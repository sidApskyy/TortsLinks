"use client";

import { useEffect, useState } from "react";

export default function UserCursor({
  targetRef,
  name,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  name?: string;
}) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [fine, setFine] = useState(false);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !fine) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);

    target.addEventListener("mouseenter", enter);
    target.addEventListener("mouseleave", leave);
    target.addEventListener("mousemove", move);

    return () => {
      target.removeEventListener("mouseenter", enter);
      target.removeEventListener("mouseleave", leave);
      target.removeEventListener("mousemove", move);
    };
  }, [targetRef, fine]);

  if (!fine || !visible) return null;

  const label = (name || "").trim() || "Your name";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[100]"
      style={{
        left: pos.x,
        top: pos.y,
        transition: reduce ? undefined : "left 60ms linear, top 60ms linear",
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
      {/* name tag */}
      <div
        className="absolute left-5 top-4 whitespace-nowrap rounded-full border border-accent/40 bg-[#121210]/90 px-2.5 py-1 text-[11px] font-semibold text-accent shadow-lg backdrop-blur-sm"
      >
        {label}
      </div>
    </div>
  );
}
