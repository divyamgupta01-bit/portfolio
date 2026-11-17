import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import ProjectCard from "@/components/projects/ProjectCard";

export const metadata: Metadata = {
  title: `Projects // ${site.name}`,
  description: "Case studies with real data, models and results: an FP&A model, a full-stack app, a backtest and two econometrics papers.",
};

export default function ProjectsPage() {
  return (
    <>
      <div>
        <section className="wrap pt-32 md:pt-40" aria-labelledby="projects-title">
          <p className="mono legible flex items-center gap-2.5">
            <span className="dot" aria-hidden />
            <span>{"// Projects"}</span>
          </p>
          <h1 id="projects-title" className="h2 legible mt-5">
            Things I built, tested<span className="accent">.</span>
          </h1>
          <p className="legible prose-body mt-8 text-[var(--fg)]/80">
            Each project says what it is, what I did and what came out of it. Open one for the full case study, with the real charts,
            screens and numbers. For the short version of my background, see the{" "}
            <a href={site.resume} target="_blank" rel="noopener noreferrer" className="accent underline underline-offset-4">resume</a>.
          </p>
        </section>

        <ul className="wrap mt-14 grid gap-5 md:grid-cols-2 md:[&>li:last-child:nth-child(odd)]:col-span-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
        </ul>

      </div>
    </>
  );
}
