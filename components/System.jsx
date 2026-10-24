"use client";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import Sparkles from "./Sparkles";

const steps = [
  { t: "Get found", s: "SEO · SEM · Local search", h: ["Be the name", "they see first."], p: "People already search for what you sell. We fix the words, the pages and the ads that put you in front of them.", tags: ["SEO", "SEM", "Local search"],
    v: (<div className="vis v1" aria-hidden="true"><div className="bar">best dentist near me</div><div className="rw you">Your business<em>You</em></div><div className="rw"><span className="sk" /></div><div className="rw"><span className="sk" /></div></div>) },
  { t: "Get chosen", s: "Meta ads · Social · Creative", h: ["Give them a reason", "to pick you."], p: "Being seen isn't enough. We make the message and visuals that win the click over the next result.", tags: ["Meta ads", "Social", "Creative", "Email"],
    v: (<div className="vis v2" aria-hidden="true"><div className="ad"><div className="im" /><div className="tx"><span className="sk" style={{ width: "80%" }} /><span className="sk" style={{ width: "55%" }} /><span className="cta">Learn more</span></div></div><div className="rx"><span>♥ Like</span><span>↪ Share</span><span>Save</span></div></div>) },
  { t: "Get the lead", s: "Web · UI/UX · WhatsApp", h: ["Turn a visit into", "a conversation."], p: "A visit only counts when it becomes a call or a message. We build the page and the path that make that easy.", tags: ["Web & SaaS", "UI/UX", "WhatsApp"],
    v: (<div className="vis v3" aria-hidden="true"><div className="fm"><span className="ts">New enquiry ✓</span><div className="fi">Your name</div><div className="fi">Phone or email</div><div className="bt">Send enquiry</div></div></div>) },
  { t: "Get the proof", s: "Tracking · Reporting", h: ["Know what actually", "brings business."], p: "Every enquiry is traced back to where it came from, so you stop paying for what doesn't work.", tags: ["Tracking", "Reporting", "Optimization"],
    v: (<div className="vis v4" aria-hidden="true"><div className="cap">Where your enquiries came from</div><div className="ch"><div className="col"><i style={{ "--h": "90%" }} />Search</div><div className="col"><i style={{ "--h": "62%" }} />Ads</div><div className="col"><i style={{ "--h": "38%" }} />Social</div></div></div>) },
];

export default function System() {
  const [cur, setCur] = useState(0), [auto, setAuto] = useState(false), [hover, setHover] = useState(false);
  const panel = useRef(null), tabs = useRef([]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); setAuto(true); } }, { threshold: 0.5 });
    io.observe(panel.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!auto || hover) return;
    const t = setTimeout(() => setCur((c) => (c + 1) % steps.length), 6000);
    return () => clearTimeout(t);
  }, [auto, hover, cur]);
  const pick = (i) => { setAuto(false); setCur(i); };
  const onKey = (e) => {
    const k = e.key; let n = null;
    if (k === "ArrowDown" || k === "ArrowRight") n = (cur + 1) % steps.length;
    if (k === "ArrowUp" || k === "ArrowLeft") n = (cur + steps.length - 1) % steps.length;
    if (n !== null) { e.preventDefault(); pick(n); tabs.current[n]?.focus(); }
  };

  return (
    <section className="band b-lav" id="system" aria-labelledby="syh">
      <div className="sec">
        <Reveal className="hd-c">
          <Sparkles />
          <span className="lab"><i />Our system</span>
          <h2 className="sh" id="syh">One plan.<br /><b>Four moves.</b></h2>
          <p className="ss">Everything we offer sits inside one of these four steps, so nothing runs on its own and nothing gets paid for twice.</p>
        </Reveal>
        <Reveal className="sg" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
          <div className="sl" role="tablist" aria-label="Our four steps" style={{ "--p": cur / (steps.length - 1) }}>
            <div className="sl-line" aria-hidden="true"><div className="sl-fill" /></div>
            {steps.map((s, i) => (
              <button key={s.t} ref={(el) => (tabs.current[i] = el)} role="tab" id={`t${i}`} aria-controls={`p${i}`} aria-selected={cur === i} tabIndex={cur === i ? 0 : -1}
                className={`sy${i < cur ? " done" : ""}${cur === i && auto && !hover ? " auto" : ""}`} onClick={() => pick(i)} onKeyDown={onKey}>
                <span className="n">0{i + 1}</span>
                <span><b>{s.t}</b><small>{s.s}</small></span>
                <span className="pb"><i /></span>
              </button>
            ))}
          </div>
          <div className="sp2" ref={panel}>
            {steps.map((s, i) => (
              <div key={s.t} className={`pane${cur === i ? " on" : ""}`} role="tabpanel" id={`p${i}`} aria-labelledby={`t${i}`} hidden={cur !== i}>
                <span className="cnt">Step 0{i + 1} of 04</span>
                <h3>{s.h[0]}<br /><b>{s.h[1]}</b></h3>
                <p>{s.p}</p>
                <div className="tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div>
                {s.v}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
