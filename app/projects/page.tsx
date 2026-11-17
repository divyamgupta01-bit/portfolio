import type { Metadata } from "next";
import Link from "next/link";
import { coursework, projects } from "@/data/projects";
import { hues, site } from "@/data/site";

export const metadata: Metadata = {
  title: `Projects · ${site.name}`,
  description: "Case studies with the real work behind them: a reporting app with controls built in, and an econometrics paper on H-1B hiring and wages.",
};

const tone = (h: keyof typeof hues) => ({ "--a": hues[h].a, "--b": hues[h].b }) as React.CSSProperties;

export default function ProjectsIndex() {
  return (
    <>
      <header className="wrap pt-32 md:pt-40">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="rise md:col-span-7">
            <p className="mono legible flex items-center gap-2.5">
              <span className="dot" aria-hidden />
              <span className="opacity-80">{"// Projects"}</span>
            </p>
            <h1 className="h2 legible mt-5">
              Projects<span className="accent">.</span>
            </h1>
          </div>
          <p className="rise legible prose-body text-[var(--fg)]/80 md:col-span-5 md:justify-self-end md:text-right" style={{ animationDelay: "80ms" }}>
            The work behind the résumé lines: what the problem was, what I did, the numbers that came out, and the artifact itself.
          </p>
        </div>
      </header>

      {/* ---- case studies ---- */}
      <section aria-labelledby="case-studies" className="wrap mt-16 md:mt-20">
        <SubHead id="case-studies" n="01" label="Case studies" />
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.slug} className="rise" style={{ animationDelay: `${120 + i * 80}ms` }}>
              <Link
                href={`/projects/${p.slug}`}
                className="glass tint group flex h-full flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8"
                style={tone(p.hue)}
              >
                <p className="mono" style={{ color: hues[p.hue].a }}>{`// ${p.type} · ${p.date}`}</p>
                <h2 className="mt-4 text-[clamp(1.5rem,2.4vw,2.1rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{p.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg)]/75">{p.summary}</p>

                <div className="mt-auto pt-8" />
                <dl className="grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3 sm:gap-3">
                  {p.metrics.map((m) => (
                    <div key={m.label} className="flex min-w-0 items-baseline gap-3 sm:block">
                      <dt className="sr-only">{m.label}</dt>
                      <dd className="shrink-0 text-[clamp(1rem,1.5vw,1.3rem)] font-semibold leading-tight tracking-[-0.02em]" style={{ color: hues[p.hue].a }}>
                        {m.value}
                      </dd>
                      <dd className="text-[13px] leading-snug text-[var(--fg)]/60 sm:mt-1.5">{m.label}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mono mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <span>Read the case study</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- coursework ---- */}
      <section aria-labelledby="coursework" className="wrap mt-16 md:mt-20">
        <SubHead id="coursework" n="02" label="Coursework projects" />
        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {coursework.map((c) => (
            <li key={c.title} className="glass tint flex h-full flex-col rounded-3xl p-6 md:p-8" style={tone(c.hue)}>
              <p className="mono" style={{ color: hues[c.hue].a }}>{`// ${c.context} · ${c.date}`}</p>
              <h2 className="mt-4 text-[clamp(1.25rem,1.9vw,1.6rem)] font-semibold leading-tight tracking-[-0.02em]">{c.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg)]/75">{c.summary}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-6" aria-label="Tools">
                {c.tools.map((t) => (
                  <li key={t}>
                    <span className="tag-c" style={{ "--a": hues[c.hue].a } as React.CSSProperties}>
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function SubHead({ id, n, label }: { id: string; n: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 id={id} className="mono legible shrink-0">{`${n} // ${label}`}</h2>
      <span className="h-px flex-1 bg-[var(--line)]" aria-hidden />
    </div>
  );
}
