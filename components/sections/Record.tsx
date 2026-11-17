"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { reveal } from "@/lib/anim";
import { hues, site } from "@/data/site";
import { Heading, SectionLabel } from "../ui";

/** "On paper": grades, awards, certification, affiliation and leadership, straight from the résumé. */
export default function Record() {
  const root = useRef<HTMLElement>(null);
  const { record } = site;

  useGSAP(
    () => {
      reveal(".rec-intro", ".rec-intro");
      reveal(".rec-card", ".rec-grid", { stagger: 0.08 });
    },
    { scope: root },
  );

  const card = "rec-card glass tint rounded-3xl p-6 md:p-7";
  const tone = (h: keyof typeof hues) => ({ "--a": hues[h].a, "--b": hues[h].b }) as React.CSSProperties;

  return (
    <section id="record" ref={root} aria-labelledby="record-title" className="relative pt-[16vh]">
      <div className="wrap">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel id="record" />
            <Heading id="record-title" className="mt-5">{`${record.title}.`}</Heading>
          </div>
          <p className="rec-intro legible prose-body md:col-span-5 md:justify-self-end md:text-right">{record.intro}</p>
        </div>

        <div className="rec-grid mt-14 grid gap-4 md:grid-cols-12">
          {/* academics */}
          <article className={`${card} md:col-span-5 md:row-span-2`} style={tone("gold")}>
            <p className="mono" style={{ color: hues.gold.a }}>
              {"// Academics"}
            </p>
            <div className="mt-6 flex items-end gap-4">
              <p
                className="text-[clamp(3.2rem,6.5vw,5rem)] font-semibold leading-[0.85] tracking-[-0.05em] tabular-nums"
                style={{ color: hues.gold.a }}
              >
                {record.academics.gpa}
              </p>
              <p className="mono dim pb-2">GPA</p>
            </div>
            <p className="mt-6 text-[16px] font-semibold leading-snug tracking-[-0.01em]">{record.academics.degree}</p>
            <p className="mono dim mt-1">{record.academics.school}</p>

            <p className="mono dim mt-8">{"// Awards"}</p>
            <ul className="mt-3 space-y-2">
              {record.academics.awards.map((a) => (
                <li key={a} className="flex items-center gap-3 text-[14px]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: hues.gold.a, boxShadow: `0 0 10px ${hues.gold.a}` }} />
                  {a}
                </li>
              ))}
            </ul>

            <p className="mono dim mt-8">{"// Relevant coursework"}</p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--fg)]/75">{record.academics.coursework.join(" · ")}</p>
          </article>

          {/* certification */}
          {record.certifications.map((c) => (
            <article key={c.name} className={`${card} md:col-span-3`} style={tone("pine")}>
              <p className="mono" style={{ color: hues.pine.a }}>
                {"// Certification"}
              </p>
              <svg viewBox="0 0 24 24" className="mt-6 h-9 w-9" fill="none" stroke={hues.pine.a} strokeWidth="1.6" aria-hidden>
                <circle cx="12" cy="9" r="5.5" />
                <path d="m9.5 9 1.8 1.8 3.4-3.6M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <h3 className="mt-4 text-[18px] font-semibold leading-tight tracking-[-0.015em]">{c.name}</h3>
              <p className="mono dim mt-2">{c.issuer}</p>
            </article>
          ))}

          {/* affiliation */}
          {record.affiliations.map((a) => (
            <article key={a.name} className={`${card} md:col-span-4`} style={tone("sky")}>
              <p className="mono" style={{ color: hues.sky.a }}>
                {"// Professional body"}
              </p>
              <h3 className="mt-6 text-[18px] font-semibold leading-tight tracking-[-0.015em]">{a.name}</h3>
              <p className="mono dim mt-2">{a.detail}</p>
              <p className="mt-4 text-[13.5px] leading-snug text-[var(--fg)]/75">{a.note}</p>
            </article>
          ))}

          {/* leadership */}
          <article className={`${card} md:col-span-7`} style={tone("dusk")}>
            <p className="mono" style={{ color: hues.dusk.a }}>
              {"// Leadership"}
            </p>
            <ul className="mt-5 divide-y divide-white/10">
              {record.leadership.map((l) => (
                <li key={l.org} className="grid gap-1 py-4 first:pt-0 last:pb-0 md:grid-cols-[1fr_auto] md:gap-x-6">
                  <h3 className="text-[16px] font-semibold leading-tight tracking-[-0.01em]">
                    {l.role}
                    <span className="font-normal text-[var(--fg)]/60">{`, ${l.org}`}</span>
                  </h3>
                  <p className="mono dim md:text-right">{l.period}</p>
                  <p className="text-[13.5px] leading-snug text-[var(--fg)]/75 md:col-span-2 md:mt-1">{l.line}</p>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
