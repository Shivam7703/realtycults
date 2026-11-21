"use client";
import React from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content (edit contact details here)                                */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ContactEntry {
  display: string;
  href: string;
}

const PHONE: ContactEntry = { display: "(+91) 9205999692", href: "tel:+919205999692" };
const WHATSAPP_HREF = "https://wa.me/919205999691"; // country code + number, digits only
const EMAILS: ContactEntry[] = [
  { display: "Info@realtycults.com", href: "mailto:Info@realtycults.com" },
  { display: "Realtycults@gmail.com", href: "mailto:Realtycults@gmail.com" },
];
const ADDRESS = "C-26, 3rd Floor, Amar Colony, Market, Lajpat Nagar 4, New Delhi, Delhi 110024";
const ADDRESS_URL =
  "https://www.google.com/maps/place/Realtycults/@28.5625751,77.2442631,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce33b2b9969c9:0x6e85128f44f6356b!8m2!3d28.5625751!4d77.2442631!16s%2Fg%2F11zzpq00yt?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQ";

const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;
const DIRECTIONS = ADDRESS_URL;

interface Card {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  entries?: ContactEntry[];
  note: string;
  action: string;
  href: string;
  external?: boolean;
}

const cards: Card[] = [
  {
    icon: Phone,
    label: "Call us",
    value: PHONE.display,
    note: "Speak to our team during working hours.",
    action: "Call now",
    href: PHONE.href,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "(+91) 9205999691",
    note: "Quick answers, brochures and site visit bookings.",
    action: "Start a chat",
    href: WHATSAPP_HREF,
    external: true,
  },
  {
    icon: Mail,
    label: "Email us",
    value: EMAILS[0].display,
    entries: EMAILS,
    note: "Send us the details and we reply within a day.",
    action: "Write to us",
    href: EMAILS[0].href,
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: "New Delhi, Delhi",
    note: ADDRESS,
    action: "Get directions",
    href: DIRECTIONS,
    external: true,
  },
];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "Let’s" },
  { text: "Talk" },
  { text: "About" },
  { text: "Your", accent: true },
  { text: "Property", accent: true },
  { text: "Goals", accent: true },
];

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
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const introGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
const cardSurfaceClasses =
  "group flex h-full flex-col rounded-[28px] border border-neutral-200 bg-neutral-50 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-amber-600/50 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(180,83,9,0.35)] focus-within:border-amber-600/50 focus-within:bg-white";

const InfoCard: React.FC<{ card: Card }> = ({ card }) => {
  const Icon = card.icon;
  const externalProps = card.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.li variants={fadeUp} className="h-full">
      {card.entries && card.entries.length > 1 ? (
        <div className={cardSurfaceClasses}>
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-600/60 bg-white text-amber-600 transition-all duration-500 group-hover:scale-105 group-hover:border-transparent group-hover:bg-amber-600 group-hover:text-white">
            <Icon className="h-6 w-6" />
          </span>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            {card.label}
          </p>

          <div className="mt-2 flex flex-col gap-1.5">
            {card.entries.map((entry) => (
              <a
                key={entry.href}
                href={entry.href}
                className="break-all font-heading text-[19px] font-semibold leading-snug text-neutral-900 transition-colors hover:text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                {entry.display}
              </a>
            ))}
          </div>

          <p className="mt-3 text-[14px] leading-relaxed text-neutral-600">{card.note}</p>

          <a
            href={card.href}
            className="mt-auto flex items-center gap-2 pt-8 text-[13px] font-bold text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
          >
            {card.action}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
          </a>
        </div>
      ) : (
        <a
          href={card.href}
          {...externalProps}
          className={`${cardSurfaceClasses} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-600/60 bg-white text-amber-600 transition-all duration-500 group-hover:scale-105 group-hover:border-transparent group-hover:bg-amber-600 group-hover:text-white">
            <Icon className="h-6 w-6" />
          </span>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            {card.label}
          </p>
          <p className="mt-2 break-words font-heading text-[26px] font-semibold leading-tight text-neutral-900">
            {card.value}
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-neutral-600">{card.note}</p>

          <span className="mt-auto flex items-center gap-2 pt-8 text-[13px] font-bold text-amber-600">
            {card.action}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
          </span>
        </a>
      )}
    </motion.li>
  );
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const ContactUs: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="contact-info"
        aria-labelledby="contact-info-title"
        className="relative scroll-mt-20 overflow-hidden bg-white py-24 text-neutral-900 lg:py-32"
      >
        <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
          {/* Intro */}
          <motion.div
            variants={introGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                Contact us
              </motion.span>

              <motion.h2
                id="contact-info-title"
                variants={headingGroup}
                className="mt-7 max-w-[760px] font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl lg:text-[64px]"
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
            </div>

            <motion.p
              variants={fadeUp}
              className="max-w-[420px] text-[15px] leading-relaxed text-neutral-600"
            >
              Looking for the right property or need guidance with your next investment? We&apos;re here to understand your requirements and help you take the next step.
            </motion.p>
          </motion.div>

          {/* Contact cards */}
          <motion.ul
            variants={cardGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4"
          >
            {cards.map((c) => (
              <InfoCard key={c.label} card={c} />
            ))}
          </motion.ul>
        </div>
      </section>
    </MotionConfig>
  );
};

export default ContactUs;