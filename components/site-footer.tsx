"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import BlinkingDots from "./blinking-dots";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const navLinks = [
  { label: "Campaigns", href: "/#campaigns" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
  { label: "Free Case Review", href: "/#victim-form" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms of Service", href: "#terms" },
  { label: "Disclosures", href: "#disclosures" },
  { label: "Cookie Policy", href: "#cookie-policy" },
];

const legalBlocks = [
  {
    id: "privacy",
    title: "Privacy Policy",
    body: "Information you submit is used to evaluate your potential claim and may be shared with participating law firms for that purpose. We do not sell your information for unrelated marketing. You may request access to or deletion of your information at any time by contacting us.",
  },
  {
    id: "terms",
    title: "Terms of Service",
    body: "By using this site you agree that your submission is a request for a free case review only, that no attorney-client relationship is formed, and that you consent to be contacted as described in the consent language presented with the form.",
  },
  {
    id: "disclosures",
    title: "Disclosures",
    body: "This is a paid attorney advertisement. Participating attorneys and firms pay to receive qualifying inquiries. The choice of a lawyer is an important decision and should not be based solely upon advertisements. Prior results do not guarantee similar outcomes.",
  },
  {
    id: "cookie-policy",
    title: "Cookie Policy",
    body: "This site uses only technologies required for security and form functionality, including bot-mitigation and consent-certification tools. We do not use advertising or analytics cookies on this page.",
  },
];

export function SiteFooter() {
  const reduce = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const watermarkOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.7, 1]);

  const rise = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-30px" },
          transition: { duration: 0.55, delay, ease },
        };

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-white/10 bg-black text-white/70">
      {/* Nebula clouds — champagne, violet, and a whisper of blue drifting
          behind the starfield */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[-12%] h-80 w-[44rem] max-w-[90vw] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(216,201,163,0.12), transparent 65%)",
        }}
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 18, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-15%] top-1/3 h-96 w-[38rem] max-w-[90vw] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(96,82,168,0.14), transparent 65%)",
        }}
        animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 24, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[-10%] left-[30%] h-72 w-[34rem] max-w-[80vw] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(110,140,220,0.10), transparent 65%)",
        }}
        animate={reduce ? undefined : { x: [0, 30, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* galaxy starfield across the whole footer */}
      <BlinkingDots />
      {/* Accent hairline draws itself across the top */}
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-[-1px] h-px origin-left bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-12 pb-28 lg:pb-12">
        <div className="grid gap-10 md:grid-cols-4">
          <motion.div {...rise(0)} className="md:col-span-2">
            <a href="/" className="font-display text-2xl font-bold tracking-tight text-white">
              <span className="footer-sheen">
                Torts<span className="text-accent">Links</span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Where Better Cases Begin With Better Acquisition.
            </p>
            <div className="mt-4 space-y-1 text-sm">
              <a
                href="mailto:hello@thetortsattorney.com"
                className="footer-link inline-block text-white/70 hover:text-accent"
              >
                hello@thetortsattorney.com
              </a>
              <a href="tel:3025868230" className="footer-link inline-block text-white/70 hover:text-accent">
                3025868230
              </a>
            </div>
          </motion.div>
          <motion.nav {...rise(0.1)} aria-label="Footer">
            <h3 className="text-sm font-semibold text-white">Navigation</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="footer-link hover:text-accent">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
          <motion.nav {...rise(0.2)} aria-label="Legal">
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="footer-link hover:text-accent">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>

        <motion.div {...rise(0.15)} className="mt-10 border-t border-white/15 pt-8 text-sm text-white/55">
          <h3 className="font-semibold text-white/80">Important Notice</h3>
          <p className="mt-2 max-w-3xl">
            We provide legal marketing and case-acquisition services for plaintiff law firms and
            campaign partners. We are not a law firm and do not provide legal advice or legal
            representation.
          </p>
        </motion.div>

        <div className="mt-8 space-y-6 border-t border-white/15 pt-8 text-sm leading-relaxed text-white/50">
          {legalBlocks.map((b, i) => (
            <motion.div key={b.id} id={b.id} {...rise(i * 0.06)} className="scroll-mt-24">
              <h3 className="font-semibold text-white/80">{b.title}</h3>
              <p className="mt-2">{b.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.p {...rise(0.1)} className="mt-8 text-sm text-white/40">
          © {new Date().getFullYear()} TortsLinks. All rights reserved.{" "}
          <span className="text-white/25">|</span> Developed by{" "}
          <a
            href="https://www.rdcsgenix.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link text-white/60 hover:text-accent"
          >
            RDCS Genix
          </a>
        </motion.p>
      </div>

      {/* Giant ghost wordmark — rises with scroll, gold sheen sweeps occasionally */}
      <div aria-hidden className="pointer-events-none relative select-none overflow-hidden">
        <motion.p
          className="footer-watermark mt-2 text-center font-display text-[17vw] font-bold leading-[0.9] tracking-tight md:text-[11rem]"
          style={reduce ? undefined : { y: watermarkY, opacity: watermarkOpacity }}
        >
          TortsLinks
        </motion.p>
        <motion.p
          className="footer-watermark-sheen absolute inset-0 mt-2 text-center font-display text-[17vw] font-bold leading-[0.9] tracking-tight md:text-[11rem]"
          style={reduce ? undefined : { y: watermarkY }}
        >
          TortsLinks
        </motion.p>
      </div>
    </footer>
  );
}
