"use client";

import { useEffect, useRef } from "react";

// Deterministic pseudo-random hash → stable starfield across resizes
const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// warm white / champagne / faint cool blue — the noir palette, galaxified
const TINTS = ["235,232,224", "216,201,163", "172,190,255"];

type Star = {
  x: number;
  y: number;
  r: number;
  tint: string;
  phase: number;
  rate: number;
  floor: number;
  halo: boolean;
};

type Meteor = { x: number; y: number; vx: number; vy: number; life: number; ttl: number };

export default function BlinkingDots({
  spacing = 22,
  meteors = true,
  className,
}: {
  spacing?: number;
  meteors?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let nextMeteor = 2.5;

    const build = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = [];
      meteors = [];

      // Milky-way band: a diagonal axis across the footer. Star density and
      // brightness both swell near it — reads as a galactic arm.
      // Wider lattice on phones — a tall narrow footer would otherwise be
      // a wall of dots
      const sp = w < 480 ? spacing * 1.6 : spacing;
      const ax = -w * 0.05;
      const ay = h * 0.9;
      const bx = w * 1.05;
      const by = h * 0.12;
      const dx = bx - ax;
      const dy = by - ay;
      const len2 = dx * dx + dy * dy;
      const sigma = Math.max(60, h * 0.22);

      for (let y = sp / 2; y < h; y += sp) {
        for (let x = sp / 2; x < w; x += sp) {
          const jx = x + (hash(x, y) - 0.5) * sp * 0.9;
          const jy = y + (hash(y, x) - 0.5) * sp * 0.9;
          const t = ((jx - ax) * dx + (jy - ay) * dy) / len2;
          const px = ax + t * dx;
          const py = ay + t * dy;
          const d = Math.hypot(jx - px, jy - py);
          const band = Math.exp(-(d * d) / (2 * sigma * sigma));
          if (hash(jx * 0.9, jy * 1.1) > 0.45 + band * 0.55) continue;

          const big = hash(jx * 2.1, jy * 1.7) > 0.93;
          stars.push({
            x: jx,
            y: jy,
            r: big ? 1.2 + hash(jx, jy * 3) * 0.9 : 0.45 + hash(jx * 1.3, jy) * 0.75,
            tint: TINTS[Math.floor(hash(jx * 5, jy * 7) * TINTS.length)],
            phase: hash(jx, jy) * Math.PI * 2,
            rate: 0.35 + hash(jy, jx) * 1.7,
            floor: hash(jx * 3.7, jy * 2.3) * (0.1 + band * 0.12),
            halo: big,
          });
        }
      }
      if (reduce) draw(0);
    };

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        const pulse = Math.pow(0.5 + 0.5 * Math.sin(s.phase + t * s.rate), 3);
        const a = reduce ? s.floor + 0.2 : s.floor + pulse * 0.5;
        if (a <= 0.01) continue;
        if (s.halo) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4.5);
          g.addColorStop(0, `rgba(${s.tint}, ${a * 0.5})`);
          g.addColorStop(1, `rgba(${s.tint}, 0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.tint}, ${a})`;
        ctx.fill();
      }

      // shooting stars — rare, fast, fading streak
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life += 1;
        const fade = 1 - m.life / m.ttl;
        if (fade <= 0 || m.x < -140 || m.x > w + 140 || m.y > h + 140) {
          meteors.splice(i, 1);
          continue;
        }
        const len = 110;
        const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * len * 0.06, m.y - m.vy * len * 0.06);
        g.addColorStop(0, `rgba(240,235,220, ${0.8 * fade})`);
        g.addColorStop(1, "rgba(240,235,220, 0)");
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * len * 0.06, m.y - m.vy * len * 0.06);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.4;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      if (!reduce && meteors && t > nextMeteor) {
        const dir = hash(t, w) > 0.5 ? 1 : -1;
        meteors.push({
          x: w * (0.25 + hash(t, h) * 0.7),
          y: -8 + hash(h, t) * h * 0.3,
          vx: dir * (6 + hash(t * 3, w) * 3),
          vy: 2.2 + hash(w, t * 7) * 1.6,
          life: 0,
          ttl: 55 + hash(t, t) * 30,
        });
        nextMeteor = t + 3.5 + hash(t * 1.7, h) * 6;
      }
    };

    const loop = (now: number) => {
      draw(now * 0.001);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      } else {
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    build();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [spacing, meteors]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
