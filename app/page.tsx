import Backdrop from "@/components/Backdrop";
import SmoothScroll from "@/components/SmoothScroll";
import Hud from "@/components/Hud";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Now from "@/components/sections/Now";
import Record from "@/components/sections/Record";
import Experience from "@/components/sections/Experience";
import Work from "@/components/sections/Work";
import Toolkit from "@/components/sections/Toolkit";
import Gallery from "@/components/sections/Gallery";
import { GoldenGateFog } from "@/components/BayScenes";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Page() {
  return (
    <>
      <Backdrop />
      <SmoothScroll />
      <Hud />
      <main id="main" className="relative z-10 overflow-x-clip">
        <Hero />
        <About />
        <Now />
        <Record />
        <Experience />
        <Work />
        <Toolkit />
        <GoldenGateFog className="my-[8vh] block w-full" />
        <Gallery />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
