"use client";
import React, { useEffect, useState } from "react";
import { MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content (edit copy and images here)                                */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const AUTO_MS = 5500;

interface Reason {
  title: string;
  description: string;
  image: string;
}

const reasons: Reason[] = [
  {
    title: "Personalised Property Guidance",
    description:
      "We understand your requirements, budget and preferences to help you identify suitable property options.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Transparent Communication",
    description:
      "We provide clear information about property details, pricing and available opportunities to support informed decisions.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Diverse Property Opportunities",
    description:
      "From residential plots to agricultural land, we help you explore different real estate options.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Dedicated Customer Support",
    description:
      "Our team assists you throughout your property journey, from the initial enquiry to the next steps.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
  },
];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "Why" },
  { text: "Choose", accent: true },
  { text: "RealtyCults", accent: true },
  { text: "For" },
  { text: "Your" },
  { text: "Property" },
  { text: "Needs" },
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
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const imageReveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0 round 28px)" },
  show: { clipPath: "inset(0 0% 0 0 round 28px)", transition: { duration: 1.3, ease: EASE } },
};

const listGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const rowReveal: Variants = {
  hidden: { opacity: 0, x: 36 },
  show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const WhyChooseUs: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  /* Gentle auto-advance; stops while the person hovers or focuses the list */
  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % reasons.length), AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, reduce, active]);

  const current = reasons[active];

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="why-choose-us"
        aria-labelledby="why-title"
        className="relative overflow-hidden bg-neutral-100 py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
          {/* Intro: label | heading + text */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-8 lg:grid-cols-[minmax(0,300px)_1fr] lg:gap-14"
          >
            <div className="relative">
              {/* Hairlines like the reference: they cross at the label's corner */}
              <span className="absolute -top-6 right-0 hidden h-px w-[420px] bg-gradient-to-l from-neutral-300 to-transparent lg:block" />
              <span className="absolute -top-6 right-0 hidden h-[300px] w-px bg-gradient-to-b from-neutral-300 to-transparent lg:block" />

              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                Why choose us
              </motion.span>
            </div>

            <div>
              <motion.h2
                id="why-title"
                variants={headingGroup}
                className="max-w-[900px] font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl lg:text-[64px]"
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
                className="mt-8 max-w-[620px] text-[15px] leading-relaxed text-neutral-600"
              >
                We believe every property decision should be backed by the right information,
                transparent communication and dependable assistance. Our focus is to understand
                your requirements and help you find property opportunities that align with your
                goals.
              </motion.p>
            </div>
          </motion.div>

          {/* Image + numbered reasons */}
          <div className="mt-14 grid items-stretch gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-16">
            {/* Image: wipes in once, then crossfades with the active reason */}
            {/* The wrapper (no clip-path) is what scroll-triggers the reveal */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="relative min-h-[320px] lg:min-h-[480px]"
            >
              <motion.div
                variants={imageReveal}
                className="absolute inset-0 overflow-hidden rounded-[28px] bg-neutral-300"
              >
                {reasons.map((r, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={r.title}
                    src={r.image}
                    alt={i === active ? r.title : ""}
                    aria-hidden={i !== active}
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ease-out ${
                      i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
                    }`}
                  />
                ))}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Caption chip follows the active reason */}
                <div
                  className="absolute bottom-5 left-5 flex items-center gap-3 rounded-full border border-white/20 bg-black/30 py-2 pl-2 pr-5 text-white backdrop-blur-md"
                  aria-live="polite"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-xs font-bold">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13px] font-semibold">{current.title}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Reasons */}
            <motion.ul
              variants={listGroup}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              className="flex flex-col border-b border-neutral-200"
            >
              {reasons.map((r, i) => {
                const isActive = i === active;
                return (
                  <motion.li key={r.title} variants={rowReveal} className="relative border-t border-neutral-200">
                    {/* Amber rule draws across the active row */}
                    <span
                      aria-hidden="true"
                      className={`absolute -top-px left-0 h-px bg-amber-600 transition-all duration-700 ease-out ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />

                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-current={isActive}
                      className="group flex w-full items-start gap-5 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-amber-600 lg:gap-6 lg:py-7"
                    >
                      <span
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold transition-all duration-500 ${
                          isActive
                            ? "scale-105 bg-amber-600 text-white shadow-[0_14px_30px_-12px_rgba(217,119,6,0.9)]"
                            : "bg-white text-neutral-900"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="flex-1">
                        <span className="block font-heading text-[24px] font-bold leading-tight tracking-tight text-neutral-900 transition-transform duration-500 group-hover:translate-x-1 lg:text-[28px]">
                          {r.title}
                        </span>
                        <span className="mt-2 block max-w-[400px] text-[13.5px] leading-relaxed text-neutral-600">
                          {r.description}
                        </span>
                      </span>

                      <ArrowUpRight
                        aria-hidden="true"
                        className={`mt-2 hidden h-5 w-5 shrink-0 text-amber-600 transition-all duration-500 sm:block ${
                          isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                        }`}
                      />
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default WhyChooseUs;