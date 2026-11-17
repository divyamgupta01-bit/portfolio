import Image from "next/image";
import { aaplMonthly, spyMonthly } from "@/data/market";
import { h1bFigure } from "@/data/work";
import { OI, Q, REV } from "./Artifacts";

/*
 * The picture on each project slide: a real chart, photo or screen from the work.
 * Charts are plain SVG with their own coordinate system; page layout around them is
 * Tailwind flex/grid only (no absolute positioning, no negative margins).
 */

const INK = "#64748b";
const GRID = "#e2e8f0";

function RevenueChart() {
  const w = 560;
  const h = 280;
  const pad = { l: 8, r: 8, t: 20, b: 26 };
  const bw = (w - pad.l - pad.r) / REV.length;
  const max = 40000;
  const y = (v: number) => h - pad.b - (v / max) * (h - pad.t - pad.b);
  const m = (i: number) => h - pad.b - (OI[i] / REV[i] / 0.45) * (h - pad.t - pad.b);
  const cx = (i: number) => pad.l + i * bw + bw / 2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full" role="img" aria-label="Google Cloud quarterly revenue rising from $12.3B in Q1 2025 to $30.7B in Q3 2026, with a $36.2B Q4 forecast; operating margin rising from 17.8% to 36.2%, then 35.5% forecast">
      <defs>
        <pattern id="pv-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1d4ed8" strokeWidth="2" />
        </pattern>
      </defs>
      {[10000, 20000, 30000, 40000].map((g) => (
        <line key={g} x1={pad.l} x2={w - pad.r} y1={y(g)} y2={y(g)} stroke={GRID} />
      ))}
      {REV.map((v, i) => {
        const x = pad.l + i * bw + bw * 0.18;
        const forecast = i === REV.length - 1;
        return (
          <g key={Q[i]}>
            <rect x={x} y={y(v)} width={bw * 0.64} height={y(0) - y(v)} rx="3" fill={forecast ? "url(#pv-hatch)" : "#1d4ed8"} fillOpacity={forecast ? 1 : 0.35 + i * 0.09} stroke={forecast ? "#1d4ed8" : "none"} strokeWidth="1.5" />
            <text x={cx(i)} y={h - 8} fontSize="10" textAnchor="middle" fill={INK} fontFamily="var(--font-jetbrains)">
              {Q[i]}
            </text>
          </g>
        );
      })}
      <polyline points={REV.map((_, i) => `${cx(i)},${m(i)}`).join(" ")} fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" />
      {REV.map((_, i) => (
        <circle key={i} cx={cx(i)} cy={m(i)} r="3.2" fill="#d97706" />
      ))}
      <text x={cx(0)} y={m(0) - 10} fontSize="11" fontWeight="600" fill="#b45309">
        17.8%
      </text>
      <text x={cx(6)} y={m(6) - 10} fontSize="11" fontWeight="600" fill="#b45309" textAnchor="middle">
        36.2%
      </text>
    </svg>
  );
}

function StockChart() {
  const w = 560;
  const h = 280;
  const pad = { l: 8, r: 44, t: 16, b: 24 };
  const a = aaplMonthly.map((v) => v / aaplMonthly[0]);
  const s = spyMonthly.map((v) => v / spyMonthly[0]);
  const lo = Math.log10(0.5);
  const hi = Math.log10(Math.max(...a) * 1.15);
  const x = (i: number) => pad.l + (i * (w - pad.l - pad.r)) / (a.length - 1);
  const y = (v: number) => h - pad.b - ((Math.log10(v) - lo) / (hi - lo)) * (h - pad.t - pad.b);
  const line = (arr: number[]) => arr.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = a.length - 1;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full" role="img" aria-label={`Growth of one dollar from January 2005 to October 2026: Apple about ${Math.round(a[last])} times, the S&P 500 about ${s[last].toFixed(1)} times`}>
      <defs>
        <linearGradient id="pv-aapl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d97706" stopOpacity="0.28" />
          <stop offset="1" stopColor="#d97706" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[1, 10, 100].map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={w - pad.r + 4} y1={y(g)} y2={y(g)} stroke={GRID} />
          <text x={w - pad.r + 8} y={y(g) + 4} fontSize="10" fill={INK} fontFamily="var(--font-jetbrains)">{`${g}×`}</text>
        </g>
      ))}
      <polygon points={`${x(0)},${h - pad.b} ${line(a)} ${x(last)},${h - pad.b}`} fill="url(#pv-aapl)" />
      <polyline points={line(s)} fill="none" stroke="#64748b" strokeWidth="1.6" />
      <polyline points={line(a)} fill="none" stroke="#d97706" strokeWidth="2" strokeLinejoin="round" />
      <text x={x(last) - 4} y={y(a[last]) - 8} fontSize="11.5" fontWeight="700" fill="#b45309" textAnchor="end">{`Apple ×${Math.round(a[last])}`}</text>
      <text x={x(last) - 4} y={y(s[last]) - 8} fontSize="11.5" fontWeight="600" fill="#475569" textAnchor="end">{`S&P 500 ×${s[last].toFixed(1)}`}</text>
      <text x={pad.l} y={h - 6} fontSize="10" fill={INK} fontFamily="var(--font-jetbrains)">2005</text>
      <text x={x(last)} y={h - 6} fontSize="10" fill={INK} fontFamily="var(--font-jetbrains)" textAnchor="end">2026</text>
    </svg>
  );
}

const H1B_COLORS = ["#1d4ed8", "#d97706", "#059669"];
const H1B_NAMES = ["Tech", "Finance", "Health care"];

function H1BChart() {
  const { years, series } = h1bFigure;
  const w = 560;
  const h = 280;
  const pad = { l: 8, r: 120, t: 16, b: 24 };
  const x = (i: number) => pad.l + (i * (w - pad.l - pad.r)) / (years.length - 1);
  const y = (v: number) => h - pad.b - (v / 0.06) * (h - pad.t - pad.b);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full" role="img" aria-label="H-1B share of employment, 2015 to 2024: Tech rose from about 4% to 5.4%, Finance and Insurance from about 1% to 2.1%, Health Care stayed near 0.2%">
      {[0, 0.02, 0.04, 0.06].map((g) => (
        <line key={g} x1={pad.l} x2={x(years.length - 1)} y1={y(g)} y2={y(g)} stroke={GRID} />
      ))}
      {series.map((s, k) => {
        const last = s.values.length - 1;
        return (
          <g key={s.name}>
            <polyline points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" stroke={H1B_COLORS[k]} strokeWidth="2.6" strokeLinejoin="round" />
            <circle cx={x(last)} cy={y(s.values[last])} r="4" fill={H1B_COLORS[k]} />
            <text x={x(last) + 9} y={y(s.values[last]) + 4} fontSize="12" fontWeight="600" fill={H1B_COLORS[k]}>
              {`${H1B_NAMES[k] ?? s.name} ${(s.values[last] * 100).toFixed(1)}%`}
            </text>
          </g>
        );
      })}
      <text x={pad.l} y={h - 6} fontSize="10" fill={INK} fontFamily="var(--font-jetbrains)">{years[0]}</text>
      <text x={x(years.length - 1)} y={h - 6} fontSize="10" fill={INK} fontFamily="var(--font-jetbrains)" textAnchor="end">{years[years.length - 1]}</text>
    </svg>
  );
}

/** Library photo with the app on top: both sit in the same grid cell (no absolute positioning). */
function StacksPicture() {
  return (
    <div className="grid aspect-[16/10] overflow-hidden rounded-xl">
      <Image
        src="/projects/mlk-library.jpg"
        alt="The Dr. Martin Luther King Jr. Library on Fourth Street, San José"
        width={1600}
        height={960}
        sizes="(max-width: 768px) 92vw, 640px"
        className="col-start-1 row-start-1 h-full w-full object-cover object-left"
      />
      <div className="col-start-1 row-start-1 flex items-center justify-end p-3 sm:p-4">
        <div className="aspect-[9/16] w-[34%] max-w-[170px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_40px_-16px_rgba(0,0,0,0.75)] ring-1 ring-black/10">
          <Image src="/projects/stacks-report.png" alt="The app's report form on a phone, with the shelf location filled in from the QR code" width={780} height={2480} sizes="170px" className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}

function YouthPicture() {
  return (
    <Image
      src="/projects/youth-unemployment-graph.png"
      alt="Line chart of the U.S. youth unemployment rate from 1991 to 2024, with spikes during the 2008 and 2020 recessions"
      width={1320}
      height={513}
      sizes="(max-width: 768px) 92vw, 640px"
      className="h-auto w-full"
    />
  );
}

export default function ProjectVisual({ slug }: { slug: string }) {
  switch (slug) {
    case "google-cloud-fpna-model":
      return <RevenueChart />;
    case "stacks-reporting-system":
      return <StacksPicture />;
    case "equity-ensemble-trading-model":
      return <StockChart />;
    case "h1b-wages":
      return <H1BChart />;
    case "youth-employment-econometrics":
      return <YouthPicture />;
    default:
      return null;
  }
}

/** Legend under a chart, where one is needed. */
export function visualLegend(slug: string): { label: string; color: string; dashed?: boolean }[] {
  if (slug === "google-cloud-fpna-model")
    return [
      { label: "Revenue", color: "#1d4ed8" },
      { label: "Q4 forecast", color: "#1d4ed8", dashed: true },
      { label: "Operating margin", color: "#d97706" },
    ];
  if (slug === "equity-ensemble-trading-model")
    return [
      { label: "Apple (AAPL)", color: "#d97706" },
      { label: "S&P 500 (SPY)", color: "#64748b" },
    ];
  return [];
}
