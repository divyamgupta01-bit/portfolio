"use client";

import { useEffect, useRef } from "react";
import { scrollStore } from "@/lib/gsap";

/**
 * Night sky behind the last sections: crisp stars drawn on a canvas (sharp at any screen size),
 * over a soft glow made from Divyam's own Death Valley Milky Way photo. Stars cluster along the
 * band in that photo. Nothing is drawn or downloaded until the page nears night (SmoothScroll sets
 * data-night on the sky element), and the twinkle only runs while the night is visible.
 */
export default function NightSky() {
  const base = useRef<HTMLCanvasElement>(null);
  const sparkle = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const sky = base.current?.closest<HTMLElement>("[data-sky]");
    const c1 = base.current;
    const c2 = sparkle.current;
    if (!sky || !c1 || !c2) return;

    let started = false;
    let raf = 0;
    let density: { w: number; h: number; d: Float32Array } | null = null;
    type Star = { x: number; y: number; r: number; a: number; hue: string; tw: number; ph: number };
    let twinklers: Star[] = [];

    const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const wide = () => window.innerWidth / window.innerHeight >= 0.8;

    const loadDensity = () =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const w = 96;
          const h = Math.round((w * img.height) / img.width);
          const cv = document.createElement("canvas");
          cv.width = w;
          cv.height = h;
          const g = cv.getContext("2d")!;
          g.drawImage(img, 0, 0, w, h);
          const px = g.getImageData(0, 0, w, h).data;
          const d = new Float32Array(w * h);
          for (let i = 0; i < w * h; i++) d[i] = (px[i * 4] + px[i * 4 + 1] + px[i * 4 + 2]) / 765;
          density = { w, h, d };
          resolve();
        };
        img.onerror = () => resolve();
        img.src = wide() ? "/sky/glow-wide.webp" : "/sky/glow-tall.webp";
      });

    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = window.innerWidth;
      const H = window.innerHeight;
      for (const c of [c1, c2]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
        c.style.width = `${W}px`;
        c.style.height = `${H}px`;
      }
      const g = c1.getContext("2d")!;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const rnd = seeded(20261009);
      const at = (x: number, y: number) => {
        if (!density) return 0.3;
        // background-size: cover, centred
        const s = Math.max(W / density.w, H / density.h);
        const ox = (W - density.w * s) / 2;
        const oy = (H - density.h * s) / 2;
        const ix = Math.min(density.w - 1, Math.max(0, Math.floor((x - ox) / s)));
        const iy = Math.min(density.h - 1, Math.max(0, Math.floor((y - oy) / s)));
        return density.d[iy * density.w + ix];
      };
      const count = Math.round((W * H) / 650);
      const hues = ["255,255,255", "255,255,255", "205,225,255", "255,236,210", "190,210,255"];
      twinklers = [];
      let placed = 0;
      let tries = 0;
      while (placed < count && tries < count * 6) {
        tries++;
        const x = rnd() * W;
        const y = rnd() * H;
        const band = at(x, y);
        // more stars where the Milky Way is bright, but a sprinkle everywhere
        if (rnd() > 0.18 + band * 1.1) continue;
        placed++;
        const big = rnd();
        const r = big > 0.985 ? 1.5 + rnd() * 0.8 : big > 0.9 ? 0.9 + rnd() * 0.5 : 0.35 + rnd() * 0.45;
        const a = Math.min(1, 0.35 + rnd() * 0.5 + band * 0.25 + (r > 1 ? 0.25 : 0));
        const hue = hues[Math.floor(rnd() * hues.length)];
        if (r > 0.95 && twinklers.length < 70) {
          twinklers.push({ x, y, r, a, hue, tw: 0.6 + rnd() * 1.6, ph: rnd() * Math.PI * 2 });
          continue;
        }
        g.fillStyle = `rgba(${hue},${a.toFixed(2)})`;
        g.beginPath();
        g.arc(x, y, r, 0, Math.PI * 2);
        g.fill();
      }
      sparkleFrame(0);
    };

    const sparkleFrame = (t: number) => {
      const g = c2.getContext("2d")!;
      const dpr = c2.width / window.innerWidth;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const s of twinklers) {
        const k = scrollStore.reducedMotion ? 1 : 0.6 + 0.4 * Math.sin(t * 0.001 * s.tw + s.ph);
        const a = s.a * k;
        // soft halo + crisp core
        const halo = g.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
        halo.addColorStop(0, `rgba(${s.hue},${(a * 0.35).toFixed(3)})`);
        halo.addColorStop(1, `rgba(${s.hue},0)`);
        g.fillStyle = halo;
        g.beginPath();
        g.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = `rgba(${s.hue},${a.toFixed(3)})`;
        g.beginPath();
        g.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        g.fill();
      }
    };

    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const night = parseFloat(sky.style.getPropertyValue("--night") || "0");
      if (night <= 0.01 || t - last < 50) return; // only while visible, ~20 fps is plenty
      last = t;
      sparkleFrame(t);
    };

    const start = async () => {
      if (started) return;
      started = true;
      await loadDensity();
      draw();
      if (!scrollStore.reducedMotion) raf = requestAnimationFrame(loop);
    };

    const mo = new MutationObserver(() => {
      if (sky.dataset.night) start();
    });
    mo.observe(sky, { attributes: true, attributeFilter: ["data-night"] });
    if (sky.dataset.night) start();

    let rt = 0;
    const onResize = () => {
      if (!started) return;
      window.clearTimeout(rt);
      rt = window.setTimeout(draw, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="sky-night absolute inset-0">
      <div className="sky-glow absolute inset-0" />
      <canvas ref={base} className="absolute left-0 top-0" />
      <canvas ref={sparkle} className="absolute left-0 top-0" />
    </div>
  );
}
