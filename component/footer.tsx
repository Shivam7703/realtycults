"use client";
import React from "react";
import Link from "next/link";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Content (edit brand, links and contact details here)               */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const BRAND = "RealityCults";

interface LinkItem {
    name: string;
    href: string;
}

const quickLinks: LinkItem[] = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Projects", href: "/projects" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact Us", href: "/contact-us" },
];

const projectLinks: LinkItem[] = [
    { name: "Arvind", href: "/projects/arvind" },
    { name: "Godrej", href: "/projects/godrej" },
    { name: "Fortesia", href: "/projects/fortesia" },
    { name: "River Wood", href: "/projects/river-wood" },
];

const legalLinks: LinkItem[] = [{ name: "Privacy Policy", href: "/privacy-policy" }];

const PHONE = { display: "(+91) 123 678 900", href: "tel:+91123678900" };
const EMAIL = { display: "hello@yourcompany.com", href: "mailto:hello@yourcompany.com" };
const ADDRESS = "123 Business Avenue, Bengaluru, Karnataka 560001";

/* Replace each href with your real profile */
const socials: { name: string; href: string; icon: React.ReactNode }[] = [
    {
        name: "Instagram",
        href: "https://www.instagram.com/",
        icon: (
            <>
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
            </>
        ),
    },
    {
        name: "Facebook",
        href: "https://www.facebook.com/",
        icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/",
        icon: (
            <>
                <rect x="3" y="9" width="4" height="12" />
                <circle cx="5" cy="5" r="2" />
                <path d="M10 9h4v2c.8-1.4 2.2-2.2 4-2.2 3 0 4 2 4 5V21h-4v-6c0-1.4-.6-2.3-2-2.3S14 13.6 14 15v6h-4V9Z" />
            </>
        ),
    },
    {
        name: "YouTube",
        href: "https://www.youtube.com/",
        icon: (
            <>
                <rect x="2" y="5" width="20" height="14" rx="4" />
                <path d="m10 9 5 3-5 3V9Z" />
            </>
        ),
    },
];

/* ------------------------------------------------------------------ */
/*  Motion                                                             */
/* ------------------------------------------------------------------ */
const group: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
const Logo: React.FC = () => (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label={`${BRAND} home`}>
        <svg
            width="30"
            height="30"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            className="text-amber-600"
        >
            <path d="M16 3 4 9.5 16 16l12-6.5L16 3Z" fill="currentColor" />
            <path d="M4 15.5 16 22l12-6.5" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M4 21.5 16 28l12-6.5" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" opacity=".55" />
        </svg>
        <span className="text-[28px] font-semibold tracking-tight text-white transition-transform duration-500 group-hover:translate-x-0.5">
            {BRAND}
        </span>
    </Link>
);

const ColumnTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">{children}</h3>
);

/* Link with an amber underline that grows from the left */
const FooterLink: React.FC<{ item: LinkItem }> = ({ item }) => (
    <Link
        href={item.href}
        className="group relative inline-block py-1 text-[14.5px] text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
    >
        {item.name}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-amber-600 transition-transform duration-500 group-hover:scale-x-100" />
    </Link>
);

const ContactLine: React.FC<{
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    children: React.ReactNode;
}> = ({ icon: Icon, href, children }) => {
    const inner = (
        <>
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-amber-600 transition-all duration-500 group-hover:border-transparent group-hover:bg-amber-600 group-hover:text-white">
                <Icon className="h-4 w-4" />
            </span>
            <span className="text-[14.5px] leading-snug text-white/70 transition-colors duration-300 group-hover:text-white">
                {children}
            </span>
        </>
    );
    const cls = "group flex items-start gap-3";
    return href ? (
        <a href={href} className={`${cls} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600`}>
            {inner}
        </a>
    ) : (
        <div className={cls}>{inner}</div>
    );
};

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <MotionConfig reducedMotion="user">
            <footer className="relative overflow-hidden bg-neutral-950 text-white" aria-label="Site footer">
                <div className="mx-auto max-w-[1500px] px-6 lg:px-14">
                    {/* ---------- CTA band ---------- */}
                    <motion.div
                        variants={group}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        className="flex flex-col gap-8 border-b border-white/10 py-16 lg:flex-row lg:items-end lg:justify-between lg:py-20"
                    >
                        <div>
                            <motion.p
                                variants={fadeUp}
                                className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600"
                            >
                                Let’s get started
                            </motion.p>
                            <motion.h2
                                variants={fadeUp}
                                className="mt-4 max-w-[760px] font-heading text-[38px] font-bold leading-[1.08] tracking-[-0.01em] sm:text-5xl lg:text-[56px]"
                            >
                                Ready to find a home that is <span className="text-amber-600">made for you?</span>
                            </motion.h2>
                        </div>

                        <motion.div variants={fadeUp}>
                            <Link
                                href="/contact-us"
                                className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-amber-600 py-1.5 pl-7 pr-1.5 text-[14px] font-bold text-white shadow-[0_14px_34px_-14px_rgba(217,119,6,0.9)] transition-shadow duration-500 hover:shadow-[0_18px_40px_-12px_rgba(217,119,6,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            >
                                <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0" />
                                <span className="relative transition-colors duration-500 group-hover:text-neutral-900">
                                    Get in touch
                                </span>
                                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-amber-600 transition-all duration-500 group-hover:rotate-45 group-hover:bg-amber-600 group-hover:text-white">
                                    <ArrowUpRight className="h-4 w-4" />
                                </span>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* ---------- Link columns ---------- */}
                    <motion.div
                        variants={group}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr] lg:gap-14"
                    >
                        <motion.div variants={fadeUp}>
                            <Logo />
                            <p className="mt-6 max-w-[340px] text-[14.5px] leading-relaxed text-white/65">
                                Thoughtfully made homes and spaces, designed with care and delivered with
                                transparency from the first conversation to the final handover.
                            </p>

                            <ul className="mt-8 flex items-center gap-3" aria-label="Social media">
                                {socials.map((s) => (
                                    <li key={s.name}>
                                        <a
                                            href={s.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={s.name}
                                            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-500 hover:-translate-y-1 hover:border-transparent hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                width="18"
                                                height="18"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                {s.icon}
                                            </svg>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.nav variants={fadeUp} aria-label="Quick links">
                            <ColumnTitle>Quick links</ColumnTitle>
                            <ul className="mt-6 flex flex-col gap-1.5">
                                {quickLinks.map((l) => (
                                    <li key={l.href}>
                                        <FooterLink item={l} />
                                    </li>
                                ))}
                            </ul>
                        </motion.nav>

                        <motion.nav variants={fadeUp} aria-label="Projects">
                            <ColumnTitle>Projects</ColumnTitle>
                            <ul className="mt-6 flex flex-col gap-1.5">
                                {projectLinks.map((l) => (
                                    <li key={l.href}>
                                        <FooterLink item={l} />
                                    </li>
                                ))}
                            </ul>
                        </motion.nav>

                        <motion.div variants={fadeUp}>
                            <ColumnTitle>Contact</ColumnTitle>
                            <div className="mt-6 flex flex-col gap-4">
                                <ContactLine icon={Phone} href={PHONE.href}>
                                    {PHONE.display}
                                </ContactLine>
                                <ContactLine icon={Mail} href={EMAIL.href}>
                                    {EMAIL.display}
                                </ContactLine>
                                <ContactLine icon={MapPin}>{ADDRESS}</ContactLine>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* ---------- Bottom bar ---------- */}
                    <div className="flex flex-col gap-5 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[13px] text-white/50">
                            © {year} {BRAND}. All rights reserved.
                        </p>

                        <div className="flex items-center justify-between gap-6 sm:justify-end">
                            <ul className="flex items-center gap-6">
                                {legalLinks.map((l) => (
                                    <li key={l.href}>
                                        <Link
                                            href={l.href}
                                            className="text-[13px] text-white/50 transition-colors duration-300 hover:text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600"
                                        >
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={toTop}
                                aria-label="Back to top"
                                className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-500 hover:border-transparent hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                <ArrowUp className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Oversized wordmark: decorative, fades out toward the bottom */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none -mb-[0.1em] select-none whitespace-nowrap text-center font-heading text-[30vw] font-bold leading-[0.8] tracking-tighter text-transparent bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text lg:text-[21vw]"
                >
                    {BRAND}
                </div>
            </footer>
        </MotionConfig>
    );
};

export default Footer;