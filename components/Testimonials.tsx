"use client";
import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import Avatar from "./Avatar";
import DotPattern from "./DotPattern";
import Eyebrow from "./Eyebrow";
import { Quote, Sparkle } from "./Icons";
import { mag } from "../lib/mag";
import { site } from "../lib/site";
import type { Testimonial } from "../lib/site";

// Layout preview for `npm run dev` only. Production shows real entries or nothing.
const samples: Testimonial[] = [
  { name: "Aarav Malhotra", business: "Owner, Smile Studio Dental", quote: "They found problems in our website that nobody had told us about, and fixed them in the first month.", photo: "https://i.pravatar.cc/120?img=12" },
  { name: "Neha Kapoor", business: "Founder, Kapoor Interiors", quote: "A clear plan, plain English, and a founder on every call. We always know where our budget is going.", photo: "https://i.pravatar.cc/120?img=47" },
  { name: "Rohan Verma", business: "Director, FitZone Gym", quote: "We finally know which ads bring enquiries, so we stopped paying for the ones that don't.", photo: "https://i.pravatar.cc/120?img=33" },
];
const list = site.testimonials.length || process.env.NODE_ENV !== "development" ? site.testimonials : samples;

export default function Testimonials() {
  const [cur, setCur] = useState(Math.min(1, list.length - 1)); // the middle card starts active
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (list.length < 2 || hover || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const t = setTimeout(() => setCur((c) => (c + 1) % list.length), 5000);
    return () => clearTimeout(t);
  }, [cur, hover]);

  if (!list.length) return null;

  return (
    <section className="band b-white" id="stories" aria-labelledby="tmh">
      <div className="sec">
        <div className="tm">
          <Reveal className="tm-l">
            <Eyebrow>Client stories</Eyebrow>
            <h2 className="sh" id="tmh">
              What our clients
              <br />
              <b>say about us.</b>
            </h2>
            <p className="ss">
              No stock quotes. These are real people running real businesses.
            </p>
            <a className="btn p" href="#contact" {...mag}>
              Get my free audit{" "}
              <span className="arr" aria-hidden="true">
                →
              </span>
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="tm-r" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <DotPattern gap={16} r={1.1} className="tm-dots" />
              <svg className="tm-sq" viewBox="0 0 84 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 37c5-12 13-16 16-10s-4 15 3 15 10-22 17-20-3 15 5 13 15-13 26-20" />
                <path d="M60 10l10 5-7 8" />
              </svg>
              <Sparkle className="tm-st" />
              {list.map((t, i) => (
                <article key={t.name} className={`tm-c${i === cur ? " on" : ""}`} onMouseEnter={() => setCur(i)} onClick={() => setCur(i)}>
                  <Avatar photo={t.photo} name={t.name} />
                  <div className="tm-tx">
                    <h3>{t.link ? <a href={t.link} target="_blank" rel="noopener noreferrer">{t.name}</a> : t.name}</h3>
                    <span className="tm-b">{t.business}</span>
                    <blockquote>{t.quote}</blockquote>
                  </div>
                  <Quote className="tm-q" />
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
