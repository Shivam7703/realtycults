"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { ArrowUpRight, Quote } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content (replace with the real founder, photo and message)         */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FOUNDER = {
  name: "Your Founder Name",
  title: "Founder & Managing Director",
  // Use a real portrait. A vertical (4:5) photo with the face in the upper half works best.
  image:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1400&auto=format&fit=crop",
};

const PULL_QUOTE = "We do not just build homes. We build the places where life happens.";

const PARAGRAPHS: string[] = [
  "When I started this company, I had one simple belief: buying a home should feel exciting, not stressful. Too many families were being asked to trust promises they could not verify. I wanted to change that.",
  "Today, every project we deliver is built on the same three commitments: honest advice, transparent pricing and craftsmanship we are proud to put our name on. Our team treats each home as if it were their own.",
  "Thank you for considering us. We would be honoured to help you find a place you will love coming back to.",
];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "A" },
  { text: "Message" },
  { text: "From" },
  { text: "Our", accent: true },
  { text: "Founder", accent: true },
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
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const textGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};

/* The photo wipes in from the left (this variant lives on an inner element,
   a separate wrapper triggers it, because a fully clipped element never counts as "in view") */
const photoReveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0 round 28px)" },
  show: { clipPath: "inset(0 0% 0 0 round 28px)", transition: { duration: 1.3, ease: EASE } },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.7, ease: EASE } },
};

const frameReveal: Variants = {
  hidden: { opacity: 0, x: -16, y: -16 },
  show: { opacity: 1, x: 0, y: 0, transition: { duration: 1.1, delay: 0.4, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const Founder: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="founder"
        aria-labelledby="founder-title"
        className="relative overflow-hidden bg-neutral-50 py-24 lg:py-32"
      >
        <div className="mx-auto grid max-w-[1500px] items-center gap-20 px-6 lg:grid-cols-[5fr_6fr] lg:gap-24 lg:px-14">
          {/* ---------- Left: portrait ---------- */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="relative mx-auto w-full max-w-[560px] pb-10 lg:mx-0"
          >
            {/* Offset amber frame behind the photo */}
            <motion.span
              aria-hidden="true"
              variants={frameReveal}
              className="absolute -left-3 -top-3 bottom-[calc(2.5rem+12px)] right-3 rounded-[28px] border border-amber-600/70 lg:-left-5 lg:-top-5 lg:bottom-[calc(2.5rem+20px)] lg:right-5"
            />

            <motion.div
              variants={photoReveal}
              className="group relative aspect-[4/5] overflow-hidden rounded-[28px] bg-neutral-200 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]"
            >
              <Image
                src={FOUNDER.image}
                alt={`Portrait of ${FOUNDER.name}`}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </motion.div>

            {/* Name card overlapping the photo */}
            <motion.div
              variants={cardReveal}
              className="absolute bottom-0 left-5 right-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.35)] sm:left-8 sm:right-auto sm:min-w-[300px]"
            >
              <span className="block h-px w-10 bg-amber-600" />
              <p className="mt-4 font-heading text-[26px] font-bold leading-tight text-neutral-900">
                {FOUNDER.name}
              </p>
              <p className="mt-1 text-[13px] font-semibold text-amber-600">{FOUNDER.title}</p>
            </motion.div>
          </motion.div>

          {/* ---------- Right: message ---------- */}
          <motion.div
            variants={textGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Founder’s message
            </motion.span>

            <motion.h2
              id="founder-title"
              variants={headingGroup}
              className="mt-7 max-w-[640px] font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl lg:text-[60px]"
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

            {/* Pull quote */}
            <motion.figure variants={fadeUp} className="mt-10 flex gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white shadow-[0_14px_30px_-12px_rgba(217,119,6,0.9)]">
                <Quote className="h-5 w-5" aria-hidden="true" />
              </span>
              <blockquote className="font-heading text-[26px] font-semibold italic leading-snug text-neutral-900 sm:text-[32px]">
                {PULL_QUOTE}
              </blockquote>
            </motion.figure>

            {/* Message body */}
            <div className="mt-8 max-w-[620px] space-y-5 border-l border-neutral-300 pl-6 sm:ml-[68px]">
              {PARAGRAPHS.map((p) => (
                <motion.p
                  key={p}
                  variants={fadeUp}
                  className="text-[15px] leading-[1.8] text-neutral-600"
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* Signature + CTA */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col gap-8 sm:ml-[68px] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-heading text-[34px] font-semibold italic leading-none text-amber-600">
                  {FOUNDER.name}
                </p>
                <p className="mt-2 text-[13px] text-neutral-500">{FOUNDER.title}</p>
              </div>

              <Link
                href="/about-us"
                className="group inline-flex items-center gap-4 self-start rounded-full border border-neutral-300 py-1.5 pl-6 pr-1.5 text-[13px] font-semibold text-neutral-900 transition-all duration-500 hover:border-amber-600 hover:bg-amber-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
              >
                Read our story
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-amber-600">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Founder;