"use client";

export function SiteLogo({
  className,
  sheen,
}: {
  className?: string;
  sheen?: boolean;
}) {
  const mark = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      fill="none"
      className="shrink-0 text-accent"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 12h12M16 12v9M10 21l6-4 6 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <a
      href="/"
      className={`group flex items-center gap-2 ${className ?? ""}`}
      aria-label="TortsLinks home"
    >
      {mark}
      <span
        className={`font-display text-2xl font-bold tracking-tight ${
          sheen ? "footer-sheen" : ""
        }`}
      >
        <span className={sheen ? "" : "text-white transition-colors group-hover:text-accent"}>
          Torts
        </span>
        <span className="text-accent">Links</span>
      </span>
    </a>
  );
}
