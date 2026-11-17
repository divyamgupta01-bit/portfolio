"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, scrollStore } from "@/lib/gsap";
import { onIntro, startIntro } from "@/lib/anim";
import { scrollToTarget } from "@/lib/lenis";
import { site } from "@/data/site";
import { Arrow } from "../ui";
import GoldenGate from "../GoldenGate";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const links = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const kicker = useRef<HTMLParagraphElement>(null);
  const bridge = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const fit = useRef<HTMLDivElement>(null);

  // The bridge spans the full width. Where that would run into the name and buttons, it is
  // lifted (tower tops may tuck up to the top edge) and the water below the deck fades out
  // above the text. The deck itself always stays visible: on very short screens the drawing
  // shrinks just enough to keep it clear of the text.
  useEffect(() => {
    const sec = root.current;
    const wrap = bridge.current;
    const inner = fit.current;
    const text = copy.current;
    if (!sec || !wrap || !inner || !text) return;
    const TOWER = 0.131; // tower tops, as a fraction of the drawing's height
    const DECK = 0.671; // the roadway
    const WATER = 0.794; // tower bases on the water
    const reset = () => {
      wrap.style.top = "";
      inner.style.width = "";
      wrap.style.maskImage = wrap.style.webkitMaskImage = "";
      wrap.style.maskComposite = "";
      wrap.style.setProperty("-webkit-mask-composite", "");
    };
    const size = () => {
      if (window.innerWidth < 768) return reset();
      const full = (sec.clientWidth * 7) / 16;
      const textTop = text.offsetTop;
      const natural = window.innerHeight * 0.06;
      const edge = 54; // tower tops stay below the name in the top bar
      const deckGap = 26; // deck stays at least this far above the text
      let H = full;
      let top = Math.min(natural, Math.max(edge - TOWER * H, textTop - 8 - WATER * H));
      if (top + DECK * H > textTop - deckGap) {
        H = Math.max(260, (textTop - deckGap - edge) / (DECK - TOWER));
        top = edge - TOWER * H;
      }
      const narrow = H < full - 1;
      wrap.style.top = `${Math.round(top)}px`;
      inner.style.width = narrow ? `${Math.round((H * 16) / 7)}px` : "";

      // fade: below the deck when the water would reach the text, otherwise just the last waves
      let down: string;
      if (top + WATER * H > textTop - 24) {
        const deckY = top + DECK * H;
        const startY = Math.max(deckY + 6, textTop - 70);
        const endY = Math.max(startY + 18, textTop - 8);
        down = `linear-gradient(to bottom, #000 ${(((startY - top) / H) * 100).toFixed(1)}%, transparent ${(((endY - top) / H) * 100).toFixed(1)}%)`;
      } else {
        down = "linear-gradient(to bottom, #000 80%, transparent 86%)";
      }
      const across = "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)";
      wrap.style.maskImage = wrap.style.webkitMaskImage = narrow ? `${down}, ${across}` : down;
      wrap.style.maskComposite = narrow ? "intersect" : "";
      wrap.style.setProperty("-webkit-mask-composite", narrow ? "source-in" : "");
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(sec);
    ro.observe(text);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      const reduced = scrollStore.reducedMotion;
      const intro = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
      intro.from([pill.current, kicker.current, name.current, sub.current, links.current], {
        autoAlpha: 0,
        y: reduced ? 0 : 14,
        duration: 0.9,
        stagger: 0.1,
      });
      // the Golden Gate draws itself: water → headlands → towers → deck → cable → suspenders
      const q = (sel: string) => bridge.current!.querySelectorAll(sel);
      const draw = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
      if (reduced) {
        gsap.set(q(".gg-fillable"), { attr: { "fill-opacity": 1 } });
        gsap.set(q(".gg-car"), { opacity: 0 });
        draw.from(bridge.current, { autoAlpha: 0, duration: 0.8 });
      } else {
        draw
          .fromTo(q(".gg-sun"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6, stagger: 0.2 }, 0)
          .fromTo(q(".gg-wave"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 1.2, stagger: 0.08 }, 0)
          .fromTo(q(".gg-land"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.4, stagger: 0.1 }, 0.2)
          .to(q(".gg-fillable"), { attr: { "fill-opacity": 1 }, duration: 1.2, ease: "power1.out" }, 1.2)
          .fromTo(q(".gg-tower"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, stagger: 0.04 }, 0.5)
          .fromTo(q(".gg-deck"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.1, stagger: 0.12 }, 1.1)
          .fromTo(q(".gg-truss"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.25, stagger: 0.008 }, 1.3)
          .fromTo(q(".gg-cable"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6 }, 1.5)
          .fromTo(q(".gg-sus"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.35, stagger: { each: 0.007, from: "center" } }, 2.1)
          .fromTo(q(".gg-bird"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.6, stagger: 0.12 }, 2.4)
          .fromTo(q(".gg-wisp"), { opacity: 0 }, { opacity: 1, duration: 2, stagger: 0.3 }, 2.2)
          .add(() => {
            // ambient life once drawn: fog drifts, gulls bob, cars cross
            gsap.to(q(".gg-wisp"), { x: (i) => (i % 2 ? -60 : 70), duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
            gsap.to(q(".gg-bird"), { y: (i) => -8 - i * 3, x: (i) => 12 + i * 6, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut", stagger: 0.4 });
            q(".gg-car").forEach((car, i) => {
              const rtl = i === 1;
              gsap.fromTo(
                car,
                { attr: { cx: rtl ? 1510 : 90 }, opacity: 1 },
                { attr: { cx: rtl ? 90 : 1510 }, duration: 5.5 + i * 1.5, delay: i * 1.1, repeat: -1, ease: "none" },
              );
            });
            gsap.to(q(".gg-towers, .gg-cable"), { opacity: 0.82, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
            // ships: a freighter heads out under the bridge, a sailboat tacks back in
            gsap.set(q(".gg-ship, .gg-boat"), { opacity: 1 });
            gsap.fromTo(q(".gg-ship"), { x: -220 }, { x: 1660, duration: 70, ease: "none", repeat: -1 });
            gsap.fromTo(q(".gg-boat"), { x: 1620 }, { x: -80, duration: 48, ease: "none", repeat: -1, delay: 4 });
            gsap.to(q(".gg-boat"), { y: -3, rotate: 2, transformOrigin: "50% 100%", duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
          });
      }
      // a brisk draw-in: ~3.3s as authored → ~2.4s
      draw.timeScale(1.4);
      const off = onIntro(() => {
        intro.play();
        draw.play();
      });
      startIntro();

      // As you scroll on, the hero content and bridge ease out.
      if (!reduced) {
        gsap.to(bridge.current, {
          yPercent: -12,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
        });
        // explicit start values: the intro's from() leaves these hidden until it plays
        gsap.fromTo([pill.current, kicker.current, name.current, sub.current, links.current], { autoAlpha: 1 }, {
          autoAlpha: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: root.current, start: "top top", end: "50% top", scrub: true },
        });
      }
      return off;
    },
    { scope: root },
  );

  return (
    <section id="hero" ref={root} aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col justify-end pb-28 md:pb-32 md:[@media(max-height:800px)]:pb-20">
      <div ref={bridge} className="pointer-events-none absolute inset-x-0 top-[14vh] md:top-[3vh]">
        <div ref={fit} className="mx-auto">
          <GoldenGate className="block aspect-[16/7] w-full" />
        </div>
      </div>
      <div ref={copy} className="wrap relative">
        <div ref={pill} className="glass mb-7 inline-flex items-center gap-3 rounded-full px-4 py-2 md:[@media(max-height:800px)]:mb-4">
          <span className="relative block h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" aria-hidden />
          <span className="mono">{`Open to ${site.availability} roles`}</span>
        </div>
        <p ref={kicker} className="mono legible mb-5 flex items-center gap-2.5 md:[@media(max-height:800px)]:mb-3 md:[@media(max-height:620px)]:hidden">
          <span className="dot" aria-hidden />
          {`// 01 ${site.sections[0].label} · ${site.location}`}
        </p>
        <h1 id="hero-title" ref={name} tabIndex={-1} className="display legible">
          {site.name.toUpperCase()}
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end md:[@media(max-height:800px)]:mt-5">
          <p ref={sub} className="mono legible [text-wrap:balance] md:col-span-6">
            {site.tagline}
          </p>
          <div ref={links} className="flex gap-3 md:col-span-6 md:justify-end">
            <a
              href="#experience"
              className="arrow-link mono glass rounded-full px-5 py-3"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#experience", 1.8);
              }}
            >
              {site.hero.primaryCta} <Arrow glyph="↓" />
            </a>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener"
              className="arrow-link mono rounded-full px-5 py-3 text-[#0b0d0e]"
              style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
            >
              {site.hero.secondaryCta} <Arrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
