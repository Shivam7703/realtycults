"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { Eye, Gem, Target } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content (edit copy and images here)                                */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Pillar {
  id: string;
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  summary?: string;
  values?: { title: string; text: string }[];
}

const pillars: Pillar[] = [
  {
    id: "mission",
    number: "01",
    title: "Our Mission",
    icon: Target,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop",
    summary:
      "Our mission is to simplify property decisions by connecting buyers with suitable real estate opportunities. We aim to provide clear information, personalized guidance, and dependable support throughout the property search process.",
  },
  {
    id: "vision",
    number: "02",
    title: "Our Vision",
    icon: Eye,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    summary:
      "Our vision is to become a trusted name in real estate by building lasting relationships, promoting transparent practices and helping people make confident property decisions.",
  },
  {
    id: "values",
    number: "03",
    title: "Our Values",
    icon: Gem,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
    values: [
      { title: "Integrity", text: "We believe in honest dealings and responsible property guidance." },
      { title: "Transparency", text: "We share clear information about property details, pricing and available opportunities." },
      { title: "Commitment", text: "We focus on understanding your requirements and helping you make informed decisions." },
      { title: "Customer Care", text: "Your property goals matter to us. We aim to make every step of your property journey easier." },
    ],
  },
];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "The" },
  { text: "Purpose" },
  { text: "Behind" },
  { text: "Everything", accent: true },
  { text: "We", accent: true },
  { text: "Build", accent: true },
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

const panelGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  Panel                                                              */
/*  Desktop: the active panel grows and the others fold into a strip.  */
/*  Mobile: every panel is simply open, stacked.                       */
/* ------------------------------------------------------------------ */
interface PanelProps {
  pillar: Pillar;
  isActive: boolean;
  onActivate: () => void;
  priority?: boolean;
}

const Panel: React.FC<PanelProps> = ({ pillar, isActive, onActivate, priority }) => {
  const Icon = pillar.icon;

  return (
    <motion.article
      variants={fadeUp}
      onMouseEnter={onActivate}
      style={{ flexGrow: isActive ? 3.2 : 1 }}
      className="group relative isolate min-w-0 overflow-hidden rounded-[28px] bg-neutral-900 text-white transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-full lg:basis-0"
    >
      {/* Photo + overlays */}
      <Image
        src={pillar.image}
        alt=""
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        priority={priority}
        className={`-z-10 object-cover transition-transform duration-[1600ms] ease-out ${
          isActive ? "lg:scale-100" : "lg:scale-110"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-0 -z-10 bg-neutral-950 transition-opacity duration-700 ${
          isActive ? "opacity-60 lg:opacity-45" : "opacity-60 lg:opacity-70"
        }`}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

      {/* Keyboard and click target for the desktop accordion */}
      <button
        type="button"
        onClick={onActivate}
        onFocus={onActivate}
        aria-expanded={isActive}
        aria-label={`Show ${pillar.title}`}
        className="absolute inset-0 z-20 hidden cursor-pointer rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-amber-600 lg:block"
      />

      <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-between p-6 sm:p-8 lg:min-h-0 lg:p-10">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span className="text-sm font-bold tracking-[0.2em] text-white/70">{pillar.number}</span>
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-700 ${
              isActive
                ? "border-transparent bg-amber-600 text-white shadow-[0_14px_30px_-12px_rgba(217,119,6,0.9)] lg:scale-110"
                : "border-white/30 text-white lg:bg-white/5"
            } max-lg:border-transparent max-lg:bg-amber-600`}
          >
            <Icon className="h-5 w-5" />
          </span>
        </div>

        {/* Folded label (desktop, inactive only) */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 font-heading text-[28px] font-semibold tracking-wide text-white transition-opacity duration-500 [writing-mode:vertical-rl] rotate-180 lg:block ${
            isActive ? "opacity-0" : "opacity-100 delay-300"
          }`}
        >
          {pillar.title}
        </span>

        {/* Open content: always visible on mobile, fades in on the active desktop panel */}
        <div
          className={`transition-all duration-700 lg:min-w-[440px] ${
            isActive
              ? "lg:translate-y-0 lg:opacity-100 lg:delay-300"
              : "lg:translate-y-4 lg:opacity-0"
          }`}
        >
          <span className="block h-px w-12 bg-amber-600" />
          <h3 className="mt-5 font-heading text-[34px] font-bold leading-tight sm:text-[42px]">
            {pillar.title}
          </h3>

          {pillar.summary && (
            <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-white/80">
              {pillar.summary}
            </p>
          )}

          {pillar.values && (
            <ul className="mt-6 grid max-w-[640px] gap-x-8 gap-y-5 sm:grid-cols-2">
              {pillar.values.map((v) => (
                <li key={v.title} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span>
                    <span className="block text-[15px] font-semibold">{v.title}</span>
                    <span className="mt-0.5 block text-[13.5px] leading-snug text-white/70">
                      {v.text}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.article>
  );
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const MissionVision: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="mission"
        aria-labelledby="mission-title"
        className="relative overflow-hidden bg-neutral-100 py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
          {/* Intro: label | heading */}
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
                What drives us
              </motion.span>
            </div>

            <motion.h2
              id="mission-title"
              variants={headingGroup}
              className="max-w-[860px] font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl lg:text-[64px]"
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
          </motion.div>

          {/* Panels */}
          <motion.div
            variants={panelGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-14 flex flex-col gap-4 lg:mt-20 lg:h-[580px] lg:flex-row"
          >
            {pillars.map((p, i) => (
              <Panel
                key={p.id}
                pillar={p}
                isActive={i === active}
                onActivate={() => setActive(i)}
                priority={i === 0}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default MissionVision;