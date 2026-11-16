"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MotionConfig,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content (replace with your real six projects)                      */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Status = "Ongoing" | "Completed" | "Upcoming";

interface Project {
  slug: string;
  title: string;
  meta: string;
  status: Status;
  image: string;
}

const projects: Project[] = [
  {
    slug: "arvind",
    title: "Arvind",
    meta: "3 & 4 BHK / Bengaluru",
    status: "Ongoing",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "godrej",
    title: "Godrej",
    meta: "2 & 3 BHK / Bengaluru",
    status: "Ongoing",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "fortesia",
    title: "Fortesia",
    meta: "Villas / Bengaluru",
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "river-wood",
    title: "River Wood",
    meta: "3 BHK / Bengaluru",
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "project-five",
    title: "Project Five",
    meta: "Plots / Bengaluru",
    status: "Upcoming",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "project-six",
    title: "Project Six",
    meta: "Apartments / Bengaluru",
    status: "Upcoming",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
  },
];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "Mixing" },
  { text: "Smart", accent: true },
  { text: "Ideas", accent: true },
  { text: "with" },
  { text: "Creative" },
  { text: "Designs" },
];

const CARD_TOP = 96; // px: where the first card sticks (clears the fixed header)
const CARD_STEP = 14; // px: how far each next card peeks below the previous one
const SCALE_STEP = 0.025; // how much earlier cards shrink as new ones stack on top

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

const ruleDraw: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease: EASE } },
};

const introGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
const LogoMark: React.FC = () => (
  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-600 text-amber-600">
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 3 4 9.5 16 16l12-6.5L16 3Z" fill="currentColor" />
      <path d="M4 15.5 16 22l12-6.5" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M4 21.5 16 28l12-6.5" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" opacity=".55" />
    </svg>
  </span>
);

/* White pill, amber circle: on hover the pill turns amber and the chevron slides */
const ViewAllButton: React.FC = () => (
  <Link
    href="/projects"
    className="group inline-flex items-center gap-4 rounded-full bg-white py-1.5 pl-6 pr-1.5 text-[13px] font-semibold text-neutral-900 transition-colors duration-500 hover:bg-amber-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
  >
    View All Projects
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white transition-all duration-500 group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-amber-600">
      <ChevronRight className="h-4 w-4" />
    </span>
  </Link>
);

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

/* One sticky card. Earlier cards shrink slightly as the next ones stack on top. */
const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, total, progress }) => {
  const reduce = useReducedMotion();
  const scale = useTransform(progress, [index / total, 1], [1, 1 - (total - 1 - index) * SCALE_STEP]);

  return (
    <div
      className="sticky"
      style={{ top: CARD_TOP + index * CARD_STEP, zIndex: index + 1 }}
    >
      <motion.div
        style={reduce ? undefined : { scale, transformOrigin: "top center" }}
        className="h-[340px] sm:h-[400px] lg:h-[440px]"
      >
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.title}, ${project.meta}, ${project.status}`}
          className="group relative block h-full overflow-hidden rounded-[28px] bg-neutral-800 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
        >
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority={index === 0}
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20 transition-opacity duration-700 group-hover:from-black/90" />

          {/* Status chip */}
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
            {project.status}
          </span>

          {/* Title row */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
            <div className="min-w-0">
              <h3 className="font-heading text-[30px] font-semibold leading-tight text-white transition-transform duration-500 group-hover:translate-x-1 sm:text-[34px]">
                {project.title}
              </h3>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
                {project.meta}
              </p>
            </div>

            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-amber-600">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/*  Note: no ancestor of the sticky elements may use overflow-hidden.  */
/* ------------------------------------------------------------------ */
const Projects: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const total = projects.length;

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setCurrent(Math.min(total - 1, Math.max(0, Math.floor(p * total))));
  });

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="projects"
        aria-labelledby="projects-title"
        className="relative bg-neutral-950 py-24 text-white lg:py-32"
      >
        <div className="mx-auto grid max-w-[1500px] gap-14 px-6 lg:grid-cols-[5fr_6fr] lg:gap-20 lg:px-14">
          {/* Left: sticky intro */}
          <div className="self-start lg:sticky lg:top-28">
            <motion.div
              variants={introGroup}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div variants={fadeUp}>
                <LogoMark />
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-amber-600"
              >
                Our projects
              </motion.p>

              <motion.h2
                id="projects-title"
                variants={headingGroup}
                className="mt-5 max-w-[520px] font-heading text-[40px] font-semibold leading-[1.08] tracking-[-0.01em] sm:text-5xl lg:text-[56px]"
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

              <motion.span
                variants={ruleDraw}
                className="mt-12 block h-px w-full max-w-[440px] origin-left bg-white/25"
              />

              <motion.p
                variants={fadeUp}
                className="mt-8 max-w-[440px] text-sm leading-relaxed text-white/70"
              >
                Our approach stands on individual and distinct designs to develop functional spaces
                that meet both aesthetic and operational needs. Careful planning determines
                everything we do to achieve functional and attractive spaces.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-10">
                <ViewAllButton />
              </motion.div>
            </motion.div>

            {/* Scroll progress (desktop) */}
            <div className="mt-14 hidden max-w-[440px] items-center gap-4 lg:flex" aria-hidden="true">
              <span className="w-[72px] text-sm font-semibold tabular-nums text-white">
                {String(current + 1).padStart(2, "0")}
                <span className="text-white/40"> / {String(total).padStart(2, "0")}</span>
              </span>
              <span className="relative h-px flex-1 bg-white/20">
                <motion.span
                  style={{ scaleX: scrollYProgress }}
                  className="absolute inset-0 origin-left bg-amber-600"
                />
              </span>
            </div>
          </div>

          {/* Right: sticky stacking cards */}
          <div ref={listRef} className="flex flex-col gap-8 pb-8 lg:gap-10">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} total={total} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Projects;