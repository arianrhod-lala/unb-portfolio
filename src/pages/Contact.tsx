import { FormEvent, useState } from "react";
import { FacebookIcon, InstagramIcon, GithubIcon } from "../components/Icons";
import { scrollBehavior } from "../utils/motion";

const EMAIL = "unitednationboys@gmail.com";
const PHONE = "+63 999 473 7196";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = `${f.get("name") ?? ""} ${f.get("lastName") ?? ""}`.trim();
    const email = f.get("email");
    const message = f.get("message");
    const body = `${message}\n\nFrom: ${name} <${email}>`;

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      "Message from " + (name || "a portfolio visitor")
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id="contact" className="page contact-section">
      <div className="contact-container split">
        {/* Left Information Column */}
        <div className="contact-title-col">
          <h2 className="display contact-display-title">
            Get in touch
          </h2>

          <div className="station-badge">
            <span className="station-dot" />
            <span className="station-text">Start a conversation</span>
          </div>

          <p className="contact-sub">
            Have an exciting project, freelance inquiry, or just want to connect with
            the UNB crew? Reach out to us through any of our station channels below.
          </p>

          <div className="contact-station-card">
            <div className="contact-line">
              <span className="contact-label">Hotline / Phone</span>
              <a href={`tel:${PHONE.replace(/\s+/g, "")}`} className="contact-val">
                {PHONE}
              </a>
            </div>

            <div className="contact-line">
              <span className="contact-label">Official Email</span>
              <a href={`mailto:${EMAIL}`} className="contact-val">
                {EMAIL}
              </a>
            </div>

            <div className="contact-line">
              <span className="contact-label">Transit Hub / Location</span>
              <span className="contact-val">
                LRT-1 UN Avenue Station, Ermita, Manila, Philippines
              </span>
            </div>

            <div className="contact-line">
              <span className="contact-label">Alma Mater</span>
              <span className="contact-val">
                Technological University of the Philippines (TUP-Manila)
              </span>
            </div>
          </div>

          <div className="contact-social-row">
            <span className="social-row-label">Connect on Socials:</span>
            <div className="socials contact-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="contact-form-col">
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="form-legend">
              <h3>Send a message</h3>
              <p>This form opens your email app. You’ll send the message from there.</p>
            </div>

            <div className="form-row">
              <label>
                <span>First Name</span>
                <input name="name" required placeholder="e.g. Kobe" />
              </label>
              <label>
                <span>Last Name</span>
                <input name="lastName" placeholder="e.g. Dela Cruz" />
              </label>
            </div>

            <label>
              <span>Email Address*</span>
              <input name="email" type="email" required placeholder="name@example.com" />
            </label>

            <label>
              <span>Your Message*</span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us about your project, idea, or inquiry..."
              />
            </label>

            <button type="submit" className="submit contact-submit-btn">
              <span>Send Message</span>
              <span className="submit-arrow">→</span>
            </button>

            {sent && (
              <div className="sent-toast" role="status">
                Your email app was requested. Review and send your message there; it has not been sent by this form.
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="site-bottom-bar">
        <span>© {new Date().getFullYear()} UNB (United Nation Boys) • TUP-Manila</span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
          className="back-to-top"
          aria-label="Back to top of page"
        >
          Back to Top ↑
        </button>
      </div>
    </section>
  );
}
