import { gsap } from "@/lib/gsap";

/**
 * The line-art scenes (bridge, trains, fog, lit windows) run endless ambient tweens.
 * Left alone they keep rewriting SVG attributes every frame even when the scene is far
 * off screen, which makes scrolling heavy. This pauses any endlessly repeating tween
 * whose SVG is off screen and resumes it when the SVG comes back into view.
 */
export function startOffscreenPause(): () => void {
  if (typeof IntersectionObserver === "undefined") return () => {};

  const visible = new WeakMap<Element, boolean>();
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => visible.set(e.target, e.isIntersecting)),
    { rootMargin: "250px 0px" },
  );
  const watched = new WeakSet<Element>();
  const pausedByUs = new WeakSet<gsap.core.Animation>();

  const sweep = () => {
    const tweens = gsap.globalTimeline.getChildren(true, true, false) as gsap.core.Tween[];
    for (const t of tweens) {
      if (t.repeat() !== -1) continue;
      const target = t.targets()[0];
      if (!(target instanceof Element)) continue;
      const svg = target.closest("svg");
      if (!svg) continue;
      if (!watched.has(svg)) {
        watched.add(svg);
        io.observe(svg);
        continue; // wait for the first visibility report
      }
      const vis = visible.get(svg);
      if (vis === undefined) continue;
      if (!vis && !t.paused()) {
        t.pause();
        pausedByUs.add(t);
      } else if (vis && pausedByUs.has(t)) {
        pausedByUs.delete(t);
        t.resume();
      }
    }
  };

  const id = window.setInterval(sweep, 250);
  return () => {
    window.clearInterval(id);
    io.disconnect();
  };
}
