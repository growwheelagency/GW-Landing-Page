"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import { Tick } from "./Icons";
import { site } from "../lib/site";
import { useBucket } from "../lib/bucket";
import { pieces, totals, inr } from "../lib/shop";
import Eyebrow from "./Eyebrow";

const needs = [
  "SEO",
  "Paid ads",
  "Social media",
  "Website",
  "UI/UX",
  "Not sure yet",
];

export default function Contact() {
  const [needsPicked, setNeedsPicked] = useState([]);
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [err, setErr] = useState("");
  const picked = useBucket();
  const tot = totals(picked);
  const toggle = (n) =>
    setNeedsPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("sending");
    setErr("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"),
          email: f.get("email"),
          website: f.get("website"),
          message: f.get("message"),
          needs: needsPicked,
          bucket: picked.map((id) => {
            const p = pieces[id];
            return { service: p.svc.t, item: p.name, price: p.price, billing: p.b };
          }),
          totals: tot,
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Something went wrong.");
      setState("done");
    } catch (x) {
      setErr(x.message);
      setState("error");
    }
  }

  return (
    <section className="band b-dark" id="contact" aria-labelledby="ch">
      <div className="sec">
        <div className="ct">
          <Reveal>
            <Eyebrow>Free audit</Eyebrow>
            <h2 className="sh" id="ch">
              Let's look at your
              <br />
              marketing. <b>Free.</b>
            </h2>
            <p className="ss">
              Tell us where you are. Within 48 hours a founder sends you a
              plain-English teardown of your site, ads and search presence, and
              the three fixes we'd make first.
            </p>
            <ul className="perks">
              <li>
                <Tick />
                No obligation, no sales script
              </li>
              <li>
                <Tick />A founder replies within 24 hours
              </li>
              <li>
                <Tick />
                No lock-in if we work together
              </li>
            </ul>
            <p className="alt">
              Prefer to talk?{" "}
              <a href={`https://wa.me/${site.whatsapp}`}>WhatsApp us</a> or
              write to <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            {state === "done" ? (
              <div className="fm2 ok2">
                <span className="dot">
                  <Tick size={22} />
                </span>
                <h3>Got it. Thank you.</h3>
                <p>
                  A founder will reply within 24 hours with next steps for your
                  free audit.
                </p>
              </div>
            ) : (
              <form className="fm2" onSubmit={submit} noValidate={false}>
                {picked.length > 0 && (
                  <div className="bk-sum">
                    <div className="bk-h">
                      <span>
                        Your bucket · {picked.length} piece
                        {picked.length > 1 ? "s" : ""}
                      </span>
                      <a href="#services">Edit</a>
                    </div>
                    <ul>
                      {picked.slice(0, 4).map((id) => (
                        <li key={id}>{pieces[id].name}</li>
                      ))}
                      {picked.length > 4 && <li>+ {picked.length - 4} more</li>}
                    </ul>
                    <span className="bk-t">
                      {inr(tot.mo)}/mo + {inr(tot.once)} one-time
                    </span>
                  </div>
                )}
                <label>
                  Your name
                  <input
                    name="name"
                    required
                    placeholder="e.g. Riya Sharma"
                    autoComplete="name"
                  />
                </label>
                <label>
                  Work email
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </label>
                <label>
                  Website (optional)
                  <input
                    name="website"
                    placeholder="yourbrand.com"
                    autoComplete="url"
                  />
                </label>
                <div>
                  <span className="fl">What do you need help with?</span>
                  <div className="chs">
                    {needs.map((n) => (
                      <button
                        type="button"
                        key={n}
                        aria-pressed={needsPicked.includes(n)}
                        onClick={() => toggle(n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <label>
                  Anything we should know? (optional)
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Your goal, budget range, deadline…"
                  />
                </label>
                <button
                  className="btn p"
                  type="submit"
                  disabled={state === "sending"}
                >
                  {state === "sending" ? (
                    "Sending…"
                  ) : (
                    <>
                      {picked.length ? "Send my bucket" : "Get my free audit"}{" "}
                      <span className="arr" aria-hidden="true">
                        →
                      </span>
                    </>
                  )}
                </button>
                {state === "error" && (
                  <p className="note err" role="alert">
                    {err}
                  </p>
                )}
                <p className="note">
                  No spam. We only use your details to reply to you.
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
