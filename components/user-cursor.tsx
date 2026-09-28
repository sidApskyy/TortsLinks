"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

export default function UserCursor() {
  const reduce = useReducedMotion();
  const fine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 900, damping: 28, mass: 0.08 });
  const springY = useSpring(y, { stiffness: 900, damping: 28, mass: 0.08 });

  // read the first-name field live; only show the tag once it has a value
  useEffect(() => {
    const input = document.getElementById("firstName") as HTMLInputElement | null;
    if (!input) return;
    const update = () => setLabel((input.value || "").trim());
    update();
    input.addEventListener("input", update);
    return () => input.removeEventListener("input", update);
  }, []);

  // follow the mouse anywhere on the page
  useEffect(() => {
    if (!fine) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [fine, x, y]);

  if (!fine || !visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform"
      style={{ x: reduce ? x : springX, y: reduce ? y : springY }}
    >
      {/* pointer */}
      <svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
        className="relative -mt-1 -ml-1"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
      >
        <path
          d="M3.5 2.5L3.5 20L8 15.5L11.5 22L15 20.5L11.5 14L17.5 13.5L3.5 2.5Z"
          fill="#121210"
          stroke="#d8c9a3"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      {/* name tag — only appears once the victim has started typing */}
      {label ? (
        <div className="absolute left-5 top-4 whitespace-nowrap rounded-full border border-accent/40 bg-[#121210]/90 px-2.5 py-1 text-[11px] font-semibold text-accent shadow-lg backdrop-blur-sm">
          {label}
        </div>
      ) : null}
    </motion.div>
  );
}
