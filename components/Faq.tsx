import Reveal from "./Reveal";
import { Plus } from "./Icons";
import Eyebrow from "./Eyebrow";

const faqs = [
  [
    "Are you a new agency?",
    "Yes. We're three founders who started GrowWheel recently, which is why you'll deal with us directly instead of an account manager. We'd rather say it plainly than dress this page in logos we haven't earned.",
  ],
  [
    "Do I have to sign a long contract?",
    "No lock-in. We work month to month, and if it isn't working for you, you can walk away.",
  ],
  [
    "Who will I actually talk to?",
    "One of the three founders, every time. The same people plan your campaign, run it and report on it.",
  ],
  [
    "How soon will I see results?",
    "It depends on the channel. Ads can bring first enquiries within weeks, while SEO usually takes a few months to build. We'll tell you what to expect for your case in the audit, and we never promise rankings or numbers we can't control.",
  ],
  [
    "What does the free audit include?",
    "A review of your website, your ads (if you run any) and how you show up in search, plus the three biggest fixes we'd make first. It lands in your inbox within 48 hours, with no obligation to hire us.",
  ],
  [
    "How do you charge?",
    "Pick a plan in our pricing section, add or remove services and pay monthly, with one-time charges only for setup work like websites. Not sure what you need? Start with the free audit.",
  ],
  [
    "Which businesses do you work with?",
    "Growing local and online businesses that want more enquiries from digital. If we're not the right fit, we'll say so.",
  ],
];

export default function Faq() {
  return (
    <section className="band b-white" id="faq" aria-labelledby="fqh">
      <div className="sec">
        <div className="fq">
          <Reveal className="fq-l">
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="sh" id="fqh">
              Straight answers
              <br />
              <b>to what you'd ask.</b>
            </h2>
            <p className="ss">
              Can't find yours? Send it over and a founder will reply within a
              day.
            </p>
            <a className="btn p" href="#contact" style={{ marginTop: 22 }}>
              Ask us anything{" "}
              <span className="arr" aria-hidden="true">
                →
              </span>
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            {faqs.map(([q, a], i) => (
              <details className="q" key={q} open={i === 0}>
                <summary>
                  {q}
                  <i>
                    <Plus />
                  </i>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
