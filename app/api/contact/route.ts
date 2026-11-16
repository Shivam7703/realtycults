import { NextResponse } from "next/server";
import nodemailer, { type Transporter } from "nodemailer";

export const runtime = "nodejs"; // nodemailer needs Node, not the Edge runtime

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

const tooMany = (ip: string): boolean => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
};

/* ---- validation (mirrors the form) ---- */
interface Payload {
  name: string;
  email: string;
  phone: string;
  project: string;
  message: string;
  consent: boolean;
}

const str = (v: unknown, max: number): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

const parse = (raw: unknown): { ok: true; data: Payload } | { ok: false; error: string } => {
  if (typeof raw !== "object" || raw === null) return { ok: false, error: "Invalid request" };
  const b = raw as Record<string, unknown>;

  const data: Payload = {
    name: str(b.name, 100),
    email: str(b.email, 254),
    phone: str(b.phone, 30),
    project: str(b.project, 100),
    message: str(b.message, 2000),
    consent: b.consent === true,
  };

  if (data.name.length < 2) return { ok: false, error: "Name is required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { ok: false, error: "Valid email is required" };
  if (!/^[+\d][\d\s()-]{6,17}$/.test(data.phone)) return { ok: false, error: "Valid phone is required" };
  if (data.message.length < 10) return { ok: false, error: "Message is too short" };
  if (!data.consent) return { ok: false, error: "Consent is required" };

  return { ok: true, data };
};

/* Strip line breaks so user input can never inject extra email headers */
const oneLine = (s: string): string => s.replace(/[\r\n]+/g, " ");

/* Escape user text before it goes into the HTML version of the email */
const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* One transporter per server instance */
let transporter: Transporter | null = null;

const getTransporter = (): Transporter | null => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user, pass },
    });
  }
  return transporter;
};

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) {
    return NextResponse.json({ error: "Too many requests, please try again later" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parse(raw);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { name, email, phone, project, message } = parsed.data;

  const mailer = getTransporter();
  const to = process.env.CONTACT_TO_EMAIL;

  if (!mailer || !to) {
    console.error("[contact] SMTP_HOST, SMTP_USER, SMTP_PASS or CONTACT_TO_EMAIL is not set");
    return NextResponse.json({ error: "Email is not configured" }, { status: 500 });
  }

  const fromName = process.env.CONTACT_FROM_NAME ?? "Website Enquiry";
  const projectLine = oneLine(project) || "Not specified";

  const text = [
    `Name: ${oneLine(name)}`,
    `Email: ${oneLine(email)}`,
    `Phone: ${oneLine(phone)}`,
    `Interested in: ${projectLine}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;color:#171717;max-width:560px">
      <h2 style="margin:0 0 16px;color:#d97706">New website enquiry</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%">
        <tr><td style="color:#737373;width:130px">Name</td><td><strong>${esc(name)}</strong></td></tr>
        <tr><td style="color:#737373">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td style="color:#737373">Phone</td><td><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
        <tr><td style="color:#737373">Interested in</td><td>${esc(projectLine)}</td></tr>
      </table>
      <p style="margin:20px 0 6px;color:#737373">Message</p>
      <p style="margin:0;white-space:pre-wrap;line-height:1.6">${esc(message)}</p>
    </div>`;

  try {
    await mailer.sendMail({
      from: `"${fromName}" <${process.env.SMTP_USER}>`,
      to,
      replyTo: `"${oneLine(name).replace(/"/g, "")}" <${email}>`,
      subject: `New enquiry from ${oneLine(name)}`,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Send failed", err);
    return NextResponse.json({ error: "Could not send message" }, { status: 502 });
  }
}