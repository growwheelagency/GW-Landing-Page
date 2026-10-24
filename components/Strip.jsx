import { Sparkle } from "./Icons";
const items = ["SEO", "Paid Ads", "Social Media", "Web & SaaS", "UI/UX", "Email Marketing", "Poster Design"];

export default function Strip() {
  return (
    <div className="marq" aria-label="Services we run">
      <div className="track">
        {[0, 1].map((k) => items.map((t) => (
          <div className="it" key={k + t} aria-hidden={k === 1 ? "true" : undefined}><span>{t}</span><Sparkle /></div>
        )))}
      </div>
    </div>
  );
}
