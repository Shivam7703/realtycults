"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content (replace with your real posts)                             */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Post {
  slug: string;
  category: string;
  author: string;
  date: string; // ISO, e.g. 2026-10-12
  title: string;
  excerpt: string;
  image: string;
}

const posts: Post[] = [
  {
    slug: "things-to-check-before-buying-a-residential-plot",
    category: "Property Buying Guide",
    author: "Admin",
    date: "2026-10-12",
    title: "Five Important Things To Check Before Buying A Residential Plot",
    excerpt:
      "Buying a residential plot requires careful planning. From location and legal documents to development plans and pricing, understand the important factors before making your property decision.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "how-to-identify-the-right-location-for-property-investment",
    category: "Real Estate Insights",
    author: "Admin",
    date: "2026-09-28",
    title: "How To Identify The Right Location For Your Property Investment",
    excerpt:
      "Location plays an important role in property decisions. Learn how connectivity, infrastructure, surrounding development and future growth prospects can influence your investment choices.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    slug: "what-to-know-before-investing-in-agricultural-land",
    category: "Agricultural Land",
    author: "Admin",
    date: "2026-09-10",
    title: "What To Know Before Investing In Agricultural Land",
    excerpt:
      "Agricultural land can offer different ownership and usage opportunities. Understand land records, permitted usage, accessibility and local regulations before making a purchase decision.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1600&auto=format&fit=crop",
  },
];

const headingWords: { text: string; accent?: boolean }[] = [
  { text: "Insights", accent: true },
  { text: "&", accent: true },
  { text: "Updates", accent: true },
  { text: "From" },
  { text: "The" },
  { text: "World" },
  { text: "Of" },
  { text: "Real" },
  { text: "Estate" },
];

const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });


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

const cardGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
/* Faint architectural line drawing behind the section */
const BlueprintBackdrop: React.FC = () => (
  <svg
    viewBox="0 0 800 500"
    fill="none"
    aria-hidden="true"
    className="pointer-events-none absolute right-0 top-0 w-[900px] max-w-none text-neutral-900 opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent)]"
  >
    <g stroke="currentColor" strokeWidth="1">
      <path d="M40 460 220 120 300 260 420 40 540 240 640 120 760 460" />
      <path d="M220 120 420 40 640 120" />
      <path d="M300 260 540 240" />
      <path d="M220 120 260 460" />
      <path d="M300 260 340 460" />
      <path d="M420 40 400 460" />
      <path d="M540 240 520 460" />
      <path d="M640 120 600 460" />
      <path d="M260 300 520 330" />
      <path d="M120 330 700 340" />
    </g>
  </svg>
);

const PostCard: React.FC<{ post: Post; priority?: boolean }> = ({ post, priority }) => (
  <motion.article variants={fadeUp} className="h-full">
    <Link
      href={`/blogs/${post.slug}`}
      className="group flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-amber-600"
    >
      {/* Image */}
      <div className="relative aspect-[1.4/1] overflow-hidden rounded-[28px] bg-neutral-200">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

        <span className="absolute left-5 top-5 rounded-full bg-amber-600 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(217,119,6,0.9)]">
          {post.category}
        </span>

        {/* Arrow appears on hover */}
        <span
          aria-hidden="true"
          className="absolute bottom-5 right-5 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-white text-amber-600 opacity-0 shadow-lg transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>

      {/* Meta */}
      <p className="mt-7 flex items-center gap-2 text-[14px] text-neutral-500">
        <span>
          By <span className="font-semibold text-amber-600">{post.author}</span>
        </span>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-neutral-300" />
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </p>

      {/* Title: amber underline draws on hover */}
      <h3 className="mt-3 font-heading text-[26px] font-bold leading-[1.15] tracking-tight text-neutral-900 transition-colors duration-500 group-hover:text-amber-600 sm:text-[30px]">
        <span className="bg-gradient-to-r from-amber-600 to-amber-600 bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-700 ease-out [box-decoration-break:clone] group-hover:bg-[length:100%_2px]">
          {post.title}
        </span>
      </h3>

      <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-neutral-600">{post.excerpt}</p>
    </Link>
  </motion.article>
);

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
const Blog: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="blog"
        aria-labelledby="blog-title"
        className="relative overflow-hidden bg-neutral-50 py-24 lg:py-32"
      >
        <BlueprintBackdrop />

        <div className="relative mx-auto max-w-[1500px] px-6 lg:px-14">
          {/* Intro: label | heading */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid gap-8 lg:grid-cols-[minmax(0,330px)_1fr] lg:gap-14"
          >
            <div className="relative">
              {/* Hairlines like the reference: they cross at the label's corner */}
              <span className="absolute -top-6 right-0 hidden h-px w-[420px] bg-gradient-to-l from-neutral-300 to-transparent lg:block" />
              <span className="absolute -top-6 right-0 hidden h-[300px] w-px bg-gradient-to-b from-neutral-300 to-transparent lg:block" />

              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-800"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                Latest Articles
              </motion.span>
            </div>

            <motion.h2
              id="blog-title"
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
          </motion.div>

          {/* Cards */}
          <motion.div
            variants={cardGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:mt-20 lg:grid-cols-3"
          >
            {posts.map((p, i) => (
              <PostCard key={p.slug} post={p} priority={i === 0} />
            ))}
          </motion.div>

          {/* View all */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-4 rounded-full border border-neutral-300 py-1.5 pl-7 pr-1.5 text-[14px] font-semibold text-neutral-900 transition-all duration-500 hover:border-amber-600 hover:bg-amber-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
            >
              View all articles
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-amber-600">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
};

export default Blog;