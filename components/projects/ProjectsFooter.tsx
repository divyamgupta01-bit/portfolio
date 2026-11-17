import Link from "next/link";
import { site } from "@/data/site";

/** Closing strip for the project pages: a way to get in touch, then the footer line. */
export default function ProjectsFooter() {
  return (
    <footer className="wrap mt-[16vh] pb-10">
      <div className="glass tint flex flex-col items-start justify-between gap-6 rounded-3xl p-6 md:flex-row md:items-center md:p-10" style={{ "--a": "#a78bfa", "--b": "#38bdf8" } as React.CSSProperties}>
        <div>
          <p className="mono dim">{"// Questions about any of these?"}</p>
          <p className="mt-3 text-[clamp(1.4rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.03em]">
            I&apos;m happy to walk through the work<span className="accent">.</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={`mailto:${site.email}`} className="mono rounded-full bg-[var(--fg)] px-5 py-3 text-[11px] uppercase tracking-[0.1em] text-[#0b0d0e]">
            Email me ↗
          </a>
          <a href={site.resume} target="_blank" rel="noopener noreferrer" className="glass mono rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.1em]">
            Resume ↗
          </a>
        </div>
      </div>
      <div className="mt-10 flex items-center justify-between border-t border-white/15 pt-6">
        <p className="mono dim">{`// © ${site.year} ${site.name}`}</p>
        <Link href="/" className="mono">
          Home ↗
        </Link>
      </div>
    </footer>
  );
}
