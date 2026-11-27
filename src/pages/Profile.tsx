import { Link, useParams } from "react-router-dom";
import { findMember, team } from "../data/team";
import Socials from "../components/Socials";
import PersonalWebsite from "../components/PersonalWebsite";
import MemberPassBanner from "../components/MemberPassBanner";
import ProfileStamps from "../components/ProfileStamps";
import { profileStamps } from "../utils/profileStamps";

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const member = findMember(id);

  if (!member) {
    return (
      <section className="page">
        <h1 className="display">NOT<br />FOUND</h1>
        <p><Link to="/team">Back to Our Team</Link></p>
      </section>
    );
  }

  const idx = team.findIndex((m) => m.id === member.id);
  const next = team[(idx + 1) % team.length];
  const stamps = profileStamps(member.id);

  return (
    <section className="page profile profile-pass">
      <ProfileStamps memberId={member.id} />
      <MemberPassBanner number={idx + 1} total={team.length} />
      <div className="profile-head">
        <img className="member-photo profile-photo" src={member.photo} alt={member.name} style={{ borderColor: member.accent }} />
        <div>
          <h1 className="display">{member.name}</h1>
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
          <h3>Skills</h3>
          <ul className="chips">{member.skills.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        <div>
          <h3>Projects</h3>
          <ul className="projects">
            {member.projects.map((p, index) => (
              <li key={p.title} style={{ backgroundImage: `url('${stamps[(index + 5) % stamps.length].src}')` }}>
                <h4>{p.link ? <a href={p.link}>{p.title}</a> : p.title}</h4>
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="profile-nav">
        <Link className="pill" to="/team">All members</Link>
        <Link className="pill" to={`/team/${next.id}`}>Next: {next.name}</Link>
      </div>
    </section>
  );
}
