"use client";
// import { tilt } from "../../GW/gw/lib/mag";
import { tilt } from "../lib/mag";
import { Person } from "./Icons";
import type { Member } from "../lib/site";

const grads = [
  "linear-gradient(135deg,#8F8DF0,#4B49A0)",
  "linear-gradient(135deg,#C4B8FF,#7C6BF0)",
  "linear-gradient(135deg,#5B59B8,#17163A)",
];

export default function FounderCard({ m, i }: { m: Member; i: number }) {
  return (
    <article className="fc" {...tilt}>
      <div className="ph" style={{ "--g": grads[i % 3] }}>
        <span className="no">0{i + 1}</span>
        {m.photo ? (
          <img src={m.photo} alt={m.name} className="pimg" />
        ) : (
          <>
            <Person size={90} className="pp" />
            <span className="add">Add photo</span>
          </>
        )}
      </div>
      <h3>{m.name}</h3>
      <p className="role">{m.role}</p>
      <p className="own">{m.owns}</p>
      <div className="tags">
        {m.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </article>
  );
}
