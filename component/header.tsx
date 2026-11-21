"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ChevronDown, Grid, Phone, Search, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface SubItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  children?: SubItem[];
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  {
    name: "Projects",
    href: "/projects",
    children: [
      { name: "Arvind", href: "/projects/arvind" },
      { name: "Godrej", href: "/projects/godrej" },
      { name: "Fortesia", href: "/projects/fortesia" },
      { name: "River Wood", href: "/projects/river-wood" },
    ],
  },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact Us", href: "/contact-us" },
];

const PHONE_DISPLAY = "(+91) 9205999692";
const PHONE_HREF = "tel:+919205999692";

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */
const Logo: React.FC = () => (
  <Link href="/" className="group flex items-center gap-2.5" aria-label="RealtyCults home">
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="text-amber-600">
      <path d="M16 3 4 9.5 16 16l12-6.5L16 3Z" fill="currentColor" />
      <path d="M4 15.5 16 22l12-6.5" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M4 21.5 16 28l12-6.5" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" opacity=".55" />
    </svg>
    <span className="text-[28px] font-semibold tracking-tight text-white transition-transform duration-500 group-hover:translate-x-0.5">
      RealtyCults
    </span>
  </Link>
);

interface IconButtonProps {
  label: string;
  onClick: () => void;
  expanded?: boolean;
  children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ label, onClick, expanded, children }) => (
  <button
    type="button"
    aria-label={label}
    aria-expanded={expanded}
    onClick={onClick}
    className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-transparent hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
  >
    <span className="transition-transform duration-500 group-hover:rotate-90">{children}</span>
  </button>
);

/* Amber pill: white fill sweeps in, label rolls up */
const QuoteButton: React.FC = () => (
  <Link
    href="/contact-us"
    className="group relative hidden h-11 items-center overflow-hidden rounded-full bg-amber-600 px-6 text-[13px] font-bold shadow-[0_10px_30px_-10px_rgba(217,119,6,0.8)] transition-shadow duration-500 hover:shadow-[0_14px_40px_-8px_rgba(217,119,6,1)] md:inline-flex"
  >
    <span className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0" />
    <span className="relative block h-[1.2em] overflow-hidden leading-[1.2em]">
      <span className="block text-white transition-transform duration-500 group-hover:-translate-y-full">Get A Quote!</span>
      <span className="absolute left-0 top-full block text-amber-600 transition-transform duration-500 group-hover:-translate-y-full">
        Get A Quote!
      </span>
    </span>
  </Link>
);

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */
const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const isActive = (href: string): boolean =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  /* Transparent at the top, dark glass after scrolling */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close everything when the route changes */
  useEffect(() => {
    setPanelOpen(false);
    setSearchOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  /* Lock body scroll while the side panel is open */
  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [panelOpen]);

  /* Escape closes dropdown, search and panel */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setSearchOpen(false);
        setPanelOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  };

  const solid = scrolled || searchOpen;

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 border-b text-white transition-all duration-500 ${solid
          ? "border-white/10 bg-neutral-950/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
          }`}
      >
        <div
          className={`mx-auto flex max-w-[1500px] items-center justify-between px-6 transition-all duration-500 lg:px-14 ${scrolled ? "h-20" : "h-24"
            }`}
        >
          {/* Left: logo + nav */}
          <div className="flex items-center gap-12 xl:gap-16">
            <Logo />

            <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
              {navItems.map((item) => {
                const active = isActive(item.href);
                const hasChildren = !!item.children?.length;
                const isOpen = openMenu === item.name;

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => hasChildren && setOpenMenu(item.name)}
                    onMouseLeave={() => hasChildren && setOpenMenu(null)}
                    onBlur={(e) => {
                      if (hasChildren && !e.currentTarget.contains(e.relatedTarget as Node | null)) {
                        setOpenMenu(null);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`group relative py-8 text-[13px] font-semibold transition-colors duration-300 hover:text-amber-600 focus-visible:outline-none focus-visible:text-amber-600 ${active ? "text-amber-600" : "text-white/90"
                          }`}
                      >
                        {item.name}
                        <span
                          className={`absolute bottom-6 left-0 h-[2px] w-full origin-left bg-amber-600 transition-transform duration-500 ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                            }`}
                        />
                      </Link>

                      {hasChildren && (
                        <button
                          type="button"
                          aria-label={`${isOpen ? "Close" : "Open"} ${item.name} menu`}
                          aria-haspopup="true"
                          aria-expanded={isOpen}
                          onClick={() => setOpenMenu(isOpen ? null : item.name)}
                          className="-ml-0.5 rounded p-1 text-white/80 transition-colors hover:text-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                        >
                          <ChevronDown
                            className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Dropdown (the pt-2 wrapper keeps hover alive across the gap) */}
                    {hasChildren && (
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="absolute left-0 top-full z-50 w-56 pt-1"
                          >
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/95 p-2 shadow-2xl backdrop-blur-xl">
                              {item.children!.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/75 transition-all duration-300 hover:bg-white/5 hover:pl-5 hover:text-white focus-visible:bg-white/5 focus-visible:text-white focus-visible:outline-none"
                                >
                                  <span
                                    className="h-1.5 w-0 rounded-full transition-all duration-300 group-hover:w-1.5 bg-amber-600"
                                  />
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right: phone, CTA, icons */}
          <div className="flex items-center gap-4 xl:gap-5">
            <a href={PHONE_HREF} className="group hidden items-center gap-3 xl:flex" aria-label={`Call us at ${PHONE_DISPLAY}`}>
              <Phone className="h-6 w-6 text-white/80 transition-all duration-500 group-hover:-rotate-12 group-hover:text-amber-600" />
              <span className="leading-tight">
                <span className="block text-[11px] text-white/70">Call Us Phone</span>
                <span className="block text-[15px] font-semibold">{PHONE_DISPLAY}</span>
              </span>
            </a>

            <QuoteButton />

            <div className="flex items-center gap-3">
              <IconButton
                label={searchOpen ? "Close search" : "Open search"}
                expanded={searchOpen}
                onClick={() => setSearchOpen((v) => !v)}
              >
                {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </IconButton>
              <IconButton label="Open menu" expanded={panelOpen} onClick={() => setPanelOpen(true)}>
                <Grid className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Search drawer */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden border-t border-white/10"
            >
              <form onSubmit={submitSearch} className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-6" role="search">
                <Search className="h-5 w-5 shrink-0 text-white/50" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects, blogs and more"
                  aria-label="Search the site"
                  autoFocus
                  className="w-full bg-transparent text-lg text-white placeholder-white/40 outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full px-5 py-2 text-[13px] font-bold text-white transition-transform duration-300 hover:scale-105 bg-amber-600"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ---------- Side panel (all screen sizes; the only nav on mobile) ---------- */}
      <AnimatePresence>
        {panelOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setPanelOpen(false)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
              aria-hidden="true"
            />

            <motion.aside
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="fixed right-0 top-0 z-[70] flex h-full w-[88%] max-w-sm flex-col overflow-y-auto bg-neutral-950 px-8 py-8 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setPanelOpen(false)}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-all duration-500 hover:rotate-90 hover:border-transparent hover:bg-amber-600 hover:text-neutral-950"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <motion.ul
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
                className="mt-12 flex flex-col"
              >
                {navItems.map((item) => {
                  const hasChildren = !!item.children?.length;
                  const active = isActive(item.href);

                  return (
                    <motion.li
                      key={item.name}
                      variants={{
                        hidden: { opacity: 0, x: 30 },
                        show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
                      }}
                      className="border-b border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          className={`group flex-1 py-4 text-xl font-semibold transition-all duration-300 hover:translate-x-1 hover:text-amber-600 ${active ? "text-amber-600" : "text-white"
                            }`}
                        >
                          {item.name}
                        </Link>
                        {hasChildren && (
                          <button
                            type="button"
                            aria-label={`${mobileProjectsOpen ? "Collapse" : "Expand"} ${item.name}`}
                            aria-expanded={mobileProjectsOpen}
                            onClick={() => setMobileProjectsOpen((v) => !v)}
                            className="rounded-full p-2 text-white/70 transition-colors hover:text-amber-600"
                          >
                            <ChevronDown
                              className={`h-5 w-5 transition-transform duration-300 ${mobileProjectsOpen ? "rotate-180" : ""
                                }`}
                            />
                          </button>
                        )}
                      </div>

                      {hasChildren && (
                        <AnimatePresence initial={false}>
                          {mobileProjectsOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: EASE }}
                              className="overflow-hidden pb-3 pl-4"
                            >
                              {item.children!.map((sub) => (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className="group flex items-center gap-3 py-2.5 text-base text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white"
                                  >
                                    <span
                                      className="h-px w-4 transition-all duration-300 group-hover:w-7 bg-amber-600"
                                    />
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>

              <div className="mt-auto pt-10">
                <a href={PHONE_HREF} className="group flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-transparent group-hover:bg-amber-600 group-hover:text-neutral-950">
                    <Phone className="h-5 w-5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-xs text-white/60">Call Us Phone</span>
                    <span className="block text-base font-semibold">{PHONE_DISPLAY}</span>
                  </span>
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
};

export default Header;