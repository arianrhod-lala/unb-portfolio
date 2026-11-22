export interface Project {
  title: string;
  description: string;
  link?: string;
}

export interface Member {
  id: string;
  name: string;
  handle: string;
  photo: string;
  website?: string; // Add the member's real absolute https:// URL when available.
  accent: string; // card border colour
  tagline: string;
  bio: string;
  skills: string[];
  projects: Project[];
  socials: { facebook?: string; instagram?: string; github?: string };
}

const socials = { facebook: "https://facebook.com", instagram: "https://instagram.com", github: "https://github.com" };

// TODO: replace names, handles, photos, bios, skills, projects and links with real details.
export const team: Member[] = [
  {
    id: "kobe",
    name: "Kobe",
    handle: "@swilylent",
    photo: "/images/kobe.jpg?v=4",
    website: "https://business-portfolio-kobecuison-omega.vercel.app/",
    accent: "#302d2b",
    tagline: "Frontend Architect & Creative Designer",
    bio: "DOST Scholar and BSIT student who turns challenges into growth. I thrive on learning, adapt quickly, and commit fully to what I start. Focused, curious, and ready to take on opportunities that push me beyond my comfort zone.",
    skills: ["TypeScript", "React", "UI/UX Design", "Vite", "Tailwind CSS"],
    projects: [
      { title: "UNB Collective Portal", description: "Modern portfolio experience with railway track navigation and interactive profile drawers." },
      { title: "LRT-1 Station Tracker", description: "Real-time commuter navigation helper for daily University Belt students." },
      { title: "Campus Network Hub", description: "Community forum and resource sharing space for TUP students." }
    ],
    socials
  },
  {
    id: "ian",
    name: "Ian",
    handle: "@iansane222",
    photo: "/images/ian.jpg?v=4",
    website: "https://ianlester.netlify.app",
    accent: "#6b0f2a",
    tagline: "Visual Artist & Creative Technologist",
    bio: "lorem ipsum dolor sit amet consectetur adipiscing elit excepteur eiusmod quas mollit ut ex nulla ut ullamco sunt sint at cum placeat excepturi corrupti sit adipiscing lorem ipsum dolor sit amet consectetur",
    skills: ["Photography", "Creative Direction", "Motion Graphics", "Branding"],
    projects: [
      { title: "Manila Bay Golden Hour", description: "Documentary photography series capturing youth culture across Metro Manila." },
      { title: "UNB Identity Package", description: "Typography system, brand guidelines, and vintage railway iconography." },
      { title: "Soundtrack of Commute", description: "Curated ambient soundscape and playlist for the LRT line." }
    ],
    socials
  },
  {
    id: "tyrone",
    name: "Tyrone",
    handle: "@r.on_r.on",
    photo: "/images/tyrone.jpg?v=4",
    website: "https://tyronejohn.netlify.app/",
    accent: "#6b0f2a",
    tagline: "Full-Stack Developer & Systems Enthusiast",
    bio: "lorem ipsum dolor sit amet consectetur adipiscing elit exceptur eiusmod quas mollit ut ex nulla ut ullamco sunt sint at cum placeat excepturi corrupti sit adipiscing soluta ullamco et dolores praesentium",
    skills: ["JavaScript", "Node.js", "Express", "Database Design", "REST APIs"],
    projects: [
      { title: "Express Transit API", description: "High-performance transit timetable microservice built for fast querying." },
      { title: "Peer Study Scheduler", description: "Collaborative calendar and task manager for university engineering students." },
      { title: "Batch Asset Compressor", description: "Lightweight tool for automating media optimization on web projects." }
    ],
    socials
  },
  {
    id: "allen",
    name: "Allen",
    handle: "@mygabxx_",
    photo: "/images/allen.jpg?v=4",
    website: "https://allenpasion05-droid.github.io/Portfolio_v1/",
    accent: "#6b0f2a",
    tagline: "Software Engineer & Mobile Specialist",
    bio: "Lorem ipsum dolor sit amet consectetur adipiscing corrupti sit adipiscing soluta ullamco et dolores praesentium est voluptas assumenda sint imperdiet nihil qui dolor et expedita tempor omnis ut in aute eu cupiditate in nulla",
    skills: ["Mobile Dev", "React Native", "Java / Kotlin", "Git", "Clean Architecture"],
    projects: [
      { title: "Commuter Pulse", description: "Cross-platform mobile utility for tracking train intervals and station crowds." },
      { title: "TUP Grade Tracker", description: "Offline-first mobile calculator for curriculum subjects and GWA calculation." },
      { title: "Event Scanner App", description: "QR code check-in scanner application for campus student organization summits." }
    ],
    socials
  },
  {
    id: "tristan",
    name: "Tristan",
    handle: "@te._.ej",
    photo: "/images/tristan.jpg?v=4",
    website: "https://tristan1804.github.io/Personal-Portfolio/",
    accent: "#6b0f2a",
    tagline: "Backend Engineer & Cloud Architect",
    bio: "Lorem ipsum dolor sit amet consectetur adipiscing elit excepteur eiusmod quas mollit ut ex nulla ut ullamco sunt sint at cum placeat excepturi corrupti sit adipiscing soluta ullamco et dolores praesentium",
    skills: ["Cloud Services", "Docker", "DevOps", "Python", "System Security"],
    projects: [
      { title: "Cloud Deployment Pipeline", description: "Automated CI/CD pipeline and container registry for team microservices." },
      { title: "Auth & Identity Gateway", description: "OAuth2 and session token management service for shared student tools." },
      { title: "Monitoring Dashboard", description: "Prometheus and Grafana cluster monitor with uptime alerting." }
    ],
    socials
  },
];

export const findMember = (id?: string) => team.find((m) => m.id === id);
