import Link from "next/link";
import { hues } from "@/data/site";
import type { Project } from "@/data/projects";
import { Arrow } from "../ui";

export default function ProjectCard({ p, index, compact = false }: { p: Project; index: number; compact?: boolean }) {
  const h = hues[p.hue];
  return (
    <li className="glass tint rounded-3xl" style={{ "--a": h.a, "--b": h.b } as React.CSSProperties}>
      <Link href={`/projects/${p.slug}`} className="arrow-link h-full w-full flex-col p-6 md:p-8" style={{ display: "flex", alignItems: "stretch" }}>
        <span className="flex w-full items-center justify-between">
          <span className="mono" style={{ color: h.a }}>{`// ${String(index + 1).padStart(2, "0")} ${p.kind}`}</span>
          <Arrow />
        </span>
        <h3 className="mt-6 block text-[24px] font-semibold leading-[1.1] tracking-[-0.02em] md:text-[28px]">{p.short}</h3>
        <p className="mt-3 block max-w-[46ch] text-[16px] leading-snug text-[var(--fg)]/80">{p.hook}</p>
        {!compact && <p className="mt-3 block max-w-[52ch] text-[15px] leading-snug text-[var(--fg-dim)]">{p.summary}</p>}
        <span className="mt-auto flex w-full flex-wrap gap-x-6 gap-y-3 pt-8">
          {p.stats.slice(0, 2).map((s) => (
            <span key={s.label} className="block">
              <span className="block text-[22px] font-semibold tracking-[-0.02em] tabular-nums" style={{ color: h.a }}>{s.value}</span>
              <span className="mono dim block max-w-[22ch] normal-case tracking-normal">{s.label}</span>
            </span>
          ))}
        </span>
      </Link>
    </li>
  );
}
