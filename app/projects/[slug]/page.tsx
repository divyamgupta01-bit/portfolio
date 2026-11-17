import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { hues, site } from "@/data/site";
import { artifacts } from "@/components/projects/Artifacts";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.short} // ${site.name}`, description: `${p.hook} ${p.summary}` };
}

function Section({ n, block, accent }: { n: string; block: { title: string; body: string[] }; accent: string }) {
  return (
    <section className="grid gap-5 border-t border-[var(--line)] py-12 md:grid-cols-12 md:gap-10 md:py-16">
      <h2 className="md:col-span-4">
        <span className="mono block" style={{ color: accent }}>{`// ${n}`}</span>
        <span className="mt-3 block text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] md:text-[34px]">{block.title}</span>
      </h2>
      <div className="space-y-5 md:col-span-8">
        {block.body.map((t, i) => (
          <p key={i} className="max-w-[64ch] text-[17px] leading-[1.65] text-[var(--fg)]/85 md:text-[18px]">{t}</p>
        ))}
      </div>
    </section>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const h = hues[p.hue];
  const Artifact = artifacts[p.slug];
  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <div>
        <article className="wrap pt-28 md:pt-36">
          <p className="mono legible">
            <Link href="/projects" className="dim hover:text-[var(--fg)]">← All projects</Link>
          </p>
          <p className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium" style={{ background: `color-mix(in oklab, ${h.a} 16%, transparent)`, color: h.a }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: h.a }} aria-hidden />
              {p.card.type}
            </span>
            <span className="text-[13px] text-[var(--fg)]/60">{p.period}</span>
          </p>
          <h1 className="legible mt-4 max-w-[22ch] text-[clamp(2.25rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.035em]">{p.title}</h1>
          <p className="legible mt-6 max-w-[40ch] text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug tracking-[-0.015em] text-[var(--fg)]/85">{p.hook}</p>

          {/* at a glance: the same three questions as the project cards */}
          <dl className="solid-card mt-10 grid gap-6 rounded-3xl p-6 md:grid-cols-3 md:gap-8 md:p-8" style={{ "--a": h.a } as React.CSSProperties}>
            {[
              ["What it is", p.card.what],
              ["What I did", p.card.did],
              ["Result", p.card.result],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[13px] font-semibold" style={{ color: h.a }}>{k}</dt>
                <dd className="mt-2 text-[15.5px] leading-relaxed text-[var(--fg)]/90">{v}</dd>
              </div>
            ))}
          </dl>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-[var(--line)] py-6 md:grid-cols-4">
            {[
              ["Context", p.context],
              ["When", p.period],
              ["Tools", p.tools.slice(0, 3).join(" · ")],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[13px] font-semibold text-[var(--fg)]/55">{k}</dt>
                <dd className="mt-1.5 text-[14.5px] text-[var(--fg)]">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="text-[13px] font-semibold text-[var(--fg)]/55">Links</dt>
              <dd className="mt-1.5 flex flex-col gap-1 text-[14.5px]">
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: h.a }}>{p.repoLabel} ↗</a>
                {p.extraLinks?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: h.a }}>{l.label} ↗</a>
                ))}
              </dd>
            </div>
          </dl>

          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {p.stats.map((s) => (
              <li key={s.label} className="solid-card rounded-2xl p-4 md:p-5" style={{ "--a": h.a } as React.CSSProperties}>
                <p className="text-[clamp(1.35rem,2.6vw,2rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums" style={{ color: h.a }}>{s.value}</p>
                <p className="mt-2 text-[13.5px] leading-snug text-[var(--fg)]/65">{s.label}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 md:mt-16">
            <Section n="01" block={p.question} accent={h.a} />
            <Section n="02" block={p.approach} accent={h.a} />
          </div>

          <div className="py-6 md:py-10">
            <p className="mono mb-6" style={{ color: h.a }}>{`// The work`}</p>
            <Artifact />
          </div>

          <Section n="03" block={p.finding} accent={h.a} />
          <Section n="04" block={p.limits} accent={h.a} />

          <section className="grid gap-5 border-t border-[var(--line)] py-12 md:grid-cols-12 md:gap-10 md:py-16">
            <h2 className="md:col-span-4">
              <span className="mono block" style={{ color: h.a }}>{`// 05`}</span>
              <span className="mt-3 block text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] md:text-[34px]">What&apos;s next</span>
            </h2>
            <ul className="space-y-4 md:col-span-8">
              {p.next.map((t) => (
                <li key={t} className="flex max-w-[64ch] gap-3 text-[17px] leading-[1.6] text-[var(--fg)]/85 md:text-[18px]">
                  <span className="accent" aria-hidden>→</span>
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label="Next project" className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-[var(--line)] pt-10">
            <Link href="/projects" className="mono dim hover:text-[var(--fg)]">← All projects</Link>
            <Link href={`/projects/${next.slug}`} className="text-right">
              <span className="mono dim block">Next project</span>
              <span className="mt-1 block text-[24px] font-semibold tracking-[-0.02em] md:text-[32px]">{next.short} →</span>
            </Link>
          </nav>
        </article>
      </div>
    </>
  );
}
