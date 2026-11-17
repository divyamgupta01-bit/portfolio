"use client";

import { useEffect } from "react";
import { getLenis, initLenis } from "@/lib/lenis";
import { gsap, ScrollTrigger, scrollStore } from "@/lib/gsap";
import { getPrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { measureStops, sectionPhase, sectionStops } from "@/lib/sections";
import { paletteAt, rgbCss } from "@/lib/timeOfDay";
import { startOffscreenPause } from "@/lib/offscreenPause";

export const SECTION_EVENT = "trail:section";
/** sessionStorage key for the home page scroll position (cleared when the wordmark is used to go home). */
export const HOME_SCROLL_KEY = "idv:home-scroll";
export { sectionStops };

/**
 * Global scroll wiring: Lenis, section tracking, the eased progress value,
 * and the time-of-day palette (written to the store for the HUD clock and to
 * CSS variables for the page).
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = getPrefersReducedMotion();
    scrollStore.reducedMotion = reduced;
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";

    const cleanupLenis = initLenis(reduced);
    const stopOffscreenPause = reduced ? () => {} : startOffscreenPause();

    const onRefresh = () => measureStops();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    // force the first section event after a remount (e.g. coming back from /projects)
    scrollStore.section = -1;

    // ---- scroll position. The pinned sections only add their scroll length once GSAP has
    // measured them, so the browser's own restore lands in the wrong place on reload. Restore
    // it ourselves after the first full refresh: a #section in the URL wins, then the saved spot.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const saveScroll = () => {
      try {
        sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.round(window.scrollY)));
      } catch {}
    };
    window.addEventListener("pagehide", saveScroll);
    let cancelled = false;
    const restore = () => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      let y: number | null = null;
      if (target) {
        const box = (target.parentElement?.classList.contains("pin-spacer") ? target.parentElement : target) as HTMLElement;
        y = box.getBoundingClientRect().top + window.scrollY;
      } else {
        try {
          const v = sessionStorage.getItem(HOME_SCROLL_KEY);
          if (v) y = Number(v);
        } catch {}
      }
      if (y !== null && Number.isFinite(y) && y > 0) {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
        ScrollTrigger.update();
      }
    };
    const fontsIn = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fontsIn, new Promise((r) => window.setTimeout(r, 900))]).then(() => window.requestAnimationFrame(restore));

    const root = document.documentElement.style;
    let lastKey = -1;
    let first2 = true;
    let lastSky = "";
    let lastSun = "";
    const sky = document.querySelector<HTMLElement>("[data-sky]");
    let first = true;

    const tick = () => {
      // eased progress (frame-rate independent, ≈0.08 per 60fps frame)
      const k = reduced || first ? 1 : 1 - Math.pow(1 - 0.08, gsap.ticker.deltaRatio());
      scrollStore.eased += (scrollStore.progress - scrollStore.eased) * k;
      first = false;

      // current section: becomes current once its top passes ~55% of the viewport
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0) {
        const probe = (window.scrollY + window.innerHeight * 0.45) / max;
        let i = 0;
        for (let s = sectionStops.length - 1; s >= 0; s--) {
          if (probe >= sectionStops[s]) {
            i = s;
            break;
          }
        }
        if (i !== scrollStore.section) {
          scrollStore.section = i;
          window.dispatchEvent(new CustomEvent(SECTION_EVENT, { detail: i }));
        }
      }

      // time of day
      const { section, local } = sectionPhase(scrollStore.eased);
      const pal = paletteAt(section + local);
      scrollStore.palette = pal;
      // The sky layer is a single fixed element, so it can follow the palette every frame.
      const skyCss = `${rgbCss(pal.accent2)}|${rgbCss(pal.skyTop)}|${rgbCss(pal.skyMid)}|${rgbCss(pal.horizon)}`;
      if (sky && skyCss !== lastSky) {
        lastSky = skyCss;
        const [b, top, mid, hor] = skyCss.split("|");
        sky.style.setProperty("--accent-2", b);
        sky.style.setProperty("--sky-top", top);
        sky.style.setProperty("--sky-mid", mid);
        sky.style.setProperty("--horizon", hor);
      }
      if (sky) {
        const sun = `${pal.sun.toFixed(3)}|${pal.sunX.toFixed(1)}|${pal.sunY.toFixed(1)}`;
        if (sun !== lastSun) {
          lastSun = sun;
          sky.style.setProperty("--sun", pal.sun.toFixed(3));
          sky.style.setProperty("--sun-x", `${pal.sunX.toFixed(1)}%`);
          sky.style.setProperty("--sun-y", `${pal.sunY.toFixed(1)}%`);
          // night: fades the Milky Way in once the sun is gone
          sky.style.setProperty("--night", Math.min(1, Math.max(0, (0.22 - pal.sun) / 0.22)).toFixed(3));
          // start loading the photo a little before it's needed
          if (pal.sun < 0.45 && !sky.dataset.night) sky.dataset.night = "1";
        }
      }
      // Variables on <html> are inherited by every element, so each write restyles the whole
      // page (the main cause of slow scrolling). The page-wide accents therefore change once per
      // section, not every frame; the sky above follows the scroll smoothly on its own.
      const key = reduced ? section + local : scrollStore.section;
      if (key !== lastKey) {
        lastKey = key;
        const sp = reduced ? pal : paletteAt(scrollStore.section + 0.5);
        root.setProperty("--accent", rgbCss(sp.accent));
        root.setProperty("--accent-2", rgbCss(sp.accent2));
        if (first2) {
          first2 = false;
          root.setProperty("--sky-top", rgbCss(sp.skyTop));
          root.setProperty("--sky-mid", rgbCss(sp.skyMid));
          root.setProperty("--horizon", rgbCss(sp.horizon));
        }
      }
    };
    gsap.ticker.add(tick);


    // Fonts change line breaks (and therefore pin lengths).
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cancelled = true;
      saveScroll();
      window.removeEventListener("pagehide", saveScroll);
      // the accents and sky colours belong to this page only
      ["--accent", "--accent-2", "--sky-top", "--sky-mid", "--horizon"].forEach((v) => root.removeProperty(v));
      window.clearTimeout(t);
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      cleanupLenis();
      stopOffscreenPause();
    };
  }, []);

  return null;
}
