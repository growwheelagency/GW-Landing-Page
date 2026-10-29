import Reveal from "./Reveal";
import Sparkles from "./Sparkles";
import FounderCard from "./FounderCard";
import { site } from "../lib/site";
import Eyebrow from "./Eyebrow";

export default function Founders() {
  return (
    <section className="band b-lav" id="about" aria-labelledby="fh">
      <div className="sec">
        <Reveal className="hd-c">
          <Sparkles />
          <Eyebrow>Meet the founders</Eyebrow>
          <h2 className="sh" id="fh">
            Three founders.
            <br />
            <b>Zero middlemen.</b>
          </h2>
          <p className="ss">
            From the first call to the last report, you deal with the people who
            actually do the work. No account managers, no handoffs, no juniors
            learning on your budget.
          </p>
        </Reveal>
        <div className="fg">
          {site.team.map((m, i) => (
            <Reveal key={i} delay={0.05 + i * 0.1}>
              <FounderCard m={m} i={i} />
            </Reveal>
          ))}
        </div>
        <Reveal className="why">
          <p>
            <b>Why we started:</b> small brands deserve the same strategy big
            agencies sell, without the handoffs.
          </p>
          <a className="btn p" href="#contact">
            Talk to a founder{" "}
            <span className="arr" aria-hidden="true">
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
