import { useEffect, useRef, useState } from "react";
import { team } from "../data/team";

interface NavbarProps {
  activeSection: string;
  variant: "dark" | "light";
  onNavigate: (sectionId: string) => void;
  onSelectMember: (memberId: string) => void;
}

export default function Navbar({ activeSection, variant, onNavigate, onSelectMember }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const navClass = (id: string) =>
    "nav-link" + (activeSection === id ? " active" : "");

  return (
    <header className={`navbar navbar--${variant}`}>
      <button
        onClick={() => onNavigate("home")}
        className="brand brand-btn"
        aria-label="UNB Home"
      >
        <img
          src="/images/logo.png"
          alt="UNB Train Logo"
          width={28}
          height={28}
          className="brand-logo"
        />
        <span className="brand-text">UNB</span>
      </button>

      <nav aria-label="Main Navigation">
        <button
          className={navClass("home")} aria-current={activeSection === "home" ? "location" : undefined}
          onClick={() => onNavigate("home")}
        >
          Home
        </button>

        <button
          className={navClass("about")} aria-current={activeSection === "about" ? "location" : undefined}
          onClick={() => onNavigate("about")}
        >
          About
        </button>

        <div className="dropdown" ref={wrapRef}>
          <button
            className={navClass("team")} aria-current={activeSection === "team" ? "location" : undefined}
            onClick={() => {
              onNavigate("team");
              setOpen(false);
            }}
          >
            Team
          </button>
          <button
            ref={toggleRef}
            className="dropdown-toggle"
            aria-controls="team-member-list"
            aria-expanded={open}
            aria-label="Toggle team member list"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              aria-hidden="true"
              className={open ? "flip" : ""}
            >
              <path
                d="M1 1l4 4 4-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {open && (
            <ul className="dropdown-menu" id="team-member-list">
              {team.map((m) => (
                <li key={m.id}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setOpen(false);
                      toggleRef.current?.focus();
                      onSelectMember(m.id);
                    }}
                  >
                    <span>{m.name}</span>
                    <small>{m.handle}</small>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className={navClass("contact")} aria-current={activeSection === "contact" ? "location" : undefined}
          onClick={() => onNavigate("contact")}
        >
          Contact
        </button>
      </nav>
    </header>
  );
}
