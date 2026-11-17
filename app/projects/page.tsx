import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import ProjectSlide from "@/components/projects/ProjectSlide";

export const metadata: Metadata = {
  title: `Projects // ${site.name}`,
  description: "Case studies with real data, models and results: an FP&A model, a full-stack app, a backtest and two econometrics papers.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-4 pt-28 sm:px-6 md:gap-16 md:px-10 md:pt-36">
      <header className="flex flex-col gap-5" aria-labelledby="projects-title">
        <p className="inline-flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-white/70">
          <span className="inline-flex size-2 rounded-full bg-violet-400 shadow-[0_0_12px_var(--color-violet-400)]" aria-hidden />
          {"// Projects"}
        </p>
        <h1 id="projects-title" className="text-[clamp(2.4rem,1.6rem+4vw,4.25rem)] font-semibold leading-[1] tracking-[-0.045em] text-balance">
          Things I built and tested<span className="text-violet-400">.</span>
        </h1>
        <p className="max-w-[62ch] text-[clamp(1rem,0.95rem+0.3vw,1.15rem)] leading-relaxed text-white/75">
          Each project leads with what I found, then the situation, my approach and the result, with the real chart or screen behind it. Open
          any one for the full case study.
        </p>
        <nav aria-label="Jump to a project" className="flex flex-wrap gap-2">
          {projects.map((p) => (
            <a
              key={p.slug}
              href={`#${p.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-[13px] text-white/80 ring-1 ring-white/10 transition-colors duration-200 hover:bg-white/[0.12] hover:text-white"
            >
              {p.card.name}
            </a>
          ))}
        </nav>
      </header>

      {/* one slide per row: each slide lays itself out by its own width (text beside the chart when there's room) */}
      <ul className="grid grid-cols-1 gap-8">
        {projects.map((p) => (
          <li key={p.slug} id={p.slug} className="flex scroll-mt-28 flex-col">
            <ProjectSlide p={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
