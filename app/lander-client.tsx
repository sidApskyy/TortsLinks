"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { IntakeForm } from "@/components/intake-form";
import LightRays from "@/components/light-rays";
import BorderGlow from "@/components/border-glow";
import FlipCard from "@/components/flip-card";
import { CAMPAIGNS, OTHER_CAMPAIGN } from "@/lib/campaigns";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  FileText,
  Lock,
  RefreshCw,
  Scale,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];
const spring = { type: "spring" as const, stiffness: 300, damping: 20 };

const TINTS: Record<string, string> = {
  "camp-lejeune": "#55B3F3",
  afff: "#F0633C",
  roundup: "#7FBF5E",
  "ozempic-glp1": "#5CC8A0",
  "nec-formula": "#F2A8BC",
  "depo-provera": "#F26D8D",
  pfas: "#9B8CE8",
  suboxone: "#C8D0E0",
  "bard-powerport": "#E87D7D",
  "hair-relaxer": "#C890E8",
  oxbryta: "#D46A6A",
  "hernia-mesh": "#E8B87D",
  zantac: "#6BA8E8",
  dacthal: "#C8B86B",
  rideshare: "#F05555",
  risperdal: "#8FA8D4",
  "olympus-scope": "#6BB8C8",
  "social-media-addiction": "#8B9CF0",
  "sports-betting": "#F0A85C",
  "video-game-addiction": "#B07DE8",
  roblox: "#E86B6B",
  "benzene-exposure": "#F0C84F",
  "talcum-powder": "#F07DA8",
  tepezza: "#5CB8D4",
  taxotere: "#D48FB8",
  silicosis: "#C8A86B",
  paraquat: "#9FB86B",
  paragard: "#D08F5C",
  wildfire: "#F07D3C",
  "ivc-filter": "#7D9BE8",
  mesothelioma: "#9AA8B8",
  "allergan-breast-implant": "#E88FA8",
  valsartan: "#6BC8B8",
  exactech: "#E0D8C8",
  "philips-cpap": "#7D8CE8",
  "motor-vehicle": "#F05555",
  "transvaginal-mesh": "#C88FD4",
  "premises-liability": "#8FA8C8",
  "ca-juvenile-detention-abuse": "#E8C35C",
  "ca-womens-prison-abuse": "#E8C35C",
  wtc: "#8FA8C8",
  other: "#A8B0C0",
};

const hexToHsl = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return `0 0 ${Math.round(l * 100)}`;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return `${Math.round(h * 60)} ${Math.round(s * 100)} ${Math.round(l * 100)}`;
};

const HOT = new Set(["depo-provera", "ozempic-glp1", "camp-lejeune", "suboxone"]);

const campaigns = [
  ...CAMPAIGNS.map((c) => ({
    label: c.name,
    slug: c.slug,
    description: c.blurb,
    hot: HOT.has(c.slug),
    emoji: c.icon,
    tint: TINTS[c.slug] ?? "#D8C9A3",
  })),
  {
    label: OTHER_CAMPAIGN,
    slug: "other",
    description: "Describe what happened",
    hot: false,
    emoji: "❓",
    tint: TINTS.other,
  },
];

const steps = [
  {
    icon: FileText,
    tint: "#6BA8E8",
    title: "Start with your details",
    copy: "Complete a short, secure form with the basic information about your experience.",
  },
  {
    icon: Scale,
    tint: "#E8C35C",
    title: "We screen against current criteria",
    copy: "Your submission is reviewed against the campaign's current qualification requirements.",
  },
  {
    icon: Users,
    tint: "#5CC8B8",
    title: "A law firm reviews the fit",
    copy: "If the information appears to match, it may be shared with a participating law firm.",
  },
  {
    icon: ArrowRight,
    tint: "#8FD08F",
    title: "You decide the next step",
    copy: "You are not obligated to move forward. A firm may request more information or explain your options.",
  },
];

const benefits = [
  {
    icon: Shield,
    tint: "#7FC87F",
    title: "No cost to check",
    copy: "There is no fee to find out whether your information may fit a current campaign.",
  },
  {
    icon: Lock,
    tint: "#E8B35C",
    title: "Confidential review",
    copy: "Your information is handled according to our Privacy Policy and is only shared with disclosed recipients.",
  },
  {
    icon: Clock,
    tint: "#8FA8E8",
    title: "Takes about 2 minutes",
    copy: "A short form is all it takes to start. You decide whether to continue after a firm explains your options.",
  },
];

const faqs = [
  {
    q: "Is The Torts Attorney a law firm?",
    a: "No. We provide legal marketing and case-acquisition services for plaintiff law firms. We are not a law firm and do not provide legal advice or legal representation.",
  },
  {
    q: "Does submitting the form mean I have hired a lawyer?",
    a: "No. Submitting information does not create an attorney-client relationship. A participating law firm decides whether it can review or accept a matter.",
  },
  {
    q: "What happens to the information I provide?",
    a: "Your information is handled according to our Privacy Policy and the disclosures presented with the form. It may be shared with participating law firms or other disclosed recipients for the purposes described.",
  },
  {
    q: "Will someone contact me?",
    a: "If your submission appears to fit the campaign criteria, you may be contacted using the methods described in the applicable disclosure and consent language.",
  },
  {
    q: "Does completing the form guarantee that I have a case?",
    a: "No. A form submission is not a legal determination. A participating law firm decides whether it can review or accept a matter.",
  },
  {
    q: "Are there deadlines to file a claim?",
    a: "Yes — every claim is subject to statutes of limitation that vary by state and case type, and missing a deadline can bar recovery entirely. That's why it's best to request a review as soon as possible.",
  },
];

export function LanderClient({ initialCampaign }: { initialCampaign: string }) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [formInView, setFormInView] = useState(true);
  const [campaign, setCampaign] = useState(initialCampaign);
  const [cardH, setCardH] = useState(240);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 479px)");
    const apply = () => setCardH(mq.matches ? 264 : 240);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = document.getElementById("victim-form");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => setScrolledPast(y > 480));

  const fadeUp = {
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease },
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.09 } },
  };

  const item = {
    hidden: prefersReducedMotion
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 0, y: 28, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease } },
  };

  const pickCampaign = (label: string, slug: string) => {
    setCampaign(label);
    window.history.replaceState(null, "", `?campaign=${slug}`);
    document.getElementById("victim-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showStickyCta = scrolledPast && !formInView && !submitted;

  return (
    <div className="relative overflow-hidden bg-[#0A0A0A] text-ink">
      {/* ── HERO + FORM ─────────────────────────────────── */}
      <section className="relative flex items-center overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        {/* Light rays background */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <LightRays
            raysOrigin="top-center"
            raysColor="#F0E8D4"
            raysSpeed={prefersReducedMotion ? 0 : 0.9}
            lightSpread={0.9}
            rayLength={1.8}
            fadeDistance={1.2}
            saturation={0}
            followMouse={!prefersReducedMotion}
            mouseInfluence={0.08}
            noiseAmount={0.05}
            distortion={0.03}
            className="absolute inset-0"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, transparent 40%, rgba(10,10,10,0.72) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="max-w-2xl">
              <motion.div {...fadeUp} className="relative mb-6" aria-hidden>
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 55% 50% at 50% 48%, rgba(217,169,79,0.18), transparent 70%)",
                  }}
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: [0.65, 1, 0.65], scale: [0.95, 1.04, 0.95] }
                  }
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  src="/models/lady-justice-gold.png"
                  alt=""
                  animate={prefersReducedMotion ? undefined : { y: [0, -12, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mx-auto h-60 w-auto object-contain mix-blend-lighten sm:h-80 lg:h-[22rem]"
                  style={{
                    maskImage:
                      "radial-gradient(ellipse 62% 64% at 50% 50%, black 58%, transparent 84%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 62% 64% at 50% 50%, black 58%, transparent 84%)",
                  }}
                />
              </motion.div>
              <motion.span
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.05 }}
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-accent md:text-base"
              >
                <span className="h-px w-8 bg-accent/60" aria-hidden />
                Always free. Fully private. Your call.
              </motion.span>
              <motion.h1
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.05 }}
                className="mb-6 font-display text-4xl leading-[1.05] tracking-[-0.02em] text-gradient md:text-5xl lg:text-6xl"
              >
                Find Out If Your Situation May Fit an{" "}
                <span className="italic text-accent">Ongoing Case Review.</span>
              </motion.h1>
              <motion.p
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="mb-8 text-lg leading-[1.7] text-ink/65 md:text-xl"
              >
                Were you or someone you love affected by a drug, product, or event that&rsquo;s now
                part of a major lawsuit? A quick, private review can show whether your details may
                qualify.
              </motion.p>
              <motion.div
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.15 }}
                className="mb-8 flex flex-wrap gap-3"
              >
                {[
                  { icon: Check, text: "No upfront cost" },
                  { icon: Lock, text: "Confidential" },
                  { icon: Clock, text: "Takes about 2 minutes" },
                ].map(({ icon: Icon, text }, i) => (
                  <motion.span
                    key={text}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 + i * 0.08, duration: 0.4, ease }}
                    className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm text-ink/75"
                  >
                    <Icon className="h-4 w-4 text-accent" />
                    {text}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              className="w-full"
            >
              <IntakeForm
                id="victim-form"
                campaign={campaign}
                onCampaignChange={setCampaign}
                onSubmitted={() => setSubmitted(true)}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CAMPAIGN CARDS ──────────────────────────────── */}
      <section id="campaigns" className="relative scroll-mt-20 border-t border-white/10 bg-[#0D0D0D] py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <motion.span
            {...fadeUp}
            className="mb-4 block text-center text-sm font-semibold uppercase tracking-[0.15em] text-accent"
          >
            Active Reviews
          </motion.span>
          <motion.h2
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="mb-4 text-center font-display text-3xl text-gradient md:text-4xl"
          >
            Mass Tort &amp; Class Action Cases
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="mx-auto mb-12 max-w-2xl text-center text-ink/65"
          >
            Select a topic to start your review. If your situation matches the current criteria, your
            information may be shared with a participating law firm for follow-up.
          </motion.p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {campaigns.map((c, index) => {
              const selected = campaign === c.label;
              const tint = c.tint;
              const stop = (e: React.SyntheticEvent) => e.stopPropagation();
              const select = (e: React.SyntheticEvent) => {
                e.stopPropagation();
                pickCampaign(c.label, c.slug);
              };
              return (
                <motion.div key={c.label} variants={item} className="h-full">
                  <FlipCard
                    axis="y"
                    flipOnClick
                    draggable={false}
                    tilt
                    tiltMax={8}
                    glare
                    glareOpacity={0.12}
                    hoverScale={1.02}
                    perspective={1100}
                    width={480}
                    height={cardH}
                    radius={16}
                    background="#161616"
                    color="#fafafa"
                    shadow
                    shadowOpacity={0.4}
                    ariaLabel={`${c.label} — flip for case details`}
                    front={
                      <div
                        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-300"
                        style={{
                          borderColor: selected ? `${tint}99` : "rgba(255,255,255,0.1)",
                          boxShadow: selected
                            ? `0 0 0 3px ${tint}26, inset 0 1px 0 rgba(255,255,255,0.08)`
                            : "inset 0 1px 0 rgba(255,255,255,0.06)",
                          background: `radial-gradient(circle at 88% -12%, ${tint}2E, transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.045), transparent 45%)`,
                        }}
                      >
                        {c.hot && !selected && (
                          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-xs font-bold uppercase tracking-wide text-accent">
                            <TrendingUp className="h-3 w-3" />
                            Hot
                          </span>
                        )}
                        <div className="relative mb-4 inline-flex">
                          {!prefersReducedMotion && !selected && (
                            <motion.span
                              aria-hidden="true"
                              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: index * 0.4 }}
                              className="pointer-events-none absolute inset-0 rounded-xl"
                              style={{ background: `${tint}40` }}
                            />
                          )}
                          <span
                            className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110"
                            style={{
                              background: selected ? "#ffffff" : `${tint}24`,
                              boxShadow: selected
                                ? "0 0 22px rgba(255,255,255,0.25)"
                                : `0 0 22px ${tint}40`,
                            }}
                          >
                            <span className="text-2xl leading-none">{c.emoji}</span>
                          </span>
                          {selected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={spring}
                              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-black ring-2 ring-[#161616]"
                            >
                              <Check className="h-3 w-3" />
                            </motion.span>
                          )}
                        </div>
                        <h3 className="mb-1 pr-14 font-display text-[19px] font-normal leading-snug text-ink">
                          {c.label}
                        </h3>
                        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-ink/60">
                          {c.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between gap-2 border-t border-white/10 pt-3.5">
                          <span className="inline-flex items-center gap-1.5 text-xs text-ink/40">
                            <RefreshCw className="h-3 w-3" />
                            Flip for details
                          </span>
                          <button
                            type="button"
                            onPointerDown={stop}
                            onClick={select}
                            className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-300 group-hover:gap-2.5"
                            style={{
                              color: selected ? "#0a0a0a" : tint,
                              borderColor: `${tint}66`,
                              background: selected ? "#ffffff" : `${tint}14`,
                            }}
                          >
                            {selected ? "Selected" : "See if this may fit"}
                            {selected ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <ArrowRight className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    }
                    back={
                      <div
                        className="relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 text-left"
                        style={{
                          borderColor: `${tint}66`,
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                          background: `radial-gradient(circle at 12% -12%, ${tint}2E, transparent 55%), linear-gradient(160deg, rgba(255,255,255,0.05), transparent 60%)`,
                        }}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: tint, boxShadow: `0 0 8px ${tint}` }}
                          />
                          <span
                            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                            style={{ color: tint }}
                          >
                            About this case
                          </span>
                        </div>
                        <h3 className="mb-2 font-display text-[19px] font-normal leading-snug text-ink">
                          {c.label}
                        </h3>
                        <p className="line-clamp-4 text-[13px] leading-relaxed text-ink/65">
                          {c.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-3.5">
                          <span className="text-xs text-ink/45">
                            {c.hot ? "High-activity campaign" : "Active litigation review"}
                          </span>
                          <button
                            type="button"
                            onPointerDown={stop}
                            onClick={select}
                            className="shrink-0 rounded-full px-4 py-2 text-xs font-bold text-black transition-transform hover:scale-105"
                            style={{ background: tint, boxShadow: `0 0 18px ${tint}55` }}
                          >
                            {selected ? "Selected" : "Select this case"}
                          </button>
                        </div>
                      </div>
                    }
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20 border-t border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <motion.span
            {...fadeUp}
            className="mb-4 block text-center text-sm font-semibold uppercase tracking-[0.15em] text-accent"
          >
            The Process
          </motion.span>
          <motion.h2
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.05 }}
            className="mb-14 text-center font-display text-3xl text-gradient md:text-4xl"
          >
            How a Review Works
          </motion.h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div key={s.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }} className="h-full">
                <BorderGlow
                  edgeSensitivity={30}
                  glowColor={hexToHsl(s.tint)}
                  backgroundColor="#161616"
                  borderRadius={16}
                  glowRadius={24}
                  glowIntensity={0.7}
                  coneSpread={25}
                  fillOpacity={0.18}
                  colors={[s.tint, s.tint, s.tint]}
                  className="h-full"
                >
                  <div className="relative h-full p-6">
                    <span className="absolute -top-3 right-5 rounded-full bg-white px-2.5 py-0.5 font-display text-xs font-bold text-black">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ background: `${s.tint}1F`, color: s.tint }}
                    >
                      <s.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mb-2 font-semibold text-ink">{s.title}</h3>
                    <p className="text-sm leading-relaxed text-ink/65">{s.copy}</p>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0D0D0D] py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="h-full"
              >
                <BorderGlow
                  edgeSensitivity={30}
                  glowColor={hexToHsl(b.tint)}
                  backgroundColor="#161616"
                  borderRadius={16}
                  glowRadius={24}
                  glowIntensity={0.7}
                  coneSpread={25}
                  fillOpacity={0.18}
                  colors={[b.tint, b.tint, b.tint]}
                  className="h-full"
                >
                  <div className="flex h-full items-start gap-4 p-6">
                    <span
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${b.tint}1F`, color: b.tint }}
                    >
                      <b.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="mb-1 font-semibold text-ink">{b.title}</h3>
                      <p className="text-sm leading-relaxed text-ink/65">{b.copy}</p>
                    </div>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 border-t border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-5 sm:px-6">
          <motion.h2
            {...fadeUp}
            className="mb-10 text-center font-display text-3xl text-gradient md:text-4xl"
          >
            Common Questions
          </motion.h2>
          <div className="space-y-3">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <motion.div
                  key={f.q}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                  className={`overflow-hidden rounded-xl border bg-[#161616] transition-colors duration-300 ${
                    open ? "border-white/30" : "border-white/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-ink"
                  >
                    {f.q}
                    <ChevronDown
                      className={`ml-4 h-4 w-4 shrink-0 text-accent transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease }}
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-ink/70">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────── */}
      <section className="border-t border-white/10 bg-ink py-16 text-center md:py-20">
        <div className="mx-auto max-w-2xl px-5">
          <motion.h2
            {...fadeUp}
            className="font-display text-3xl font-bold text-paper md:text-4xl"
          >
            Start with a free, confidential review.
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="mt-4 text-paper/60"
          >
            If your situation appears to match a current campaign, the next steps will be explained
            clearly. There is no cost and no obligation.
          </motion.p>
          <motion.button
            type="button"
            onClick={() =>
              document.getElementById("victim-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            transition={spring}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0A0A0A] px-8 py-4 font-semibold text-white"
          >
            Check My Eligibility
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ───────────────────────────── */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            key="sticky-cta"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="fixed inset-x-0 bottom-0 z-40 block lg:hidden"
          >
            <div className="flex items-center justify-between gap-3 border-t border-white/15 bg-[#0A0A0A]/95 px-5 pb-[max(env(safe-area-inset-bottom),0.875rem)] pt-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Free case review</p>
                <p className="text-xs text-white/55">Confidential · ~2 minutes</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  document.getElementById("victim-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black"
              >
                Start Review
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
