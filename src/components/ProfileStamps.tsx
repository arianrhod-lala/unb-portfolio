import { profileStamps } from '../utils/profileStamps';

export default function ProfileStamps({ memberId }: { memberId: string }) {
  return (
    <div className="profile-stamps" aria-hidden="true">
      <span className="profile-stamps__label">Collected along the line</span>
      <div className="profile-stamps__collection">
        {profileStamps(memberId).slice(0, 5).map(stamp => (
          <span className="profile-stamps__slot" key={stamp.src}>
            <img src={stamp.src} alt="" width="120" height="120"
              style={{ transform: `rotate(${stamp.rotation}deg)` }} />
          </span>
        ))}
      </div>
    </div>
  );
}
