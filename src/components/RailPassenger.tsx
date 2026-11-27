// Small illustrated commuters with coats, bags, and varied hair/headwear.
export default function RailPassenger({ variant }: { variant: number }) {
  const cap = variant % 3 === 0;
  const ponytail = variant % 3 === 1;
  return (
    <svg viewBox="0 0 24 34" fill="none" focusable="false">
      <ellipse cx="12" cy="32" rx="8" ry="1.5" fill="rgb(35 33 30 / 0.12)" />
      <g stroke="var(--paper)" strokeWidth="0.8" strokeLinejoin="round">
        <path className="commuter-leg commuter-leg--left" d="M8 23v7l-3 1h6v-8" fill="var(--main)" />
        <path className="commuter-leg commuter-leg--right" d="M14 23v7l-1 1h6l-2-2v-6" fill="var(--main)" />
        <path d="M7 14Q3 14 3 20l2 4 3-2h8l3 2 2-4q0-6-5-6Z" fill="currentColor" />
        <rect x="6" y="13" width="12" height="13" rx="4" fill="currentColor" />
        {ponytail && <circle cx="19" cy="8" r="4" fill="var(--main)" />}
        <circle cx="12" cy="8" r="6" fill={variant % 2 ? 'oklch(0.73 0.075 55)' : 'oklch(0.85 0.055 65)'} />
        <path d="M6 8a6 6 0 0 1 12 0L14 5l-3 2-3-1Z" fill="var(--main)" />
        {cap && <path d="M6 6q1-6 6-5 6 0 6 6h-8l-5 1Z" fill="var(--lrt-yellow)" />}
        <path d="M8 15l4 3 4-3" stroke="var(--paper)" strokeWidth="1.4" />
        <path d="M7 17l9 8" stroke="var(--main)" strokeWidth="1.2" />
        <rect x="14" y="21" width="6" height="6" rx="1.5" fill={cap ? 'var(--paper)' : 'var(--lrt-yellow)'} />
      </g>
      <path d="M10 9v1m5-1v1" stroke="var(--main)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
