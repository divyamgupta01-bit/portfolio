"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, scrollStore } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { hues } from "@/data/site";
import { h1bFigure, stacksCase } from "@/data/work";
import H1BChart from "../H1BChart";
import Link from "next/link";
import { Arrow, Heading, SectionLabel } from "../ui";

/** Two projects shown in depth: the Stacks Reports case study and a chart from the H-1B paper. */
export default function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      reveal(".work-card", ".work-card", { stagger: 0.1 });
      const reduced = scrollStore.reducedMotion;

      // controls flow: the spine draws down and each step lights up in turn
      const flow = el.querySelector(".ctrl-flow");
      if (flow && !reduced) {
        gsap.from(flow.querySelector(".ctrl-spine"), {
          scaleY: 0,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: {
            trigger: flow,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        });
        gsap.from(flow.querySelectorAll(".ctrl-step"), {
          autoAlpha: 0.15,
          x: -8,
          stagger: 0.25,
          ease: "power2.out",
          scrollTrigger: {
            trigger: flow,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.5,
          },
        });
      }

      // chart: lines draw left to right once it comes into view
      const chart = el.querySelector(".h1b-chart");
      if (chart && !reduced) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: chart, start: "top 80%", once: true },
        });
        tl.fromTo(
          chart.querySelectorAll(".h1b-line"),
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 1.8,
            stagger: 0.25,
            ease: "power2.inOut",
            // the chart resizes with its box, so drop the fixed dash lengths once drawn
            clearProps: "strokeDasharray,strokeDashoffset",
          },
        ).from(
          chart.querySelectorAll(".h1b-end"),
          {
            autoAlpha: 0,
            scale: 0,
            transformOrigin: "50% 50%",
            duration: 0.4,
            stagger: 0.15,
          },
          "-=0.5",
        );
      }
    },
    { scope: root },
  );

  const c = stacksCase;

  return (
    <section
      id="work"
      ref={root}
      aria-labelledby="work-title"
      className="relative pt-[16vh]"
    >
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel id="work" />
            <Heading id="work-title" className="mt-5">
              Selected work.
            </Heading>
          </div>
          <Link href="/projects" className="glass mono arrow-link rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.1em]">
            All projects <Arrow glyph="→" />
          </Link>
        </div>

        {/* ---- case study ---- */}
        <article
          className="work-card glass tint mt-14 rounded-3xl p-6 md:p-10"
          style={
            { "--a": hues.dusk.a, "--b": hues.sky.a } as React.CSSProperties
          }
          aria-labelledby="stacks-title"
        >
          <p
            className="mono"
            style={{ color: hues.dusk.a }}
          >{`// ${c.kicker}`}</p>
          <h3
            id="stacks-title"
            className="mt-3 text-[clamp(1.7rem,3.2vw,2.6rem)] font-semibold leading-[1] tracking-[-0.035em]"
          >
            {c.title}
          </h3>
          <p className="mt-3 text-[15.5px] text-[var(--fg)]/70">{c.subtitle}</p>

          <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="space-y-7 md:col-span-6">
              <Block label="The problem">{c.problem}</Block>
              <Block label="What I built">{c.built}</Block>
              <div>
                <p className="mono dim">{"// Result"}</p>
                <p
                  className="mt-2 text-[19px] font-semibold leading-snug tracking-[-0.015em]"
                  style={{ color: hues.pine.a }}
                >
                  {c.result}
                </p>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Built with">
                {c.stack.map((s) => (
                  <li key={s}>
                    <span
                      className="tag-c"
                      style={{ "--a": hues.dusk.a } as React.CSSProperties}
                    >
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* the controls, in the order a request meets them */}
            <div className="md:col-span-6">
              <p className="mono dim">{"// Controls I designed in"}</p>
              <ol className="ctrl-flow relative mt-5">
                <span
                  className="ctrl-spine absolute bottom-6 left-[15px] top-4 w-px"
                  style={{
                    background: `linear-gradient(${hues.sky.a}, ${hues.dusk.a})`,
                  }}
                  aria-hidden
                />
                {c.controls.map((s, i) => (
                  <li
                    key={s.step}
                    className="ctrl-step relative grid grid-cols-[32px_1fr] gap-4 pb-6 last:pb-0"
                  >
                    <span
                      className="mono relative z-10 grid h-8 w-8 place-items-center rounded-full border text-[11px]"
                      style={{
                        borderColor: hues.sky.a,
                        background: "#0b1220",
                        color: hues.sky.a,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="mono dim">{s.step}</p>
                      <p className="mt-1 text-[15.5px] font-semibold tracking-[-0.01em]">
                        {s.control}
                      </p>
                      <p className="mt-1 text-[13.5px] leading-snug text-[var(--fg)]/70">
                        {s.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-[15px] leading-snug text-[var(--fg)]/80 md:max-w-[70ch]">
              <span className="mono mr-2" style={{ color: hues.dusk.a }}>
                {"// Why it matters"}
              </span>
              {c.why}
            </p>
            <Link href="/projects/stacks-reports" className="mono arrow-link shrink-0" style={{ color: hues.dusk.a }}>
              Full case study <Arrow glyph="→" />
            </Link>
          </div>

          {c.shots.length > 0 && (
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {c.shots.map((s) => (
                <div
                  key={s.src}
                  className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10"
                >
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, 30vw"
                    className="object-cover object-top"
                  />
                </div>
              ))}
            </div>
          )}
        </article>

        {/* ---- research figure ---- */}
        <article
          className="work-card glass tint mt-6 grid gap-8 rounded-3xl p-6 md:grid-cols-12 md:p-10"
          style={
            { "--a": hues.sky.a, "--b": hues.pine.a } as React.CSSProperties
          }
          aria-labelledby="h1b-title"
        >
          <div className="md:col-span-5">
            <p
              className="mono"
              style={{ color: hues.sky.a }}
            >{`// ${h1bFigure.kicker}`}</p>
            <h3
              id="h1b-title"
              className="mt-3 text-[clamp(1.45rem,2.4vw,2rem)] font-semibold leading-[1.05] tracking-[-0.03em]"
            >
              {h1bFigure.title}
            </h3>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--fg)]/80">
              {h1bFigure.takeaway}
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Methods">
              {h1bFigure.methods.map((m) => (
                <li key={m}>
                  <span
                    className="tag-c"
                    style={{ "--a": hues.sky.a } as React.CSSProperties}
                  >
                    {m}
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={h1bFigure.paper}
              target="_blank"
              rel="noopener noreferrer"
              className="mono mt-7 inline-block text-[0.8rem] uppercase tracking-[0.1em] underline decoration-white/30 underline-offset-4 hover:decoration-white"
              style={{ color: hues.sky.a }}
            >
              Read the paper (PDF) ↗
            </a>
            <Link
              href="/projects/h1b-wages"
              className="mono ml-6 mt-7 inline-block text-[0.8rem] uppercase tracking-[0.1em] underline decoration-white/30 underline-offset-4 hover:decoration-white"
              style={{ color: hues.sky.a }}
            >
              Full write-up →
            </Link>
          </div>
          <div className="md:col-span-7">
            <H1BChart />
          </div>
        </article>
      </div>
    </section>
  );
}

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <p className="mono dim">{`// ${label}`}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg)]/85">
        {children}
      </p>
    </div>
  );
}
