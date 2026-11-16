"use client";
import React, { useEffect, useRef } from "react";
import {
  MotionConfig,
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Content (edit numbers and copy here)                               */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BG_IMAGE =
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2400&auto=format&fit=crop";

interface Stat {
  /** where the count starts (use a nearby year for years so it doesn't count from 0) */
  from?: number;
  value: number;
  suffix?: string;
  title: string;
  description: string;
}

const stats: Stat[] = [
  {
    from: 1990,
    value: 2013,
    title: "Year Established",
    description: "Improving homes with expert craftsmanship for years.",
  },
  {
    value: 190,
    suffix: "+",
    title: "Projects Completed",
    description: "Over 250 successful projects delivered with quality and care.",
  },
  {
    value: 260,
    suffix: "+",
    title: "Skilled Tradespeople",
    description: "Our team of 30 experts ensures top-quality results.",
  },
  {
    value: 328,
    suffix: "+",
    title: "Client Satisfaction",
    description: "All of our clients are satisfied with our work and service.",
  },
];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "Behind" },
  { text: "Every", accent: true },
  { text: "Statistic", accent: true },
  { text: "Pulses", accent: true },
  { text: "A" },
  { text: "Human" },
  { text: "Story" },
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

const statGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const rule: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/*  Count-up number: starts when it scrolls into view                  */
/* ------------------------------------------------------------------ */
interface CountUpProps {
  from?: number;
  to: number;
  suffix?: string;
  delay?: number;
}

const CountUp: React.FC<CountUpProps> = ({ from = 0, to, suffix = "", delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = `${to}${suffix}`;
      return;
    }
    if (!inView) return;

    // Writes straight to the DOM so the number doesn't re-render React 60 times a second
    const controls = animate(from, to, {
      duration: 2.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, from, to, suffix, delay]);

  return (
    <>
      {/* Screen readers get the final number, not the animation */}
      <span className="sr-only">{`${to}${suffix}`}</span>
      <span ref={ref} aria-hidden="true">{`${from}${suffix}`}</span>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const Counter: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  /* Slow parallax on the photo: the one continuous motion in this section */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className="relative flex min-h-[760px] flex-col justify-between overflow-hidden bg-neutral-950 py-24 text-white lg:min-h-[900px] lg:py-28"
      >
        {/* Background photo + overlays */}
        <motion.div
          aria-hidden="true"
          style={reduce ? undefined : { y: imgY }}
          className="absolute inset-x-0 -inset-y-[10%]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BG_IMAGE} alt="" className="h-full w-full object-cover" />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-neutral-950/55" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950" />

        {/* Heading block */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="relative z-10 mx-auto w-full max-w-[1500px] px-6 lg:px-14"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            Trusted experience
          </motion.span>

          <motion.h2
            variants={headingGroup}
            className="mt-7 max-w-[620px] font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-[60px]"
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

        {/* Stats */}
        <motion.div
          variants={statGrid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="relative z-10 mx-auto mt-24 grid w-full max-w-[1500px] grid-cols-1 gap-x-10 gap-y-12 px-6 sm:grid-cols-2 lg:mt-32 lg:grid-cols-4 lg:px-14"
        >
          {stats.map((s, i) => (
            <motion.div key={s.title} variants={fadeUp} className="group">
              <p className="font-sans text-5xl font-bold tabular-nums leading-none tracking-tight transition-colors duration-500 group-hover:text-amber-600 lg:text-[64px]">
                <CountUp from={s.from} to={s.value} suffix={s.suffix} delay={0.15 * i} />
              </p>

              {/* Rule: white hairline draws in, amber fills across on hover */}
              <div className="relative mt-6 h-px w-full">
                <motion.span variants={rule} className="absolute inset-0 origin-left bg-white/25" />
                <span className="absolute left-0 top-0 h-px w-0 bg-amber-600 transition-all duration-700 ease-out group-hover:w-full" />
              </div>

              <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 max-w-[260px] text-[13.5px] leading-relaxed text-white/65">
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </MotionConfig>
  );
};

export default Counter;