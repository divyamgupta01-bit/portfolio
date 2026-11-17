import Link from "next/link";
import { site } from "@/data/site";

/** Top bar for the project pages (the home page uses the scroll HUD instead). */
export default function ProjectsNav({ current }: { current: "index" | "project" }) {
  return (
    <header className="relative z-20">
      <nav aria-label="Site" className="wrap flex items-center justify-between gap-4 py-5 md:py-7">
        <Link href="/" className="font-semibold tracking-[-0.02em] text-[15px] md:text-[17px]">
          {site.name.toUpperCase()}
        </Link>
        <ul className="mono flex items-center gap-5 md:gap-8">
          <li>
            <Link href="/" className="dim hover:text-[var(--fg)]">Home</Link>
          </li>
          <li>
            <Link href="/projects" aria-current={current === "index" ? "page" : undefined} className={current === "index" ? "accent" : "dim hover:text-[var(--fg)]"}>
              Projects
            </Link>
          </li>
          <li>
            <a href={site.resume} target="_blank" rel="noopener noreferrer" className="dim hover:text-[var(--fg)]">Resume ↗</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
