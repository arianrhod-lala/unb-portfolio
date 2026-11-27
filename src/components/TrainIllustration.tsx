function CarBody({ cab = false }: { cab?: boolean }) {
  return (
    <>
      <g fill="var(--night)" stroke="var(--main)" strokeWidth="1.25">
        <rect x="1" y="13" width="42" height="14" rx="3" />
        <rect x="1" y="45" width="42" height="14" rx="3" />
        <rect x="6" y="1" width="32" height="70" rx={cab ? 12 : 8}
          fill={cab ? 'var(--lrt-green)' : 'var(--text-home)'} />
      </g>
      <rect x="11" y="7" width="22" height={cab ? 34 : 57} rx="5"
        fill="var(--paper)" stroke="var(--line)" />
      <path d="M8 12v46" stroke="var(--lrt-green)" strokeWidth="2" />
      <rect x="14" y={cab ? 14 : 29} width="16" height="13" rx="2" fill="var(--main)" />
      <path d={cab ? 'M17 18h10m-10 3h10m-10 3h10' : 'M17 33h10m-10 3h10m-10 3h10'}
        stroke="var(--night-secondary)" strokeWidth="1" />
      {/* Side doors are at the midpoint of every car. */}
      <path d="M6 29v14m32-14v14" stroke="var(--lrt-yellow)" strokeWidth="2.5" />
      {cab ? (
        <>
          <path d="M10 49a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v5a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6v-5Z" fill="var(--night)" />
          <path d="M22 47v11" stroke="var(--night-secondary)" />
          <path className="train-headlights" d="M11 66h6m10 0h6" stroke="var(--text-home)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M18 70h8" stroke="var(--main)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <g fill="var(--night)">
          <rect x="10" y="12" width="24" height="11" rx="3" />
          <rect x="10" y="48" width="24" height="11" rx="3" />
        </g>
      )}
    </>
  );
}

// Each group owns a local car; PageRailway moves them along the same track.
export default function TrainIllustration() {
  return (
    <svg viewBox="0 0 44 238" fill="none" focusable="false">
      <g stroke="var(--night-secondary)" strokeWidth="6" strokeLinecap="round">
        <path data-coupling="0" d="M22 72V82" />
        <path data-coupling="1" d="M22 154V164" />
      </g>
      {['rear', 'middle', 'cab'].map((kind, index) => (
        <g key={kind} data-car={kind} transform={`translate(0 ${index * 82})`}>
          <CarBody cab={kind === 'cab'} />
        </g>
      ))}
    </svg>
  );
}
