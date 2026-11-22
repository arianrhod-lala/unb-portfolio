import { team } from "../data/team";
import Socials from "../components/Socials";
import { useTeamScroll } from "../hooks/useTeamScroll";
import StationHeading from "../components/StationHeading";

interface TeamProps {
  onSelectMember: (id: string) => void;
}

export default function Team({ onSelectMember }: TeamProps) {
  const { sectionRef, pinRef, scrollerRef, isPinned, moveCards, onTrackKeyDown, onCardFocus } = useTeamScroll();

  return (
    <section ref={sectionRef} id="team" className="page team-section" aria-label="Our team">
      <div ref={pinRef} className="team-pin">
      <div className="team-container split">
        {/* Left Title Column - Aligned to About Us and Contact Us */}
        <div className="team-title-col">
          <StationHeading number="03" name="Team platform" title="Our team" />

          <p className="team-subtext">
            Five members, different interests. Explore the people behind UNB and the technologies they’re learning and building with.
          </p>
          <div className="team-station-index" aria-label="Member index">
            {team.map((member, index) => <button key={member.id} onClick={() => onSelectMember(member.id)}><span aria-hidden="true">{index + 1}</span>{member.name}<span aria-hidden="true">↗</span></button>)}
          </div>
        </div>

        {/* Right Track Area with Fully Scrollable Horizontal Cards */}
        <div className="team-track-area">
          <div className="team-scroll-controls">
            <span>{isPinned ? 'Scroll down to explore all five' : 'Meet all five members'}</span>
            <div>
              <button aria-label="Previous team cards" onClick={() => moveCards(-1)}>←</button>
              <button aria-label="Next team cards" onClick={() => moveCards(1)}>→</button>
            </div>
          </div>
          <div
            ref={scrollerRef}
            className="team-scroller"
            tabIndex={0}
            aria-label="Team member cards across tracks"
            onKeyDown={onTrackKeyDown}
            onFocusCapture={onCardFocus}
          >
            <div className="team-cards-convoy">
              {team.map((m) => (
                <article
                  className="member-card"
                  key={m.id}
                >
                  <div className="photo-frame" style={{ borderColor: m.accent }}>
                    <img
                      className="member-photo"
                      src={m.photo}
                      alt={`${m.name} (${m.handle})`}
                      loading="lazy"
                    />
                  </div>

                  <h3 className="member-handle">{m.name}</h3>
                  <p className="member-username">{m.handle}</p>

                  <p className="member-bio">{m.skills.slice(0, 3).join(' · ')}</p>

                  <div className="card-actions">
                    <button
                      className="pill view-profile-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMember(m.id);
                      }}
                      aria-label={`View full profile of ${m.name}`}
                    >
                      View profile
                    </button>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Socials links={m.socials} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
