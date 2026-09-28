"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JellyRadio from "./jelly-radio";
import { SiteLogo } from "./site-logo";

const links = [
  { label: "Campaigns", href: "/#campaigns", id: "campaigns" },
  { label: "How It Works", href: "/#how-it-works", id: "how-it-works" },
  { label: "FAQ", href: "/#faq", id: "faq" },
];

const navItems = links.map((l) => ({ value: l.id, label: l.label }));

const menuEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("campaigns");

  // Scrollspy — the active chip follows the section crossing mid-viewport.
  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll while the glass menu is open.
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = original; };
    }
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:h-16">
          <SiteLogo />

          <nav className="hidden items-center gap-4 md:flex" aria-label="Primary">
            <JellyRadio
              items={navItems}
              value={active}
              onChange={(v) => {
                setActive(v);
                document
                  .getElementById(v)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              chipColor="#1b1b1b"
              activeColor="#e8dfc9"
              textColor="#f5f5f5"
              activeTextColor="#0a0a0a"
              size="sm"
              gap={6}
              radius={14}
              swell={0.18}
              barge={4}
              shrink={0.05}
              jelly={1}
              bounce={0.25}
              stagger={22}
              stiffness={580}
              ariaLabel="Sections"
              className="rounded-full border border-white/10 bg-white/5"
            />
            <a
              href="/#victim-form"
              className="rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-ink/90"
            >
              Free Case Review →
            </a>
          </nav>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/15 md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              {open ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: menuEase }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A]/92 p-6 backdrop-blur-2xl md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Mobile navigation"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <nav className="flex flex-col gap-4 text-center" onClick={(e) => e.stopPropagation()}>
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, delay: i * 0.07, ease: menuEase }}
                  className="block px-6 py-3 text-2xl font-medium text-white/80 transition-colors hover:text-accent"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="/#victim-form"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35, delay: links.length * 0.07, ease: menuEase }}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8dfc9] to-[#d8c9a3] px-7 py-3.5 text-base font-bold text-black shadow-[0_8px_30px_rgba(216,201,163,0.25)]"
              >
                Free Case Review
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
