import { Sparkle } from "./Icons";
const items = ["SEO", "Paid Ads", "Social Media", "Web & SaaS", "UI/UX", "Email Marketing", "Poster Design"];
// The track slides by half its width, so half of these copies must out-span the widest screen.
const copies = 12; // change the .track duration with this: 15s per copy keeps the speed

export default function Strip() {
  return (
    <div className="marq" aria-label="Services we run">
      <div className="track">
        {Array.from({ length: copies }, (_, k) => items.map((t) => (
          <div className="it" key={k + t} aria-hidden={k > 0 ? "true" : undefined}><span>{t}</span><Sparkle /></div>
        )))}
      </div>
    </div>
  );
}
