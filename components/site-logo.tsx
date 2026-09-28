"use client";

export function SiteLogo({
  className,
  sheen,
}: {
  className?: string;
  sheen?: boolean;
}) {
  return (
    <a
      href="/"
      className={`group ${className ?? ""}`}
      aria-label="TortLinks home"
    >
      <span
        className={`font-display text-2xl font-bold tracking-tight ${
          sheen ? "footer-sheen" : ""
        }`}
      >
        <span className={sheen ? "" : "text-white transition-colors group-hover:text-accent"}>
          Tort
        </span>
        <span className="text-accent">Links</span>
      </span>
    </a>
  );
}
