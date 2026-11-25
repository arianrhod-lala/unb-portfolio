import StationSign from './StationSign';

export default function MemberPassBanner({ number, total }: { number: number; total: number }) {
  return (
    <div className="member-pass-banner">
      <span className="member-pass-punches" aria-hidden="true"><span /><span /></span>
      <StationSign number={String(number).padStart(2, '0')} name="Member pass" />
      <div className="member-pass-banner__route"><span>UNB line · Our team</span><span>Member {number} of {total}</span></div>
    </div>
  );
}
