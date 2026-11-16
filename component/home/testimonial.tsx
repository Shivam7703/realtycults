"use client";
import React, { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";

/* ------------------------------------------------------------------ */
/*  Content (replace the placeholder reviews with your real ones)      */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Paste your Google "write a review" link here */
const GOOGLE_REVIEW_URL = "https://g.page/r/YOUR_PLACE_ID/review";

const SUMMARY = { rating: 4.9, count: 128 };

interface Review {
  name: string;
  meta?: string;
  time: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** avatar background (Tailwind class) */
  color: string;
}

const reviews: Review[] = [
  {
    name: "Ananya Rao",
    meta: "Local Guide · 24 reviews",
    time: "2 weeks ago",
    rating: 5,
    color: "bg-indigo-600",
    text: "We booked our apartment after just one site visit. The team was transparent about pricing, paperwork and timelines, and possession came exactly when they said it would. The finish quality is better than what we saw in the show flat.",
  },
  {
    name: "Rohit Menon",
    meta: "11 reviews",
    time: "a month ago",
    rating: 5,
    color: "bg-teal-600",
    text: "Very professional from the first call to handover. They answered every question patiently and followed up on every small request.",
  },
  {
    name: "Sneha Iyer",
    meta: "Local Guide · 67 reviews",
    time: "a month ago",
    rating: 5,
    color: "bg-rose-600",
    text: "The layout is thoughtful and the common areas are well maintained. As a first-time buyer I was nervous about the loan and registration process, but their team walked me through every step. I would happily recommend them to family and friends looking for a home in Bengaluru.",
  },
  {
    name: "Karthik Subramanian",
    time: "2 months ago",
    rating: 4,
    color: "bg-purple-600",
    text: "Good construction quality and a responsive team. A couple of snag items took a little time to close, but they were all fixed properly.",
  },
  {
    name: "Meera Kapoor",
    meta: "5 reviews",
    time: "3 months ago",
    rating: 5,
    color: "bg-sky-700",
    text: "Honest, friendly and no pressure at all. They showed us three options within our budget and explained the trade-offs clearly. We love the natural light in our new home.",
  },
  {
    name: "Vikram Shetty",
    meta: "Local Guide · 9 reviews",
    time: "4 months ago",
    rating: 5,
    color: "bg-emerald-700",
    text: "From booking to key handover everything was smooth. The after-sales support has been just as good as the sales experience, which is rare. Our family has settled in beautifully and the neighbourhood is exactly what we hoped for.",
  },
  {
    name: "Divya Nair",
    time: "5 months ago",
    rating: 5,
    color: "bg-orange-700",
    text: "Great experience overall. Clear communication, quality materials and a team that actually listens.",
  },
];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "What" },
  { text: "Our" },
  { text: "Clients", accent: true },
  { text: "Say" },
  { text: "About" },
  { text: "Living", accent: true },
  { text: "With", accent: true },
  { text: "Us", accent: true },
];

const CLAMP_AT = 170; // characters; longer reviews get a "Read more" toggle

/* ------------------------------------------------------------------ */
/*  Motion                                                             */
/* ------------------------------------------------------------------ */
const headingGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
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
const GoogleG: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const Stars: React.FC<{ rating: number; className?: string }> = ({ rating, className = "h-4 w-4" }) => (
  <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <svg
        key={n}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={`${className} ${n <= Math.round(rating) ? "text-amber-500" : "text-neutral-300"}`}
        fill="currentColor"
      >
        <path d="M12 2.5l2.94 6.1 6.56.9-4.8 4.62 1.2 6.58L12 17.5l-5.9 3.2 1.2-6.58L2.5 9.5l6.56-.9L12 2.5z" />
      </svg>
    ))}
  </div>
);

/* One Google-style review card */
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const [open, setOpen] = useState(false);
  const long = review.text.length > CLAMP_AT;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-amber-600/40 hover:shadow-[0_24px_50px_-28px_rgba(180,83,9,0.45)]">
      <header className="flex items-start gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white ${review.color}`}
          aria-hidden="true"
        >
          {review.name.charAt(0)}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-neutral-900">{review.name}</h3>
          {review.meta && <p className="truncate text-xs text-neutral-500">{review.meta}</p>}
        </div>

        <GoogleG className="h-5 w-5 shrink-0" />
      </header>

      <div className="mt-4 flex items-center gap-2">
        <Stars rating={review.rating} />
        <span className="text-xs text-neutral-500">{review.time}</span>
      </div>

      <p
        className={`mt-3 text-[14px] leading-relaxed text-neutral-700 ${
          long && !open ? "line-clamp-4" : ""
        }`}
      >
        {review.text}
      </p>

      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-2 self-start text-[13px] font-semibold text-amber-600 underline-offset-4 transition-colors hover:text-amber-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}

      {/* <p className="mt-auto pt-5 text-[11px] text-neutral-400">Posted on Google</p> */}
    </article>
  );
};

const NavButton: React.FC<{ label: string; onClick: () => void; children: React.ReactNode }> = ({
  label,
  onClick,
  children,
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 text-neutral-800 transition-all duration-500 hover:scale-105 hover:border-transparent hover:bg-amber-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
  >
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const Testimonials: React.FC = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden bg-white py-24 lg:py-32" aria-labelledby="testimonials-title">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
          {/* Heading + Google rating summary */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                Testimonials
              </motion.span>

              <motion.h2
                id="testimonials-title"
                variants={headingGroup}
                className="mt-7 max-w-[760px] font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] text-neutral-900 sm:text-5xl lg:text-[60px]"
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

            <motion.div
              variants={fadeUp}
              className="flex items-center gap-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <GoogleG className="h-10 w-10 shrink-0" />
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl font-bold leading-none text-neutral-900">
                    {SUMMARY.rating.toFixed(1)}
                  </span>
                  <Stars rating={SUMMARY.rating} className="h-[18px] w-[18px]" />
                </div>
                {/* <p className="mt-1.5 text-xs text-neutral-500">
                  Based on {SUMMARY.count} Google reviews
                </p> */}
              </div>
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 hidden rounded-full bg-amber-600 px-5 py-2.5 text-[13px] font-bold text-white transition-all duration-500 hover:bg-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 sm:inline-block"
              >
                Write a review
              </a>
            </motion.div>
          </motion.div>

          {/* Slider */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-14 lg:mt-16"
          >
            <Swiper
              modules={[Autoplay, Keyboard, A11y]}
              loop
              speed={800}
              grabCursor
              keyboard={{ enabled: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              a11y={{ prevSlideMessage: "Previous review", nextSlideMessage: "Next review" }}
              breakpoints={{
                0: { slidesPerView: 1.08, spaceBetween: 16 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1280: { slidesPerView: 3, spaceBetween: 24 },
              }}
              onSwiper={(s) => {
                swiperRef.current = s;
              }}
              className="-my-4 py-4"
            >
              {reviews.map((r) => (
                <SwiperSlide key={r.name} style={{ height: "auto" }}>
                  <ReviewCard review={r} />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="mt-10 flex items-center justify-between gap-6">
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-neutral-900 underline decoration-amber-600 decoration-2 underline-offset-8 transition-colors hover:text-amber-600 sm:hidden"
              >
                Write a review
              </a>
              {/* <p className="hidden text-xs text-neutral-400 sm:block">
                Reviews are shown from Google and shared with permission.
              </p> */}

              <div className="flex items-center gap-3">
                <NavButton label="Previous review" onClick={() => swiperRef.current?.slidePrev()}>
                  <ArrowLeft className="h-4 w-4" />
                </NavButton>
                <NavButton label="Next review" onClick={() => swiperRef.current?.slideNext()}>
                  <ArrowRight className="h-4 w-4" />
                </NavButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Testimonials;