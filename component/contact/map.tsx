"use client";
import React from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "./form";

/* ------------------------------------------------------------------ */
/*  Content (edit contact details here)                                */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ContactItem {
  display: string;
  href: string;
}

const PHONE: ContactItem[] = [
  { display: "(+91) 9205999692", href: "tel:+919205999692" },
  { display: "(+91) 9205999691", href: "tel:+919205999691" },
];

const EMAIL: ContactItem[] = [
  { display: "Info@realtycults.com", href: "mailto:Info@realtycults.com" },
  { display: "Realtycults@gmail.com", href: "mailto:Realtycults@gmail.com" },
];

const ADDRESS: ContactItem = {
  display: "C-26, 3rd Floor, Amar Colony, Market, Lajpat Nagar 4, New Delhi, Delhi 110024",
  href: "https://www.google.com/maps/place/Realtycults/data=!4m2!3m1!1s0x0:0x6e85128f44f6356b?sa=X&ved=1t:2428&ictx=111",
};

const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS.display)}&output=embed`;
const DIRECTIONS = ADDRESS.href;

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "Visit" },
  { text: "Us" },
  { text: "Or" },
  { text: "Send", accent: true },
  { text: "A", accent: true },
  { text: "Message", accent: true },
];

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

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
const QuickLinkGroup: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  items: ContactItem[];
}> = ({ icon: Icon, items }) => (
  <div className="group flex items-start gap-3">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-amber-600 transition-all duration-500 group-hover:bg-amber-600 group-hover:text-white">
      <Icon className="h-4 w-4" />
    </span>
    <div className="flex flex-col gap-1 pt-1.5">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="text-[14px] font-semibold leading-snug text-neutral-800 transition-colors duration-300 hover:text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
        >
          {item.display}
        </a>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const ContactMap: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      {/* id matches the Banner's "Take Counsel" button (#contact) */}
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="relative scroll-mt-20 overflow-hidden bg-neutral-100 py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
          {/* Intro */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-14"
          >
            <div className="relative">
              {/* Hairlines like the other sections: they cross at the label's corner */}
              <span className="absolute -top-6 right-0 hidden h-px w-[420px] bg-gradient-to-l from-neutral-300 to-transparent lg:block" />
              <span className="absolute -top-6 right-0 hidden h-[300px] w-px bg-gradient-to-b from-neutral-300 to-transparent lg:block" />

              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                Get in touch
              </motion.span>
            </div>

            <div>
              <motion.h2
                id="contact-title"
                variants={headingGroup}
                className="max-w-[820px] font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl lg:text-[64px]"
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
                className="mt-8 max-w-[520px] text-[15px] leading-relaxed text-neutral-600"
              >
                Have a property enquiry or need more information about available opportunities? Get in touch with RealtyCults through a call, email or contact form. Our team will be happy to assist you.
              </motion.p>
            </div>
          </motion.div>

          {/* Map (left) + form (right) */}
          <div className="mt-14 grid items-stretch gap-6 lg:mt-20 lg:grid-cols-2 lg:gap-8">
            {/* Map: muted grey, full colour on hover. Details card floats over it. */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="relative min-h-[540px] overflow-hidden rounded-[28px] bg-neutral-200 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.25)] lg:min-h-full"
            >
              <iframe
                title={`Map showing our office at ${ADDRESS.display}`}
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 duration-700"
              />

              <div className="pointer-events-none absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
                <div className="pointer-events-auto max-w-[400px] rounded-2xl bg-white p-5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.45)] sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                    Head office
                  </p>

                  <div className="mt-4 flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                    <address className="text-[14.5px] not-italic leading-relaxed text-neutral-800">
                      <a
                        href={ADDRESS.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors duration-300 hover:text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
                      >
                        {ADDRESS.display}
                      </a>
                    </address>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-neutral-200 pt-4">
                    <QuickLinkGroup icon={Phone} items={PHONE} />
                    <QuickLinkGroup icon={Mail} items={EMAIL} />
                  </div>

                  <a
                    href={DIRECTIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative mt-5 inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-amber-600 py-1.5 pl-6 pr-1.5 text-[14px] font-bold text-white transition-shadow duration-500 hover:shadow-[0_16px_36px_-14px_rgba(217,119,6,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-neutral-900 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                    <span className="relative">Get directions</span>
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-600 transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              <ContactForm className="h-full rounded-[28px] bg-white p-6 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10" />
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default ContactMap;