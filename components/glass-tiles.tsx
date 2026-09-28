"use client";

import { useEffect, useRef } from "react";

const hash = (a: number, b: number) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

type Tile = { x: number; y: number; s: number; r: number; cx: number; cy: number; jitter: number };

export default function GlassTiles({
  cell = 110,
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

      // smaller tiles on phones so a few still fit across
      const c = w < 640 ? Math.max(64, cell * 0.62) : w < 1024 ? Math.max(80, cell * 0.8) : cell;
      const gap = 5;
      const s = c - gap;
      const r = Math.min(20, Math.max(10, s * 0.16));

      for (let y = gap; y < h; y += c) {
        for (let x = gap; x < w; x += c) {
          tiles.push({
            x,
            y,
            s,
            r,
            cx: x + s / 2,
            cy: y + s / 2,
            jitter: hash(x, y) * 0.5,
          });
        }
      }
      if (reduce) draw(0);
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
        // sweeping diagonal light band — tiles along x+y=const light up together,
        // and the crest moves as t changes, giving that flowing glass sheen
        const wave = 0.5 + 0.5 * Math.sin(t * 0.55 - (tile.cx + tile.cy) * 0.012 + tile.jitter);
        const lit = reduce ? 0.18 : Math.pow(wave, 3);

        // --- tile body ---
        roundRect(tile.x, tile.y, tile.s, tile.r);
        const bg = ctx.createLinearGradient(tile.x, tile.y, tile.x + tile.s, tile.y + tile.s);
        bg.addColorStop(0, "rgba(26,22,18,1)");
        bg.addColorStop(1, "rgba(10,9,7,1)");
        ctx.fillStyle = bg;
        ctx.fill();

        // thin warm gold border
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(200,170,110,${0.12 + lit * 0.15})`;
        ctx.stroke();

        // --- internal reflections ---
        ctx.save();
        roundRect(tile.x + 2, tile.y + 2, tile.s - 4, tile.r - 2);
        ctx.clip();

        // top-left arc sheen: the way light curls around the top-left of a glass block
        const arc1 = ctx.createLinearGradient(tile.x, tile.y, tile.x + tile.s, tile.y + tile.s);
        arc1.addColorStop(0, `rgba(255,240,195,${lit * 0.95})`);
        arc1.addColorStop(0.35, `rgba(255,215,145,${lit * 0.35})`);
        arc1.addColorStop(1, "rgba(255,210,130,0)");
        ctx.strokeStyle = arc1;
        ctx.lineWidth = 7;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tile.x + tile.s * 0.12, tile.y + tile.r * 0.4);
        ctx.quadraticCurveTo(
          tile.x + tile.s * 0.45,
          tile.y + tile.s * 0.35,
          tile.x + tile.s - tile.r * 0.4,
          tile.y + tile.s * 0.82
        );
        ctx.stroke();

        // bottom-right arc sheen: reflected light catching the opposite corner
        const arc2 = ctx.createLinearGradient(tile.x + tile.s, tile.y + tile.s, tile.x, tile.y);
        arc2.addColorStop(0, `rgba(255,220,155,${lit * 0.55})`);
        arc2.addColorStop(0.45, `rgba(255,200,120,${lit * 0.18})`);
        arc2.addColorStop(1, "rgba(255,210,130,0)");
        ctx.strokeStyle = arc2;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(tile.x + tile.r * 0.4, tile.y + tile.s * 0.18);
        ctx.quadraticCurveTo(
          tile.x + tile.s * 0.55,
          tile.y + tile.s * 0.65,
          tile.x + tile.s * 0.88,
          tile.y + tile.s - tile.r * 0.4
        );
        ctx.stroke();

        // central radial flare when the crest passes over
        const rg = ctx.createRadialGradient(
          tile.cx,
          tile.cy,
          4,
          tile.cx,
          tile.cy,
          tile.s * 0.7
        );
        rg.addColorStop(0, `rgba(255,235,180,${lit * 0.45})`);
        rg.addColorStop(0.55, `rgba(255,210,130,${lit * 0.14})`);
        rg.addColorStop(1, "rgba(255,210,130,0)");
        ctx.fillStyle = rg;
        ctx.fillRect(tile.x, tile.y, tile.s, tile.s);

        ctx.restore();
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
