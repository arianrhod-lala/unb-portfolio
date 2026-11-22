import { team } from './team';

// Routes describe listed interests, not verified professional credentials.
export const capabilities = [
  { id: 'software', name: 'Software', description: 'Web applications, APIs, and mobile development', skills: ['React', 'TypeScript', 'JavaScript', 'Mobile Dev', 'Python'] },
  { id: 'systems', name: 'Systems', description: 'Data, infrastructure, and connected services', skills: ['Database Design', 'REST APIs', 'Cloud Services', 'DevOps', 'System Security', 'Clean Architecture'] },
  { id: 'design', name: 'Digital design', description: 'Interfaces, visual identity, and creative direction', skills: ['UI/UX Design', 'Photography', 'Creative Direction', 'Branding'] },
].map(route => ({ ...route, members: team.filter(member => member.skills.some(skill => route.skills.includes(skill))) }));
