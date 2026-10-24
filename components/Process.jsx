import Reveal from "./Reveal";
import Sparkles from "./Sparkles";

const steps = [
  { t: "Free audit", p: "We look at your site, ads and search presence and tell you plainly what's working and what isn't.", g: "A plain-English teardown in 48 hours" },
  { t: "Plan before spend", p: "One plan across search, ads, social and web, with priorities and a clear split of your budget.", g: "A 90-day plan you can read in ten minutes" },
  { t: "Build and launch", p: "We set up tracking, build what's missing and switch campaigns on, with founders hands-on.", g: "Live campaigns and pages" },
  { t: "Measure and improve", p: "Every month we show what brought enquiries, cut what didn't and double down on what did.", g: "A monthly report in plain English" },
];

export default function Process() {
  return (
    <section className="band b-canvas" id="how" aria-labelledby="hwh">
      <div className="sec">
        <Reveal className="hd-c">
          <Sparkles />
          <span className="lab"><i />How we work</span>
          <h2 className="sh" id="hwh">No mystery.<br /><b>Four clear steps.</b></h2>
          <p className="ss">You'll always know what we're doing, why we're doing it and what it will cost before we start.</p>
        </Reveal>
        <Reveal className="pcs">
          {steps.map((s, i) => (
            <div className="ps" key={s.t}>
              <span className="dot">0{i + 1}</span>
              <h3>{s.t}</h3><p>{s.p}</p>
              <span className="got">{s.g}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
