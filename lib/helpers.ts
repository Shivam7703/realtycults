// PATH: lib/helpers.ts
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, verifySessionToken } from './auth';
import type { ProjectRow, ProjectDTO, ProjectDetail } from '../types/project';

export type { ProjectRow, ProjectDTO, ProjectDetail };

export const MAX_IMAGES = 4;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// "a, b ,c" -> ["a","b","c"]
export const csv = (s: unknown): string[] =>
  String(s ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

export const toCsv = (s: unknown): string => csv(s).join(',');

export function requireAuth(req: NextRequest): void {
  const key = process.env.API_KEY;
  const headerOk: boolean = !!key && req.headers.get('x-api-key') === key;
  const cookieOk: boolean = verifySessionToken(req.cookies.get(COOKIE_NAME)?.value);
  if (!headerOk && !cookieOk) {
    throw new HttpError(401, 'Unauthorized: login karein ya x-api-key bhejein');
  }
}

// DB row -> API response
export function formatProject(row: ProjectRow): ProjectDTO {
  const labels = csv(row.labels);
  const values = csv(row.label_values);
  return {
    id: row.id,
    title: row.title,
    details: labels.map((label, i): ProjectDetail => ({ label, value: values[i] ?? '' })),
    description: row.description,
    highlights: csv(row.highlights),
    images: csv(row.images).map((f) => (process.env.IMAGE_BASE_URL ?? '') + f),
    raw: { labels: row.labels, values: row.label_values, highlights: row.highlights },
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function detectExt(buf: Buffer): 'jpg' | 'png' | 'webp' | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.subarray(0, 4).toString('hex') === '89504e47') return 'png';
  if (buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'webp';
  return null;
}

export function getImageFiles(fd: FormData): File[] {
  return fd
    .getAll('images')
    .filter((f): f is File => typeof f !== 'string' && f.size > 0);
}

export async function saveImages(files: File[]): Promise<string[]> {
  if (files.length > MAX_IMAGES) throw new HttpError(422, `Maximum ${MAX_IMAGES} images allowed`);
  const dir = process.env.UPLOAD_DIR as string;
  await fs.mkdir(dir, { recursive: true });

  const saved: string[] = [];
  try {
    for (const f of files) {
      if (f.size > MAX_IMAGE_SIZE) throw new HttpError(422, 'Har image 5MB se chhoti honi chahiye');
      const buf = Buffer.from(await f.arrayBuffer());
      const ext = detectExt(buf);
      if (!ext) throw new HttpError(422, 'Sirf JPG, PNG ya WEBP images allowed hain');
      const name = `${crypto.randomUUID()}.${ext}`;
      await fs.writeFile(path.join(dir, name), buf);
      saved.push(name);
    }
  } catch (e) {
    await deleteImages(saved);
    throw e;
  }
  return saved;
}

export async function deleteImages(names: string[]): Promise<void> {
  for (const n of names) {
    try {
      await fs.unlink(path.join(process.env.UPLOAD_DIR as string, path.basename(n)));
    } catch {}
  }
}

export function validateLabelsValues(labels: unknown, values: unknown): void {
  const l = csv(labels);
  const v = csv(values);
  if (!l.length) throw new HttpError(422, 'labels required');
  if (l.length !== v.length) {
    throw new HttpError(422, `labels (${l.length}) aur values (${v.length}) ki count same honi chahiye`);
  }
}

// try/catch wrapper for route handlers
export function handle<C = unknown>(
  fn: (req: NextRequest, ctx: C) => Promise<NextResponse>
): (req: NextRequest, ctx: C) => Promise<NextResponse> {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof HttpError) {
        return NextResponse.json({ error: e.message }, { status: e.status });
      }
      console.error(e);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  };
}