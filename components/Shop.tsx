"use client";
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import Sparkles from "./Sparkles";
import { Plus, Tick } from "./Icons";
import { services, groups, pieces, idsOf, inr, totals } from "../lib/shop";
import type { Service } from "../lib/shop";
import { bucket, useBucket } from "../lib/bucket";
import Eyebrow from "./Eyebrow";

gsap.registerPlugin(useGSAP, Draggable, Flip);

// Shelf order is mixed on purpose so the shop feels like a market stall, not a list.
const ORDER = [
  "igfb",
  "web",
  "gads",
  "content",
  "saas",
  "local",
  "meta",
  "lp",
  "msg",
  "organic",
  "seo",
];
const ROT = [-3, 2, -1.5, 3, -2.5, 1.5, -2, 2.5, -1, 3, -2];
const shelf = ORDER.map((id) => services.find((s) => s.id === id)!);
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function Basket() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9h18l-1.6 9.2a2 2 0 0 1-2 1.8H6.6a2 2 0 0 1-2-1.8z" />
      <path d="M8 9l3-5M16 9l-3-5M9 13v3M15 13v3" />
    </svg>
  );
}

export default function Shop() {
  const picked = useBucket();
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null),
    shelfEl = useRef<HTMLDivElement>(null),
    dw = useRef<HTMLDivElement>(null),
    bk = useRef<HTMLDivElement>(null),
    icon = useRef<HTMLSpanElement>(null),
    moEl = useRef<HTMLSpanElement>(null),
    onceEl = useRef<HTMLSpanElement>(null);
  const floats = useRef<Record<string, gsap.core.Tween>>({}),
    dragged = useRef(false),
    fromH = useRef(0),
    flip = useRef<Flip.FlipState | null>(null),
    shown = useRef({ mo: 0, once: 0 });

  // A dot flies from what was picked into the bucket icon.
  function fly(el?: Element) {
    if (!el || !icon.current || reduced()) return;
    const a = el.getBoundingClientRect(),
      b = icon.current.getBoundingClientRect();
    const x0 = a.left + a.width / 2 - 8,
      y0 = a.top + a.height / 2 - 8;
    const x1 = b.left + b.width / 2 - 8,
      y1 = Math.min(b.top + b.height / 2 - 8, innerHeight - 24);
    const d = document.createElement("span");
    d.className = "ls-fly";
    document.body.appendChild(d);
    gsap.set(d, { x: x0, y: y0 });
    gsap
      .timeline({
        onComplete() {
          d.remove();
          gsap.fromTo(
            icon.current,
            { scale: 1 },
            {
              scale: 1.18,
              duration: 0.16,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
            },
          );
        },
      })
      .to(d, { x: x1, duration: 0.75, ease: "power1.inOut" }, 0)
      .to(d, { y: Math.min(y0, y1) - 80, duration: 0.3, ease: "power2.out" }, 0)
      .to(d, { y: y1, duration: 0.45, ease: "power2.in" }, 0.3)
      .to(d, { scale: 0.5, duration: 0.75 }, 0);
  }

  // Every bucket change goes through here so the list can animate with Flip.
  function commit(next: string[]) {
    if (bk.current && !reduced())
      flip.current = Flip.getState(
        bk.current.querySelectorAll("[data-flip-id]"),
      );
    bucket.set(next);
  }
  function togglePiece(id: string, el?: Element) {
    const cur = bucket.get();
    if (cur.includes(id)) return commit(cur.filter((x) => x !== id));
    commit([...cur, id]);
    fly(el);
  }
  function addAll(s: Service, el: Element) {
    const cur = bucket.get(),
      add = idsOf(s).filter((id) => !cur.includes(id));
    if (!add.length) return;
    commit([...cur, ...add]);
    fly(el);
  }
  function removeAll(s: Service) {
    const ids = idsOf(s);
    commit(bucket.get().filter((x) => !ids.includes(x)));
  }

  // Shelf: chips pop in, then float. Drag is mouse-only; touch users tap.
  useGSAP(
    () => {
      const b = bk.current!,
        parentOf = (el: unknown) => (el as HTMLElement).parentNode as HTMLElement,
        wraps = gsap.utils.toArray<HTMLElement>(".ls-w", shelfEl.current),
        chips = gsap.utils.toArray<HTMLElement>(".ls-chip", shelfEl.current);
      chips.forEach((c, i) => gsap.set(c, { rotation: ROT[i] }));

      if (matchMedia("(pointer: fine)").matches) {
        Draggable.create(chips, {
          dragClickables: true,
          minimumMovement: 6,
          autoScroll: 1,
          zIndexBoost: false,
          onDragStart() {
            dragged.current = true;
            const w = parentOf(this.target);
            w.classList.add("drag");
            floats.current[w.dataset.id!]?.pause();
            b.classList.add("ready");
          },
          onDrag() {
            b.classList.toggle("over", this.hitTest(b, "30%"));
          },
          onDragEnd() {
            const w = parentOf(this.target);
            if (this.hitTest(b, "30%"))
              addAll(
                services.find((s) => s.id === w.dataset.id)!,
                this.target,
              );
            b.classList.remove("ready", "over");
            gsap.to(this.target, {
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "elastic.out(1, 0.65)",
              onComplete() {
                w.classList.remove("drag");
                floats.current[w.dataset.id!]?.play();
              },
            });
            setTimeout(() => (dragged.current = false), 60);
          },
        });
      }

      if (reduced()) return;
      gsap.set(wraps, { autoAlpha: 0, y: 30, scale: 0.8 });
      wraps.forEach((w, i) => {
        floats.current[w.dataset.id!] = gsap.to(w, {
          y: i % 2 ? -7 : 7,
          duration: 2.4 + (i % 4) * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        });
      });
      const all = () => Object.values(floats.current);
      let started = false;
      const io = new IntersectionObserver(
        ([e]) => {
          if (!started && e.isIntersecting) {
            started = true;
            gsap.to(wraps, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "back.out(1.6)",
              stagger: { each: 0.06, from: "random" },
              onComplete: () => all().forEach((t) => t.play()),
            });
          } else if (started) {
            all().forEach((t) => (e.isIntersecting ? t.play() : t.pause())); // no floating off-screen
          }
        },
        { threshold: 0.2 },
      );
      io.observe(shelfEl.current!);
      return () => io.disconnect();
    },
    { scope: root },
  );

  // Detail panel: grow from its old height to the new content, items stagger in.
  useGSAP(
    () => {
      const el = dw.current;
      if (!open || !el) return;
      if (reduced()) return void gsap.set(el, { height: "auto" });
      gsap.fromTo(
        el,
        { height: fromH.current },
        {
          height: "auto",
          duration: 0.55,
          ease: "power3.out",
          onComplete() {
            if (el.getBoundingClientRect().bottom > innerHeight)
              el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          },
        },
      );
      gsap.fromTo(
        el.querySelectorAll(".ls-it"),
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.04,
          delay: 0.08,
        },
      );
    },
    { dependencies: [open], scope: root },
  );

  function pick(id: string) {
    if (dragged.current) return; // the click that ends a drag
    if (open === id) return close();
    gsap.killTweensOf(dw.current);
    fromH.current = dw.current!.offsetHeight;
    setOpen(id);
  }
  function close() {
    const el = dw.current!;
    gsap.killTweensOf(el);
    if (reduced()) {
      gsap.set(el, { height: 0 });
      return setOpen(null);
    }
    gsap.to(el, {
      height: 0,
      duration: 0.4,
      ease: "power3.inOut",
      onComplete: () => setOpen(null),
    });
  }

  // Bucket rows slide into place; new rows fade in.
  useLayoutEffect(() => {
    const st = flip.current;
    flip.current = null;
    if (!st || !bk.current) return;
    Flip.from(st, {
      targets: bk.current.querySelectorAll("[data-flip-id]"),
      duration: 0.45,
      ease: "power3.inOut",
      simple: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { autoAlpha: 0, x: -16 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.05,
          },
        ),
    });
  }, [picked]);

  // Totals count up or down.
  const t = totals(picked);
  useEffect(() => {
    const o = shown.current;
    const draw = () => {
      if (moEl.current) moEl.current.textContent = inr(o.mo);
      if (onceEl.current) onceEl.current.textContent = inr(o.once);
    };
    if (reduced()) {
      o.mo = t.mo;
      o.once = t.once;
      draw();
      return;
    }
    draw();
    const tw = gsap.to(o, {
      mo: t.mo,
      once: t.once,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: draw,
    });
    return () => {
      tw.kill();
    };
  }, [t.mo, t.once]);

  const cur = services.find((s) => s.id === open);
  const allIn = cur && idsOf(cur).every((id) => picked.includes(id));
  const chosen = services
    .map((s) => ({ s, ids: idsOf(s).filter((id) => picked.includes(id)) }))
    .filter((c) => c.ids.length);

  return (
    <section
      className="band b-canvas ls"
      id="services"
      aria-labelledby="lsh"
      ref={root}
    >
      <div className="sec">
        <Reveal className="hd-c">
          <Sparkles />
          <Eyebrow>Lead shop</Eyebrow>
          <h2 className="sh" id="lsh">
            Build your own
            <br />
            <b>growth bucket.</b>
          </h2>
          <p className="ss">
            Every service, broken into pieces with a price on each. Pick only
            what you need and watch your total add up.
          </p>
        </Reveal>

        <div className="ls-shelf" ref={shelfEl}>
          <div className="ls-top">
            <span className="ls-open">
              <i />
              Shop is open · {services.length} services
            </span>
            <span className="ls-leg">
              {Object.entries(groups).map(([k, v]) => (
                <span key={k}>
                  <i className={`g-${k}`} />
                  {v}
                </span>
              ))}
            </span>
          </div>
          <div className="ls-chips">
            {shelf.map((s) => {
              const n = idsOf(s).filter((id) => picked.includes(id)).length;
              return (
                <div className="ls-w" key={s.id} data-id={s.id}>
                  <button
                    type="button"
                    className={`ls-chip g-${s.g}${open === s.id ? " on" : ""}`}
                    aria-expanded={open === s.id}
                    aria-controls="ls-detail"
                    onClick={() => pick(s.id)}
                  >
                    {s.t}
                    {n > 0 && <span className="ls-n">{n}</span>}
                  </button>
                </div>
              );
            })}
          </div>
          <p className="ls-hint">
            Tap a service to see what&apos;s inside
            <span className="ls-fine">
              {" "}
              · or drag it into your bucket to add the whole thing
            </span>
          </p>
        </div>

        <div className="ls-dw" ref={dw}>
          {cur && (
            <div
              className="ls-d"
              id="ls-detail"
              role="region"
              aria-label={`${cur.t}: pick pieces`}
            >
              <div className="ls-dh">
                <div>
                  <span className={`ls-g g-${cur.g}`}>{groups[cur.g]}</span>
                  <h3>{cur.t}</h3>
                </div>
                <div className="ls-da">
                  <button
                    type="button"
                    className="ls-all"
                    onClick={(e) =>
                      allIn ? removeAll(cur) : addAll(cur, e.currentTarget)
                    }
                  >
                    {allIn ? "Remove all" : "Add all"}
                  </button>
                  <button
                    type="button"
                    className="ls-x"
                    aria-label="Close"
                    onClick={close}
                  >
                    <Plus />
                  </button>
                </div>
              </div>
              <div className="ls-items">
                {cur.items.map(([name, price, b], i) => {
                  const id = `${cur.id}-${i}`;
                  return (
                    <button
                      type="button"
                      key={id}
                      className="ls-it"
                      aria-pressed={picked.includes(id)}
                      onClick={(e) => togglePiece(id, e.currentTarget)}
                    >
                      <span className="ls-ck">
                        <Tick size={12} />
                      </span>
                      <span>
                        <b>{name}</b>
                        <span className="ls-pr">
                          from <em>{inr(price)}</em>
                          {b === "mo" ? " / month" : " one-time"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="ls-b" ref={bk}>
          <div className="ls-bh">
            <span className="ls-bi" ref={icon}>
              <Basket />
            </span>
            <div>
              <h3>Make your own bucket</h3>
              <p aria-live="polite">
                {picked.length
                  ? `${picked.length} piece${picked.length > 1 ? "s" : ""} from ${chosen.length} service${chosen.length > 1 ? "s" : ""}`
                  : "Empty for now"}
              </p>
            </div>
            {picked.length > 0 && (
              <button
                type="button"
                className="ls-clr"
                onClick={() => commit([])}
              >
                Clear
              </button>
            )}
          </div>

          {picked.length === 0 ? (
            <div className="ls-e" data-flip-id="empty">
              <span className="ls-fine">Drag a service here, or tap</span>
              <span className="ls-touch">Tap</span> one in the shop to pick its
              pieces.
            </div>
          ) : (
            <div className="ls-l">
              {chosen.map(({ s, ids }) => (
                <Fragment key={s.id}>
                  <div className="ls-gh" data-flip-id={`g-${s.id}`}>
                    {s.t}
                  </div>
                  {ids.map((id) => {
                    const p = pieces[id];
                    return (
                      <div className="ls-row" key={id} data-flip-id={id}>
                        <span>{p.name}</span>
                        <span className="ls-rp">
                          {inr(p.price)}
                          <small>{p.b === "mo" ? "/mo" : "once"}</small>
                        </span>
                        <button
                          type="button"
                          className="ls-rm"
                          aria-label={`Remove ${p.name}`}
                          onClick={() => togglePiece(id)}
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          )}

          <div className="ls-foot" data-flip-id="foot">
            <div className="ls-tot">
              <span>Monthly</span>
              <b>
                <span ref={moEl} />
                <small>/mo</small>
              </b>
            </div>
            <div className="ls-tot">
              <span>One-time</span>
              <b>
                <span ref={onceEl} />
              </b>
            </div>
            {picked.length ? (
              <a className="btn p ls-go" href="#contact">
                Checkout my bucket{" "}
                <span className="arr" aria-hidden="true">
                  →
                </span>
              </a>
            ) : (
              <button type="button" className="btn p ls-go" disabled>
                Checkout my bucket
              </button>
            )}
            <p className="ls-note">
              Starting prices. Ad spend is paid directly to Meta or Google. We
              confirm your final quote after the free audit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
