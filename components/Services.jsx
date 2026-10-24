import Reveal from "./Reveal";
import Sparkles from "./Sparkles";
import { Tick } from "./Icons";

const lanes = [
  {
    n: "001",
    t: "Search & visibility",
    d: "Be the answer when people search for what you sell.",
    items: [
      "SEO and local SEO",
      "Google Ads (SEM)",
      "Keyword and content plans",
      "Search tracking",
    ],
    c: "l-tile ln1",
  },
  {
    n: "002",
    t: "Paid & social",
    d: "Ads and content that earn the click, then the enquiry.",
    items: [
      "Meta and social ads",
      "Instagram and WhatsApp",
      "Email marketing",
      "Creative testing",
    ],
    c: "l-surface ln2",
  },
  {
    n: "003",
    t: "Web & product",
    d: "Sites and apps built to turn visits into conversations.",
    items: [
      "Websites and landing pages",
      "Interactive sites and SaaS",
      "UI/UX design",
      "Speed and tracking setup",
    ],
    c: "l-dark ln3",
  },
  {
    n: "004",
    t: "Creative & design",
    d: "Visuals that make your brand look like it knows what it's doing.",
    items: [
      "Posters and social creatives",
      "Ad creatives",
      "Brand visuals",
      "UI kits",
    ],
    c: "l-soft ln4",
  },
];

export default function Services() {
  return (
    <section className="band b-white" id="services" aria-labelledby="svh">
      <div className="sec">
        <Reveal className="hd-c">
          <Sparkles />
          <span className="lab">
            <i />
            What we do
          </span>
          <h2 className="sh" id="svh">
            Everything you need,
            <br />
            <b>in four lanes.</b>
          </h2>
          <p className="ss">
            One team covers all of it, so your search, ads, website and visuals
            pull in the same direction.
          </p>
        </Reveal>
        <div className="bn">
          {lanes.map((l, i) => (
            <Reveal
              key={l.n}
              className={l.c.split(" ")[1]}
              delay={0.05 + i * 0.08}
            >
              <article className={`lane ${l.c.split(" ")[0]}`} data-n={l.n}>
                <span className="no">{l.n}</span>
                <h3>{l.t}</h3>
                <p className="d">{l.d}</p>
                <ul>
                  {l.items.map((it) => (
                    <li key={it}>
                      <Tick />
                      {it}
                    </li>
                  ))}
                </ul>
                <a className="go" href="#contact">
                  Ask about this <span aria-hidden="true">→</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
