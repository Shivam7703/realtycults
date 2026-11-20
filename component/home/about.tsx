"use client";
import React from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";
import {
  FaHome,
  FaSeedling,
  FaHandshake,
  FaChartLine,
  FaSearchLocation,
  FaRoute,
} from "react-icons/fa";
import type { IconType } from "react-icons";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Service {
  title: string;
  description: string;
  icon: IconType;
}

const services: Service[] = [
  {
    title: "Residential Property Solutions",
    description:
      "Find a place that matches your plans! We help you explore residential plots and property opportunities that align with your location preferences, budget and future goals.",
    icon: FaHome,
  },
  {
    title: "Agricultural Land Opportunities",
    description:
      "Invest in possibilities beyond residential spaces. We assist buyers in identifying agricultural land opportunities for farming, land ownership and long-term investment planning.",
    icon: FaSeedling,
  },
  {
    title: "Property Buying & Selling",
    description:
      "Looking to buy or sell a property? We help connect buyers and sellers while providing guidance throughout the property transaction process.",
    icon: FaHandshake,
  },
  {
    title: "Real Estate Investment Consulting",
    description:
      "Make informed property investment decisions! Our team helps you evaluate locations, property options, pricing and investment potential to support your real estate goals.",
    icon: FaChartLine,
  },
  {
    title: "Property Search & Shortlisting",
    description:
      "Finding the right property takes the right approach. We help you shortlist suitable options based on your requirements, preferred location and budget.",
    icon: FaSearchLocation,
  },
  {
    title: "End-to-End Property Assistance",
    description:
      "From the initial enquiry to the next steps in your property journey, we aim to make the process more organised with dedicated assistance and guidance.",
    icon: FaRoute,
  },
];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "Your" },
  { text: "Property", accent: true },
  { text: "Journey", accent: true },
  { text: "Starts" },
  { text: "With" },
  { text: "The" },
  { text: "Right" },
  { text: "Guidance" },
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

const iconReveal: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -12 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
const CardIcon: React.FC<{ icon: IconType }> = ({ icon: Icon }) => (
  <motion.span
    variants={iconReveal}
    aria-hidden="true"
    className="inline-flex h-12 w-12 shrink-0 items-center justify-center text-amber-600 transition-transform duration-700 ease-out group-hover:rotate-[8deg] group-hover:scale-110"
  >
    <Icon className="h-9 w-9" />
  </motion.span>
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
      <CardIcon icon={service.icon} />
    </div>

    {/* Divider: the amber line draws across on hover */}
    <div className="relative mt-auto h-px w-full bg-neutral-200">
      <span className="absolute left-0 top-0 h-px w-0 bg-amber-600 transition-all duration-700 ease-out group-hover:w-full" />
    </div>

    <p className="mt-6 text-[13.5px] leading-relaxed text-neutral-600">
      {service.description}
    </p>
  </motion.article>
);

const About: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
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
              {/* Hairlines: they cross at the label's corner */}
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
                className="max-w-[900px] font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl lg:text-[64px]"
              >
                {headingWords.map((w, i) => (
                  <React.Fragment key={`${w.text}-${i}`}>
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
                className="mt-8 max-w-[560px] text-[15px] leading-relaxed text-neutral-600"
              >
                At RealtyCults, we make property decisions simpler. From finding the right
                residential plot to identifying promising investment opportunities, we help you
                make informed real estate choices with confidence.
              </motion.p>
            </div>
          </motion.div>

          {/* Service cards */}
          <motion.div
            variants={cardGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
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