"use client";

import { useEffect, useRef } from "react";

const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

type Tile = { x: number; y: number; s: number; r: number; cx: number; cy: number; jitter: number };

export default function GlassTiles({
  cell = 120,
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
    let lastT = 0;
    let lastW = 0;
    let lastH = 0;

    const build = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // ignore tiny oscillations during CSS accordion animations, but rebuild
      // on real width changes or meaningful height changes
      if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 24) return;
      lastW = w;
      lastH = h;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tiles = [];

      // fewer, larger tiles = fewer draw calls and smoother motion
      const c = w < 640 ? Math.max(72, cell * 0.58) : w < 1024 ? Math.max(88, cell * 0.75) : cell;
      const gap = 5;
      const s = c - gap;
      const r = Math.min(18, Math.max(8, s * 0.12));

      for (let y = gap; y < h; y += c) {
        for (let x = gap; x < w; x += c) {
          tiles.push({
            x,
            y,
            s,
            r,
            cx: x + s / 2,
            cy: y + s / 2,
            jitter: hash(x, y) * Math.PI * 2,
          });
        }
      }
      // redraw immediately so the canvas never sits blank after a resize
      draw(lastT);
    };

    const roundRect = (x: number, y: number, s: number, r: number) => {
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
        // molten flow: three sine waves at different frequencies so each tile's
        // surface moves independently, like liquid metal cooling and re-heating
        const f1 = Math.sin(t * 0.8 + tile.cx * 0.03 + tile.jitter);
        const f2 = Math.sin(t * 1.2 + tile.cy * 0.04 - tile.jitter * 0.7);
        const f3 = Math.sin(t * 0.5 + (tile.cx - tile.cy) * 0.02);
        const flow = 0.5 + 0.5 * ((f1 + f2 + f3) / 3);
        const lit = reduce ? 0.15 : Math.pow(flow, 2.2);

        // --- molten metal body ---
        // diagonal gradient with a moving gold crest
        const g = ctx.createLinearGradient(
          tile.x,
          tile.y,
          tile.x + tile.s,
          tile.y + tile.s
        );
        const crest = 0.15 + lit * 0.7;

        g.addColorStop(0, "#0b0805");
        g.addColorStop(Math.max(0, crest - 0.22), "#3d2410");
        g.addColorStop(Math.max(0, crest - 0.08), "#8a5a20");
        g.addColorStop(crest, "#ffde8a");
        g.addColorStop(Math.min(1, crest + 0.12), "#7a4a18");
        g.addColorStop(Math.min(1, crest + 0.28), "#2a1a0a");
        g.addColorStop(1, "#0a0705");

        roundRect(tile.x, tile.y, tile.s, tile.r);
        ctx.fillStyle = g;
        ctx.fill();

        // warm gold grid border
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(210,175,105,${0.12 + lit * 0.18})`;
        ctx.stroke();

        // specular hot spot
        const spot = ctx.createRadialGradient(
          tile.x + tile.s * (crest + 0.05),
          tile.y + tile.s * (crest - 0.05),
          0,
          tile.x + tile.s * crest,
          tile.y + tile.s * crest,
          tile.s * 0.5
        );
        spot.addColorStop(0, `rgba(255,240,195,${lit * 0.65})`);
        spot.addColorStop(0.5, `rgba(255,210,130,${lit * 0.22})`);
        spot.addColorStop(1, "rgba(255,210,130,0)");
        ctx.fillStyle = spot;
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      lastT = now * 0.001;
      draw(lastT);
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

    // schedule rebuilds on a single rAF to collapse multiple resize events
    let pendingBuild = false;
    const ro = new ResizeObserver(() => {
      if (pendingBuild) return;
      pendingBuild = true;
      requestAnimationFrame(() => {
        pendingBuild = false;
        build();
      });
    });
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
