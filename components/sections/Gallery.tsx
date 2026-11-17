"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, scrollStore } from "@/lib/gsap";
import { biomePalette, formatTripDate, home, shortName, tripsChronological as trips, type Biome } from "@/data/camping";
import { MAP, project } from "@/data/californiaMap";
import * as L from "@/data/mapLayers";
import { reveal } from "@/lib/anim";
import { PhotoPlaceholder, SectionLabel } from "../ui";

/* ------------------------------------------------------------------ data */

type Pt = [number, number];

const N = trips.length;
/** Map positions: San José first, then each trip in order. */
const pts: Pt[] = [home, ...trips].map((t) => project(t.lng, t.lat));

/** Curved leg between consecutive stops; alternate which side it bows to. */
const legs: string[] = pts.slice(1).map((b, i) => {
  const a = pts[i];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const side = i % 2 ? 1 : -1;
  const cx = (a[0] + b[0]) / 2 + (-dy / len) * len * 0.16 * side;
  const cy = (a[1] + b[1]) / 2 + (dx / len) * len * 0.16 * side;
  return `M${a[0].toFixed(1)} ${a[1].toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
});

/** Which side of its pin each label sits on (default right). */
const LABEL_LEFT = new Set(["yosemite-valley"]);
/** Short place name for small screens: "Yosemite Valley" → "Yosemite", "Lake Tahoe" → "Tahoe". */
function mobileName(name: string): string {
  const n = shortName(name).replace(/ National Park$/, "");
  const map: Record<string, string> = {
    "Lake Tahoe": "Tahoe",
    "Yosemite Valley": "Yosemite",
    "Tuolumne Meadows": "Tuolumne",
    "Death Valley": "Death Valley",
    "Glacier Point": "Glacier Pt",
  };
  return map[n] ?? n.split(" ")[0];
}

/** Light grid so the map reads as a plate. */
const grid = (() => {
  let d = "";
  for (let lng = -123; lng <= -116; lng += 0.5) {
    const [x1, y1] = project(lng, 35.0);
    const [x2, y2] = project(lng, 39.7);
    d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  for (let lat = 35; lat <= 39.5; lat += 0.5) {
    const [x1, y1] = project(-122.8, lat);
    const [x2, y2] = project(-116, lat);
    d += `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
})();


/** Reference places so the map reads as California (public coordinates). */
const cities: { name: string; lng: number; lat: number; left?: boolean }[] = [
  { name: "San Francisco", lng: -122.4194, lat: 37.7749, left: true },
  { name: "Monterey", lng: -121.8947, lat: 36.6002, left: true },
  { name: "Sacramento", lng: -121.4944, lat: 38.5816 },
  { name: "Stockton", lng: -121.2908, lat: 37.9577 },
  { name: "Fresno", lng: -119.7871, lat: 36.7378 },
  { name: "Reno", lng: -119.8138, lat: 39.5296 },
  { name: "Bishop", lng: -118.3951, lat: 37.3635 },
].map((c) => ({ ...c }));
const cityPts = cities.map((c) => project(c.lng, c.lat));
const regions: { name: string; lng: number; lat: number; rot?: number }[] = [
  { name: "PACIFIC OCEAN", lng: -122.45, lat: 36.35, rot: -58 },
  { name: "CENTRAL VALLEY", lng: -120.75, lat: 37.45, rot: -55 },
  { name: "SIERRA NEVADA", lng: -119.55, lat: 38.55, rot: -48 },
  { name: "NEVADA", lng: -117.4, lat: 38.4 },
];
const regionPts = regions.map((r) => project(r.lng, r.lat));



const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const inOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const backOut = (t: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

/* ------------------------------------------------------------- component */

export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(-1); // -1 = on the road / at the start

  useGSAP(
    () => {
      const el = root.current!;
      const svgEl = svg.current!;
      const stage = el.querySelector<HTMLElement>("[data-stage]")!;
      reveal("[data-reveal]", el, { stagger: 0.06 });

      const segEls = Array.from(svgEl.querySelectorAll<SVGPathElement>("[data-seg]"));
      const glowEls = Array.from(svgEl.querySelectorAll<SVGPathElement>("[data-glow]"));
      const lens = segEls.map((p) => p.getTotalLength());
      segEls.forEach((p, i) => {
        p.style.strokeDasharray = `${lens[i]}`;
        p.style.strokeDashoffset = `${lens[i]}`;
      });
      const homeEl = svgEl.querySelector<SVGGElement>("[data-home]")!;
      const stopEls = Array.from(svgEl.querySelectorAll<SVGGElement>("[data-stop]"));
      const brightEls = Array.from(svgEl.querySelectorAll<SVGGElement>("[data-bright]"));
      const labelEls = Array.from(svgEl.querySelectorAll<SVGElement>("[data-label]"));
      const headEl = svgEl.querySelector<SVGGElement>("[data-head]")!;
      const stopLabels = Array.from(svgEl.querySelectorAll<SVGTextElement>("[data-stop-label]"));
      const labelSide: (boolean | null)[] = stopLabels.map(() => null); // forces the first placement

      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const bw = Math.max(...xs) - Math.min(...xs);
      const bh = Math.max(...ys) - Math.min(...ys);
      const ocx = (Math.max(...xs) + Math.min(...xs)) / 2;
      const ocy = (Math.max(...ys) + Math.min(...ys)) / 2;

      let aspect = 1.4;
      let cw = 800;
      const measure = () => {
        const r = stage.getBoundingClientRect();
        cw = r.width || 800;
        aspect = (r.width || 1) / (r.height || 1);
        // phones: short place names so labels fit inside the map
        const narrow = cw < 560;
        stopLabels.forEach((t) => {
          const txt = (narrow ? t.dataset.short : t.dataset.long) ?? "";
          if (t.textContent !== txt) t.textContent = txt;
        });
      };
      const overviewVw = () => Math.max(bw + 340, (bh + 340) * aspect);

      let lastActive = -2;
      const setCam = (cx: number, cy: number, vw: number) => {
        const vh = vw / aspect;
        // nudge the view down a little so pins don't sit under the progress rail at the top
        const oy = 18 * (vw / cw);
        svgEl.setAttribute("viewBox", `${(cx - vw / 2).toFixed(1)} ${(cy - vh / 2 - oy).toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
        const f = vw / cw; // map units per screen pixel: markers keep a constant on-screen size
        homeEl.setAttribute("transform", `translate(${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}) scale(${f.toFixed(4)})`);
        stopEls.forEach((g, i) => g.setAttribute("transform", `translate(${pts[i + 1][0].toFixed(1)} ${pts[i + 1][1].toFixed(1)}) scale(${f.toFixed(4)})`));
        // flip a stop's label to the left when the pin sits near the right edge of the view
        stopLabels.forEach((t, i) => {
          const fx = (pts[i + 1][0] - (cx - vw / 2)) / vw;
          const below = t.dataset.below === "1";
          // below-pin labels hang off to whichever side has room; the others sit beside the pin
          const left = below ? fx > 0.55 : t.dataset.left === "1" || fx > 0.66;
          if (left !== labelSide[i]) {
            labelSide[i] = left;
            t.setAttribute("x", below ? (left ? "8" : "-8") : left ? "-16" : "16");
            t.setAttribute("text-anchor", left ? "end" : "start");
          }
        });
        labelEls.forEach((l) => {
          const maxf = l.getAttribute("data-maxf");
          if (maxf) {
            const show = f <= Number(maxf) ? "1" : "0";
            if (l.style.opacity !== show) l.style.opacity = show;
          }
          const x = Number(l.getAttribute("data-x"));
          const y = Number(l.getAttribute("data-y"));
          const r = Number(l.getAttribute("data-rot"));
          l.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r}) scale(${f.toFixed(4)})`);
        });
        return f;
      };
      const place = (p: number, f: number) => {
        // draw every leg up to p, and position the travelling dot at its head.
        // Strokes are non-scaling, so dash lengths are in screen px: convert from map units.
        const k = Math.min(N - 1, Math.floor(p));
        segEls.forEach((seg, i) => {
          const px = lens[i] / f;
          const dash = `${px}`;
          const off = `${px * (1 - clamp(p - i))}`;
          seg.style.strokeDasharray = dash;
          seg.style.strokeDashoffset = off;
          const g = glowEls[i];
          if (g) {
            g.style.strokeDasharray = dash;
            g.style.strokeDashoffset = off;
          }
        });
        brightEls.forEach((g, i) => {
          const a = clamp((p - (i + 0.86)) / 0.14);
          const sc = a === 0 ? 0 : backOut(a);
          g.style.opacity = `${clamp(a * 2)}`;
          g.setAttribute("transform", `scale(${sc.toFixed(3)})`);
        });
        const t = clamp(p - k);
        const pt = segEls[k].getPointAtLength(lens[k] * t);
        return pt;
      };

      const renderStatic = () => {
        measure();
        const f = setCam(ocx, ocy, overviewVw());
        place(N, f);
        headEl.setAttribute("transform", `translate(${pts[N][0]} ${pts[N][1]}) scale(${f})`);
        headEl.style.opacity = "0";
      };

      if (scrollStore.reducedMotion) {
        renderStatic();
        const ro = new ResizeObserver(renderStatic);
        ro.observe(stage);
        return () => ro.disconnect();
      }

      const INTRO = 0.07; // scroll share spent flying in from the overview to San José
      const TRAVEL = 0.58; // share of each step spent travelling (the rest is a dwell on the stop)
      const BASE = 720; // map units visible across the stage while parked on a stop

      const render = (s: number) => {
        let p = 0;
        let tr = 0;
        let dwell = false;
        if (s > INTRO) {
          const q = clamp((s - INTRO) / (1 - INTRO)) * N;
          const i = Math.min(N - 1, Math.floor(q));
          const u = q >= N ? 1 : q - i;
          tr = clamp(u / TRAVEL);
          dwell = tr >= 1;
          p = i + inOut(tr);
        }
        let vw = BASE + 430 * Math.sin(Math.PI * (dwell ? 1 : tr));
        let intro = 0;
        if (s <= INTRO) {
          intro = inOut(clamp(s / INTRO));
          const ov = overviewVw();
          vw = ov + (BASE - ov) * intro;
        }
        const head = place(p, vw / cw);
        let cx = head.x;
        let cy = head.y;
        if (s <= INTRO) {
          cx = ocx + (pts[0][0] - ocx) * intro;
          cy = ocy + (pts[0][1] - ocy) * intro;
        }
        const f = setCam(cx, cy, vw);
        headEl.setAttribute("transform", `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${f.toFixed(4)})`);
        headEl.style.opacity = dwell || s <= INTRO ? "0" : "1";
        const act = s > INTRO && dwell ? Math.min(N - 1, Math.floor(clamp((s - INTRO) / (1 - INTRO)) * N - 1e-6)) : -1;
        if (act !== lastActive) {
          lastActive = act;
          setActive(act);
        }
      };

      measure();
      const st = { s: 0 };
      gsap.to(st, {
        s: 1,
        ease: "none",
        onUpdate: () => render(st.s),
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * (N * 1.05 + 0.4))}`,
          pin: true,
          scrub: 0.6,
          refreshPriority: 1,
          invalidateOnRefresh: true,
          onRefresh: () => {
            measure();
            render(st.s);
          },
        },
      });
      render(0);
    },
    { scope: root },
  );


  const stepNames = [shortName(home.name), ...trips.map((t) => mobileName(t.name))];

  return (
    <section
      id="gallery"
      ref={root}
      aria-labelledby="gallery-title"
      className="relative flex h-[100svh] flex-col overflow-hidden pt-20 md:pt-24 [html[data-motion=reduced]_&]:h-auto [html[data-motion=reduced]_&]:overflow-visible [html[data-motion=reduced]_&]:pb-20"
    >
      <div className="wrap" data-reveal>
        <SectionLabel id="gallery" />
        <h2 id="gallery-title" className="h2 legible mt-3">
          Beyond work<span className="accent">.</span>
        </h2>
      </div>

      <div className="wrap mt-4 grid min-h-0 flex-1 gap-4 pb-6 md:pb-12 [grid-template-rows:minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] md:gap-8 md:[grid-template-rows:minmax(0,1fr)] [html[data-motion=reduced]_&]:flex-none [html[data-motion=reduced]_&]:[grid-template-rows:auto]">
        {/* ---- the map ---- */}
        <div
          data-stage
          data-reveal
          className="relative min-h-[38svh] overflow-hidden rounded-[18px] border border-white/12 bg-[#06111a] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] [html[data-motion=reduced]_&]:h-[60svh]"
        >
          <svg
            ref={svg}
            viewBox={`0 0 ${MAP.w} ${MAP.h}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label={`Map of the route: ${stepNames.join(", then ")}`}
          >
            <defs>
              <radialGradient id="jm-glow">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <clipPath id="jm-landclip">
                <path d={MAP.ca + MAP.nv} />
              </clipPath>
            </defs>

            {/* ---- base: ocean with depth bands, then land ---- */}
            <rect x="-4000" y="-4000" width="9000" height="9000" fill="#06111a" />
            {[90, 56, 30, 14].map((w, i) => (
              <path key={w} d={MAP.ca} fill="none" stroke="#7ab8e0" strokeOpacity={0.025 + i * 0.018} strokeWidth={w} strokeLinejoin="round" />
            ))}
            <path d={MAP.nv} fill="#111b22" />
            <path d={MAP.ca} fill="#16232c" />

            {/* ---- terrain tints and park lands, clipped to the land ---- */}
            <g clipPath="url(#jm-landclip)">
              <path d={L.basin} fill="#c99a64" fillOpacity="0.07" />
              <path d={L.valley} fill="#6f9a5c" fillOpacity="0.14" />
              <path d={L.coast} fill="#8fb08a" fillOpacity="0.06" />
              <path d={L.sierra} fill="#c3d0de" fillOpacity="0.06" />
              <path d={L.sierraH} fill="none" stroke="#e3ecf5" strokeOpacity="0.2" strokeWidth="1" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <path d={L.coastH} fill="none" stroke="#cfe2c6" strokeOpacity="0.12" strokeWidth="1" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {L.parks.map((pk) => (
                <path key={pk.name} d={pk.d} fill="#4fbf7a" fillOpacity="0.09" stroke="#6fd79a" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
              ))}
            </g>
            <path d={grid} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" vectorEffect="non-scaling-stroke" />

            {/* ---- water and roads ---- */}
            <path d={L.roadsMinor} fill="none" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
            <path d={L.roadsMajor} fill="none" stroke="#ffd9b5" strokeOpacity="0.22" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
            <path d={L.rivers} fill="none" stroke="#5aa6cf" strokeOpacity="0.45" strokeWidth="1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={L.lakes} fill="#2b7395" stroke="#9ad6ef" strokeOpacity="0.55" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />

            {/* ---- borders ---- */}
            <path d={MAP.nv} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
            <path d={MAP.ca} fill="none" stroke="rgba(190,225,255,0.5)" strokeWidth="1.1" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />

            {/* ---- labels (constant on-screen size; detail labels only appear zoomed in) ---- */}
            {regions.map((rg, i) => (
              <text key={rg.name} data-label data-x={regionPts[i][0]} data-y={regionPts[i][1]} data-rot={rg.rot ?? 0} textAnchor="middle" fontSize="10" className="mono" fill="rgba(255,255,255,0.2)" style={{ letterSpacing: "0.38em" }}>
                {rg.name}
              </text>
            ))}
            {L.parks.map((pk) => (
              <text key={pk.name} data-label data-x={pk.cx} data-y={pk.cy} data-rot="0" textAnchor="middle" fontSize="9" className="mono" fill="#86e3ad" fillOpacity="0.8" style={{ letterSpacing: "0.14em" }}>
                {pk.name}
              </text>
            ))}
            {L.peaks.map((pk) => (
              <g key={pk.name} data-label data-x={pk.x} data-y={pk.y} data-rot="0" data-maxf="1.35">
                <path d="M-4.5 3.5L0 -4.5L4.5 3.5Z" fill={pk.low ? "none" : "rgba(255,255,255,0.75)"} stroke="rgba(255,255,255,0.75)" strokeWidth="1" />
                <text x="8" y="3.5" fontSize="9" className="mono" fill="rgba(255,255,255,0.55)" style={{ letterSpacing: "0.06em" }}>
                  {`${pk.name} · ${pk.ft.toLocaleString("en-US")} FT`}
                </text>
              </g>
            ))}
            {L.shields.map((sh) => (
              <g key={sh.name} data-label data-x={sh.x} data-y={sh.y} data-rot="0" data-maxf="1.25">
                <rect x={-(sh.name.length * 3 + 6)} y="-6.5" width={sh.name.length * 6 + 12} height="13" rx={sh.kind === "I" ? 3 : 6.5} fill={sh.kind === "I" ? "#2c4f92" : sh.kind === "US" ? "#e9e6df" : "#2f6b4a"} stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
                <text y="3.2" textAnchor="middle" fontSize="8.5" className="mono" fill={sh.kind === "US" ? "#111" : "#fff"} fontWeight="600">
                  {sh.name}
                </text>
              </g>
            ))}
            {cities.map((c, i) => (
              <g key={c.name} data-label data-x={cityPts[i][0]} data-y={cityPts[i][1]} data-rot="0">
                <rect x="-2.5" y="-2.5" width="5" height="5" fill="#0b1117" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
                <text x={c.left ? -8 : 8} y="3.5" textAnchor={c.left ? "end" : "start"} fontSize="9.5" className="mono" fill="rgba(255,255,255,0.5)" style={{ letterSpacing: "0.06em" }}>
                  {c.name.toUpperCase()}
                </text>
              </g>
            ))}

            {/* ---- the route travelled so far: a soft glow under a bright line ---- */}
            {legs.map((d, i) => (
              <path key={`g${i}`} data-glow d={d} fill="none" stroke="var(--accent)" strokeOpacity="0.28" strokeWidth="9" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            ))}
            {legs.map((d, i) => (
              <path key={i} data-seg d={d} fill="none" stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            ))}

            {/* San José: where it starts */}
            <g data-home>
              <circle r="11" fill="#0b1117" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
              <path d="M-5 1.5L0 -4L5 1.5V5.5H-5Z" fill="#fff" />
              <text x="17" y="4" fontSize="11" className="mono" fill="rgba(255,255,255,0.9)" style={{ letterSpacing: "0.08em" }}>
                {home.name.toUpperCase()} · HOME
              </text>
            </g>

            {/* the stops: numbered pins; the name shows for the stop you're on */}
            {trips.map((t, i) => {
              const left = LABEL_LEFT.has(t.id);
              const accent = biomePalette[t.biome ?? "forest"].accent;
              const on = active === i;
              return (
                <g key={t.id} data-stop>
                  <circle r="10" fill="#0b1117" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" />
                  <g data-bright style={{ opacity: 0 }}>
                    <circle r={on ? 22 : 13} fill={accent} fillOpacity={on ? 0.22 : 0.12} style={{ transition: "r 400ms" }} />
                    <circle r="10.5" fill={accent} stroke="#fff" strokeWidth={on ? 2 : 1.2} />
                  </g>
                  <text y="3.6" textAnchor="middle" fontSize="10" className="mono" fontWeight="700" fill="#fff" style={{ pointerEvents: "none" }}>
                    {i + 1}
                  </text>
                  <g style={{ opacity: on ? 1 : 0, transition: "opacity 400ms" }}>
                    <text
                      data-stop-label
                      data-long={shortName(t.name).replace(/ National Park$/, "").toUpperCase()}
                      data-short={mobileName(t.name).toUpperCase()}
                      data-left={left ? "1" : "0"}
                      data-below="0"
                      x={left ? -18 : 18}
                      y="4"
                      textAnchor={left ? "end" : "start"}
                      fontSize="12"
                      className="mono"
                      fontWeight="600"
                      fill="#fff"
                      stroke="#06111a"
                      strokeWidth="3"
                      paintOrder="stroke"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      {shortName(t.name).replace(/ National Park$/, "").toUpperCase()}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* the travelling dot */}
            <g data-head style={{ opacity: 0 }}>
              <circle r="14" fill="url(#jm-glow)" opacity="0.7" />
              <circle r="4.5" fill="#fff" />
            </g>
          </svg>

          {/* progress rail, on a soft band so map labels never collide with it */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#06111a] via-[#06111a]/80 to-transparent md:h-14" aria-hidden />
          <ol className="mono pointer-events-none absolute inset-x-3 top-3 flex items-center gap-2 text-[10px] md:inset-x-5 md:top-4 md:justify-between md:gap-3 md:text-[10.5px]" aria-hidden>
            {stepNames.map((n, i) => {
              const on = i === active + 1;
              const done = i <= active + 1;
              return (
                <li key={n} className={`flex min-w-0 items-center gap-2 ${on ? "flex-[3] md:flex-none" : "flex-none"}`}>
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-500"
                    style={{ background: done ? "var(--accent)" : "rgba(255,255,255,0.3)", boxShadow: on ? "0 0 10px var(--accent)" : "none" }}
                  />
                  <span className={`truncate uppercase tracking-[0.08em] transition-colors duration-500 ${on ? "text-white" : "hidden text-white/45 md:inline"}`}>{n}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ---- the trip panel ---- */}
        <div className="relative h-[clamp(176px,25svh,240px)] md:h-auto md:self-center md:min-h-[520px] [html[data-motion=reduced]_&]:hidden" data-reveal>
          <div className="absolute inset-0">
            <Intro shown={active === -1} />
            {trips.map((t, i) => (
              <TripCard key={t.id} index={i} shown={active === i} />
            ))}
          </div>
        </div>
      </div>

      {/* reduced motion: everything on one page, no pinning */}
      <div className="wrap mt-10 hidden gap-10 md:grid-cols-2 [html[data-motion=reduced]_&]:grid">
        {trips.map((t, i) => (
          <div key={t.id} className="relative min-h-[420px]">
            <TripCard index={i} shown flow />
          </div>
        ))}
      </div>

    </section>
  );
}

/* ----------------------------------------------------------- panel cards */

function Intro({ shown }: { shown: boolean }) {
  return (
    <div
      inert={!shown}
      className={`absolute inset-0 flex flex-col justify-center transition-all duration-500 ${shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <p className="mono dim">{"// The route"}</p>
      <p className="legible mt-3 max-w-[30ch] text-[clamp(1.15rem,1.8vw,1.6rem)] leading-tight">
        {N} places I&apos;ve camped and hiked, all road trips from {home.name}.
      </p>
      <p className="mono dim mt-4">Scroll to follow it ↓</p>
    </div>
  );
}

function TripCard({ index, shown, flow = false }: { index: number; shown: boolean; flow?: boolean }) {
  const t = trips[index];
  const accent = biomePalette[t.biome ?? ("forest" as Biome)].accent;
  const photos = t.photos;
  const n = photos.length;
  const [front, setFront] = useState(0);
  const [fling, setFling] = useState<{ src: string; dir: 1 | -1 } | null>(null);
  const down = useRef<{ x: number; y: number } | null>(null);
  const busy = useRef(false);

  // back to the first photo whenever the card is hidden again
  useEffect(() => {
    if (!shown) setFront(0);
  }, [shown]);

  /** dir 1 = next (front card flies left), -1 = previous (flies right). */
  const step = (dir: 1 | -1) => {
    if (n < 2 || busy.current) return;
    busy.current = true;
    const reduced = scrollStore.reducedMotion;
    setFling({ src: photos[front], dir });
    window.setTimeout(
      () => {
        setFront((f) => (f + dir + n) % n);
        setFling(null);
        busy.current = false;
      },
      reduced ? 0 : 260,
    );
  };

  // position of each photo in the stack: 0 = front, 1 and 2 peek out behind
  const rot = [0, -4, 4];
  const off = [0, -4, 4];

  return (
    <article
      inert={!shown}
      aria-label={t.name}
      className={`${flow ? "relative" : "absolute inset-0"} flex flex-row items-center gap-4 transition-all duration-500 md:flex-col md:items-start md:justify-center md:gap-5 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="w-[30vw] shrink-0 md:w-[min(88%,270px,30svh)]">
        <button
          type="button"
          disabled={n < 2}
          aria-label={n < 2 ? `${t.name} photo` : `${t.name}: photo ${front + 1} of ${n}. Tap, swipe or use the arrow keys for the next photo`}
          onPointerDown={(e) => {
            down.current = { x: e.clientX, y: e.clientY };
            // keep receiving the pointer even if the swipe leaves the photo
            e.currentTarget.setPointerCapture?.(e.pointerId);
          }}
          onPointerUp={(e) => {
            const d = down.current;
            down.current = null;
            if (!d) return;
            const dx = e.clientX - d.x;
            const dy = e.clientY - d.y;
            if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
            else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) step(1);
          }}
          onPointerCancel={() => (down.current = null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              step(1);
            }
          }}
          className="relative block aspect-[4/5] w-full touch-pan-y select-none disabled:cursor-default enabled:cursor-pointer"
        >
          {n === 0 ? (
            <span className="absolute inset-0 block overflow-hidden rounded-[16px] border border-white/15">
              <PhotoPlaceholder label={`${shortName(t.name).toUpperCase()} · PHOTOS SOON`} seed={t.id} biome={t.biome} />
            </span>
          ) : (
            photos.map((src, i) => {
              const j = (i - front + n) % n; // place in the stack
              const flying = fling?.src === src;
              const visible = j < 3;
              const transform = flying
                ? `translateX(${fling!.dir === 1 ? -115 : 115}%) rotate(${fling!.dir === 1 ? -14 : 14}deg)`
                : `translateX(${off[Math.min(j, 2)]}%) rotate(${rot[Math.min(j, 2)]}deg)`;
              return (
                <span
                  key={src}
                  aria-hidden={j !== 0}
                  className="absolute inset-0 block overflow-hidden rounded-[16px] border border-white/20 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.9)] transition-[transform,opacity] duration-300 ease-out"
                  style={{ transform, zIndex: flying ? 20 : 10 - j, opacity: flying ? 0 : visible ? 1 : 0 }}
                >
                  <Image src={src} alt={j === 0 ? `${t.name}, photo ${i + 1}` : ""} fill sizes="(max-width: 768px) 30vw, 300px" className="pointer-events-none object-cover" draggable={false} />
                </span>
              );
            })
          )}
        </button>
        {n > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5 md:justify-start" aria-hidden>
            {photos.map((src, i) => (
              <span
                key={src}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ width: i === front ? 16 : 6, background: i === front ? accent : "rgba(255,255,255,0.3)" }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="mono flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span className="dim">
            {String(index + 1).padStart(2, "0")} · {formatTripDate(t.date)}
          </span>
        </p>
        <h3 className="legible mt-2 text-[clamp(1.1rem,1.7vw,1.5rem)] font-semibold leading-tight tracking-[-0.02em]">{t.name}</h3>
        <p className="mono dim mt-1 text-[11px]">{t.area}</p>
        <p className="legible mt-3 hidden max-w-[34ch] text-[14px] leading-relaxed text-[var(--fg)]/80 md:block md:[@media(max-height:760px)]:hidden">{t.blurb}</p>
        {n > 1 && <p className="mono mt-3 text-[11px] text-[var(--fg)]/70">{n} photos · tap or swipe</p>}
      </div>
    </article>
  );
}
