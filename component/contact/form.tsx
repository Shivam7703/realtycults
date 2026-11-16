"use client";
import React, { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, Loader2 } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
export interface ContactFormProps {
  /** Where the form POSTs its JSON (see app/api/contact/route.ts) */
  endpoint?: string;
  /** Options for the "Interested in" dropdown */
  projects?: string[];
  /** Pre-select a project, e.g. on a project detail page */
  defaultProject?: string;
  title?: string;
  subtitle?: string;
  /** Wrapper classes. Pass "" to render the form without the white card. */
  className?: string;
  /** Called after a successful send (handy for analytics) */
  onSuccess?: () => void;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const DEFAULT_PROJECTS = ["Arvind", "Godrej", "Fortesia", "River Wood", "Not sure yet"];

const DEFAULT_CARD =
  "rounded-[28px] bg-white p-6 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10";

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */
interface Values {
  name: string;
  email: string;
  phone: string;
  project: string;
  message: string;
  /** honeypot: real people never see or fill this */
  company: string;
}

type ErrorKey = "name" | "email" | "phone" | "message" | "consent";
type Errors = Partial<Record<ErrorKey, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const emptyValues: Values = { name: "", email: "", phone: "", project: "", message: "", company: "" };

const validate = (field: ErrorKey, value: string | boolean): string => {
  if (field === "consent") return value ? "" : "Please agree so we can contact you";
  const v = String(value).trim();
  switch (field) {
    case "name":
      return v.length < 2 ? "Please enter your name" : "";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address";
    case "phone":
      return /^[+\d][\d\s()-]{6,17}$/.test(v) ? "" : "Please enter a valid phone number";
    case "message":
      return v.length < 10 ? "Please tell us a little more (at least 10 characters)" : "";
  }
};

const fieldOrder: ErrorKey[] = ["name", "email", "phone", "message", "consent"];

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */
const inputClass = (hasError: boolean): string =>
  `w-full rounded-xl border bg-neutral-50 px-4 py-3.5 text-[14px] text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 ${
    hasError
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/15"
      : "border-neutral-200 hover:border-neutral-300 focus:border-amber-600 focus:ring-amber-600/15"
  }`;

const ErrorText: React.FC<{ id: string; message?: string }> = ({ id, message }) => (
  <AnimatePresence initial={false}>
    {message && (
      <motion.p
        id={id}
        role="alert"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden pt-1.5 text-xs text-red-600"
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

const Label: React.FC<{ htmlFor: string; required?: boolean; children: React.ReactNode }> = ({
  htmlFor,
  required,
  children,
}) => (
  <label htmlFor={htmlFor} className="mb-2 block text-[13px] font-semibold text-neutral-800">
    {children}
    {required && <span className="text-amber-600"> *</span>}
  </label>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const ContactForm: React.FC<ContactFormProps> = ({
  endpoint = "/api/contact",
  projects = DEFAULT_PROJECTS,
  defaultProject = "",
  title = "Send us a message",
  subtitle = "We reply within one working day.",
  className = DEFAULT_CARD,
  onSuccess,
}) => {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const initial: Values = { ...emptyValues, project: defaultProject };
  const [values, setValues] = useState<Values>(initial);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const submitting = status === "submitting";

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // re-check live only once a field has shown an error
    if (errors[name as ErrorKey]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name as ErrorKey, value) }));
    }
  };

  const onBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const name = e.target.name as ErrorKey;
    if (!fieldOrder.includes(name)) return;
    setErrors((prev) => ({ ...prev, [name]: validate(name, e.target.value) }));
  };

  const onConsent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConsent(e.target.checked);
    if (errors.consent) setErrors((prev) => ({ ...prev, consent: validate("consent", e.target.checked) }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const next: Errors = {};
    fieldOrder.forEach((f) => {
      const msg = validate(f, f === "consent" ? consent : values[f]);
      if (msg) next[f] = msg;
    });
    setErrors(next);

    const firstBad = fieldOrder.find((f) => next[f]);
    if (firstBad) {
      document.getElementById(id(firstBad))?.focus();
      return;
    }

    // Honeypot filled: act like it worked, send nothing
    if (values.company) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          project: values.project,
          message: values.message,
          consent,
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("success");
      setValues({ ...emptyValues, project: defaultProject });
      setConsent(false);
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrors({});
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={className}>
        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <motion.div
              key="success"
              role="status"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex min-h-[460px] flex-col items-center justify-center text-center"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-600 text-white shadow-[0_16px_36px_-12px_rgba(217,119,6,0.9)]">
                <Check className="h-7 w-7" />
              </span>
              <h3 className="mt-6 font-heading text-[32px] font-bold leading-tight text-neutral-900">
                Thank you, we got your message
              </h3>
              <p className="mt-3 max-w-[360px] text-sm leading-relaxed text-neutral-600">
                Our team will contact you within one working day. For anything urgent, please call
                us directly.
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
              className="relative"
              aria-describedby={id("status")}
            >
              <h3 className="font-heading text-[30px] font-bold leading-tight text-neutral-900 sm:text-[34px]">
                {title}
              </h3>
              <p className="mt-2 text-sm text-neutral-500">
                {subtitle} Fields marked <span className="text-amber-600">*</span> are required.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <Label htmlFor={id("name")} required>
                    Full name
                  </Label>
                  <input
                    id={id("name")}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? id("name-error") : undefined}
                    className={inputClass(!!errors.name)}
                  />
                  <ErrorText id={id("name-error")} message={errors.name} />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor={id("email")} required>
                    Email address
                  </Label>
                  <input
                    id={id("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? id("email-error") : undefined}
                    className={inputClass(!!errors.email)}
                  />
                  <ErrorText id={id("email-error")} message={errors.email} />
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor={id("phone")} required>
                    Phone number
                  </Label>
                  <input
                    id={id("phone")}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={values.phone}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? id("phone-error") : undefined}
                    className={inputClass(!!errors.phone)}
                  />
                  <ErrorText id={id("phone-error")} message={errors.phone} />
                </div>

                {/* Project */}
                <div>
                  <Label htmlFor={id("project")}>Interested in</Label>
                  <div className="relative">
                    <select
                      id={id("project")}
                      name="project"
                      value={values.project}
                      onChange={onChange}
                      className={`${inputClass(false)} appearance-none pr-11 ${
                        values.project ? "" : "text-neutral-400"
                      }`}
                    >
                      <option value="">Select a project</option>
                      {projects.map((p) => (
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
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <Label htmlFor={id("message")} required>
                    Your message
                  </Label>
                  <textarea
                    id={id("message")}
                    name="message"
                    rows={5}
                    placeholder="Tell us what you are looking for"
                    value={values.message}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? id("message-error") : undefined}
                    className={`${inputClass(!!errors.message)} resize-y`}
                  />
                  <ErrorText id={id("message-error")} message={errors.message} />
                </div>

                {/* Consent */}
                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-neutral-600">
                    <input
                      id={id("consent")}
                      type="checkbox"
                      checked={consent}
                      onChange={onConsent}
                      aria-invalid={!!errors.consent}
                      aria-describedby={errors.consent ? id("consent-error") : undefined}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-amber-600"
                    />
                    <span>
                      I agree to be contacted about my enquiry and have read the{" "}
                      <Link
                        href="/privacy-policy"
                        className="font-semibold text-neutral-900 underline decoration-amber-600 decoration-2 underline-offset-4 transition-colors hover:text-amber-600"
                      >
                        Privacy Policy
                      </Link>
                      .<span className="text-amber-600"> *</span>
                    </span>
                  </label>
                  <ErrorText id={id("consent-error")} message={errors.consent} />
                </div>

                {/* Honeypot: hidden from people and screen readers, bots fill it in */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor={id("company")}>Company</label>
                  <input
                    id={id("company")}
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.company}
                    onChange={onChange}
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative inline-flex w-full items-center justify-between gap-3 overflow-hidden rounded-full bg-amber-600 py-1.5 pl-7 pr-1.5 text-[14px] font-bold text-white shadow-[0_14px_34px_-14px_rgba(217,119,6,0.9)] transition-shadow duration-500 hover:shadow-[0_18px_40px_-12px_rgba(217,119,6,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:cursor-not-allowed disabled:opacity-80 sm:w-auto sm:justify-center"
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
              </div>

              {/* Live region: also announces failures to screen readers */}
              <div id={id("status")} aria-live="polite" className="mt-4 min-h-[20px]">
                {status === "error" && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    Something went wrong and your message was not sent. Please try again in a moment,
                    or call us directly.
                  </p>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
};

export default ContactForm;