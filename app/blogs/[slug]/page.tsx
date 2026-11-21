import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  LuCalendar,
  LuClock,
  LuUser,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUpRight,
  LuBookOpen,
  LuTag,
  LuBuilding2,
} from 'react-icons/lu';
import { blogData } from '@/data/blogdata';
import Globalbanner from '@/component/global/banner';


// Generate static pages for all blog slugs
export async function generateStaticParams() {
  return blogData.map((blog: { slug: any; }) => ({
    slug: blog.slug,
  }));
}

// Disable dynamic routes that are not in blogdata
export const dynamicParams = false;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Helper to support both string URLs (Unsplash) and StaticImageData imports
function getImageUrl(image: string | { src: string }): string {
  return typeof image === 'string' ? image : image.src;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogData.find((item: { slug: string; }) => item.slug === slug);

  if (!blog) {
    return {
      title: 'Blog Not Found | RealtyCults',
    };
  }

  const imageUrl = getImageUrl(blog.image);

  return {
    title: `${blog.title} | RealtyCults`,
    description: blog.excerpt,
    keywords: [
      blog.category,
      blog.title,
      'RealtyCults',
      'Residential Plots',
      'Real Estate Investment',
      'Property Buying Guide',
    ],
    alternates: {
      canonical: `/blogData/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: new Date(blog.date).toISOString(),
      authors: [blog.author],
      images: [
        {
          url: imageUrl,
          width: 1600,
          height: 900,
          alt: blog.title,
        },
      ],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = blogData.find((item: { slug: string; }) => item.slug === slug);

  if (!blog) {
    notFound();
  }

  const imageUrl = getImageUrl(blog.image);

  // Related blogData
  const relatedblogData = blogData
    .filter((item: { slug: any; }) => item.slug !== blog.slug)
    .slice(0, 2);

  // Article structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: blog.author,
    },
    datePublished: new Date(blog.date).toISOString(),
    dateModified: new Date(blog.date).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blogData/${blog.slug}`,
    },
    articleSection: blog.category,
    publisher: {
      '@type': 'Organization',
      name: 'RealtyCults',
    },
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* JSON-LD SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
            <Globalbanner title={blog.title} slug={blog.title} />


      {/* Blog Hero Header */}
      <section className="relative overflow-hidden bg-white pb-10 pt-12 md:pt-16 lg:pb-14">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
          <div className="max-w-4xl">
            <Link
              href="/blogData"
              className="group mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-neutral-600 transition-colors duration-300 hover:text-amber-600"
            >
              <LuArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to all blogData
            </Link>

            {/* Category Pill */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-800">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                <LuTag className="h-3.5 w-3.5 text-amber-600" />
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-[34px] font-bold leading-[1.08] tracking-[-0.02em] text-neutral-900 sm:text-5xl lg:text-[58px]">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              {blog.excerpt}
            </p>

            {/* Meta Strip */}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-neutral-200 pt-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-600/40 bg-amber-50 text-amber-600">
                  <LuUser className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                    Written by
                  </p>
                  <p className="text-sm font-bold text-neutral-900">
                    {blog.author}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                <LuCalendar className="h-4 w-4 text-amber-600" />
                <span>{blog.date}</span>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                <LuClock className="h-4 w-4 text-amber-600" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="mx-auto max-w-[1500px] px-6 lg:px-14">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] bg-neutral-100 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.3)] md:aspect-[21/9]">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1400px"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/20 via-transparent to-transparent" />
        </div>
      </section>

      {/* Main Content + Sticky Sidebar */}
      <section className="mx-auto max-w-[1500px] px-6 py-14 md:py-20 lg:px-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Article Body */}
          <article className="min-w-0 lg:col-span-8">
            <div className="mb-8 inline-flex items-center gap-2.5 text-amber-600">
              <LuBookOpen className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-[0.22em]">
                Article Guide
              </span>
            </div>

            <div
              className="
                blog-content
                text-[15.5px] leading-[1.85] text-neutral-700 sm:text-[16.5px]

                [&_h1]:hidden

                [&_h2]:mt-12
                [&_h2]:mb-4
                [&_h2]:font-heading
                [&_h2]:text-2xl
                [&_h2]:font-bold
                [&_h2]:leading-tight
                [&_h2]:tracking-[-0.01em]
                [&_h2]:text-neutral-900
                [&_h2]:sm:text-[30px]

                [&_h3]:mt-8
                [&_h3]:mb-3
                [&_h3]:font-heading
                [&_h3]:text-lg
                [&_h3]:font-bold
                [&_h3]:text-neutral-900
                [&_h3]:sm:text-xl

                [&_p]:mb-5

                [&_ul]:mb-6
                [&_ul]:list-disc
                [&_ul]:space-y-2.5
                [&_ul]:pl-6

                [&_ol]:mb-6
                [&_ol]:list-decimal
                [&_ol]:space-y-2.5
                [&_ol]:pl-6

                [&_li]:pl-1
                [&_li]:marker:text-amber-600

                [&_strong]:font-semibold
                [&_strong]:text-neutral-900

                [&_a]:font-semibold
                [&_a]:text-amber-600
                [&_a]:underline
                [&_a]:decoration-amber-600/40
                [&_a]:underline-offset-4
                hover:[&_a]:decoration-amber-600

                [&_blockquote]:my-7
                [&_blockquote]:rounded-r-2xl
                [&_blockquote]:border-l-4
                [&_blockquote]:border-amber-600
                [&_blockquote]:bg-neutral-50
                [&_blockquote]:py-4
                [&_blockquote]:pl-6
                [&_blockquote]:pr-5
                [&_blockquote]:italic
                [&_blockquote]:text-neutral-800

                [&_table]:my-8
                [&_table]:w-full
                [&_table]:overflow-hidden
                [&_table]:rounded-2xl
                [&_table]:border
                [&_table]:border-neutral-200
                [&_table]:border-collapse
                [&_table]:text-left
                [&_table]:text-sm

                [&_thead]:bg-neutral-900
                [&_thead]:text-white

                [&_th]:px-4
                [&_th]:py-3.5
                [&_th]:text-xs
                [&_th]:font-bold
                [&_th]:uppercase
                [&_th]:tracking-wider

                [&_td]:border-t
                [&_td]:border-neutral-200
                [&_td]:px-4
                [&_td]:py-3.5
                [&_td]:align-top
                [&_td]:text-neutral-700

                [&_tbody_tr:nth-child(even)]:bg-neutral-50/70
                [&_tbody_tr_td:first-child]:font-semibold
                [&_tbody_tr_td:first-child]:text-neutral-900
              "
              dangerouslySetInnerHTML={{
                __html: blog.content,
              }}
            />

            {/* Article Footer */}
            <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-neutral-200 pt-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Published by
                </p>
                <p className="mt-1 font-heading text-lg font-bold text-neutral-900">
                  {blog.author} · RealtyCults
                </p>
              </div>

              <Link
                href="/blogData"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-amber-600 py-1.5 pl-6 pr-1.5 text-[14px] font-bold text-white shadow-[0_14px_34px_-14px_rgba(217,119,6,0.9)] transition-shadow duration-500 hover:shadow-[0_18px_40px_-12px_rgba(217,119,6,1)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-neutral-900 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="relative">Explore more blogData</span>
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-600 transition-transform duration-500 group-hover:rotate-45">
                  <LuArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </article>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-7 lg:sticky lg:top-24">
              {/* Article Information Card */}
              <div className="rounded-[28px] border border-neutral-200 bg-neutral-50 p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
                  Overview
                </p>
                <h3 className="mt-2 font-heading text-xl font-bold text-neutral-900">
                  Article Information
                </h3>

                <div className="mt-6 space-y-4 border-t border-neutral-200 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-neutral-500">Category</span>
                    <span className="rounded-full bg-amber-600/10 px-3 py-1 text-xs font-bold text-amber-700">
                      {blog.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-neutral-500">Published</span>
                    <span className="text-sm font-semibold text-neutral-900">
                      {blog.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-neutral-500">
                      Reading Time
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">
                      {blog.readTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* RealtyCults Advisory Card */}
              <div className="rounded-[28px] bg-neutral-950 p-7 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/15 text-amber-500">
                  <LuBuilding2 className="h-5 w-5" />
                </span>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                  Property Guidance
                </p>
                <h3 className="mt-2 font-heading text-2xl font-bold leading-snug text-white">
                  Planning to buy a plot or agricultural land?
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  Connect with RealtyCults for requirement-based shortlisting,
                  clear communication, and guidance on verified property
                  opportunities.
                </p>

                <Link
                  href="/contact-us"
                  className="group relative mt-7 inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-amber-600 py-1.5 pl-6 pr-1.5 text-[14px] font-bold text-white transition-shadow duration-500 hover:shadow-[0_16px_36px_-14px_rgba(217,119,6,1)]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0" />
                  <span className="relative transition-colors duration-500 group-hover:text-neutral-900">
                    Get in touch
                  </span>
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-amber-600 transition-all duration-500 group-hover:rotate-45 group-hover:bg-amber-600 group-hover:text-white">
                    <LuArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>

              {/* Back to All Articles */}
              <Link
                href="/blogData"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white py-3.5 text-sm font-semibold text-neutral-800 transition-all duration-300 hover:border-amber-600 hover:text-amber-600"
              >
                <LuArrowLeft className="h-4 w-4" />
                View All Articles
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Related blogData */}
      {relatedblogData.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-100 py-16 md:py-24">
          <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                  Keep reading
                </span>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-[-0.02em] text-neutral-900 sm:text-4xl">
                  Related <span className="text-amber-600">Insights</span>
                </h2>
              </div>

              <Link
                href="/blogData"
                className="inline-flex items-center gap-2 text-sm font-bold text-neutral-900 transition-colors hover:text-amber-600"
              >
                View all posts
                <LuArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2">
              {relatedblogData.map((item :any) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white transition-all duration-500 hover:-translate-y-1.5 hover:border-amber-600/50 hover:shadow-[0_30px_60px_-30px_rgba(180,83,9,0.3)]"
                >
                  <div className="grid h-full grid-cols-1 sm:grid-cols-5">
                    <div className="relative min-h-[210px] overflow-hidden sm:col-span-2 sm:h-full">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 320px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col p-6 sm:col-span-3 sm:p-7">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                        {item.category}
                      </span>

                      <h3 className="mt-2 line-clamp-2 font-heading text-xl font-bold leading-snug text-neutral-900 transition-colors duration-300 group-hover:text-amber-600">
                        <Link href={`/blogData/${item.slug}`}>{item.title}</Link>
                      </h3>

                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                        {item.excerpt}
                      </p>

                      <div className="mt-auto pt-5">
                        <Link
                          href={`/blogData/${item.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-amber-600"
                        >
                          Read article
                          <LuArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}