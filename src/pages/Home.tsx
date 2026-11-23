import TransitNetwork from '../components/TransitNetwork';

import StationSign from '../components/StationSign';

interface HomeProps {
  onNavigate: (section: string) => void;
  onSelectMember: (id: string) => void;
}

export default function Home({ onNavigate, onSelectMember }: HomeProps) {
  return (
    <section id="home" className="home" aria-labelledby="home-title">
      <div className="home-content-wrap">
        <div className="home-text-block">
          <div className="home-location"><StationSign number="01" name="UN Avenue" night /><span>TUP-Manila · IT student collective</span></div>
          <h1 id="home-title" className="home-title">Different routes.<br />Shared direction.</h1>
          <p className="home-desc">We’re UNB. A collective exploring software, systems, and digital design. Connected by the commute. Building on what we learn.</p>
          <div className="home-actions">
            <button className="pill hero-primary" onClick={() => onNavigate('team')}>Meet the team <span aria-hidden="true">↗</span></button>
            <button className="hero-secondary" onClick={() => onNavigate('contact')}>Contact us <span aria-hidden="true">→</span></button>
          </div>
        </div>
        <TransitNetwork onSelectMember={onSelectMember} />
      </div>
      <div className="home-footer">
        <span><span className="footer-route" aria-hidden="true" />United Nation Boys</span>
        <span>Rooted in Manila. Connected through IT.</span>
        <button onClick={() => onNavigate('about')} aria-label="Continue to About">Next stop: About <span aria-hidden="true">↓</span></button>
      </div>
    </section>
  );
}
