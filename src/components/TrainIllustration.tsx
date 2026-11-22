// Original overhead train illustration, kept as SVG so it stays crisp at either size.
export default function TrainIllustration() {
  return (
    <svg viewBox="0 0 44 156" fill="none" focusable="false">
      <g fill="var(--night)" stroke="var(--main)" strokeWidth="1.25">
        <rect x="1" y="15" width="42" height="14" rx="3" />
        <rect x="1" y="47" width="42" height="14" rx="3" />
        <rect x="1" y="95" width="42" height="14" rx="3" />
        <rect x="1" y="127" width="42" height="14" rx="3" />
        <path d="M17 68h10v18H17z" />
        <rect x="6" y="2" width="32" height="69" rx="9" fill="var(--text-home)" />
        <path d="M6 92a10 10 0 0 1 10-10h12a10 10 0 0 1 10 10v47c0 9-7 15-16 15S6 148 6 139V92Z" fill="var(--lrt-green)" />
      </g>
      <rect x="11" y="8" width="22" height="56" rx="6" fill="var(--paper)" stroke="var(--line)" />
      <rect x="10" y="14" width="24" height="12" rx="3" fill="var(--night)" />
      <rect x="10" y="48" width="24" height="12" rx="3" fill="var(--night)" />
      <path d="M8 14v43" stroke="var(--lrt-green)" strokeWidth="2" />
      <rect x="14" y="31" width="16" height="11" rx="2" fill="var(--main)" />
      <path d="M17 34h10m-10 3h10m-10 3h10" stroke="var(--night-secondary)" strokeWidth="1" />
      <rect x="11" y="90" width="22" height="33" rx="5" fill="var(--text-home)" stroke="var(--line)" />
      <rect x="15" y="98" width="14" height="17" rx="3" fill="var(--main)" />
      <path d="M18 102h8m-8 4h8m-8 4h8" stroke="var(--night-secondary)" strokeWidth="1" />
      <path d="M10 130a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v5a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6v-5Z" fill="var(--night)" />
      <path d="M22 128v11" stroke="var(--night-secondary)" strokeWidth="1" />
      <path className="train-headlights" d="M11 147h6m10 0h6" stroke="var(--text-home)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 151h8" stroke="var(--main)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
