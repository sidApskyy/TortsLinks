"use client";

import { useEffect, useState } from "react";

export default function UserCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);
  const [fine, setFine] = useState(false);
  const [label, setLabel] = useState("Your name");
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // enable only on real pointer devices
  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  // read the first-name field live, if it exists
  useEffect(() => {
    const input = document.getElementById("firstName") as HTMLInputElement | null;
    if (!input) return;
    const update = () => setLabel((input.value || "").trim() || "Your name");
    update();
    input.addEventListener("input", update);
    return () => input.removeEventListener("input", update);
  }, []);

  // follow the mouse anywhere on the page
  useEffect(() => {
    if (!fine) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [fine]);

  if (!fine || !visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: reduce ? undefined : "transform 45ms linear",
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
      <div className="absolute left-5 top-4 whitespace-nowrap rounded-full border border-accent/40 bg-[#121210]/90 px-2.5 py-1 text-[11px] font-semibold text-accent shadow-lg backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}
