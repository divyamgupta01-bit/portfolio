"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { HOME_SCROLL_KEY, SECTION_EVENT } from "./SmoothScroll";

type NavItem = { key: string; label: string; href: string; section?: string };

/** The bar's links. `section` items scroll on the home page; the others are their own pages. */
const NAV: NavItem[] = [
  { key: "about", label: "About", href: "/#about", section: "about" },
  { key: "experience", label: "Experience", href: "/#experience", section: "experience" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "beyond", label: "Beyond work", href: "/#gallery", section: "gallery" },
  { key: "contact", label: "Contact", href: "/#contact", section: "contact" },
];

/** Which nav item is lit while each home section is on screen. */
const SECTION_TO_NAV: Record<string, string> = {
  about: "about",
  now: "about",
  record: "about",
  experience: "experience",
  toolkit: "experience",
  work: "projects",
  gallery: "beyond",
  skills: "beyond",
  contact: "contact",
};

/** Top of a home section, measuring the pin spacer when GSAP has pinned it. */
function sectionTop(id: string) {
  const el = document.getElementById(id);
  if (!el) return null;
  const box = (el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el) as HTMLElement;
  return box.getBoundingClientRect().top + window.scrollY;
}

export default function AppBar() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // light up the item for the section on screen (home), or Projects on the project pages
  useEffect(() => {
    if (!onHome) {
      setActive(pathname.startsWith("/projects") ? "projects" : null);
      return;
    }
    setActive(null);
    const onSection = (e: Event) => {
      const id = site.sections[(e as CustomEvent<number>).detail]?.id;
      setActive(id ? (SECTION_TO_NAV[id] ?? null) : null);
    };
    window.addEventListener(SECTION_EVENT, onSection);
    return () => window.removeEventListener(SECTION_EVENT, onSection);
  }, [onHome, pathname]);

  // menu sheet: lock the page behind it, close on Escape, move focus in and back out
  useEffect(() => {
    if (!open) return;
    const btn = menuBtn.current;
    const lenis = getLenis();
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.menu = "open";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      delete document.documentElement.dataset.menu;
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  // close the sheet whenever the route changes
  useEffect(() => setOpen(false), [pathname]);

  const go = (item: NavItem) => (e: React.MouseEvent) => {
    setOpen(false);
    if (!item.section || !onHome) return; // let Next handle page-to-page links
    e.preventDefault();
    const y = sectionTop(item.section);
    if (y !== null) window.setTimeout(() => scrollToTarget(y, 1.4), open ? 120 : 0);
  };

  const goHome = (e: React.MouseEvent) => {
    setOpen(false);
    try {
      sessionStorage.removeItem(HOME_SCROLL_KEY);
    } catch {}
    if (onHome) {
      e.preventDefault();
      scrollToTarget(0, 1.4);
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* a soft scrim so page content never runs under the bar */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[84px] md:h-[96px]"
          style={{ background: "linear-gradient(to bottom, rgba(6,8,14,0.92) 0%, rgba(6,8,14,0.66) 55%, rgba(6,8,14,0) 100%)" }}
          aria-hidden
        />
        <div className="wrap relative flex h-16 items-center justify-between gap-6 md:h-[76px]">
          <Link href="/" onClick={goHome} className="group block shrink-0" aria-label={`${site.name}, home`}>
            <span className="block text-[14px] font-semibold leading-none tracking-[-0.02em] md:text-[15.5px]">{site.name.toUpperCase()}</span>
            <span className="mono dim mt-1.5 block">{`// Portfolio © ${site.year}`}</span>
          </Link>

          {/* laptops: links in a glass pill, then the résumé */}
          <nav aria-label="Primary" className="hidden items-center gap-3 lg:flex">
            <ul className="glass flex items-center gap-0.5 rounded-full p-1">
              {NAV.map((item) => {
                const on = active === item.key;
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={go(item)}
                      aria-current={on ? (item.section ? "location" : "page") : undefined}
                      className={`mono flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                        on ? "bg-white/[0.09] text-[var(--fg)]" : "text-[var(--fg)]/65 hover:text-[var(--fg)]"
                      }`}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                        style={{ background: on ? "var(--accent)" : "transparent", boxShadow: on ? "0 0 10px var(--accent)" : "none" }}
                        aria-hidden
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="mono rounded-full border border-[var(--accent)]/60 px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] text-[var(--fg)] transition-colors duration-300 hover:bg-[var(--accent)] hover:text-[#0b0d0e]"
            >
              Resume ↗
            </a>
          </nav>

          {/* phones and tablets: a menu button */}
          <button
            ref={menuBtn}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="glass mono flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] lg:hidden"
          >
            <span className="relative block h-2.5 w-3.5" aria-hidden>
              <span className={`absolute left-0 top-0 block h-px w-full bg-current transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 block h-px w-full bg-current transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </span>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* the menu sheet */}
      <div
        id="site-menu"
        inert={!open}
        className={`fixed inset-0 z-[45] transition-[opacity,visibility] duration-300 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        style={{ background: "rgba(6,8,14,0.9)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      >
        <nav aria-label="Menu" className="wrap flex h-full flex-col justify-between pb-10 pt-24">
          <ol className="space-y-1">
            {NAV.map((item, i) => {
              const on = active === item.key;
              return (
                <li
                  key={item.key}
                  className="transition-[transform,opacity] duration-500"
                  style={{ transform: open ? "none" : "translateY(12px)", opacity: open ? 1 : 0, transitionDelay: open ? `${60 + i * 45}ms` : "0ms" }}
                >
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    href={item.href}
                    onClick={go(item)}
                    aria-current={on ? (item.section ? "location" : "page") : undefined}
                    className="flex items-baseline gap-4 border-b border-white/10 py-4"
                  >
                    <span className="mono dim w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-[clamp(1.75rem,7vw,2.5rem)] font-semibold leading-none tracking-[-0.03em] ${on ? "" : "text-[var(--fg)]/85"}`}>
                      {item.label}
                      {on && <span className="accent">.</span>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={site.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="mono rounded-full bg-[var(--accent)] px-5 py-3 text-[11px] uppercase tracking-[0.1em] text-[#0b0d0e]"
            >
              Resume ↗
            </a>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="glass mono rounded-full px-5 py-3 text-[11px] uppercase tracking-[0.1em]">
              LinkedIn ↗
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
