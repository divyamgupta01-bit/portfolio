"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { reveal } from "@/lib/anim";
import { projects } from "@/data/projects";
import { Arrow, Heading, SectionLabel } from "../ui";
import ProjectCard from "../projects/ProjectCard";

/** Home-page teaser: the work itself lives on /projects, so this stays short and different from the resume. */
export default function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      reveal(".work-intro", ".work-intro");
      reveal(".work-cta", ".work-cta");
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="relative pt-[16vh]">
      <div className="wrap">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel id="work" />
            <Heading id="work-title" className="mt-5">Selected work.</Heading>
          </div>
          <p className="work-intro legible prose-body md:col-span-5 md:justify-self-end md:text-right">
            Projects with the data, the method and what went wrong. Not a repeat of the resume: the actual work.
          </p>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {projects.slice(0, 4).map((p, i) => (
            <ProjectCard key={p.slug} p={p} index={i} compact />
          ))}
        </ul>

        <p className="work-cta mt-10">
          <Link href="/projects" className="arrow-link mono glass rounded-full px-5 py-3">
            All projects <Arrow />
          </Link>
        </p>
      </div>
    </section>
  );
}
