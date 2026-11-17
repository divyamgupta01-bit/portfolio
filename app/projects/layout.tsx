import Backdrop from "@/components/Backdrop";
import ProjectsFooter from "@/components/projects/ProjectsFooter";

/** Project pages: a still night sky (the scroll-driven day lives on the home page) and fixed accents. */
export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ "--accent": "#a78bfa", "--accent-2": "#38bdf8" } as React.CSSProperties}>
      <Backdrop still />
      <main id="main" className="relative z-10 overflow-x-clip">
        {children}
        <ProjectsFooter />
      </main>
    </div>
  );
}
