"use client";

import type React from "react";
import { MoveRight } from "lucide-react";

interface ArrowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  textColor?: string;
  buttonOverlayColor?: string;
  borderColor?: string;
  iconColor?: string;
  className?: string;
}

export default function ArrowButton({
  text = "Open",
  textColor = "#0a0a0a",
  buttonOverlayColor = "#141210",
  borderColor = "#d8c9a3",
  iconColor = "#e8dfc9",
  className,
  ...props
}: ArrowButtonProps) {
  return (
    <button
      type="button"
      style={{ borderColor }}
      {...props}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 bg-gradient-to-b from-[#e8dfc9] to-[#d8c9a3] px-6 py-3.5 font-medium shadow-[0_8px_30px_rgba(216,201,163,0.25)] transition-shadow duration-300 ease-out hover:shadow-[0_8px_40px_rgba(216,201,163,0.4)] disabled:cursor-not-allowed disabled:opacity-60 ${className ?? ""}`}
    >
      <span
        style={{ background: buttonOverlayColor }}
        className="absolute inset-0 flex h-full w-full -translate-x-full items-center justify-center duration-300 ease-out group-hover:translate-x-0 group-active:translate-x-0"
      >
        <MoveRight style={{ color: iconColor }} />
      </span>
      <span
        style={{ color: textColor }}
        className="absolute flex h-full w-full transform items-center justify-center font-bold tracking-wide transition-transform duration-300 ease-in-out group-hover:translate-x-full group-active:translate-x-full"
      >
        {text}
      </span>
      <span className="invisible relative">Button</span>
    </button>
  );
}
