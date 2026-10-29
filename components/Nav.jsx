"use client";
import { useEffect, useState } from "react";
import { site } from "../lib/site";
import Logo from "./Logo";

const links = [
  ["Services", "#services"],
  ["How we work", "#how"],
  ["About", "#about"],
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const f = () => setSc(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`nav${sc ? " sc" : ""}`}>
      <a className="logo" href="#top" aria-label={`${site.name} home`}>
        <Logo />
      </a>
      <nav className="links" aria-label="Primary">
        {links.map(([t, h]) => (
          <a key={h} href={h}>
            {t}
          </a>
        ))}
      </nav>
      <div className="navr">
        <a className="navcta" href="#contact">
          Let's Talk <span aria-hidden="true">↗</span>
        </a>
        <button
          className="burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <i />
          <i />
        </button>
      </div>
      {open && (
        <div className="mnav" onClick={() => setOpen(false)}>
          {links.map(([t, h]) => (
            <a key={h} href={h}>
              {t}
            </a>
          ))}
          <a href="#faq">FAQ</a>
        </div>
      )}
    </header>
  );
}
