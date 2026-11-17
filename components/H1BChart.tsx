"use client";

import { useEffect, useRef, useState } from "react";
import { hues } from "@/data/site";
import { h1bFigure } from "@/data/work";

const SERIES_COLORS = [hues.sky.a, hues.trail.a, hues.pine.a];

/** Line chart of H-1B share by industry. Pure SVG; values are shares (0.04 = 4%). */
export default function H1BChart({ bare = false }: { bare?: boolean }) {
  const Wrap = bare ? "div" : "figure";
  const { years, series } = h1bFigure;
  // size the drawing to its box so axis text stays a readable 11px on phones and desktops alike
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(600);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setW(Math.max(260, Math.round(e.contentRect.width))),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = Math.round(Math.min(340, Math.max(220, W * 0.56)));
  const m = { l: 44, r: 16, t: 16, b: 34 };
  const yMax = 0.06;
  const x = (i: number) => m.l + (i / (years.length - 1)) * (W - m.l - m.r);
  const y = (v: number) => m.t + (1 - v / yMax) * (H - m.t - m.b);
  const ticks = [0, 0.02, 0.04, 0.06];

  return (
    <Wrap className="h1b-chart">
      {!bare && (
        <figcaption className="mono dim mb-3">
          H-1B share of employment by industry, 2015–2024
        </figcaption>
      )}
      <div ref={box}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          className="block h-auto w-full"
          role="img"
          aria-label="Line chart: Tech's H-1B share rose from about 4% to 5.4%, Finance and Insurance from about 1% to a 2.8% peak in 2022, Health Care stayed near 0.2%."
        >
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={m.l}
                x2={W - m.r}
                y1={y(t)}
                y2={y(t)}
                stroke="rgba(255,255,255,0.09)"
              />
              <text
                x={m.l - 10}
                y={y(t) + 4}
                textAnchor="end"
                fontSize="11"
                className="mono"
                fill="rgba(255,255,255,0.5)"
              >
                {`${Math.round(t * 100)}%`}
              </text>
            </g>
          ))}
          {years.map((yr, i) =>
            i % 3 === 0 || i === years.length - 1 ? (
              <text
                key={yr}
                x={x(i)}
                y={H - 10}
                textAnchor="middle"
                fontSize="11"
                className="mono"
                fill="rgba(255,255,255,0.5)"
              >
                {yr}
              </text>
            ) : null,
          )}
          {series.map((s, si) => {
            const d = s.values
              .map(
                (v, i) =>
                  `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`,
              )
              .join(" ");
            const last = s.values.length - 1;
            return (
              <g key={s.name}>
                <path
                  className="h1b-line"
                  d={d}
                  fill="none"
                  stroke={SERIES_COLORS[si]}
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <circle
                  className="h1b-end"
                  cx={x(last)}
                  cy={y(s.values[last])}
                  r="4"
                  fill={SERIES_COLORS[si]}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {series.map((s, si) => (
          <li key={s.name} className="mono flex items-center gap-2 text-[11px]">
            <span
              className="h-[3px] w-4 rounded"
              style={{ background: SERIES_COLORS[si] }}
            />
            {`${s.name} · ${(s.values[s.values.length - 1] * 100).toFixed(1)}%`}
          </li>
        ))}
      </ul>
      {!bare && (
        <p className="mono dim mt-3 text-[10px]">
          Redrawn from Figure 1 of the paper. Sources: USCIS H-1B Employer Data
          Hub, BLS.
        </p>
      )}
    </Wrap>
  );
}
