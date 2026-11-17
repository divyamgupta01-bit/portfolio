import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { hues, site } from "@/data/site";
import { artifacts } from "@/components/projects/Artifacts";
import ProjectsNav from "@/components/projects/ProjectsNav";

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
      <ProjectsNav current="project" />
      <main id="main" className="relative z-10 pb-24">
        <article className="wrap pt-[6vh] md:pt-[9vh]">
          <p className="mono legible">
            <Link href="/projects" className="dim hover:text-[var(--fg)]">← All projects</Link>
          </p>
          <p className="mono mt-8" style={{ color: h.a }}>{`// ${p.kind}`}</p>
          <h1 className="legible mt-4 max-w-[22ch] text-[clamp(2.25rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.035em]">{p.title}</h1>
          <p className="legible mt-6 max-w-[40ch] text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug tracking-[-0.015em] text-[var(--fg)]/85">{p.hook}</p>

          <dl className="mono mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-[var(--line)] py-5 md:grid-cols-4">
            {[
              ["Context", p.context],
              ["When", p.period],
              ["Tools", p.tools.slice(0, 3).join(" · ")],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="dim">{k}</dt>
                <dd className="mt-1 normal-case tracking-normal text-[14px] text-[var(--fg)]">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="dim">Links</dt>
              <dd className="mt-1 flex flex-col gap-1 normal-case tracking-normal text-[14px]">
                <a href={p.repo} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: h.a }}>{p.repoLabel} ↗</a>
                {p.extraLinks?.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" style={{ color: h.a }}>{l.label} ↗</a>
                ))}
              </dd>
            </div>
          </dl>

          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {p.stats.map((s) => (
              <li key={s.label} className="glass tint rounded-2xl p-4 md:p-5" style={{ "--a": h.a, "--b": "transparent" } as React.CSSProperties}>
                <p className="text-[clamp(1.35rem,2.6vw,2rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums" style={{ color: h.a }}>{s.value}</p>
                <p className="mono dim mt-2 normal-case tracking-normal">{s.label}</p>
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
      </main>
    </>
  );
}
