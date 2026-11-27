import { profileStamps } from '../utils/profileStamps';

export default function ProfileStamps({ memberId }: { memberId: string }) {
  return (
    <div className="profile-stamps" aria-hidden="true">
      {profileStamps(memberId).slice(0, 2).map(stamp => (
        <img key={stamp.src} src={stamp.src} alt="" width="184" height="184"
          style={{ transform: `rotate(${stamp.rotation}deg)` }} />
      ))}
    </div>
  );
}
