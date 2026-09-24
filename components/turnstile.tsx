"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    turnstile?: { reset: () => void };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function Turnstile() {
  useEffect(() => {
    if (!SITE_KEY) return;
    if (document.querySelector('script[src*="turnstile/v0/api.js"]')) return;
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, []);

  if (!SITE_KEY) return null;
  return <div className="cf-turnstile" data-sitekey={SITE_KEY} data-theme="dark" />;
}
