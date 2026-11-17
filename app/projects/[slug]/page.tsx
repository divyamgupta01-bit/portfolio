import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import H1BChart from "@/components/H1BChart";
import { getProject, projects, type Block, type Project } from "@/data/projects";
import { hues, site } from "@/data/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return { title: `${p.title} · ${site.name}`, description: p.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const c = hues[p.hue];
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];

  return (
    <article style={{ "--a": c.a, "--b": c.b, "--accent": c.a } as React.CSSProperties}>
      {/* ---- header ---- */}
      <header className="wrap pt-28 md:pt-36">
        <Link href="/projects" className="mono dim rise inline-flex items-center gap-2 hover:text-[var(--fg)]">
          <span aria-hidden>←</span> All projects
        </Link>
        <p className="mono rise mt-10" style={{ color: c.a, animationDelay: "40ms" }}>{`// ${p.type} · ${p.date}`}</p>
        <h1
          className="legible rise mt-4 max-w-[22ch] text-[clamp(2.3rem,5.4vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
          style={{ animationDelay: "80ms" }}
        >
          {p.title}
        </h1>
        <p className="legible rise mt-5 max-w-[60ch] text-[clamp(1.05rem,1.5vw,1.25rem)] text-[var(--fg)]/75" style={{ animationDelay: "120ms" }}>
          {p.subtitle}
        </p>
        {p.links.length > 0 && (
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "160ms" }}>
            {p.links.map((l, k) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`mono rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.1em] ${k === 0 ? "text-[#0b0d0e]" : "glass"}`}
                style={k === 0 ? { background: c.a } : undefined}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}

        {/* facts: four equal columns on laptops, two on phones */}
        <dl className="rise mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-6 md:grid-cols-4" style={{ animationDelay: "200ms" }}>
          {p.facts.map((f) => (
            <div key={f.label}>
              <dt className="mono dim">{f.label}</dt>
              <dd className="mt-2 text-[14.5px] leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="rise mt-6 flex flex-wrap gap-2" aria-label="Tools" style={{ animationDelay: "220ms" }}>
          {p.tools.map((t) => (
            <li key={t}>
              <span className="tag-c" style={{ "--a": c.a } as React.CSSProperties}>
                {t}
              </span>
            </li>
          ))}
        </ul>
      </header>

      {/* ---- headline numbers ---- */}
      <section aria-label="Results at a glance" className="wrap mt-14">
        <ul className="grid gap-4 md:grid-cols-3">
          {p.metrics.map((m) => (
            <li key={m.label} className="glass tint rise rounded-3xl p-6 md:p-7" style={{ animationDelay: "260ms" }}>
              <p className="text-[clamp(1.8rem,3.2vw,2.8rem)] font-semibold leading-none tracking-[-0.04em]" style={{ color: c.a }}>
                {m.value}
              </p>
              <p className="mt-3 text-[14px] leading-snug text-[var(--fg)]/75">{m.label}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ---- the story, one block per row: label on the left, content on the right ---- */}
      <div className="wrap mt-[12vh] space-y-[10vh]">
        {p.blocks.map((b, k) => (
          <section key={b.title} aria-labelledby={`b-${k}`} className="grid gap-6 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="md:sticky md:top-28">
                <div className="h-px bg-[var(--line)]" aria-hidden />
                <p className="mono dim mt-4">{String(k + 1).padStart(2, "0")}</p>
                <h2 id={`b-${k}`} className="mt-2 text-[clamp(1.25rem,1.9vw,1.6rem)] font-semibold leading-tight tracking-[-0.025em]">
                  {b.title}
                </h2>
              </div>
            </div>
            <div className="min-w-0 md:col-span-8 lg:col-span-9">
              <BlockBody b={b} p={p} />
            </div>
          </section>
        ))}
      </div>

      {/* ---- previous / next ---- */}
      <nav aria-label="More projects" className="wrap mt-[14vh] grid gap-4 md:grid-cols-2">
        <Link href="/projects" className="glass group rounded-3xl p-6 md:p-7">
          <p className="mono dim">← Back</p>
          <p className="mt-3 text-[clamp(1.15rem,1.7vw,1.45rem)] font-semibold leading-tight tracking-[-0.02em]">All projects</p>
        </Link>
        {next !== p && (
          <Link
            href={`/projects/${next.slug}`}
            className="glass tint group rounded-3xl p-6 md:p-7 md:text-right"
            style={{ "--a": hues[next.hue].a, "--b": hues[next.hue].b } as React.CSSProperties}
          >
            <p className="mono dim">Next project →</p>
            <p className="mt-3 text-[clamp(1.15rem,1.7vw,1.45rem)] font-semibold leading-tight tracking-[-0.02em]">{next.title}</p>
          </Link>
        )}
      </nav>
    </article>
  );
}

function BlockBody({ b, p }: { b: Block; p: Project }) {
  const c = hues[p.hue];
  switch (b.kind) {
    case "text":
      return (
        <div className="max-w-[68ch] space-y-4 text-[16px] leading-relaxed text-[var(--fg)]/85">
          {b.body.map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      );
    case "list":
      return (
        <ul className="max-w-[68ch] space-y-3">
          {b.items.map((t) => (
            <li key={t} className="flex gap-3 text-[16px] leading-relaxed text-[var(--fg)]/85">
              <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.a, boxShadow: `0 0 10px ${c.a}` }} aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <div>
          {b.intro && <p className="max-w-[68ch] text-[16px] leading-relaxed text-[var(--fg)]/85">{b.intro}</p>}
          <ol className={`grid gap-4 sm:grid-cols-2 ${b.intro ? "mt-6" : ""}`}>
            {b.steps.map((s, k) => (
              <li key={s.title} className="glass rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="mono grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[11px]" style={{ borderColor: c.a, color: c.a }}>
                    {String(k + 1).padStart(2, "0")}
                  </span>
                  <span className="mono dim">{s.label}</span>
                </div>
                <p className="mt-4 text-[16px] font-semibold tracking-[-0.01em]">{s.title}</p>
                <p className="mt-1.5 text-[14px] leading-snug text-[var(--fg)]/72">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      );
    case "equation":
      return (
        <div>
          <p className="glass overflow-x-auto whitespace-nowrap rounded-2xl px-6 py-8 text-center font-serif text-[clamp(1.2rem,2.6vw,1.9rem)] italic" style={{ color: c.a }}>
            <Formula text={b.equation} />
          </p>
          <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {b.notes.map((n) => (
              <div key={n.term} className="border-t border-white/10 pt-4">
                <dt className="font-serif text-[17px] italic" style={{ color: c.a }}>
                  <Formula text={n.term} />
                </dt>
                <dd className="mt-1.5 text-[14.5px] leading-snug text-[var(--fg)]/80">{n.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      );
    case "table":
      return (
        <figure>
          {b.caption && <figcaption className="mono dim mb-3">{b.caption}</figcaption>}
          <div className="glass overflow-x-auto rounded-2xl px-4 py-2 md:px-6">
            <table className="w-full border-collapse text-left text-[12px] tabular-nums sm:text-[13.5px]">
              <thead>
                <tr className="border-b border-white/15">
                  {b.columns.map((h, k) => (
                    <th key={h || k} className={`mono dim py-3 pr-2 font-normal sm:pr-4 ${k ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.map((r) => (
                  <tr key={r[0]} className="border-b border-white/[0.07] last:border-0">
                    {r.map((cell, k) => (
                      <td key={k} className={`py-3 pr-2 sm:pr-4 ${k ? "text-right" : "text-[var(--fg)]/80"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.note && <p className="mt-3 max-w-[68ch] text-[14px] leading-snug text-[var(--fg)]/70">{b.note}</p>}
        </figure>
      );
    case "h1b-chart":
      return (
        <div className="glass rounded-2xl p-5 md:p-7">
          <H1BChart />
        </div>
      );
    case "gallery":
      return (
        <div className="grid gap-5 sm:grid-cols-2">
          {b.shots.map((s) => (
            <figure key={s.src}>
              <a href={s.src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl border border-white/12">
                <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 768px) 92vw, 40vw" className="h-auto w-full" />
              </a>
              <figcaption className="mt-2.5 text-[13.5px] leading-snug text-[var(--fg)]/70">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      );
    case "embed":
      return (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </span>
            <span className="mono dim truncate normal-case tracking-normal">{b.url.replace(/^https?:\/\//, "")}</span>
            <a href={b.url} target="_blank" rel="noopener noreferrer" className="mono shrink-0" style={{ color: c.a }}>
              Open ↗
            </a>
          </div>
          <iframe src={b.url} title={b.label} loading="lazy" className="block w-full bg-white" style={{ height: b.height ?? 560 }} />
        </div>
      );
  }
}

/** Write "x_it" as x with a subscript "it" (keeps the data file plain text). */
function Formula({ text }: { text: string }) {
  const parts = text.split(/_([a-z0-9]+)/i);
  return (
    <>
      {parts.map((t, k) => (k % 2 ? <sub key={k} className="text-[0.62em] not-italic">{t}</sub> : <span key={k}>{t}</span>))}
    </>
  );
}
