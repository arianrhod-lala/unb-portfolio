import { useState } from 'react';
import { capabilities } from '../data/capabilities';

export default function TransitNetwork({ onSelectMember }: { onSelectMember: (id: string) => void }) {
  const [selectedId, setSelectedId] = useState(capabilities[0].id);
  const selected = capabilities.find(route => route.id === selectedId)!;
  return (
    <section className="network" aria-labelledby="network-title">
      <div className="network-header">
        <span className="route-symbol" aria-hidden="true">U</span>
        <div><h2 id="network-title">The UNB network</h2><p>Find your connection</p></div>
        <span className="network-origin">Manila, PH</span>
      </div>
      <div className="network-map">
        <div className="network-origin-label"><span aria-hidden="true">↳</span> UN Avenue · Our starting point</div>
        <div className="network-stations" aria-label="Technical interests">
          {capabilities.map((route, index) => (
            <button key={route.id} className={`network-stop${selectedId === route.id ? ' is-selected' : ''}`}
              aria-label={route.name} aria-pressed={selectedId === route.id} aria-controls="network-members"
              onClick={() => setSelectedId(route.id)}>
              <span className="stop-marker" aria-hidden="true">{index + 1}</span>
              <span>{route.name}<small>{route.description}</small></span>
              <span className="stop-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </div>
      <div id="network-members" className="network-members" role="region" aria-label={`${selected.name} members`}>
        <p>Explore {selected.name.toLowerCase()} with</p>
        <div className="network-member-links">
          {selected.members.map(member => <button key={member.id} onClick={() => onSelectMember(member.id)}>{member.name}<span aria-hidden="true"> ↗</span></button>)}
        </div>
      </div>
      <p className="network-note">Routes reflect the interests shared by our members.</p>
    </section>
  );
}
