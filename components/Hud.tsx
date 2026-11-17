"use client";

import { useEffect, useRef } from "react";
import { gsap, scrollStore } from "@/lib/gsap";
import { SECTION_EVENT } from "./SmoothScroll";
import { formatClock } from "@/lib/timeOfDay";

/** Home-page HUD: time-of-day clock, scroll progress and the hero scroll cue. The top bar is <AppBar>. */
export default function Hud() {
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const barM = useRef<HTMLSpanElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const clock = useRef<HTMLSpanElement>(null);
  const clockName = useRef<HTMLSpanElement>(null);
  const dial = useRef<HTMLSpanElement>(null);

  // Section label
  useEffect(() => {
    const onSection = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      if (cue.current) gsap.to(cue.current, { autoAlpha: i === 0 ? 1 : 0, duration: 0.4 });
    };
    window.addEventListener(SECTION_EVENT, onSection);
    return () => window.removeEventListener(SECTION_EVENT, onSection);
  }, []);

  // Progress counter + line, read from the store on the gsap ticker (no React state per frame).
  useEffect(() => {
    let last = -1;
    const update = () => {
      const p = Math.round(scrollStore.progress * 100);
      if (p !== last) {
        last = p;
        if (counter.current) counter.current.textContent = String(p).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleY(${scrollStore.progress})`;
        if (barM.current) barM.current.style.transform = `scaleX(${scrollStore.progress})`;
      }
      // time-of-day clock
      const pal = scrollStore.palette;
      const time = formatClock(pal.clock);
      if (clock.current && clock.current.textContent !== time) clock.current.textContent = time;
      if (clockName.current && clockName.current.textContent !== pal.name) clockName.current.textContent = pal.name;
      if (dial.current) dial.current.style.transform = `rotate(${(pal.clock / 1440) * 360}deg)`;
    };
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);


  return (
    <div className="hud pointer-events-none fixed inset-0 z-[55] transition-opacity duration-300" aria-hidden={false}>
      {/* desktop: a fade under the clock and progress counter at the bottom */}
      <div
        className="absolute inset-x-0 bottom-0 hidden h-[84px] md:block"
        style={{ background: "linear-gradient(to top, rgba(6,8,14,0.85) 0%, rgba(6,8,14,0.55) 55%, rgba(6,8,14,0) 100%)" }}
        aria-hidden
      />
      {/* phones: a hairline progress bar along the top edge */}
      <span
        ref={barM}
        className="absolute inset-x-0 top-0 block h-[2px] origin-left md:hidden"
        style={{ transform: "scaleX(0)", background: "linear-gradient(to right, var(--accent-2), var(--accent))" }}
        aria-hidden
      />
      {/* bottom-left time of day */}
      <div className="absolute bottom-4 left-[var(--gutter)] hidden items-center gap-2.5 md:bottom-6 md:flex" aria-hidden>
        <span className="relative block h-5 w-5 rounded-full border border-[var(--line-strong)]">
          <span ref={dial} className="absolute inset-0 block">
            <span className="absolute left-1/2 top-[2px] block h-[7px] w-[2px] -translate-x-1/2 rounded bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
          </span>
        </span>
        <p className="mono tabular-nums">
          <span ref={clock}>06:12</span> <span className="dim">·</span> <span ref={clockName} className="accent">Dawn</span>
        </p>
      </div>

      {/* bottom-center scroll cue (hero only) */}
      <div ref={cue} className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-6 md:[@media(max-height:680px)]:hidden">
        <span className="mono dim">Scroll ↓</span>
        <span className="relative block h-10 w-px overflow-hidden bg-[var(--line)]">
          <span className="cue-line absolute inset-0 bg-[var(--fg)]" />
        </span>
      </div>

      {/* bottom-right progress */}
      <div className="absolute bottom-4 right-[var(--gutter)] hidden items-end gap-3 md:bottom-6 md:flex">
        <p className="mono tabular-nums" aria-label="Scroll progress">
          <span ref={counter}>000</span>
          <span className="dim"> / 100</span>
        </p>
        <span className="relative block h-16 w-px bg-[var(--line)]">
          <span
            ref={bar}
            className="absolute inset-0 origin-top"
            style={{ transform: "scaleY(0)", background: "linear-gradient(to bottom, var(--accent-2), var(--accent))", boxShadow: "0 0 10px var(--accent)" }}
          />
        </span>
      </div>
    </div>
  );
}
