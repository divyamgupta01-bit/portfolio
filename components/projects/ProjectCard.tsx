import Link from "next/link";
import { hues } from "@/data/site";
import type { Project } from "@/data/projects";

/**
 * One project, laid out the same way every time so a reader can scan it:
 * what it is, what I did, and what came out of it. Solid background so the sky never
 * shows through the text.
 */
export default function ProjectCard({ p, compact = false }: { p: Project; index?: number; compact?: boolean }) {
  const h = hues[p.hue];
  const rows = compact
    ? [
        { k: "What it is", v: p.card.what },
        { k: "Result", v: p.card.result },
      ]
    : [
        { k: "What it is", v: p.card.what },
        { k: "What I did", v: p.card.did },
        { k: "Result", v: p.card.result },
      ];
  return (
    <li className="h-full">
      <Link
        href={`/projects/${p.slug}`}
        className="solid-card group flex h-full flex-col rounded-3xl p-6 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 md:p-8"
        style={{ "--a": h.a } as React.CSSProperties}
      >
        {/* type and date, in plain words */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium" style={{ background: `color-mix(in oklab, ${h.a} 16%, transparent)`, color: h.a }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: h.a }} aria-hidden />
            {p.card.type}
          </span>
          <span className="text-[13px] text-[var(--fg)]/60">{p.period}</span>
        </div>

        <h3 className="mt-5 text-[clamp(1.35rem,2vw,1.65rem)] font-semibold leading-tight tracking-[-0.02em]">{p.card.name}</h3>

        <dl className="mt-5 space-y-4 border-t border-white/10 pt-5">
          {rows.map((r) => (
            <div key={r.k} className="grid gap-1 sm:grid-cols-[96px_1fr] sm:gap-4">
              <dt className="text-[13px] font-semibold text-[var(--fg)]/55">{r.k}</dt>
              <dd className="max-w-[68ch] text-[15px] leading-relaxed text-[var(--fg)]/88">{r.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-[var(--fg)]/55" aria-label="Tools">
            {p.tools.slice(0, 3).map((t, i) => (
              <li key={t}>
                {i > 0 && <span className="mr-3 opacity-50" aria-hidden>·</span>}
                {t}
              </li>
            ))}
          </ul>
          <span className="text-[14px] font-medium" style={{ color: h.a }}>
            Read the case study <span className="inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}
