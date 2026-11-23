export default function StationSign({ number, name, night = false }: { number: string; name: string; night?: boolean }) {
  return (
    <span className={`station-sign${night ? ' station-sign--night' : ''}`}>
      <span className="station-sign__number">{number}</span>
      <span className="station-sign__name">{name}</span>
    </span>
  );
}
