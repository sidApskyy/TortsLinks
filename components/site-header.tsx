"use client";

import { useEffect, useState } from "react";
import JellyRadio from "./jelly-radio";

const links = [
  { label: "Campaigns", href: "/#campaigns", id: "campaigns" },
  { label: "How It Works", href: "/#how-it-works", id: "how-it-works" },
  { label: "FAQ", href: "/#faq", id: "faq" },
];

const navItems = links.map((l) => ({ value: l.id, label: l.label }));

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

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:h-16">
        <a href="/" className="flex items-center font-display text-2xl font-bold tracking-tight">
          Torts<span className="text-accent">Links</span>
        </a>

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

      {open && (
        <nav className="border-t border-ink/10 bg-paper px-5 py-4 md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-ink/80"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#victim-form"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg bg-ink px-5 py-3 text-center text-sm font-semibold text-paper"
          >
            Free Case Review →
          </a>
        </nav>
      )}
    </header>
  );
}
