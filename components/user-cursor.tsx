"use client";

import { useEffect, useRef, useState } from "react";

export default function UserCursor() {
  const fine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");
  const cursorRef = useRef<HTMLDivElement>(null);

  // read the first-name field live; only show the tag once it has a value
  useEffect(() => {
    const input = document.getElementById("firstName") as HTMLInputElement | null;
    if (!input) return;
    const update = () => setLabel((input.value || "").trim());
    update();
    input.addEventListener("input", update);
    return () => input.removeEventListener("input", update);
  }, []);

  // follow the mouse directly — no React state, no spring interpolation,
  // just a DOM style update inside requestAnimationFrame. This removes the
  // per-frame React/Framer Motion overhead that causes the glitchy feel.
  useEffect(() => {
    if (!fine) return;
    const el = cursorRef.current;
    if (!el) return;

    let ticking = false;
    let pendingX = 0;
    let pendingY = 0;

    const move = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      setVisible(true);
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        el.style.transform = `translate3d(${pendingX}px, ${pendingY}px, 0)`;
        ticking = false;
      });
    };

    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s ease",
        transform: "translate3d(-100px, -100px, 0)",
      }}
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
    </div>
  );
}
