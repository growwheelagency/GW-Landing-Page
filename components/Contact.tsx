"use client";
import { useState } from "react";
import type { FormEvent } from "react";
import Reveal from "./Reveal";
import { Tick } from "./Icons";
import { site } from "../lib/site";
import Eyebrow from "./Eyebrow";

const needs = [
  "Paid ads",
  "Social media",
  "Website",
  "UI/UX",
  "Not sure yet",
];

export default function Contact() {
  const [needsPicked, setNeedsPicked] = useState<string[]>([]);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const toggle = (n: string) =>
    setNeedsPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  async function submit(e: FormEvent<HTMLFormElement>) {
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
          phone: f.get("phone"),
          website: f.get("website"),
          message: f.get("message"),
          needs: needsPicked,
        }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Something went wrong.");
      setState("done");
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong.");
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
                <label>
                  Your name
                  <input
                    name="name"
                    required
                    placeholder="e.g. John Smith"
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
                  Phone or WhatsApp (optional)
                  <input
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
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
                      Get my free audit{" "}
                      <span className="arr" aria-hidden="true">
                        →
                      </span>
                    </>
                  )}
                </button>
                {state === "error" && (
                  <p className="note err" role="alert">
                    {err} Please{" "}
                    <a href={`https://wa.me/${site.whatsapp}`}>WhatsApp us</a>{" "}
                    instead.
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
