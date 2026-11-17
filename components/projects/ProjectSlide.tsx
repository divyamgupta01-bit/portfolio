import Link from "next/link";
import type { Project } from "@/data/projects";
import type { Hue } from "@/data/site";
import { hues } from "@/data/site";
import ProjectVisual, { visualLegend } from "./ProjectVisual";

/*
 * One project as a one-page "slide": the finding as the headline, Situation / Approach / Result,
 * a real chart or photo, three numbers and the source.
 *
 * Layout rules: Tailwind only, flex and grid with explicit gaps (no absolute positioning, no
 * negative margins), buttons are inline-flex and centred, and the slide reflows by its own
 * width (container queries), so it works in a narrow side panel as well as a full page.
 */

/** Darker text accents that read well on the light slide. */
const INK: Record<Hue, string> = {
  sky: "#1d4ed8",
  pine: "#047857",
  gold: "#b45309",
  dawn: "#c2410c",
  trail: "#c2410c",
  dusk: "#6d28d9",
};

export default function ProjectSlide({ p, compact = false }: { p: Project; compact?: boolean }) {
  const bright = hues[p.hue].a;
  const ink = INK[p.hue];
  const legend = visualLegend(p.slug);
  const vars = { "--bright": bright, "--ink": ink } as React.CSSProperties;

  const figure = (
    <figure className={`flex min-w-0 flex-col gap-3 self-start rounded-2xl bg-white p-3 ring-1 ring-slate-200 w-full sm:p-4 ${compact ? "" : "order-first @3xl:order-none"}`}>
      <figcaption className="text-[12.5px] font-semibold text-slate-600">{p.slide.figure}</figcaption>
      <ProjectVisual slug={p.slug} />
      {legend.length > 0 && (
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-slate-500" aria-hidden>
          {legend.map((l) => (
            <li key={l.label} className="inline-flex items-center gap-2">
              <span
                className={`inline-flex h-2.5 w-3.5 rounded-[3px] ${l.dashed ? "border-[1.5px] border-dashed" : ""}`}
                style={l.dashed ? { borderColor: l.color } : { background: l.color }}
              />
              {l.label}
            </li>
          ))}
        </ul>
      )}
    </figure>
  );

  return (
    <article className="@container flex h-full flex-col overflow-hidden rounded-3xl bg-[#f7f6f2] text-slate-900 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10" style={vars}>
      {/* title bar: what kind of project, which one, when */}
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-slate-900 px-5 py-3 text-[13px] text-slate-300 @lg:px-7">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-3 py-1 font-medium text-[var(--bright)]">
            <span className="inline-flex size-1.5 rounded-full bg-[var(--bright)]" aria-hidden />
            {p.card.type}
          </span>
          <span className="text-slate-200">{p.card.name}</span>
        </div>
        <span className="tabular-nums">{p.period}</span>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-5 @lg:p-7">
        <h3 className="text-[clamp(1.2rem,1.1rem+0.8vw,1.6rem)] font-bold leading-snug tracking-[-0.02em] text-balance">{p.slide.headline}</h3>

        {compact ? (
          figure
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] @5xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] @5xl:gap-10">
            <dl className="flex flex-col gap-4">
              {[
                ["Situation", p.card.what],
                ["Approach", p.card.did],
                ["Result", p.card.result],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1.5 border-t border-slate-200 pt-4">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.09em] text-[var(--ink)]">{k}</dt>
                  <dd className="text-[14.5px] leading-relaxed text-slate-700 @5xl:text-[15.5px]">{v}</dd>
                </div>
              ))}
            </dl>
            {figure}
          </div>
        )}

        <ul className={`grid grid-cols-1 gap-3 ${compact ? "@md:grid-cols-2" : "@md:grid-cols-3"}`}>
          {p.slide.kpis.slice(0, compact ? 2 : 3).map((k) => (
            <li key={k.label} className="flex flex-col gap-1 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
              <span className="text-[1.3rem] font-bold leading-tight tracking-[-0.02em] tabular-nums">{k.value}</span>
              <span className="text-[12.5px] leading-snug text-slate-500">{k.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 @lg:px-7">
        <p className="min-w-0 flex-1 basis-56 text-[12px] leading-snug text-slate-500">Source: {p.slide.source}</p>
        <Link
          href={`/projects/${p.slug}`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[var(--ink)]"
          aria-label={`Read the case study: ${p.card.name}`}
        >
          Read the case study
          <span aria-hidden>→</span>
        </Link>
      </footer>
    </article>
  );
}
