"use client";
import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import Sparkles from "./Sparkles";
import { Tick } from "./Icons";
import { spot } from "../lib/mag";
import Eyebrow from "./Eyebrow";
import DotPattern from "./DotPattern";

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    el.textContent = "0";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let t0: number | null = null;
        const f = (t: number) => {
          if (!t0) t0 = t;
          const p = Math.min((t - t0) / 1100, 1);
          el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(f);
        };
        requestAnimationFrame(f);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{to}</span>;
}

const cards = [
  {
    n: 24,
    u: "hours",
    t: "Answered in a day",
    p: "Send us a message. A founder writes back within 24 hours, not a ticket number or an auto-reply.",
    c: "Test it today",
  },
  {
    n: 3,
    u: "founders",
    t: "The builders are in the room",
    p: "The people who plan your campaign are the ones who run it and report on it. Nothing passes through a middle layer.",
    c: "Ask for us by name",
  },
  {
    n: 48,
    u: "hours",
    t: "We look before we pitch",
    p: "A free teardown of your site, ads and search presence lands in your inbox before you spend anything with us.",
    c: "Free, no strings",
  },
];

export default function Promises() {
  return (
    <section className="band b-white" aria-labelledby="ph">
      <div className="sec">
        <Reveal className="hd-c">
          <Sparkles />
          <Eyebrow>What you can hold us to</Eyebrow>
          <h2 className="sh" id="ph">
            Claims you can check
            <br />
            <b>before you hire us.</b>
          </h2>
          <p className="ss">
            We're new, so we won't dress this page in borrowed logos. Here's
            what you can verify yourself, starting today.
          </p>
        </Reveal>
        <div className="pg">
          {cards.map((c, i) => (
            <Reveal key={c.t} delay={0.05 + i * 0.1}>
              <article className="pc" {...spot}>
                <DotPattern />
                <div className="big">
                  <span className="num">
                    <Count to={c.n} />
                  </span>
                  <small>{c.u}</small>
                </div>
                <h3>{c.t}</h3>
                <p>{c.p}</p>
                <span className="chk">
                  <Tick size={12} />
                  {c.c}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="nl">
          <span className="dot">
            <Tick size={16} />
          </span>
          <span>
            <b>No lock-in.</b> Stay because it's working. If it isn't, you can
            walk away.
          </span>
        </Reveal>
      </div>
    </section>
  );
}
