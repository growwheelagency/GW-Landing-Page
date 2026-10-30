"use client";
import { useEffect, useRef } from "react";
import { mag } from "../lib/mag";
import { site } from "../lib/site";
import Avatar from "./Avatar";
import { Sparkle, Tick } from "./Icons";

const WORDS = ["Turning", "Bold", "Ideas", "Into", "Digital", "Momentum."];
const DEFAULT = [5, 5]; // "Momentum." starts selected, like the Figma

type Timer = ReturnType<typeof setTimeout>;

export default function Hero() {
  const hero = useRef<HTMLElement>(null),
    h = useRef<HTMLHeadingElement>(null),
    sel = useRef<HTMLSpanElement>(null),
    tip = useRef<HTMLSpanElement>(null);
  const copy = useRef<HTMLButtonElement>(null),
    paste = useRef<HTMLButtonElement>(null),
    words = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const H = h.current!,
      S = sel.current!,
      T = tip.current!,
      W = words.current;
    const timers: Timer[] = [];
    let cur = [...DEFAULT],
      ready = false;

    function place(a: number, b: number, collapsed: boolean) {
      const hr = H.getBoundingClientRect(),
        f = W[a].getBoundingClientRect();
      const left = f.left;
      let right = f.right;
      for (let i = a + 1; i <= b; i++) {
        const r = W[i].getBoundingClientRect();
        if (Math.abs(r.top - f.top) < 8) right = Math.max(right, r.right);
      }
      const pad = 6,
        top = f.top - hr.top + f.height * 0.1,
        ht = f.height * 0.8;
      S.style.left = left - hr.left - pad + "px";
      S.style.top = top + "px";
      S.style.height = ht + "px";
      S.style.width = collapsed ? "0px" : right - left + pad * 2 + "px";
      const below = f.top > W[0].getBoundingClientRect().top + 10; // selection on 2nd line: tooltip goes underneath
      T.classList.toggle("below", below);
      const cx = (left + right) / 2 - hr.left,
        tw = T.offsetWidth || 132;
      const tl = Math.max(0, Math.min(hr.width - tw, cx - tw / 2));
      T.style.left = tl + "px";
      T.style.top = (below ? top + ht + 14 : top - T.offsetHeight - 12) + "px";
      T.style.setProperty(
        "--ax",
        Math.max(18, Math.min(tw - 18, cx - tl)) + "px",
      );
    }
    function setRange(a: number, b: number) {
      cur = [a, b];
      W.forEach((w, i) => w.classList.toggle("on", i >= a && i <= b));
      place(a, b, false);
    }
    const text = () =>
      W.slice(cur[0], cur[1] + 1)
        .map((w) => w.textContent)
        .join(" ");
    const clicks = W.map((w, i) => {
      const fn = () => {
        if (ready) {
          setRange(i, i);
          T.classList.add("show");
        }
      };
      w.addEventListener("click", fn);
      return [w, fn] as const;
    });
    function flash(btn: HTMLButtonElement & { _t?: Timer }, label: string) {
      const o = btn.dataset.o || btn.textContent || "";
      btn.dataset.o = o;
      btn.textContent = label;
      clearTimeout(btn._t);
      btn._t = setTimeout(() => (btn.textContent = o), 1200);
    }
    const onCopy = () => {
      try {
        navigator.clipboard && navigator.clipboard.writeText(text());
      } catch {}
      flash(copy.current!, "Copied ✓");
    };
    const onPaste = () => flash(paste.current!, "Pasted ✓");
    copy.current!.addEventListener("click", onCopy);
    paste.current!.addEventListener("click", onPaste);
    const onDoc = (e: MouseEvent) => {
      if (!H.contains(e.target as Node)) T.classList.remove("show");
    };
    document.addEventListener("click", onDoc);

    const start = () => {
      place(cur[0], cur[1], true);
      timers.push(
        setTimeout(() => {
          S.classList.add("show");
          place(cur[0], cur[1], false);
          timers.push(
            setTimeout(() => {
              ready = true;
            }, 650),
          );
        }, 1150),
      );
    };
    (document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve()
    ).then(start);

    let rt: Timer | undefined;
    const onResize = () => {
      clearTimeout(rt);
      rt = setTimeout(() => ready && place(cur[0], cur[1], false), 80);
    };
    window.addEventListener("resize", onResize);

    const el = hero.current!;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", String(((e.clientX - r.left) / r.width - 0.5) * 2));
      el.style.setProperty("--my", String(((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    el.addEventListener("pointermove", onMove);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(rt);
      clicks.forEach(([w, fn]) => w.removeEventListener("click", fn));
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onDoc);
      el.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section
      className="hero"
      id="top"
      ref={hero}
      aria-label={`${site.name} hero`}
    >
      <div className="dots" aria-hidden="true" />
      <div className="bw b1" aria-hidden="true">
        <div className="blob" />
      </div>
      <div className="bw b2" aria-hidden="true">
        <div className="blob" />
      </div>
      <div className="bw b3" aria-hidden="true">
        <div className="blob" />
      </div>

      <div className="content">
        {[
          ["c1", "SEO"],
          ["c2", "Paid Ads"],
          ["c3", "Web"],
        ].map(([c, l]) => (
          <div key={c} className={`cur ${c}`} aria-hidden="true">
            <svg width="18" height="22" viewBox="0 0 18 22">
              <path
                d="M1.5 1.5v16l4.4-4.2 3.3 7.2 3-1.4-3.3-7 6.1-.4z"
                fill="var(--c)"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span>{l}</span>
          </div>
        ))}

        <div className="eyebrow rise" style={{ "--d": ".15s" }}>
          <span className="avs" aria-hidden="true">
            {site.team.map((m, i) => (
              <Avatar key={i} photo={m.photo} name={m.name} />
            ))}
          </span>
          <span>
            Paid Ads <span className="sep">·</span> Web{" "}
            <span className="sep">—</span>{" "}
            <b>one team, zero handoffs.</b>
          </span>
        </div>

        <h1 id="h" ref={h} className="rise" style={{ "--d": ".28s" }}>
          <span className="sel" ref={sel} aria-hidden="true">
            <i className="a" />
            <i className="b" />
          </span>
          <span className="tip" ref={tip} aria-hidden="true">
            <button type="button" tabIndex={-1} ref={copy}>
              Copy
            </button>
            <button type="button" tabIndex={-1} ref={paste}>
              Paste
            </button>
          </span>
          {WORDS.map((w, i) => (
            <span key={w}>
              <span
                ref={(el) => {
                  if (el) words.current[i] = el;
                }}
                className={`w${i >= DEFAULT[0] && i <= DEFAULT[1] ? " on" : ""}`}
              >
                {w}
              </span>
              {" "}
              {i === 2 && <span className="brk" />}
            </span>
          ))}
          <span className="sp" aria-hidden="true">
            <Sparkle className="s1" />
            <Sparkle className="s2" />
            <Sparkle className="s3" />
          </span>
        </h1>

        <p className="sub rise" style={{ "--d": ".42s" }}>
          We build digital systems that turn demand into customers — across SEO,
          paid ads, social and your website.
          <span className="l2">
            Not more traffic. <b>More business.</b>
          </span>
        </p>

        <div className="ctas rise" style={{ "--d": ".54s" }}>
          <a className="btn p" href="#contact" {...mag}>
            Let's Talk Strategy{" "}
            <span className="arr" aria-hidden="true">
              →
            </span>
          </a>
          <a className="btn g" href="#how" {...mag}>
            See How We Work{" "}
            <span className="arr" aria-hidden="true">
              ↓
            </span>
          </a>
        </div>

        <div className="pills rise" style={{ "--d": ".64s" }}>
          <span className="pill">
            <Sparkle className="stp" />
            Free strategy audit, no obligation
          </span>
          <span className="pill">
            <svg
              className="bolt"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M13.5 0L3 14h7l-1.5 10L21 9h-7.5z" />
            </svg>
            Reply within 24 hours
          </span>
        </div>

        {/* <ul className="checks rise" style={{ "--d": ".74s" }}>
          <li>
            <span className="c">
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path style={{ "--cd": "1.3s" }} d="M2.5 6.3l2.4 2.4 4.6-5" />
              </svg>
            </span>
            <span>
              <b>No junior handoffs</b> — founders on every account
            </span>
          </li>
          <li>
            <span className="c">
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path style={{ "--cd": "1.55s" }} d="M2.5 6.3l2.4 2.4 4.6-5" />
              </svg>
            </span>
            <span>
              <b>Strategy before spend</b> — we don't run ads blind
            </span>
          </li>
        </ul> */}
      </div>
    </section>
  );
}
