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
    tagline: "Data Analyst, Full-stack Developer & AI Engineer",
    bio: "A highly motivated and detail-oriented IT student with a strong foundation in software development, mobile application programming, and emerging technologies. Passionate about creating seamless, user-centric digital solutions and continuously expanding technical expertise through hands-on projects and innovative problem-solving.",
    skills: ["PostgreSQL", "Prompting", "Java / Kotlin", "Git&Github", "LLMs/ML"],
    projects: [
      { title: "Google Books Search System", description: "Web app integrating the Google Books API to search, browse, and retrieve book information." },
      { title: "Analyzing Student's Mental Health", description: "Data analysis project examining mental health trends among students using statistical methods and data visualization." },
      { title: "Yankicks E-Commerce Web System", description: "Full-stack e-commerce platform for footwear retail with product listings, cart management, and order processing." }
    ],
    socials: {
      facebook: "https://www.facebook.com/allengabrielle.pasion/",
      instagram: "https://www.instagram.com/mygabxx_/",
      github: "https://github.com/allenpasion05-droid"
    },
  },
  {
    id: "tristan",
    name: "Tristan",
    handle: "@te._.ej",
    photo: "/images/tristan.jpg?v=4",
    website: "https://tristan1804.github.io/Personal-Portfolio/",
    accent: "#6b0f2a",
    tagline: "Full-Stack Developer & Database Management",
    bio: "I'm Tristan Jhon Capuyan, a BSIT student at TUP - Manila. I build web projects and turn ideas into clean, usable designs. This portfolio shows my work and how I have grown from beginner to builder.",
    skills: ["Full-stack", "Networking", "DevOps", "Python", "Databases"],
    projects: [
      { title: "Yankicks", description: "YanKicks is a fully functional, full-stack e-commerce platform designed for selling premium athletic footwear." },
      { title: "Outpatient No-Show Predictor", description: "A data-driven dashboard designed to visualize patient attendance trends and estimate the risk of future appointment no-shows. Built with Python and Streamlit." },
      { title: "SimbAI", description: "SimbAI is a high-fidelity Flutter prototype for a bilingual navigation application designed to help Filipino commuters find routes to Catholic parish churches in Laguna, Philippines using public transportation" }
    ],
    socials
  },
];

export const findMember = (id?: string) => team.find((m) => m.id === id);
