"use client";

import { useEffect, useRef } from "react";

const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// metallic gold range — deep bronze shadows through champagne highlights
const TINTS = [
  "168,124,54", // bronze
  "198,158,84", // aged gold
  "226,186,110", // bright gold
  "240,220,170", // pale champagne
];
const TINT_PICK = [0, 0, 0, 1, 1, 1, 1, 2, 2, 3]; // mid-golds dominate

type Tile = { x: number; y: number; s: number; tint: string; jitter: number; base: number };

export default function GlassTiles({
  cell = 56,
  className,
}: {
  cell?: number;
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
    let tiles: Tile[] = [];

    const build = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tiles = [];
      const gap = 4;
      const size = cell - gap;
      for (let y = gap; y < h - gap; y += cell) {
        for (let x = gap; x < w - gap; x += cell) {
          tiles.push({
            x,
            y,
            s: size,
            tint: TINTS[TINT_PICK[Math.floor(hash(x, y) * TINT_PICK.length)]],
            jitter: hash(y, x) * 0.6,
            // per-tile resting brightness — metal plates catch ambient light
            // at different angles, so the field isn't uniform
            base: 0.014 + hash(x * 1.7, y * 2.3) * 0.03,
          });
        }
      }
      if (reduce) draw(0);
    };

    const rrect = (x: number, y: number, s: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + s, y, x + s, y + s, r);
      ctx.arcTo(x + s, y + s, x, y + s, r);
      ctx.arcTo(x, y + s, x, y, r);
      ctx.arcTo(x, y, x + s, y, r);
      ctx.closePath();
    };

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const tile of tiles) {
        // traveling diagonal sheen — wave crest sweeps the grid so tiles
        // light up in sequence like glass catching a moving light
        const wave = 0.5 + 0.5 * Math.sin(t * 0.7 - (tile.x + tile.y * 0.65) * 0.008 + tile.jitter);
        const lit = wave * wave * wave; // sharpen the crest
        const a = reduce ? tile.base : tile.base * 0.6 + lit * 0.09;

        rrect(tile.x, tile.y, tile.s, 8);
        ctx.fillStyle = `rgba(${tile.tint}, ${a})`;
        ctx.fill();

        // specular edge — a hot gold line along the tile's top edge when the
        // sheen crests, the way a polished plate flares under a moving light
        const edge = reduce ? 0.06 : lit * 0.28;
        if (edge > 0.015) {
          ctx.beginPath();
          ctx.moveTo(tile.x + 8, tile.y + 1);
          ctx.lineTo(tile.x + tile.s - 8, tile.y + 1);
          ctx.strokeStyle = `rgba(255,238,196, ${edge})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
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
  }, [cell]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
