import { useEffect, useState } from 'react';
import { STATIONS } from '../data/stations';

export default function StationAnnouncement({ activeSection }: { activeSection: string }) {
  const index = Math.max(0, STATIONS.findIndex(station => station.id === activeSection));
  const current = STATIONS[index];
  const next = STATIONS[index + 1];
  const [arriving, setArriving] = useState(true);

  useEffect(() => {
    setArriving(true);
    const timer = window.setTimeout(() => setArriving(false), 1400);
    return () => window.clearTimeout(timer);
  }, [current.id]);

  return (
    <div className="station-announcement" role="group" aria-label="Station information" aria-live="off">
      <div className="station-announcement__current">
        <span className="station-announcement__caption">{arriving ? 'Now arriving' : 'Current station'}</span>
        <strong data-current-station>{current.name}</strong>
      </div>
      <span className="station-announcement__arrow" aria-hidden="true">→</span>
      <div className="station-announcement__next">
        <span className="station-announcement__caption">Next station</span>
        <span data-next-station>{next?.name ?? 'End of line'}</span>
      </div>
    </div>
  );
}
