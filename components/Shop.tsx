"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Reveal from "./Reveal";
import Sparkles from "./Sparkles";
import DotPattern from "./DotPattern";
import Eyebrow from "./Eyebrow";
import Onboarding from "./Onboarding";
import { Plus, Sparkle, Tick } from "./Icons";
import { plans, pieces, idsOf, usd, planTotals } from "../lib/shop";
import type { Plan, Service } from "../lib/shop";

function Row({ s, plan, open, picked, onOpen, onToggle, extra }: {
  s: Service;
  plan: Plan;
  open: boolean;
  picked: string[];
  onOpen: () => void;
  onToggle: (id: string) => void;
  extra: boolean;
}) {
  const ids = idsOf(s);
  const count = ids.filter((id) => picked.includes(id)).length;
  return (
    <div className={`pl-s${open ? " open" : ""}`}>
      <button type="button" className="pl-h" aria-expanded={open} onClick={onOpen}>
        <span className="pl-t">
          {s.t}
          {extra && <em>Added</em>}
        </span>
        {count > 0 && <span className="pl-n">{count}</span>}
        <i><Plus size={12} /></i>
      </button>
      <div className="pl-p" inert={!open}>
        <div className="pl-pi">
          <ul>
            {ids.map((id) => {
              const p = pieces[id], on = picked.includes(id);
              return (
                <li key={id}>
                  <label className={on ? "on" : undefined}>
                    <input type="checkbox" checked={on} onChange={() => onToggle(id)} />
                    <span className="pl-c"><Tick size={11} /></span>
                    <span className="pl-m">{p.name}</span>
                    {plan.included.includes(id) ? (
                      <span className="pl-v inc">Included</span>
                    ) : (
                      <span className="pl-v">
                        {usd(p.price)}
                        <small>{p.b === "mo" ? "/mo" : " once"}</small>
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ plan, featured }: { plan: Plan; featured: boolean }) {
  const [picked, setPicked] = useState(plan.included);
  const [open, setOpen] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const num = useRef<HTMLElement>(null), shown = useRef({ v: plan.price });
  const t = planTotals(plan, picked);
  const main = t.mo || t.once;
  const per = !t.mo && t.once ? "one-time" : "month";
  const notes = [
    t.saved > 0 && `You save ${usd(t.saved)}/month`,
    t.mo > 0 && t.once > 0 && `+ ${usd(t.once)} one-time`,
  ].filter(Boolean);

  // GSAP owns this number: React renders it once and never touches it again.
  useEffect(() => {
    const still = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const tw = gsap.to(shown.current, {
      v: main,
      duration: still ? 0 : 0.45,
      ease: "power2.out",
      onUpdate: () => {
        num.current!.textContent = usd(shown.current.v);
      },
    });
    return () => {
      tw.kill();
    };
  }, [main]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const changed = picked.length !== plan.included.length || plan.included.some((id) => !picked.includes(id));

  return (
    <article className={`pl${featured ? " hi" : ""}`}>
      {featured && <DotPattern gap={14} className="pl-dots" />}
      {featured && (
        <span className="pl-badge">
          <Sparkle />
          Most complete
        </span>
      )}
      <h3>{plan.name}</h3>
      <p className="pl-sub">{plan.sub}</p>

      <div className="pl-price" aria-live="polite">
        <strong ref={num}>{usd(plan.price)}</strong>
        <span>/ {per}</span>
      </div>
      <p className="pl-once">{notes.join("  ·  ") || " "}</p>

      <div className="pl-box">
        <span className="pl-ic">
          <Tick size={16} />
        </span>
        <div>
          <b>{picked.length} service{picked.length === 1 ? "" : "s"} selected</b>
          <small>{changed ? "Your price updates as you change it" : "Ready to go, or change it below"}</small>
        </div>
        {changed && (
          <button type="button" className="pl-clear" onClick={() => setPicked(plan.included)}>
            Reset
          </button>
        )}
      </div>

      <p className="pl-lab">Included in {plan.name}</p>
      <ul className="pl-inc">
        {plan.included.map((id) => (
          <li key={id} className={picked.includes(id) ? undefined : "off"}>
            <Tick size={11} />
            {pieces[id].name}
          </li>
        ))}
      </ul>

      <p className="pl-lab">Add or remove services</p>
      <div className="pl-list">
        {plan.services.map((s) => (
          <Row
            key={s.id}
            s={s}
            plan={plan}
            open={open === s.id}
            picked={picked}
            extra={featured && s.id === "web"}
            onOpen={() => setOpen(open === s.id ? null : s.id)}
            onToggle={toggle}
          />
        ))}
      </div>

      <button type="button" className={`btn ${featured ? "p" : "g"} pl-cta`} disabled={!picked.length} onClick={() => setStarting(true)}>
        Start with {plan.name}{" "}
        <span className="arr" aria-hidden="true">
          →
        </span>
      </button>
      <p className="pl-foot">
        Billed monthly <i /> No lock-in <i /> Cancel anytime
      </p>
      {starting && <Onboarding plan={plan} picked={picked} onClose={() => setStarting(false)} />}
    </article>
  );
}

export default function Shop() {
  return (
    <section className="band b-canvas" id="services" aria-labelledby="plh">
      <div className="sec">
        <Reveal className="hd-c">
          <Sparkles />
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="sh" id="plh">
            Start with a plan.
            <br />
            <b>Make it yours.</b>
          </h2>
          <p className="ss">
            Each plan comes with the essentials at a lower price. Open any
            service to add what you need or remove what you don't.
          </p>
        </Reveal>
        <div className="pls">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={0.05 + i * 0.1}>
              <PlanCard plan={p} featured={i === 1} />
            </Reveal>
          ))}
        </div>
        <p className="pl-note">Ad spend is paid directly to Meta.</p>
      </div>
    </section>
  );
}
