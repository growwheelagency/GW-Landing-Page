"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

// Smooth wheel scrolling, driven by GSAP's ticker so Lenis and GSAP animations share one frame loop.
// Touch devices keep native scrolling; reduced-motion users get no smoothing at all.
export default function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: true });
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
