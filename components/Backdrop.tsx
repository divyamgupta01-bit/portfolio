import NightSky from "./NightSky";

/**
 * Fixed layer behind the page: a dark gradient tinted by the time of day
 * (the CSS variables SmoothScroll writes), a soft horizon glow, and fine grain.
 * Pure CSS, so it paints with the first byte of HTML.
 */
export default function Backdrop({ still = false }: { still?: boolean }) {
  // `still`: a fixed night sky for pages without the scroll-driven day (the project pages)
  const night = still
    ? ({ "--sky-top": "#141a3a", "--sky-mid": "#2a2350", "--horizon": "#6d4a8a", "--accent-2": "#a78bfa", "--sun": 0, "--night": 1 } as React.CSSProperties)
    : {};
  return (
    <>
      <div
        className="fixed inset-0 z-0 overflow-hidden"
        aria-hidden
        data-sky
        data-night={still ? "1" : undefined}
        style={{
          ...night,
          background: [
            "radial-gradient(110% 60% at 50% 105%, color-mix(in oklab, var(--horizon) 26%, transparent), transparent 70%)",
            "radial-gradient(60% 50% at 85% 10%, color-mix(in oklab, var(--accent-2) 10%, transparent), transparent 70%)",
            // the sky brightens with the daylight (--sun: 0 at night, 1 at midday)
            "linear-gradient(to bottom, color-mix(in oklab, var(--sky-top) calc(45% + var(--sun, 0) * 47%), #05070d), color-mix(in oklab, var(--sky-mid) calc(28% + var(--sun, 0) * 50%), #05070d) 60%, color-mix(in oklab, var(--horizon) calc(var(--sun, 0) * 26%), #05070d))",
          ].join(", "),
        }}
      >
        {/* night: crisp drawn stars over a soft glow from Divyam's Death Valley Milky Way photo */}
        <NightSky />
        {/* the sun: climbs through the morning, overhead at midday, sets in the evening */}
        <div
          className="absolute inset-0"
          style={{
            opacity: "var(--sun, 0)",
            background: [
              "radial-gradient(circle at var(--sun-x, 80%) var(--sun-y, 70%), rgba(255,252,238,1) 0, rgba(255,244,210,0.95) 2.6vmax, rgba(255,222,160,0.45) 4vmax, rgba(255,210,140,0.18) 8vmax, transparent 13vmax)",
              "radial-gradient(circle at var(--sun-x, 80%) var(--sun-y, 70%), rgba(255,214,150,0.32) 0, rgba(255,200,130,0.14) 24vmax, transparent 55vmax)",
              // daylight wash: the whole sky lifts toward a pale blue around midday
              "linear-gradient(to bottom, rgba(150,200,240,0.16), rgba(150,200,240,0.05) 70%, transparent)",
            ].join(", "),
          }}
        />
      </div>
      <div className="grain fixed inset-0 z-0" aria-hidden />
      <div className="vignette" aria-hidden />
    </>
  );
}
