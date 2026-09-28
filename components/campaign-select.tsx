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
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const visible = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  const selectIndex = (i: number) => {
    const opt = visible[i];
    if (!opt) return;
    onChange(opt);
    setOpen(false);
    setQuery("");
    triggerRef.current?.focus();
  };

  const scrollTo = (i: number) => {
    const item = listRef.current?.querySelector(`[data-index="${i}"]`) as HTMLElement | null;
    item?.scrollIntoView({ block: "nearest" });
  };

  const moveHighlight = (next: number) => {
    const clamped = Math.max(0, Math.min(visible.length - 1, next));
    setHighlight(clamped);
    scrollTo(clamped);
  };

  useEffect(() => {
    if (open) {
      setQuery("");
      inputRef.current?.focus();
    } else {
      setHighlight(-1);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selectedIndex = visible.findIndex((o) => o === value);
    setHighlight(selectedIndex >= 0 ? selectedIndex : visible.length > 0 ? 0 : -1);
  }, [query, open, value, visible.length]); // keep highlight sane while filtering

  // click outside to close
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveHighlight(highlight + 1);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveHighlight(highlight - 1);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      moveHighlight(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      moveHighlight(visible.length - 1);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      selectIndex(highlight);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setQuery("");
      triggerRef.current?.focus();
      return;
    }
    if (e.key === "Tab" && !e.shiftKey) {
      // allow natural tab, but close list so focus leaves cleanly
      setOpen(false);
    }
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
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="campaign-listbox"
        className="field flex items-center justify-between text-left"
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
        <div
          id="campaign-listbox"
          role="listbox"
          aria-label="Campaigns"
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-white/15 bg-[#121212] shadow-2xl"
        >
          <div className="border-b border-white/10 p-2">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search campaigns…"
              aria-autocomplete="list"
              aria-controls="campaign-options"
              aria-activedescendant={
                highlight >= 0 && visible[highlight]
                  ? `campaign-opt-${visible[highlight].replace(/\s+/g, "-")}`
                  : undefined
              }
              className="w-full rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-[#d8c9a3]/60 focus:ring-1 focus:ring-[#d8c9a3]/20"
            />
          </div>
          <ul
            ref={listRef}
            id="campaign-options"
            className="max-h-60 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visible.length === 0 ? (
              <li className="px-4 py-3 text-sm text-neutral-500">No campaigns found</li>
            ) : (
              visible.map((opt, i) => {
                const selected = opt === value;
                return (
                  <li
                    key={opt}
                    id={`campaign-opt-${opt.replace(/\s+/g, "-")}`}
                    data-index={i}
                    role="option"
                    aria-selected={selected}
                    onClick={() => selectIndex(i)}
                    className={`px-4 py-2 text-sm outline-none transition-colors ${
                      selected
                        ? "bg-accent/20 text-accent"
                        : i === highlight
                          ? "bg-white/10 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {opt}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
