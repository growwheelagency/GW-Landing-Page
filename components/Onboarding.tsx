"use client";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Tick } from "./Icons";
import { pieces, usd, planTotals } from "../lib/shop";
import type { Plan } from "../lib/shop";
import { site } from "../lib/site";

gsap.registerPlugin(useGSAP);

const still = () => matchMedia("(prefers-reduced-motion:reduce)").matches;
const steps = ["Your plan", "Your details", "Your business", "Review"];
const goals = ["More enquiries", "More followers", "More sales", "Launch something new"];

export default function Onboarding({ plan, picked, onClose }: { plan: Plan; picked: string[]; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [goal, setGoal] = useState("");
  const [d, setD] = useState({ name: "", email: "", phone: "", business: "", website: "", message: "" });
  const root = useRef<HTMLDivElement>(null), box = useRef<HTMLDivElement>(null), closing = useRef(false);
  const t = planTotals(plan, picked);

  const done = state === "done";

  function close() {
    if (closing.current) return;
    closing.current = true;
    if (still()) return onClose();
    gsap
      .timeline({ onComplete: onClose })
      .to(box.current, { scale: 0.94, y: 14, opacity: 0, duration: 0.2, ease: "power2.in" })
      .to(root.current, { opacity: 0, duration: 0.18 }, "-=0.1");
  }

  // The card springs in once when the pop-up opens.
  useGSAP(() => {
    if (still()) return;
    gsap.from(root.current, { opacity: 0, duration: 0.25, ease: "power1.out" });
    gsap.from(box.current, { opacity: 0, duration: 0.2 });
    gsap.from(box.current, { scale: 0.78, y: 36, duration: 1.05, ease: "elastic.out(1, 0.62)", clearProps: "transform" });
  });

  // Each step, and the final screen, settles into place.
  useGSAP(
    () => {
      if (still()) return;
      gsap.from("form > :not(.ob-bar, .ob-a), .ob-ok > :not(.dot)", { y: 16, opacity: 0, duration: 0.65, stagger: 0.05, ease: "elastic.out(1, 0.75)", clearProps: "all" });
      gsap.fromTo(`.ob-bar i:nth-child(${step + 1})`, { scaleX: 0.3 }, { scaleX: 1, duration: 0.8, ease: "elastic.out(1, 0.55)", transformOrigin: "left center" });
      gsap.from(".ob-ok .dot", { scale: 0, rotation: -30, duration: 1, ease: "elastic.out(1, 0.5)", clearProps: "transform" });
    },
    { scope: box, dependencies: [step, done], revertOnUpdate: true },
  );

  useEffect(() => {
    const html = document.documentElement, was = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = was;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    box.current?.focus();
    box.current?.scrollTo(0, 0);
  }, [step, state]);

  const set = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setD((x) => ({ ...x, [e.target.name]: e.target.value }));

  async function submit() {
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...d,
          plan: plan.name,
          needs: goal ? [goal] : [],
          bucket: picked.map((id) => {
            const p = pieces[id];
            return { service: p.svc.t, item: p.name, price: p.price, billing: p.b };
          }),
          totals: { mo: t.mo, once: t.once },
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  function next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step < steps.length - 1) setStep(step + 1);
    else submit();
  }

  return createPortal(
    <div className="ob" ref={root} data-lenis-prevent onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="ob-c" ref={box} role="dialog" aria-modal="true" aria-label={`Start with ${plan.name}`} tabIndex={-1}>
        <button type="button" className="ob-x" aria-label="Close" onClick={close}>
          ×
        </button>
        {done ? (
          <div className="ob-ok">
            <span className="dot"><Tick size={22} /></span>
            <h3>You're almost in, {d.name.split(" ")[0]}.</h3>
            <p>
              We've got your {plan.name} plan. A founder will send your secure
              payment link within 24 hours. Nothing has been charged yet.
            </p>
            <button type="button" className="btn p" onClick={close}>Done</button>
          </div>
        ) : (
          <form onSubmit={next}>
            <span className="ob-s">Step {step + 1} of {steps.length}</span>
            <h3>{steps[step]}</h3>
            <div className="ob-bar" aria-hidden="true">
              {steps.map((s, i) => <i key={s} className={i <= step ? "on" : undefined} />)}
            </div>

            {(step === 0 || step === 3) && (
              <>
                <ul className="ob-l">
                  {picked.map((id) => (
                    <li key={id}>
                      <Tick size={11} />
                      <span>{pieces[id].name}</span>
                      <b>
                        {plan.included.includes(id) ? "Included" : `${usd(pieces[id].price)}${pieces[id].b === "mo" ? "/mo" : " once"}`}
                      </b>
                    </li>
                  ))}
                </ul>
                <dl className="ob-t">
                  {t.mo > 0 && <div><dt>{plan.name} monthly</dt><dd>{usd(t.mo)}/mo</dd></div>}
                  {t.once > 0 && <div><dt>One-time setup</dt><dd>{usd(t.once)}</dd></div>}
                  <div className="all"><dt>Due to start</dt><dd>{usd(t.mo + t.once)}</dd></div>
                </dl>
              </>
            )}

            {step === 1 && (
              <div className="ob-f">
                <label>Your name<input name="name" required value={d.name} onChange={set} autoComplete="name" placeholder="e.g. John Smith" /></label>
                <label>Work email<input name="email" type="email" required value={d.email} onChange={set} autoComplete="email" placeholder="you@company.com" /></label>
                <label>Phone or WhatsApp<input name="phone" type="tel" required value={d.phone} onChange={set} autoComplete="tel" placeholder="+91 98765 43210" /></label>
              </div>
            )}

            {step === 2 && (
              <div className="ob-f">
                <label>Business name<input name="business" required value={d.business} onChange={set} autoComplete="organization" placeholder="Your business" /></label>
                <label>Website or Instagram (optional)<input name="website" value={d.website} onChange={set} placeholder="yourbrand.com or @yourbrand" /></label>
                <div>
                  <span className="ob-fl">Main goal</span>
                  <div className="ob-chs">
                    {goals.map((g) => (
                      <button type="button" key={g} aria-pressed={goal === g} onClick={() => setGoal(goal === g ? "" : g)}>{g}</button>
                    ))}
                  </div>
                </div>
                <label>Anything we should know? (optional)<textarea name="message" rows={3} value={d.message} onChange={set} /></label>
              </div>
            )}

            {step === 3 && (
              <p className="ob-n">
                Online payment is being set up. Press the button and a founder
                will send your secure payment link within 24 hours. You won't be
                charged now.
              </p>
            )}
            {state === "error" && (
              <p className="ob-e" role="alert">
                We couldn't send that just now. Please{" "}
                <a href={`https://wa.me/${site.whatsapp}`}>WhatsApp us</a> instead.
              </p>
            )}

            <div className="ob-a">
              {step > 0 && (
                <button type="button" className="btn g" onClick={() => setStep(step - 1)}>Back</button>
              )}
              <button type="submit" className="btn p" disabled={state === "sending"}>
                {step < steps.length - 1 ? "Continue" : state === "sending" ? "Sending…" : "Get my payment link"}
                <span className="arr" aria-hidden="true">→</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
