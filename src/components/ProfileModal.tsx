import { useEffect, useRef, type KeyboardEvent } from "react";
import { findMember, team } from "../data/team";
import Socials from "./Socials";
import PersonalWebsite from "./PersonalWebsite";
import MemberPassBanner from "./MemberPassBanner";
import ProfileStamps from "./ProfileStamps";
import { profileStamps } from "../utils/profileStamps";

interface ProfileModalProps {
  memberId: string | null;
  onClose: () => void;
  onSelectMember: (id: string) => void;
}

function keepFocusInDialog(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab') return;
  const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, textarea, [tabindex="0"]');
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

export default function ProfileModal({ memberId, onClose, onSelectMember }: ProfileModalProps) {
  const member = findMember(memberId ?? undefined);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previousMemberId = useRef(memberId);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (previousMemberId.current !== memberId) {
      titleRef.current?.focus({ preventScroll: true });
      previousMemberId.current = memberId;
    }
    dialogRef.current?.scrollTo({ top: 0 });
  }, [memberId]);

  if (!member) return (
    <dialog ref={dialogRef} className="modal-content" aria-labelledby="missing-title" onKeyDown={keepFocusInDialog}
      onCancel={event => { event.preventDefault(); onClose(); }}>
      <h2 id="missing-title">Member not found</h2>
      <p>This member is not part of the current UNB network.</p>
      <button className="pill" autoFocus onClick={onClose}>Return to team</button>
    </dialog>
  );

  const currentIndex = team.findIndex((m) => m.id === member.id);
  const prevMember = team[(currentIndex - 1 + team.length) % team.length];
  const nextMember = team[(currentIndex + 1) % team.length];
  const stamps = profileStamps(member.id);

  return (
    <dialog ref={dialogRef} className="modal-content profile-pass" aria-label={`${member.name}'s Profile`}
      onKeyDown={keepFocusInDialog}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
      }}>
      <div className="profile-pass-sheet">
        <ProfileStamps memberId={member.id} />
        <button className="modal-close" autoFocus onClick={onClose} aria-label="Close profile">
          ✕
        </button>

        <MemberPassBanner number={currentIndex + 1} total={team.length} />
        <div className="profile-head">
          <img
            className="member-photo profile-photo"
            src={member.photo}
            alt={member.name}
            style={{ borderColor: member.accent }}
          />
          <div className="profile-info">
            <h2 ref={titleRef} tabIndex={-1} className="display modal-title">{member.name}</h2>
            <h2 className="handle">{member.handle}</h2>
            <p className="tagline">{member.tagline}</p>
            <Socials links={member.socials} />
            <PersonalWebsite url={member.website} name={member.name} />
          </div>
        </div>

        <div className="profile-body">
          <div>
            <h3>About</h3>
            <p>{/^lorem ipsum/i.test(member.bio) ? 'This member has not added a biography yet. Explore their listed interests below.' : member.bio}</p>
            <h3>Skills & Technologies</h3>
            <ul className="chips">
              {member.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Projects</h3>
            <ul className="projects">
              {member.projects.map((p, index) => (
                <li key={p.title} style={{ backgroundImage: `url('${stamps[(index + 5) % stamps.length].src}')` }}>
                  <h4>{p.link ? <a href={p.link} target="_blank" rel="noopener noreferrer">{p.title}</a> : p.title}</h4>
                  <p>{p.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="profile-modal-footer">
          <button className="pill pill--outline" onClick={() => onSelectMember(prevMember.id)}>
            ← {prevMember.name}
          </button>
          <button className="pill pill--primary" onClick={onClose}>
            Back to network
          </button>
          <button className="pill pill--outline" onClick={() => onSelectMember(nextMember.id)}>
            {nextMember.name} →
          </button>
        </div>
      </div>
    </dialog>
  );
}
