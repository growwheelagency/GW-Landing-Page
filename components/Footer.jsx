import { site } from "../lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="ft2">
      <div className="fi">
        <div className="cols">
          <div>
            <a className="logo lgw" href="#top">
              <Logo />
            </a>
            <p className="tg2">{site.tagline}</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="#services">Services</a>
            <a href="#how">How we work</a>
            <a href="#about">About</a>
            <a href="#faq">FAQ</a>
          </div>
          <div>
            <h4>Services</h4>
            <a href="#services">SEO and SEM</a>
            <a href="#services">Paid ads and social</a>
            <a href="#services">Web and SaaS</a>
            <a href="#services">Design</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`https://wa.me/${site.whatsapp}`}>WhatsApp</a>
            <span>{site.phone}</span>
            <span>{site.location}</span>
          </div>
        </div>
        <div className="bot">
          <span>© 2026 {site.name}. All rights reserved.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
