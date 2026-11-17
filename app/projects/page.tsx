import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import ProjectsNav from "@/components/projects/ProjectsNav";
import ProjectCard from "@/components/projects/ProjectCard";

export const metadata: Metadata = {
  title: `Projects // ${site.name}`,
  description: "Case studies with real data, models and results: an FP&A model, a full-stack app, a backtest and an econometrics paper.",
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsNav current="index" />
      <main id="main" className="relative z-10 pb-24">
        <section className="wrap pt-[8vh] md:pt-[12vh]" aria-labelledby="projects-title">
          <p className="mono legible flex items-center gap-2.5">
            <span className="dot" aria-hidden />
            <span>{"// Projects"}</span>
          </p>
          <h1 id="projects-title" className="h2 legible mt-5">
            Things I built, tested<span className="accent">.</span>
          </h1>
          <p className="legible prose-body mt-8 text-[var(--fg)]/80">
            Each project below is a case study: the question, the method, a real chart or screen from the work, what I found, and what
            went wrong along the way. For the short version of my background, see the{" "}
            <a href={site.resume} target="_blank" rel="noopener noreferrer" className="accent underline underline-offset-4">resume</a>.
          </p>
        </section>

        <ul className="wrap mt-14 grid gap-4 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} />
          ))}
        </ul>

        <p className="wrap mt-14">
          <Link href="/" className="mono dim hover:text-[var(--fg)]">← Back to home</Link>
        </p>
      </main>
    </>
  );
}
