"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Step = "flat" | "foldBottom" | "foldTop" | "insert" | "seal" | "sealed" | "sent";

const NEXT: Partial<Record<Step, Step>> = {
  flat: "foldBottom",
  foldBottom: "foldTop",
  foldTop: "insert",
  insert: "seal",
  seal: "sealed",
};
const DWELL: Record<Step, number> = {
  flat: 300,
  foldBottom: 540,
  foldTop: 540,
  insert: 620,
  seal: 440,
  sealed: 0,
  sent: 0,
};

const LETTER_W = 300;
const LETTER_H = 386;
const SEG_H = LETTER_H / 3;
const ENV_W = 340;
const ENV_H = 220;
const RIG_W = 400;
const RIG_H = 720;
const LETTER_TOP = 10;
const ENV_TOP = 448;
// How far the letter travels down so the folded packet ends up inside the envelope pocket.
const INSERT_DY = ENV_TOP + ENV_H * 0.72 - (LETTER_TOP + SEG_H * 2);

const easeFold = [0.65, 0, 0.35, 1] as const;
const easeFly = [0.55, 0, 1, 0.45] as const;

// Exit: the letter rides inside the envelope — both must travel the same
// distance so the letter never appears to slide out mid-flight.
const EXIT_DY = -(ENV_TOP + ENV_H + 120);
const letterSentMotion = {
  y: INSERT_DY + EXIT_DY,
  x: 90,
  rotate: 10,
  opacity: 0,
  transition: { duration: 0.62, ease: easeFly },
};
const envSentMotion = {
  y: EXIT_DY,
  x: 90,
  rotate: 10,
  opacity: 0,
  transition: { duration: 0.62, ease: easeFly },
};

export function LetterSend({
  src,
  sent,
  onSealed,
  onSent,
}: {
  src: string;
  sent: boolean;
  onSealed?: () => void;
  onSent?: () => void;
}) {
  const [step, setStep] = useState<Step>("flat");
  const [scale, setScale] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);

  // Fit the fixed-size rig inside whatever stage the card gives us.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setScale(Math.min(1, el.clientWidth / (RIG_W + 16), el.clientHeight / (RIG_H + 16)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Timed sequence: flat → fold → fold → insert → seal → sealed.
  useEffect(() => {
    const next = NEXT[step];
    if (!next) return;
    const t = window.setTimeout(() => setStep(next), DWELL[step]);
    return () => window.clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step === "sealed") onSealed?.();
  }, [step, onSealed]);

  // Parent flips `sent` once the server confirms — envelope flies off.
  useEffect(() => {
    if (sent && step === "sealed") setStep("sent");
  }, [sent, step]);

  useEffect(() => {
    if (step !== "sent") return;
    const t = window.setTimeout(() => onSent?.(), 560);
    return () => window.clearTimeout(t);
  }, [step, onSent]);

  const folded = step === "insert" || step === "seal" || step === "sealed" || step === "sent";
  const isSent = step === "sent";

  const letterAnimate = isSent
    ? letterSentMotion
    : folded
      ? {
          y: INSERT_DY,
          x: 0,
          scale: 0.94,
          rotate: 0,
          opacity: 1,
          transition: { duration: 0.62, ease: easeFold },
        }
      : { y: 0, x: 0, scale: 1, rotate: -1.5, opacity: 1, transition: { duration: 0.35 } };

  const envAnimate = isSent
    ? envSentMotion
    : folded
      ? { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0, transition: { duration: 0.45, ease: easeFold } }
      : { opacity: 0, y: 60, x: 0, scale: 0.92, rotate: 0 };

  const flapOpen = step !== "seal" && step !== "sealed" && step !== "sent";

  return (
    <div ref={stageRef} className="absolute inset-0 flex items-center justify-center">
      <div
        className="relative shrink-0"
        style={{
          width: RIG_W,
          height: RIG_H,
          transform: `scale(${scale})`,
          perspective: 1100,
        }}
      >
        {/* ── Envelope back (below the letter) ── */}
        <motion.div
          className="absolute"
          style={{ left: (RIG_W - ENV_W) / 2, top: ENV_TOP, width: ENV_W, height: ENV_H, zIndex: 5 }}
          initial={false}
          animate={envAnimate}
        >
          <div
            className="absolute inset-0 rounded-2xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7)]"
            style={{ background: "linear-gradient(160deg,#d9cba8,#bfa87e)" }}
          />
          {/* inner throat — dark slit the letter disappears into */}
          <div
            className="absolute inset-x-3 top-3 rounded-t-xl"
            style={{
              height: ENV_H * 0.4,
              background: "linear-gradient(180deg,rgba(40,32,18,0.55),rgba(40,32,18,0))",
            }}
          />
        </motion.div>

        {/* ── Letter (doc image, tri-fold) ── */}
        <motion.div
          className="absolute"
          style={{
            left: (RIG_W - LETTER_W) / 2,
            top: LETTER_TOP,
            width: LETTER_W,
            height: LETTER_H,
            zIndex: 10,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 14, rotate: -1.5 }}
          animate={letterAnimate}
        >
          {[0, 1, 2].map((i) => {
            const rotates =
              i === 0
                ? step === "foldTop" || folded
                : i === 2
                  ? step === "foldBottom" || step === "foldTop" || folded
                  : false;
            return (
              <motion.div
                key={i}
                className="absolute inset-x-0"
                style={{
                  top: i * SEG_H,
                  height: SEG_H,
                  transformStyle: "preserve-3d",
                  transformOrigin: i === 0 ? "50% 100%" : "50% 0%",
                }}
                initial={false}
                animate={
                  i === 1
                    ? {}
                    : {
                        rotateX: rotates ? (i === 0 ? 180 : -180) : 0,
                      }
                }
                transition={{ duration: 0.5, ease: easeFold }}
              >
                {/* front face — doc slice */}
                <div
                  className="absolute inset-0 overflow-hidden bg-[#f5f1e8]"
                  style={{
                    backfaceVisibility: "hidden",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    draggable={false}
                    className="absolute left-0 w-full select-none"
                    style={{ height: LETTER_H, top: -i * SEG_H }}
                  />
                  {/* fold shadow cast onto the middle when covered */}
                  {i === 1 && (
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg,rgba(30,24,12,0.28),rgba(30,24,12,0.05) 55%,rgba(30,24,12,0.28))",
                      }}
                      initial={false}
                      animate={{
                        opacity: step === "foldTop" || folded ? 0.9 : folded || step === "foldBottom" ? 0.45 : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </div>
                {/* back face — plain paper seen after folding */}
                {i !== 1 && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateX(180deg)",
                      background:
                        i === 0
                          ? "linear-gradient(180deg,#e6ddc8,#f0e9d8)"
                          : "linear-gradient(0deg,#e6ddc8,#f0e9d8)",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Envelope front: pocket + flap + seal (above the letter) ── */}
        <motion.div
          className="absolute"
          style={{
            left: (RIG_W - ENV_W) / 2,
            top: ENV_TOP,
            width: ENV_W,
            height: ENV_H,
            zIndex: 15,
            transformStyle: "preserve-3d",
          }}
          initial={false}
          animate={envAnimate}
        >
          {/* pocket — V-cut front panel the letter slides behind */}
          <div
            className="absolute inset-x-0 bottom-0 rounded-b-2xl"
            style={{
              top: ENV_H * 0.24,
              clipPath: "polygon(0% 0%, 50% 58%, 100% 0%, 100% 100%, 0% 100%)",
              background: "linear-gradient(165deg,#efe6cf,#cdb992)",
              boxShadow: "0 -2px 10px rgba(60,48,24,0.25) inset",
            }}
          />
          {/* flap — triangle hinged on the top edge */}
          <motion.div
            className="absolute inset-x-0 top-0"
            style={{
              height: ENV_H * 0.55,
              clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
              background: "linear-gradient(180deg,#f2ead6,#d5c39d)",
              transformOrigin: "50% 0%",
              filter: "drop-shadow(0 4px 6px rgba(40,32,16,0.35))",
            }}
            initial={false}
            animate={{ rotateX: flapOpen ? -158 : 0 }}
            transition={{ duration: 0.42, ease: easeFold }}
          />
          {/* seal — gold dot pops once the flap closes */}
          <motion.div
            className="absolute rounded-full"
            style={{
              left: "50%",
              top: ENV_H * 0.52,
              width: 30,
              height: 30,
              marginLeft: -15,
              marginTop: -15,
              background: "radial-gradient(circle at 35% 30%, #f4e2ae, #b8924a)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.45), inset 0 0 0 2px rgba(120,90,40,0.35)",
            }}
            initial={false}
            animate={
              flapOpen
                ? { scale: 0, opacity: 0 }
                : { scale: 1, opacity: 1 }
            }
            transition={{ type: "spring", stiffness: 320, damping: 16, delay: flapOpen ? 0 : 0.3 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
