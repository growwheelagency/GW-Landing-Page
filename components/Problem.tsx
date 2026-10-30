"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Reveal from "./Reveal";
import Sparkles from "./Sparkles";
import { Sparkle } from "./Icons";
import Eyebrow from "./Eyebrow";

const N = [
  { t: "SEO", sx: 9, sy: 24, sr: -9, cx: 12, cy: 50, mx: 50, my: 12, dd: 0, dl: 0 },
  { t: "Paid Ads", sx: 34, sy: 78, sr: 7, cx: 31, cy: 50, mx: 50, my: 31, dd: 0.06, dl: -0.8 },
  { t: "Social", sx: 56, sy: 22, sr: -5, cx: 50, cy: 50, mx: 50, my: 50, dd: 0.12, dl: -1.6 },
  { t: "Website", sx: 78, sy: 70, sr: 10, cx: 69, cy: 50, mx: 50, my: 69, dd: 0.18, dl: -2.4 },
  { t: "Reports", sx: 90, sy: 28, sr: -7, cx: 88, cy: 50, mx: 50, my: 88, dd: 0.24, dl: -3.2 },
];
const Broken = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /><path d="M4 4l16 16" /></svg>
);
const pains: [string, ReactNode][] = [
  ["SEO and ads", <>Your SEO ranks you for words your ads <b>never mention.</b></>],
  ["Ads and website", <>Your ads send people to a page <b>nobody designed for them.</b></>],
  ["Reports and sales", <>Your report looks great and <b>tells you nothing about sales.</b></>],
];

export default function Problem() {
  const [joined, setJoined] = useState(false);
  const stage = useRef<HTMLDivElement>(null), touched = useRef(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) { setJoined(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { io.disconnect(); setTimeout(() => { if (!touched.current) setJoined(true); }, 1400); }
    }, { threshold: 0.6 });
    io.observe(stage.current!);
    return () => io.disconnect();
  }, []);
  const toggle = () => { touched.current = true; setJoined((j) => !j); };

  return (
    <section className="band b-canvas" aria-labelledby="prh">
      <div className="sec">
        <Reveal className="hd-c">
          <Sparkles />
          <Eyebrow>The usual story</Eyebrow>
          <h2 className="sh" id="prh">Five freelancers. Five plans.<br /><b>One wasted budget.</b></h2>
          <p className="ss">Most small brands buy SEO from one person, ads from another and a website from a third. Nobody owns the whole picture, so every part works alone.</p>
        </Reveal>
        <Reveal>
          <div ref={stage} className={`stage${joined ? " joined" : ""}`} onClick={toggle} role="img" aria-label="Five separate marketing pieces coming together into one connected plan">
            <div className="st" aria-hidden="true"><span className="a">Five people, five plans</span><span className="b">One plan</span></div>
            <div className="ln" /><div className="pk" />
            {N.map((n) => (
              <div key={n.t} className="nd" style={{ "--sx": n.sx + "%", "--sy": n.sy + "%", "--sr": n.sr + "deg", "--cx": n.cx + "%", "--cy": n.cy + "%", "--mx": n.mx + "%", "--my": n.my + "%", "--dd": n.dd + "s", "--dl": n.dl + "s" }}><span>{n.t}</span></div>
            ))}
            <button className="tg" type="button" aria-pressed={joined} onClick={(e) => { e.stopPropagation(); toggle(); }}>
              <Sparkle /><span>{joined ? "Pull it apart" : "Pull it together"}</span>
            </button>
          </div>
        </Reveal>
        <div className="pain">
          {pains.map(([tag, text], i) => (
            <Reveal key={tag} className="pi" delay={0.05 + i * 0.1}>
              <span className="tag"><Broken />{tag}</span><p>{text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="cl">
          <p>We run all of it as <b>one plan.</b><br />That's the whole idea.</p>
          <a className="btn p" href="#system">See how we do it <span className="arr" aria-hidden="true">↓</span></a>
        </Reveal>
      </div>
    </section>
  );
}
