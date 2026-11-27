const stampFiles = [
  'member-pass-stamp', 'un-avenue-stamp', 'project-train-stamp',
  'project-junction-stamp', 'project-platform-stamp',
  'stamp-sakura-local', 'stamp-love-line', 'stamp-sunset-ticket',
  'stamp-city-shield', 'stamp-lucky-junction',
];

// A member's ID is the seed: reopening a pass keeps its own collection intact.
export function profileStamps(memberId: string): Array<{ src: string; rotation: number }> {
  let seed = 2166136261;
  for (const character of memberId) seed = Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0;
  const next = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed;
  };
  const shuffled = [...stampFiles];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swap = next() % (index + 1);
    [shuffled[index], shuffled[swap]] = [shuffled[swap], shuffled[index]];
  }
  return shuffled.map(file => ({ src: `/images/${file}.svg`, rotation: next() % 15 - 7 }));
}
