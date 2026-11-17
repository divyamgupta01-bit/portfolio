"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import Hud from "./Hud";

/** The scroll-driven HUD and smooth scrolling belong to the home page only. */
export default function Chrome() {
  const path = usePathname();
  if (path !== "/") return null;
  return (
    <>
      <SmoothScroll />
      <Hud />
    </>
  );
}
