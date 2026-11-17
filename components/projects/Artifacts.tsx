import Image from "next/image";

/* Project artifacts: charts and tables drawn from each project's real numbers.
   All data below is copied from the project workbook / README / paper. */

const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

function Figure({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <figure className="glass min-w-0 rounded-3xl p-5 md:p-8">
      <figcaption className="mono mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="text-[var(--fg)]">{title}</span>
        {note && <span className="dim normal-case tracking-normal">{note}</span>}
      </figcaption>
      {children}
    </figure>
  );
}

/* ───────────── Google Cloud ───────────── */

const Q = ["Q1 25", "Q2 25", "Q3 25", "Q4 25", "Q1 26", "Q2 26", "Q3 26", "Q4 26F"];
const REV = [12260, 13624, 15157, 17664, 20028, 24768, 30709, 36237];
const OI = [2177, 2826, 3594, 5313, 6598, 8814, 11121, 12855];

function TrendChart() {
  const W = 760, H = 330, L = 52, R = 52, T = 24, B = 40;
  const iw = W - L - R, ih = H - T - B;
  const step = iw / Q.length, bw = step * 0.56;
  const yRev = (v: number) => T + ih - (v / 40000) * ih;
  const margins = REV.map((r, i) => OI[i] / r);
  const yM = (m: number) => T + ih - ((m - 0.1) / 0.3) * ih; // 10%–40%
  const line = margins.map((m, i) => `${i ? "L" : "M"}${L + step * i + step / 2},${yM(m)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Google Cloud quarterly revenue bars and operating margin line, Q1 2025 to Q4 2026 forecast">
      {[0, 10000, 20000, 30000, 40000].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={yRev(v)} y2={yRev(v)} stroke="var(--line)" strokeWidth="1" />
          <text x={L - 8} y={yRev(v) + 4} textAnchor="end" className="fill-[var(--fg-dim)]" fontSize="11">{v / 1000}B</text>
        </g>
      ))}
      {[0.1, 0.2, 0.3, 0.4].map((m) => (
        <text key={m} x={W - R + 8} y={yM(m) + 4} className="fill-[#4fd1c5]" fontSize="11">{Math.round(m * 100)}%</text>
      ))}
      {REV.map((r, i) => {
        const x = L + step * i + (step - bw) / 2;
        const f = i === REV.length - 1;
        return (
          <g key={Q[i]}>
            <rect x={x} y={yRev(r)} width={bw} height={yRev(0) - yRev(r)} rx="3" fill={f ? "none" : "#38bdf8"} fillOpacity={f ? 1 : 0.8} stroke="#38bdf8" strokeDasharray={f ? "5 4" : undefined} strokeWidth={f ? 1.5 : 0} />
            <text x={x + bw / 2} y={yRev(r) + 20} textAnchor="middle" className="fill-[#0b0d0e]" fontSize="11" fontWeight="600" style={f ? { fill: "#38bdf8" } : undefined}>{(r / 1000).toFixed(1)}</text>
            <text x={x + bw / 2} y={H - 16} textAnchor="middle" className="fill-[var(--fg-dim)]" fontSize="11">{Q[i]}</text>
          </g>
        );
      })}
      <path d={line} fill="none" stroke="#4fd1c5" strokeWidth="2.5" strokeLinejoin="round" />
      {margins.map((m, i) => (
        <g key={i}>
          <circle cx={L + step * i + step / 2} cy={yM(m)} r="3.5" fill="#0b0d0e" stroke="#4fd1c5" strokeWidth="2" />
          {(i === 0 || i === 6 || i === 7) && (
            <text x={L + step * i + step / 2} y={yM(m) - 11} textAnchor="middle" className="fill-[#4fd1c5]" fontSize="11" fontWeight="600">{(m * 100).toFixed(1)}%</text>
          )}
        </g>
      ))}
    </svg>
  );
}

const SCEN = [
  { name: "Downside", growth: "10%", rev: 33780, oi: 10079, m: "29.8%", prem: "4.0%", c: "#ff6a2b" },
  { name: "Base", growth: "18%", rev: 36237, oi: 12855, m: "35.5%", prem: "2.5%", c: "#38bdf8" },
  { name: "Upside", growth: "25%", rev: 38386, oi: 14922, m: "38.9%", prem: "1.5%", c: "#34d399" },
];

function Scenarios() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {SCEN.map((s) => (
        <div key={s.name} className="rounded-2xl border border-[var(--line)] p-5" style={{ borderTopColor: s.c, borderTopWidth: 2 }}>
          <p className="mono" style={{ color: s.c }}>{s.name}</p>
          <p className="mt-3 text-[34px] font-semibold leading-none tracking-[-0.03em]">{s.m}</p>
          <p className="mono dim mt-1">operating margin</p>
          <dl className="mt-5 space-y-2 text-[15px]">
            {[
              ["Sequential growth", s.growth],
              ["Capacity premium", `${s.prem} of rev`],
              ["Q4 revenue", `$${fmt(s.rev)}M`],
              ["Q4 operating income", `$${fmt(s.oi)}M`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-t border-[var(--line)] pt-2">
                <dt className="text-[var(--fg-dim)]">{k}</dt>
                <dd className="tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

function Bridge() {
  const rows = [
    { label: "Revenue growth", v: 15552, c: "#38bdf8", sign: "+" },
    { label: "Implied cost growth", v: -8025, c: "#ff6a2b", sign: "−" },
    { label: "Operating income change", v: 7527, c: "#34d399", sign: "+" },
  ];
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 md:grid-cols-[220px_1fr_90px]">
          <p className="text-[15px] text-[var(--fg)]/80">{r.label}</p>
          <p className="tabular-nums text-right text-[15px] md:order-3">{r.sign}${fmt(Math.abs(r.v))}M</p>
          <div className="col-span-2 h-4 rounded-full bg-[var(--line)] md:col-span-1">
            <div className="h-4 rounded-full" style={{ width: `${(Math.abs(r.v) / 15552) * 100}%`, background: r.c }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const GROWTH = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4];
const MARGIN = [0.24, 0.27, 0.3, 0.33, 0.36, 0.39, 0.42];
function Sensitivity() {
  const oi = (g: number, m: number) => 30709 * (1 + g) * m;
  const lo = oi(0.05, 0.24), hi = oi(0.4, 0.42);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-separate border-spacing-1 text-center text-[13px] tabular-nums">
        <thead>
          <tr>
            <th className="mono dim text-left font-normal">QoQ growth ↓ / margin →</th>
            {MARGIN.map((m) => (
              <th key={m} className="mono font-normal">{Math.round(m * 100)}%</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GROWTH.map((g) => (
            <tr key={g}>
              <th className="mono text-left font-normal">{Math.round(g * 100)}%</th>
              {MARGIN.map((m) => {
                const v = oi(g, m);
                const t = (v - lo) / (hi - lo);
                return (
                  <td key={m} className="rounded-md py-2" style={{ background: `color-mix(in oklab, #38bdf8 ${Math.round(12 + t * 58)}%, transparent)` }}>
                    {(v / 1000).toFixed(1)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CloudArtifacts() {
  return (
    <div className="space-y-6">
      <Figure title="Revenue ($B) and operating margin" note="Seven reported quarters plus the base-case Q4 forecast (dashed)">
        <TrendChart />
      </Figure>
      <Figure title="Q4 2026 scenarios" note="Switch with one cell: ASSUMPTIONS!B7">
        <Scenarios />
      </Figure>
      <div className="grid gap-6 lg:grid-cols-2">
        <Figure title="Q3 YoY bridge" note="Accounting identity, not causal analysis">
          <Bridge />
        </Figure>
        <Figure title="Q4 operating income sensitivity ($B)" note="Growth × margin, from the SENSITIVITY tab">
          <Sensitivity />
        </Figure>
      </div>
    </div>
  );
}

/* ───────────── Equity ensemble ───────────── */

function VoteFlow() {
  const signals = [
    { t: "Moving-average rule", d: "1 if the S&P 500 is above its average" },
    { t: "VIX futures VRP", d: "1 if the VRP reading is positive" },
    { t: "S&P 500 RSI", d: "1 if momentum is positive" },
    { t: "Apple RSI (my addition)", d: "1 if Apple momentum is positive", me: true },
  ];
  return (
    <div className="grid items-center gap-4 md:grid-cols-[1.3fr_auto_1fr]">
      <ul className="space-y-2">
        {signals.map((s) => (
          <li key={s.t} className="rounded-xl border px-4 py-3" style={{ borderColor: s.me ? "#fbbf24" : "var(--line)", background: s.me ? "rgba(251,191,36,0.08)" : undefined }}>
            <p className="text-[15px] font-medium">{s.t}</p>
            <p className="text-[13px] text-[var(--fg-dim)]">{s.d}</p>
          </li>
        ))}
      </ul>
      <p className="mono dim text-center md:rotate-0">Σ votes ≥ 3 ?</p>
      <div className="space-y-2">
        <div className="rounded-xl border border-[#34d399]/60 bg-[#34d399]/10 px-4 py-3">
          <p className="mono" style={{ color: "#34d399" }}>Yes</p>
          <p className="text-[15px]">In the market, earn that day&apos;s return</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] px-4 py-3">
          <p className="mono dim">No</p>
          <p className="text-[15px]">In cash, earn 0%</p>
        </div>
      </div>
    </div>
  );
}

function BiasChart() {
  // log10 scale from the $10,000 start (4) to $1B (9)
  const bars = [
    { label: "Signal used the same day (as built)", v: 180e6, txt: "~$180M", c: "#ff6a2b" },
    { label: "Buy and hold Apple", v: 3.0e6, txt: "~$3.0M", c: "#8b918f" },
    { label: "Signal used the next day (realistic)", v: 0.4e6, txt: "~$0.4M", c: "#fbbf24" },
  ];
  const pct = (v: number) => ((Math.log10(v) - 4) / (9 - 4)) * 100;
  return (
    <div className="space-y-5">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="mb-1.5 flex justify-between gap-3 text-[15px]">
            <span>{b.label}</span>
            <span className="tabular-nums font-semibold" style={{ color: b.c }}>{b.txt}</span>
          </div>
          <div className="h-4 rounded-full bg-[var(--line)]">
            <div className="h-4 rounded-full" style={{ width: `${pct(b.v)}%`, background: b.c }} />
          </div>
        </div>
      ))}
      <p className="mono dim normal-case tracking-normal">Log scale, from the $10,000 starting value in January 2005. Apple-only curve.</p>
    </div>
  );
}

function Drawdown() {
  const rows = [
    { a: "50 / 50", d: 20 },
    { a: "80 / 20", d: 13 },
    { a: "90 / 10", d: 11, best: true },
  ];
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.a}>
          <div className="mb-1.5 flex justify-between text-[15px]">
            <span>S&amp;P / Apple {r.a}</span>
            <span className="tabular-nums" style={{ color: r.best ? "#fbbf24" : undefined }}>−{r.d}%</span>
          </div>
          <div className="h-3 rounded-full bg-[var(--line)]">
            <div className="h-3 rounded-full" style={{ width: `${(r.d / 20) * 100}%`, background: r.best ? "#fbbf24" : "#8b918f" }} />
          </div>
        </div>
      ))}
      <p className="mono dim normal-case tracking-normal">Worst drawdown, RSI smoothing = 1, before the timing fix.</p>
    </div>
  );
}

export function EquityArtifacts() {
  return (
    <div className="space-y-6">
      <Figure title="How the ensemble decides" note="Evaluated every trading day, 5,462 days">
        <VoteFlow />
      </Figure>
      <div className="grid gap-6 lg:grid-cols-2">
        <Figure title="Parameter search result" note="143 combinations tested">
          <Drawdown />
        </Figure>
        <Figure title="Same strategy, realistic timing" note="This is the finding">
          <BiasChart />
        </Figure>
      </div>
      <Figure title="The formulas that matter" note="Row 3 of the model sheet">
        <pre className="mono overflow-x-auto whitespace-pre-wrap text-[12px] leading-7 tracking-normal text-[var(--fg)]/85" style={{ textTransform: "none" }}>
{`Apple price     =IFERROR(INDEX(AAPL_Data!$B:$B, MATCH($A3, AAPL_Data!$A:$A, 0)), E2)
Apple vote      =IF('VRP5'!AC3>0, 1, 0)
Total votes     =SUM(L3, N3, O3, P3)
Apple return    =IFERROR(V3/V2-1, 0)`}
        </pre>
      </Figure>
    </div>
  );
}

/* ───────────── Youth employment ───────────── */

const REG = [
  { v: "Constant", a: "91.13***", b: "91.35***" },
  { v: "GDP growth", a: "0.782**", b: "0.769**", hi: true },
  { v: "ln(imports)", a: "2.091", b: "" },
  { v: "ln(exports)", a: "−8.004", b: "" },
  { v: "ln(trade volume)", a: "", b: "−4.509**", hi: true },
  { v: "Real minimum wage", a: "−0.244", b: "−0.884" },
  { v: "R²", a: "0.735", b: "0.724" },
  { v: "Observations", a: "34", b: "34" },
];

export function YouthArtifacts() {
  return (
    <div className="space-y-6">
      <Figure title="The series: U.S. youth unemployment rate, 1991–2024" note="Graph 1 from the paper · Source: World Bank via FRED">
        <div className="overflow-hidden rounded-xl bg-white">
          <Image src="/projects/youth-unemployment-graph.png" alt="Line chart of the U.S. youth unemployment rate from 1991 to 2024, with spikes during the 2008 and 2020 recessions" width={1320} height={513} className="h-auto w-full" />
        </div>
      </Figure>
      <Figure title="Regression results" note="Dependent variable: youth employment rate (%) · Model 1 = separate imports and exports, Model 2 = combined trade volume · ** p<0.01, *** p<0.001">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[15px] tabular-nums">
            <thead>
              <tr className="mono border-b border-[var(--line)]">
                <th className="py-2 font-normal">Variable</th>
                <th className="py-2 text-right font-normal">Model 1</th>
                <th className="py-2 text-right font-normal">Model 2</th>
              </tr>
            </thead>
            <tbody>
              {REG.map((r) => (
                <tr key={r.v} className="border-b border-[var(--line)]/60" style={r.hi ? { background: "rgba(255,138,91,0.08)" } : undefined}>
                  <td className="py-2.5 pr-3">{r.v}</td>
                  <td className="py-2.5 text-right">{r.a || "—"}</td>
                  <td className="py-2.5 text-right">{r.b || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 max-w-[62ch] text-[15px] text-[var(--fg)]/75">
          Why two models? Imports and exports move together, so in Model 1 neither is individually significant. Merging them into one
          log trade-volume variable removes the overlap and gives a clear, significant estimate, at the cost of hiding which side drives it.
        </p>
      </Figure>
      <Figure title="The model" note="Estimated by OLS in R">
        <pre className="mono overflow-x-auto text-[12px] leading-7 tracking-normal text-[var(--fg)]/85" style={{ textTransform: "none" }}>
{`youthemp = β0 + β1·GDPgrowth + β2·ln(import) + β3·ln(export) + β4·realminwage + ε`}
        </pre>
      </Figure>
    </div>
  );
}

/* ───────────── Stacks reporting system ───────────── */

const SHOTS = [
  { src: "/projects/stacks-report.png", alt: "Report form on a phone", cap: "1 · Scan and report", body: "Scanning a shelf QR code opens the form with the location already filled in." },
  { src: "/projects/stacks-queue.png", alt: "Task queue on a phone", cap: "2 · Triage", body: "Open work sorted by severity, with one-tap filters for unassigned, high severity and overdue." },
  { src: "/projects/stacks-task.png", alt: "Task detail on a phone", cap: "3 · Track", body: "Every change is written to the task's activity timeline; staff assign, update and resolve here." },
  { src: "/projects/stacks-dashboard.png", alt: "Supervisor dashboard on a phone", cap: "4 · Oversee", body: "Supervisors see what is open, overdue, high severity or unassigned, with each tile linking to the list behind it." },
];

const STATES = ["New", "Waiting", "Assigned", "In Progress", "Resolved", "Closed"];

export function StacksArtifacts() {
  return (
    <div className="space-y-6">
      <Figure title="The app, on a phone" note="Demo build: fictional people and locations only">
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {SHOTS.map((s) => (
            <div key={s.src} className="flex flex-col">
              <div className="relative mx-auto h-[420px] w-full max-w-[230px] overflow-hidden rounded-[26px] border border-[var(--line-strong)] bg-[#f4f6fa] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
                <Image src={s.src} alt={s.alt} width={780} height={2480} className="h-auto w-full" sizes="230px" />
              </div>
              <p className="mono mt-5" style={{ color: "#34d399" }}>{s.cap}</p>
              <p className="mt-1.5 text-[15px] leading-snug text-[var(--fg)]/75">{s.body}</p>
            </div>
          ))}
        </div>
      </Figure>
      <Figure title="Task lifecycle" note="Cancelled and merged-duplicate tasks branch off at any point">
        <ol className="flex flex-wrap items-center gap-2">
          {STATES.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="mono rounded-full border border-[var(--line-strong)] px-3.5 py-1.5">{s}</span>
              {i < STATES.length - 1 && <span className="dim" aria-hidden>→</span>}
            </li>
          ))}
        </ol>
      </Figure>
    </div>
  );
}

export const artifacts: Record<string, () => React.ReactElement> = {
  "google-cloud-fpna-model": CloudArtifacts,
  "stacks-reporting-system": StacksArtifacts,
  "equity-ensemble-trading-model": EquityArtifacts,
  "youth-employment-econometrics": YouthArtifacts,
};
