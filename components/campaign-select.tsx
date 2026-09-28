"use client";

import { useEffect, useRef, useState } from "react";

interface CampaignSelectProps {
  id?: string;
  name: string;
  value: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

export function CampaignSelect({
  id,
  name,
  value,
  options,
  placeholder = "Select a campaign…",
  required,
  onChange,
}: CampaignSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const all = [placeholder, ...options];
  const currentIndex = Math.max(0, options.findIndex((o) => o === value) + 1);

  useEffect(() => {
    if (open) setHighlight(currentIndex);
  }, [open, currentIndex]);

  // click outside to close
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const selectIndex = (i: number) => {
    if (i === 0) return;
    onChange(options[i - 1]);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const scrollTo = (i: number) => {
    const item = listRef.current?.querySelector(`[data-index="${i}"]`) as HTMLElement | null;
    item?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    let next = highlight;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        next = Math.min(all.length - 1, highlight + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        next = Math.max(0, highlight - 1);
        break;
      case "Home":
        e.preventDefault();
        next = 0;
        break;
      case "End":
        e.preventDefault();
        next = all.length - 1;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectIndex(highlight);
        return;
      case "Escape":
      case "Tab":
        setOpen(false);
        return;
      default:
        return;
    }
    setHighlight(next);
    scrollTo(next);
  };

  return (
    <div ref={containerRef} id={id} className="relative">
      {/* Hidden native select for form submission, validation, and TrustedForm */}
      <select
        name={name}
        value={value}
        required={required}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        data-tf-element-role="offer"
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      {/* Custom trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((s) => !s)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="campaign-listbox"
        aria-activedescendant={open && highlight > 0 ? `campaign-opt-${highlight}` : undefined}
        className="field flex cursor-none items-center justify-between text-left"
      >
        <span className={value ? "text-[#0a0a0a]" : "text-neutral-500"}>
          {value || placeholder}
        </span>
        <svg
          className={`h-4 w-4 text-[#0a0a0a]/60 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Custom dropdown */}
      {open && (
        <ul
          id="campaign-listbox"
          ref={listRef}
          role="listbox"
          aria-label="Campaigns"
          className="absolute z-50 mt-1 max-h-60 w-full cursor-none overflow-auto rounded-lg border border-white/15 bg-[#121212] py-1 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {all.map((opt, i) => {
            const disabled = i === 0;
            const selected = i > 0 && options[i - 1] === value;
            return (
              <li
                key={opt + i}
                id={`campaign-opt-${i}`}
                data-index={i}
                role="option"
                aria-selected={selected}
                aria-disabled={disabled}
                onClick={() => selectIndex(i)}
                className={`cursor-none px-4 py-2 text-sm outline-none transition-colors ${
                  disabled
                    ? "pointer-events-none text-neutral-500"
                    : selected
                      ? "bg-accent/20 text-accent"
                      : i === highlight
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {opt}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
