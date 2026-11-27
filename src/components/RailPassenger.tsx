// Small overhead commuters: shoulders, hair, a bag, and two walking feet.
export default function RailPassenger() {
  return (
    <svg viewBox="0 0 14 20" fill="none" focusable="false">
      <path d="M4 13l-1 5m7-5 1 4" stroke="var(--night)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="1" y="7" width="12" height="7" rx="3.5" fill="currentColor" />
      <rect x="10" y="9" width="3" height="5" rx="1.5" fill="var(--paper)" />
      <circle cx="7" cy="6" r="3.5" fill="oklch(0.79 0.06 65)" />
      <path d="M3.5 6a3.5 3.5 0 0 1 7 0L9 5 7 5.5 5 4.5Z" fill="var(--night)" />
    </svg>
  );
}
