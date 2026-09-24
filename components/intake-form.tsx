"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CAMPAIGNS, OTHER_CAMPAIGN } from "@/lib/campaigns";
import { submitLead, type FormState } from "@/lib/actions";
import { createIntakeDocImage } from "@/lib/paper-doc";
import { playCrumpleSound } from "@/lib/crumple-sound";
import { Turnstile } from "./turnstile";
import { TrustedFormScript } from "./trusted-form";
import PaperCrumple from "./paper-crumple";

const initial: FormState = { ok: false };

const thanksPanel = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.09,
      delayChildren: 0.2,
    },
  },
};
const thanksItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 210, damping: 22 },
  },
};
const thanksCheck = {
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 15 },
  },
};
const ballVariants = {
  full: {
    opacity: 1,
    scale: 1,
    y: "0%",
    rotate: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  parked: {
    opacity: 1,
    scale: 0.45,
    y: "32%",
    rotate: -4,
    transition: { type: "spring" as const, stiffness: 170, damping: 19 },
  },
  exit: {
    opacity: 0,
    scale: 0.35,
    y: "135%",
    rotate: -14,
    transition: { duration: 0.7, ease: [0.55, 0, 1, 0.45] as const },
  },
};

export function IntakeForm({
  id,
  campaign,
  onCampaignChange,
  onSubmitted,
}: {
  id?: string;
  campaign: string;
  onCampaignChange?: (value: string) => void;
  onSubmitted?: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitLead, initial);
  const [mountedAt, setMountedAt] = useState(0);
  const [localCampaign, setLocalCampaign] = useState(campaign);
  const formRef = useRef<HTMLFormElement>(null);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"form" | "crumple" | "done">("form");
  const [docSrc, setDocSrc] = useState("");
  const [crumpled, setCrumpled] = useState(false);
  const [midReveal, setMidReveal] = useState(false);
  const [paperGone, setPaperGone] = useState(false);
  const [submitted, setSubmitted] = useState({ name: "", campaign: "" });

  const selected = onCampaignChange ? campaign : localCampaign;

  useEffect(() => {
    setMountedAt(Date.now());
  }, []);

  useEffect(() => {
    if (!state.error) return;
    window.turnstile?.reset();
    setPhase("form");
    setCrumpled(false);
    setMidReveal(false);
    setPaperGone(false);
    setDocSrc("");
  }, [state]);

  useEffect(() => {
    if (state.ok && (crumpled || !docSrc)) setPhase("done");
  }, [state.ok, crumpled, docSrc]);

  useEffect(() => {
    if (phase !== "crumple") return;
    const t = window.setTimeout(() => setMidReveal(true), 650);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (state.ok) onSubmitted?.();
  }, [state.ok, onSubmitted]);

  // Fires only after native validation passes — covers the submit button
  // and Enter-key submission alike. The action itself runs right after.
  const handleFormSubmit = () => {
    const form = formRef.current;
    if (!form) return;
    const zipEl = form.elements.namedItem("zip");
    if (zipEl instanceof HTMLInputElement) zipEl.value = zipEl.value.trim();
    const fd = new FormData(form);
    const doc = {
      firstName: String(fd.get("firstName") ?? ""),
      lastName: String(fd.get("lastName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      zip: String(fd.get("zip") ?? ""),
      campaign: String(fd.get("campaign") ?? ""),
      description: String(fd.get("description") ?? ""),
    };
    setSubmitted({ name: `${doc.firstName} ${doc.lastName}`.trim(), campaign: doc.campaign });
    if (!reduce) {
      try {
        const src = createIntakeDocImage(doc);
        if (src) {
          setDocSrc(src);
          setCrumpled(false);
          setMidReveal(false);
          setPaperGone(false);
          setPhase("crumple");
          playCrumpleSound(1900);
        }
      } catch {
        /* WebGL/canvas unavailable — fall through to the normal flow */
      }
    }
  };

  const thanksVisible = phase === "done" || midReveal;

  return (
    <div id={id} className="relative scroll-mt-24">
      <div
        inert={phase !== "form"}
        aria-hidden={phase !== "form"}
        className={phase !== "form" ? "pointer-events-none opacity-0" : ""}
      >
        <form
          ref={formRef}
          action={formAction}
          onSubmit={handleFormSubmit}
          className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-2xl shadow-black/50 sm:p-10"
        >
      <TrustedFormScript />
      <input type="hidden" name="ts" value={mountedAt} />
      <div className="honeypot" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <h2 className="font-display text-2xl text-gradient sm:text-3xl">
        Check Whether You May Qualify
      </h2>
      <p className="mt-2 text-sm text-ink/70">
        {selected ? (
          <>
            You are reviewing: <strong className="text-white">{selected}</strong>.{" "}
          </>
        ) : null}
        Complete the form — a case specialist may follow up if your information appears to fit.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-ink/60">
        <span className="rounded-full bg-accent/10 px-3 py-1">Secure &amp; confidential</span>
        <span className="rounded-full bg-accent/10 px-3 py-1">About 2 minutes</span>
        <span className="rounded-full bg-accent/10 px-3 py-1">No obligation</span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="mb-1.5 block text-sm font-semibold">
            First name
          </label>
          <input id="firstName" name="firstName" required autoComplete="given-name" className="field" />
        </div>
        <div>
          <label htmlFor="lastName" className="mb-1.5 block text-sm font-semibold">
            Last name
          </label>
          <input id="lastName" name="lastName" required autoComplete="family-name" className="field" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold">
            Phone number
          </label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" className="field" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">
            Email address
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <div>
          <label htmlFor="zip" className="mb-1.5 block text-sm font-semibold">
            ZIP code
          </label>
          <input
            id="zip"
            name="zip"
            required
            autoComplete="postal-code"
            inputMode="numeric"
            pattern="\d{5}(-\d{4})?"
            maxLength={10}
            placeholder="e.g. 90210"
            title="Enter a 5-digit ZIP code"
            onInput={(e) => {
              const el = e.currentTarget;
              el.value = el.value.replace(/[^\d-]/g, "").replace(/-{2,}/g, "-").slice(0, 10);
            }}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="campaign" className="mb-1.5 block text-sm font-semibold">
            Campaign or topic
          </label>
          <select
            id="campaign"
            name="campaign"
            required
            value={selected}
            onChange={(e) =>
              onCampaignChange ? onCampaignChange(e.target.value) : setLocalCampaign(e.target.value)
            }
            className="field"
            data-tf-element-role="offer"
          >
            <option value="" disabled>
              Select a campaign…
            </option>
            {CAMPAIGNS.map((c) => (
              <option key={c.slug} value={c.name}>
                {c.name}
              </option>
            ))}
            <option value={OTHER_CAMPAIGN}>{OTHER_CAMPAIGN}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1.5 block text-sm font-semibold">
            What happened <span className="font-normal text-ink/50">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="field resize-y"
            placeholder="Briefly describe what happened, your injuries, and when it occurred…"
          />
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          data-tf-element-role="consent-opt-in"
          className="mt-0.5 h-5 w-5 shrink-0 accent-accent"
        />
        <label htmlFor="consent" className="text-[13px] leading-relaxed text-ink/70">
          <span data-tf-element-role="consent-language">
            By checking the box, you agree to be contacted about your potential case or promotional
            legal offers sent by or on behalf of{" "}
            <strong className="font-semibold text-accent">Torts Links</strong> and/or
            participating law firms. You may receive live calls, automated calls, emails or text
            messages even if you are on a national or state &ldquo;Do Not Call&rdquo; list. This
            includes contact even if you are on a Do Not Call registry. Consent is not a condition
            of any purchase. Contact may include automated dialing or prerecorded messages.
          </span>
        </label>
      </div>

      <div className="mt-6">
        <Turnstile />
      </div>

      {state.error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      )}

      <div className="mt-6 w-full">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-gradient-to-b from-[#e8dfc9] to-[#d8c9a3] px-6 py-4 text-[15px] font-bold tracking-wide text-black shadow-[0_8px_30px_rgba(216,201,163,0.25)] transition-all duration-200 hover:shadow-[0_8px_40px_rgba(216,201,163,0.4)] hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Submitting…" : "See If This May Fit →"}
        </button>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink/50">
        Your information is handled according to our Privacy Policy and the disclosures presented
        with this form.
      </p>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/45">
        Attorney advertising. The Torts Attorney provides legal marketing and case-acquisition
        services and is not a law firm. Submitting this form does not create an attorney-client
        relationship and does not guarantee review, acceptance, or any outcome. Prior results do not
        guarantee similar outcomes.
      </p>
        </form>
      </div>

      {phase !== "form" && (
        <div className="absolute inset-0 overflow-hidden">
          <p className="sr-only" role="status">
            {state.ok
              ? "Your case review request has been submitted."
              : "Submitting your request."}
          </p>

          {/* Thank-you panel revealed behind the crumpling paper */}
          <motion.div
            variants={thanksPanel}
            initial="hidden"
            animate={thanksVisible ? "show" : "hidden"}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-[#121212] px-6 text-center shadow-2xl shadow-black/50 sm:px-12"
          >
            <motion.div variants={thanksCheck} className="relative mb-5">
              <div className="absolute -inset-5 rounded-full bg-accent/15 blur-xl" aria-hidden="true" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-white/10">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
            <motion.h2 variants={thanksItem} className="font-display text-2xl text-gradient sm:text-3xl">
              Request received{submitted.name ? `, ${submitted.name.split(" ")[0]}` : ""}
            </motion.h2>
            <motion.p variants={thanksItem} className="mt-3 max-w-md text-ink/70">
              Thank you. Your free case review
              {submitted.campaign ? (
                <>
                  {" "}
                  regarding <strong className="text-white">{submitted.campaign}</strong>
                </>
              ) : null}{" "}
              has been submitted. If your information appears to fit the current criteria, a case
              specialist may follow up by phone, text, or email.
            </motion.p>
            <motion.p variants={thanksItem} className="mt-6 text-[11px] leading-relaxed text-ink/45">
              Attorney advertising. Submitting this form does not create an attorney-client
              relationship.
            </motion.p>
          </motion.div>

          {/* The paper sheet — crumples, parks at the bottom, then drops away */}
          {docSrc && !paperGone && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              variants={ballVariants}
              animate={phase === "done" ? "exit" : crumpled ? "parked" : "full"}
              onAnimationComplete={() => {
                if (phase === "done") setPaperGone(true);
              }}
            >
              <PaperCrumple
                src={docSrc}
                alt="Your submitted case review request"
                width={360}
                height={470}
                imageFit="cover"
                releaseBehavior="stay"
                crumpleAmount={0.95}
                crumpleDuration={0.7}
                wrinkleDepth={1.2}
                foldCount={11}
                foldSharpness={0.7}
                paperColor="#f5f1e8"
                paperTexture={0.18}
                roughness={0.95}
                lightIntensity={2.2}
                lightAngle={-25}
                rotation={-2}
                shadow
                shadowOpacity={0.5}
                draggable={false}
                disabled
                autoCrumple
                seed={11}
                detail={80}
                onStateChange={(s) => {
                  if (s === "crumpled") setCrumpled(true);
                }}
                onError={() => {
                  setPaperGone(true);
                  setDocSrc("");
                }}
                style={{ height: "100%" }}
              />
            </motion.div>
          )}

          {phase === "crumple" && crumpled && !state.ok && (
            <p className="absolute inset-x-0 bottom-6 text-center text-xs uppercase tracking-widest text-ink/50">
              Submitting securely…
            </p>
          )}
        </div>
      )}
    </div>
  );
}
