"use client";
import React, { useState } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, Loader2, Mail, MapPin, Phone } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content (edit contact details, projects list and endpoint here)    */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** The form POSTs JSON here. Create this route (or point it to your form service). */
const ENDPOINT = "/api/contact";

interface ContactEntry {
  display: string;
  href?: string;
  external?: boolean;
}

interface ContactItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  entries: ContactEntry[];
}

const ADDRESS_DISPLAY =
  "C-26, 3rd Floor, Amar Colony, Market, Lajpat Nagar 4, New Delhi, Delhi 110024";
const ADDRESS_URL =
  "https://www.google.com/maps/place/Realtycults/@28.5625751,77.2442631,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce33b2b9969c9:0x6e85128f44f6356b!8m2!3d28.5625751!4d77.2442631!16s%2Fg%2F11zzpq00yt?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D";

const contactItems: ContactItem[] = [
  {
    icon: Phone,
    label: "Call us",
    entries: [
      { display: "(+91) 9205999692", href: "tel:+919205999692" },
      { display: "(+91) 9205999691", href: "tel:+919205999691" },
    ],
  },
  {
    icon: Mail,
    label: "Email us",
    entries: [
      { display: "Info@realtycults.com", href: "mailto:Info@realtycults.com" },
      { display: "Realtycults@gmail.com", href: "mailto:Realtycults@gmail.com" },
    ],
  },
  {
    icon: MapPin,
    label: "Visit us",
    entries: [{ display: ADDRESS_DISPLAY, href: ADDRESS_URL, external: true }],
  },
];

const projectOptions = ["Arvind", "Godrej", "Fortesia", "River Wood", "Not sure yet"];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "Let’s" },
  { text: "Find" },
  { text: "The" },
  { text: "Right", accent: true },
  { text: "Property", accent: true },
  { text: "For" },
  { text: "Your" },
  { text: "Goals" },
];

interface FormValues {
  name: string;
  email: string;
  phone: string;
  project: string;
  message: string;
  /** honeypot: real people never see or fill this */
  company: string;
}

type Errors = Partial<Record<keyof FormValues, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const emptyValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  project: "",
  message: "",
  company: "",
};

const validateField = (field: keyof FormValues, value: string): string => {
  const v = value.trim();
  switch (field) {
    case "name":
      return v.length < 2 ? "Please enter your name" : "";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address";
    case "phone":
      return /^[+\d][\d\s()-]{6,17}$/.test(v) ? "" : "Please enter a valid phone number";
    case "message":
      return v.length < 10 ? "Please tell us a little more (at least 10 characters)" : "";
    default:
      return "";
  }
};

const requiredFields: (keyof FormValues)[] = ["name", "email", "phone", "message"];

/* ------------------------------------------------------------------ */
/*  Motion                                                             */
/* ------------------------------------------------------------------ */
const headingGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const wordReveal: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const leftGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
const inputClass = (hasError: boolean): string =>
  `w-full rounded-xl border bg-neutral-50 px-4 py-3.5 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
      : "border-neutral-200 hover:border-neutral-300 focus:border-amber-600 focus:ring-amber-600/15"
  }`;

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ id, label, required, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-[13px] font-semibold text-neutral-800">
      {label}
      {required && <span className="text-amber-600"> *</span>}
    </label>
    {children}
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden pt-1.5 text-xs text-red-600"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

/* Left column row: icon circle turns amber on hover */
const ContactRow: React.FC<{ item: ContactItem }> = ({ item }) => {
  const Icon = item.icon;

  return (
    <motion.li
      variants={fadeUp}
      className="group flex items-start gap-4 border-t border-neutral-200 py-5"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-amber-600 transition-all duration-500 group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
          {item.label}
        </span>
        <span className="mt-1 flex flex-col gap-1">
          {item.entries.map((entry) =>
            entry.href ? (
              <a
                key={entry.display}
                href={entry.href}
                target={entry.external ? "_blank" : undefined}
                rel={entry.external ? "noopener noreferrer" : undefined}
                className="break-words text-[15px] font-semibold leading-snug text-neutral-900 transition-colors duration-300 hover:text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                {entry.display}
              </a>
            ) : (
              <span
                key={entry.display}
                className="break-words text-[15px] font-semibold leading-snug text-neutral-900"
              >
                {entry.display}
              </span>
            ),
          )}
        </span>
      </span>
    </motion.li>
  );
};

const Contact: React.FC = () => {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const field = e.target.name as keyof FormValues;
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    // clear an error as soon as the person starts fixing it
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const field = e.target.name as keyof FormValues;
    if (!requiredFields.includes(field)) return;
    setErrors((prev) => ({ ...prev, [field]: validateField(field, e.target.value) }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const next: Errors = {};
    requiredFields.forEach((f) => {
      const msg = validateField(f, values[f]);
      if (msg) next[f] = msg;
    });
    setErrors(next);

    const firstBad = requiredFields.find((f) => next[f]);
    if (firstBad) {
      document.getElementById(`contact-${firstBad}`)?.focus();
      return;
    }

    // Honeypot filled: act like it worked, send nothing
    if (values.company) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: undefined }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("success");
      setValues(emptyValues);
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrors({});
  };

  const submitting = status === "submitting";

  return (
    <MotionConfig reducedMotion="user">
      {/* id matches the Banner's "Take Counsel" button (#contact) */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="relative scroll-mt-20 overflow-hidden bg-neutral-100 py-24 lg:py-32"
      >
        <div className="mx-auto grid max-w-[1500px] items-start gap-14 px-6 lg:grid-cols-[5fr_6fr] lg:gap-20 lg:px-14">
          {/* ---------- Left: contact details ---------- */}
          <motion.div
            variants={leftGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="relative"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Contact us
            </motion.span>

            <motion.h2
              id="contact-title"
              variants={headingGroup}
              className="mt-7 max-w-[560px] font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl lg:text-[60px]"
            >
              {headingWords.map((w, i) => (
                <React.Fragment key={`${w.text}-${i}`}>
                  {/* Extra padding keeps descenders (g, y, p) from being clipped by the mask */}
                  <span className="inline-block overflow-hidden align-bottom -mt-[0.1em] pt-[0.1em] -mb-[0.22em] pb-[0.22em]">
                    <motion.span
                      variants={wordReveal}
                      className={`inline-block ${w.accent ? "text-amber-600" : ""}`}
                    >
                      {w.text}
                    </motion.span>
                  </span>
                  {i < headingWords.length - 1 && " "}
                </React.Fragment>
              ))}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-[460px] text-[15px] leading-relaxed text-neutral-600"
            >
              Looking for residential plots, agricultural land or real estate investment opportunities? Connect with our team to discuss your requirements, understand available options and take the next step towards your property goals.
            </motion.p>

            <ul className="mt-10 max-w-[520px] border-b border-neutral-200">
              {contactItems.map((item) => (
                <ContactRow key={item.label} item={item} />
              ))}
            </ul>
          </motion.div>

          {/* ---------- Right: form card ---------- */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="rounded-[28px] bg-white p-6 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10"
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[460px] flex-col items-center justify-center text-center"
                  role="status"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-600 text-white shadow-[0_16px_36px_-12px_rgba(217,119,6,0.9)]">
                    <Check className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 font-heading text-[32px] font-bold leading-tight text-neutral-900">
                    Thank you, we got your message
                  </h3>
                  <p className="mt-3 max-w-[360px] text-sm leading-relaxed text-neutral-600">
                    Our team will contact you within one working day. For anything urgent, please
                    call us directly.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-8 text-sm font-semibold text-neutral-900 underline decoration-amber-600 decoration-2 underline-offset-8 transition-colors hover:text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  aria-describedby="contact-status"
                >
                  <h3 className="font-heading text-[30px] font-bold leading-tight text-neutral-900 sm:text-[34px]">
                    Send us a message
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    Fields marked <span className="text-amber-600">*</span> are required.
                  </p>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <Field id="contact-name" label="Full name" required error={errors.name}>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        value={values.name}
                        onChange={onChange}
                        onBlur={onBlur}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        className={inputClass(!!errors.name)}
                      />
                    </Field>

                    <Field id="contact-email" label="Email address" required error={errors.email}>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={values.email}
                        onChange={onChange}
                        onBlur={onBlur}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        className={inputClass(!!errors.email)}
                      />
                    </Field>

                    <Field id="contact-phone" label="Phone number" required error={errors.phone}>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="+91 98765 43210"
                        value={values.phone}
                        onChange={onChange}
                        onBlur={onBlur}
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "contact-phone-error" : undefined}
                        className={inputClass(!!errors.phone)}
                      />
                    </Field>

                    <Field id="contact-project" label="Interested in">
                      <div className="relative">
                        <select
                          id="contact-project"
                          name="project"
                          value={values.project}
                          onChange={onChange}
                          className={`${inputClass(false)} appearance-none pr-11 ${
                            values.project ? "" : "text-neutral-400"
                          }`}
                        >
                          <option value="">Select a project</option>
                          {projectOptions.map((p) => (
                            <option key={p} value={p} className="text-neutral-900">
                              {p}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          aria-hidden="true"
                          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                        />
                      </div>
                    </Field>

                    <div className="sm:col-span-2">
                      <Field id="contact-message" label="Your message" required error={errors.message}>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={5}
                          placeholder="Tell us what you are looking for"
                          value={values.message}
                          onChange={onChange}
                          onBlur={onBlur}
                          aria-invalid={!!errors.message}
                          aria-describedby={errors.message ? "contact-message-error" : undefined}
                          className={`${inputClass(!!errors.message)} resize-y`}
                        />
                      </Field>
                    </div>

                    {/* Honeypot: hidden from people and screen readers, bots fill it in */}
                    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                      <label htmlFor="contact-company">Company</label>
                      <input
                        id="contact-company"
                        name="company"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={values.company}
                        onChange={onChange}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-amber-600 py-1.5 pl-7 pr-1.5 text-[14px] font-bold text-white shadow-[0_14px_34px_-14px_rgba(217,119,6,0.9)] transition-shadow duration-500 hover:shadow-[0_18px_40px_-12px_rgba(217,119,6,1)] disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-neutral-900 transition-transform duration-500 ease-out group-hover:translate-x-0 group-disabled:translate-x-0" />
                      <span className="relative">{submitting ? "Sending..." : "Send message"}</span>
                      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-600 transition-transform duration-500 group-hover:rotate-45">
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                      </span>
                    </button>

                    <p className="text-xs text-neutral-500">
                      We only use your details to reply to this enquiry.
                    </p>
                  </div>

                  {/* Live region: announces failures to screen readers too */}
                  <div id="contact-status" aria-live="polite" className="mt-4 min-h-[20px]">
                    {status === "error" && (
                      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        Something went wrong and your message was not sent. Please try again, or call
                        us on {contactItems[0].entries[0].display}.
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Contact;