"use client";
import React, { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";

/* ------------------------------------------------------------------ */
/*  Tokens                                                             */
/* ------------------------------------------------------------------ */
const AUTOPLAY_MS = 6500;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Slide {
  id: number;
  label: string;
  lines: string[];
  description: string;
  image: string;
  stat: { value: number; label: string };
}

/* Tip: load "Plus Jakarta Sans" or "Urbanist" with next/font and apply it
   to the page body so the headline gets the same geometric feel as RealityCults. */

const slides: Slide[] = [
  {
    id: 1,
    label: "Fast and reliable",
    lines: ["The Art of Stunning", "Interior Design"],
    description:
      "Whether it's your home, office, or a commercial project, we are always dedicated to bringing your vision to life.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    stat: { value: 260, label: "Successful Projects And Counting" },
  },
  {
    id: 2,
    label: "Modern architecture",
    lines: ["Crafting Spaces", "That Define Elegance"],
    description:
      "We turn raw blueprints into architecture with premium finishes and detail-oriented planning from first sketch to handover.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    stat: { value: 18, label: "Design Awards Won" },
  },
  {
    id: 3,
    label: "Timeless luxury",
    lines: ["Redefining Urban", "Living & Studios"],
    description:
      "Modular layouts, luxury interiors and 3D walkthroughs, tailored to the way you live and work.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop",
    stat: { value: 12, label: "Years Of Studio Experience" },
  },
];

const specs = ["Tech Specifications", "Design Project", "3D Visualisation"];

/* ------------------------------------------------------------------ */
/*  Motion variants (one orchestrated sequence per slide change)       */
/* ------------------------------------------------------------------ */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const maskLine: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 1, ease: EASE } },
  exit: { y: "-115%", transition: { duration: 0.5, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
};

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */
/* Outline pill + gold circle that spins its arrow on hover */
function CounselButton(): React.JSX.Element {
  return (
    <a
      href="#contact"
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/40 py-1.5 pl-6 pr-1.5 text-[13px] font-semibold text-white transition-colors duration-500 hover:border-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <span className="absolute inset-0 origin-left scale-x-0 bg-amber-600/15 transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <span className="relative">Take Counsel</span>
      <span
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110 bg-amber-600"
      >
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </a>
  );
}

function CountUp({ to, play }: { to: number; play: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!play) return;
    const controls = animate(0, to, {
      duration: 1.8,
      delay: 0.7,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, play]);
  return <>{n}+</>;
}

/* ------------------------------------------------------------------ */
/*  Banner                                                             */
/* ------------------------------------------------------------------ */
const Banner: React.FC = () => {
  const [active, setActive] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  const reduce = useReducedMotion();

  const slide = slides[active];
  const next = slides[(active + 1) % slides.length];

  /* Autoplay without Swiper's Autoplay module: that module reads `new Date()` while the page is
     prerendered, which Cache Components rejects. One timer per slide keeps the progress bar in sync. */
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => swiperRef.current?.slideNext(), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [active, reduce]);

  /* Mouse parallax on the background (desktop only, off if reduced motion) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const bgX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const bgY = useTransform(sy, [-0.5, 0.5], [12, -12]);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      onMouseMove={onMove}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-neutral-950 text-white"
    >
      {/* ---------- Background slider ---------- */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute -inset-6">
        <Swiper
          modules={[EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop
          speed={1400}
          allowTouchMove
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          onSlideChange={(s) => setActive(s.realIndex)}
          className="h-full w-full"
        >
          {slides.map((s) => (
            <SwiperSlide key={s.id} className="h-full w-full">
              {({ isActive }) => (
                <motion.img
                  src={s.image}
                  alt=""
                  className="h-full w-full object-cover"
                  initial={false}
                  animate={{ scale: reduce ? 1.05 : isActive ? 1.04 : 1.2 }}
                  transition={{ duration: isActive ? AUTOPLAY_MS / 1000 + 1.5 : 1.4, ease: "easeOut" }}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Overlays: left-weighted for text contrast, bottom for the cards, top for the nav */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-black/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/50" />

      {/* ---------- Main content ---------- */}
      <div className="relative z-20 mx-auto flex h-full max-w-[1500px] flex-col justify-center px-6 lg:px-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="max-w-[1000px]"
          >
            <motion.div variants={fadeUp} className="mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              <span className="text-[11px] font-semibold text-white/90">{slide.label}</span>
            </motion.div>

            <h1 className="text-[44px] font-bold leading-[1.02] tracking-[-0.03em] sm:text-7xl lg:text-[104px]">
              {slide.lines.map((line) => (
                <span key={line} className="block overflow-hidden -mt-[0.1em] pt-[0.1em] -mb-[0.22em] pb-[0.22em]">
                  <motion.span variants={maskLine} className="block">
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              variants={fadeUp}
              className="mt-8 max-w-[440px] text-[15px] leading-relaxed text-white/85"
            >
              {slide.description}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8">
              <CounselButton />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---------- Right: glass stat card + next-slide preview ---------- */}
      <div className="absolute bottom-14 right-6 z-30 hidden items-end gap-5 lg:right-14 lg:flex">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
          whileHover={reduce ? undefined : { y: -8 }}
          className="group relative h-[180px] w-[170px] overflow-hidden rounded-[26px] border border-white/15 bg-gradient-to-b from-white/10 via-black/40 to-black/70 p-5 backdrop-blur-xl transition-colors duration-500 hover:border-amber-600/60"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-40 bg-amber-600"
          />
          <p className="relative text-[34px] font-bold leading-none tracking-tight">
            <CountUp key={slide.id} to={slide.stat.value} play={!reduce} />
          </p>
          <p className="relative mt-3 text-[12px] leading-snug text-white/80">{slide.stat.label}</p>
          <ul className="relative mt-5 space-y-0.5 text-[11px] font-semibold">
            {specs.map((s) => (
              <li key={s} className="transition-transform duration-300 hover:translate-x-1">
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05, ease: EASE }}
          onClick={() => swiperRef.current?.slideNext()}
          aria-label={`Show next slide: ${next.lines.join(" ")}`}
          className="group relative h-[180px] w-[170px] overflow-hidden rounded-[26px] border border-white/20 shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <AnimatePresence mode="popLayout">
            <motion.img
              key={next.id}
              src={next.image}
              alt=""
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </AnimatePresence>
          <span className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/40" />
          <span
            className="absolute right-3 top-3 flex h-9 w-9 scale-50 items-center justify-center rounded-full text-neutral-950 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 bg-amber-600"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </motion.button>
      </div>

      {/* ---------- Progress (restarts on every slide) ---------- */}
      <div className="absolute bottom-14 left-6 z-30 hidden items-center gap-3 sm:flex lg:left-14">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => swiperRef.current?.slideToLoop(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="group relative h-6 w-14 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <span className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 overflow-hidden rounded bg-white/25 transition-all duration-300 group-hover:h-[4px]">
              {i === active && (
                <motion.span
                  key={`bar-${active}`}
                  className="absolute inset-0 origin-left bg-amber-600"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
                />
              )}
              {i < active && <span className="absolute inset-0 bg-amber-600" />}
            </span>
          </button>
        ))}
      </div>

      {/* ---------- Scroll button ---------- */}
      <motion.a
        href="#next-section"
        aria-label="Scroll to next section"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
        className="group absolute bottom-10 left-1/2 z-30 -translate-x-1/2"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-white/30 [animation-duration:2.6s]" />
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-amber-600 shadow-xl transition-colors duration-500 group-hover:bg-amber-600 group-hover:text-white">
          <motion.span
            animate={reduce ? undefined : { y: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </span>
      </motion.a>
    </section>
  );
};

export default Banner;