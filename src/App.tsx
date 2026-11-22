import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollBehavior } from "./utils/motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import ProfileModal from "./components/ProfileModal";
import PageRailway from "./components/PageRailway";

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const location = useLocation();
  const navigate = useNavigate();
  const selectedMemberId = location.pathname.match(/^\/team\/([^/]+)\/?$/)?.[1] ?? null;

  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef<number | null>(null);

  // Scroll to section helper with instant active indicator update
  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    isProgrammaticScroll.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 850);

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: scrollBehavior() });
    }
  }, []);

  // Open member profile modal
  const handleSelectMember = (memberId: string) => {
    navigate(`/team/${memberId}`, { state: {
      returnSection: location.state?.returnSection ?? activeSection,
      returnScrollY: location.state?.returnScrollY ?? window.scrollY,
    } });
  };

  // Close member profile modal
  const handleCloseMember = useCallback(() => {
    navigate(`/#${location.state?.returnSection ?? 'team'}`, {
      state: { restoreScrollY: location.state?.returnScrollY },
    });
  }, [navigate, location.state]);

  // Check URL pathname for direct /team/:id access
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      const timer = window.setTimeout(() => {
        const restore = location.state?.restoreScrollY;
        if (typeof restore === 'number' && Number.isFinite(restore)) {
          setActiveSection(targetId);
          window.scrollTo({ top: restore, behavior: 'instant' });
        } else {
          scrollToSection(targetId);
        }
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [location.pathname, location.hash, location.state, scrollToSection]);

  // Robust scroll spy to accurately track sections (Home, About, Team, Contact)
  useEffect(() => {
    const handleScroll = () => {
      if (isProgrammaticScroll.current) return;

      // Bottom of page check (ensures Contact highlights at page end)
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50;

      if (isAtBottom) {
        setActiveSection("contact");
        return;
      }

      // Check sections from bottom to top against reading line
      const scrollPos = window.scrollY + 180;
      const sections = ["contact", "team", "about", "home"];

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    const handleUserScroll = () => {
      if (isProgrammaticScroll.current) {
        isProgrammaticScroll.current = false;
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleUserScroll, { passive: true });
    window.addEventListener("touchmove", handleUserScroll, { passive: true });

    // Initial check on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleUserScroll);
      window.removeEventListener("touchmove", handleUserScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const navbarVariant = activeSection === "home" ? "dark" : "light";

  return (
    <div className="portfolio-app">
      <PageRailway />
      <Navbar
        activeSection={activeSection}
        variant={navbarVariant}
        onNavigate={scrollToSection}
        onSelectMember={handleSelectMember}
      />

      <main className="portfolio-main">
        <Home onNavigate={scrollToSection} onSelectMember={handleSelectMember} />
        <About />
        <Team onSelectMember={handleSelectMember} />
        <Contact />
      </main>

      {selectedMemberId && (
        <ProfileModal
          memberId={selectedMemberId}
          onClose={handleCloseMember}
          onSelectMember={handleSelectMember}
        />
      )}
    </div>
  );
}
