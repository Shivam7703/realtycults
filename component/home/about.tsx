"use client";
import React from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Content (edit copy, order and icons here)                          */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Service {
  title: string;
  description: string;
  /** SVG path data, drawn on a 48x48 grid */
  icon: string[];
}

const services: Service[] = [
  {
    title: "Architectural Design",
    description:
      "Dream it, we'll design it! From big picture layouts to the tiniest details, our architectural magic brings your ideas to life with creativity and precision.",
    icon: [
      "M4 22V4h18v18H4Z M4 22 22 4",
      "M26 4h18v18H26Z M26 4a18 18 0 0 1 18 18",
      "M4 26h18v18H4Z M22 26a18 18 0 0 1-18 18",
      "M26 26h18v18H26Z M26 44 44 26",
    ],
  },
  {
    title: "Interior Design & Planning",
    description:
      "Make your space shine! Our team creates inviting, beautiful interiors that reflect your style and make every room a favorite place to be.",
    icon: [
      "M4 6a18 18 0 0 1 0 36Z",
      "M4 14a10 10 0 0 1 0 20Z",
      "M26 6a18 18 0 0 1 0 36Z",
      "M26 14a10 10 0 0 1 0 20Z",
    ],
  },
  {
    title: "Consulting Services",
    description:
      "Consider us your design whisperers! We provide expert advice to help your project sparkle with creativity, efficiency, and spot-on solutions.",
    icon: [
      "M4 4h20v20L4 4Z",
      "M44 4v20H24L44 4Z",
      "M44 44H24V24l20 20Z",
      "M4 44V24h20L4 44Z",
    ],
  },
  {
    title: "Project Management",
    description:
      "We handle the hustle! From start to finish, we keep your project on track, on budget, and stress-free, so you can sit back and watch the magic happen.",
    icon: [
      "M6 14a18 9 0 0 1 36 0Z",
      "M6 22a18 9 0 0 0 36 0Z",
      "M10 28a14 7 0 0 0 28 0Z",
    ],
  },
];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "Experience" },
  { text: "The", accent: true },
  { text: "Art", accent: true },
  { text: "Of", accent: true },
  { text: "Interior", accent: true },
  { text: "Design" },
];

/* ------------------------------------------------------------------ */
/*  Motion: one reveal sequence when the section scrolls into view     */
/* ------------------------------------------------------------------ */
const wordReveal: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

const textReveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const headingGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const iconPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.4, ease: "easeInOut" } },
};

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
const LineIcon: React.FC<{ paths: string[] }> = ({ paths }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
    className="h-12 w-12 shrink-0 text-amber-600 transition-transform duration-700 ease-out group-hover:rotate-[8deg] group-hover:scale-110"
  >
    {paths.map((d) => (
      <motion.path
        key={d}
        d={d}
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinejoin="round"
        strokeLinecap="round"
        variants={iconPath}
      />
    ))}
  </svg>
);

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
  <motion.article
    variants={card}
    className="group relative flex min-h-[320px] flex-col rounded-[28px] bg-white p-7 shadow-[0_1px_0_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgba(180,83,9,0.35)]"
  >
    <div className="flex items-start justify-between gap-4">
      <h3 className="font-heading text-[26px] font-bold leading-[1.1] tracking-tight text-neutral-900 transition-colors duration-500 group-hover:text-amber-600">
        {service.title}
      </h3>
      <LineIcon paths={service.icon} />
    </div>

    {/* Divider: the amber line draws across on hover */}
    <div className="relative mt-auto h-px w-full bg-neutral-200">
      <span className="absolute left-0 top-0 h-px w-0 bg-amber-600 transition-all duration-700 ease-out group-hover:w-full" />
    </div>

    <p className="mt-6 text-[13.5px] leading-relaxed text-neutral-600">{service.description}</p>
  </motion.article>
);

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const About: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      {/* id matches the Banner's scroll-down button (#next-section) */}
      <section
        id="next-section"
        className="relative scroll-mt-20 overflow-hidden bg-neutral-100 py-24 lg:py-32"
      >

        <div className="relative mx-auto max-w-[1500px] px-6 lg:px-14">
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
                variants={textReveal}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                Who we are
              </motion.span>
            </div>

            <div>
              <motion.h2
                variants={headingGroup}
                className="max-w-[820px] font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl lg:text-[64px]"
              >
                {headingWords.map((w, i) => (
                  <React.Fragment key={w.text}>
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
                variants={textReveal}
                className="mt-8 max-w-[480px] text-[15px] leading-relaxed text-neutral-600"
              >
                We specialize in transforming visions into reality. Explore our portfolio of
                innovative architectural and interior design projects crafted with precision.
              </motion.p>
            </div>
          </motion.div>

          {/* Service cards */}
          <motion.div
            variants={cardGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 xl:grid-cols-4"
          >
            {services.map((s) => (
              <ServiceCard key={s.title} service={s} />
            ))}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default About;