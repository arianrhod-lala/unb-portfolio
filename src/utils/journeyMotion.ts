// Set enabled to false to park this experiment without changing the page layout.
export const RAILWAY_TRIAL = { enabled: true, bendPixels: 24, maxZoom: 1.35 };
export interface TrackBend { start: number; end: number; amplitude: number }
export interface StationScene extends TrackBend { id: string }
export const STATION_SCENES = [
  { id: 'about', amplitude: RAILWAY_TRIAL.bendPixels },
  { id: 'team', amplitude: -20 },
  { id: 'contact', amplitude: 12 },
];

export function trackOffset(y: number, bends: readonly TrackBend[]): number {
  return bends.reduce((offset, bend) => {
    const phase = (y - bend.start) / (bend.end - bend.start);
    return offset + (phase > 0 && phase < 1 ? Math.sin(Math.PI * phase) ** 2 * bend.amplitude : 0);
  }, 0);
}

export function trackAngle(y: number, bends: readonly TrackBend[]): number {
  const slope = bends.reduce((sum, bend) => {
    const phase = (y - bend.start) / (bend.end - bend.start);
    return sum + (phase > 0 && phase < 1 ? bend.amplitude * Math.PI / (bend.end - bend.start) * Math.sin(2 * Math.PI * phase) : 0);
  }, 0);
  return -Math.atan(slope) * 180 / Math.PI;
}

export function railPaths(height: number, bends: readonly TrackBend[]) {
  const positions = new Set([0, height]);
  for (const bend of bends) {
    if (!bend.amplitude) continue;
    for (let y = Math.max(0, bend.start); y < Math.min(height, bend.end); y += 12) positions.add(y);
    positions.add(Math.max(0, Math.min(height, bend.end)));
  }
  const sorted = [...positions].sort((a, b) => a - b);
  const path = (x: number) => sorted.map((y, index) => `${index ? 'L' : 'M'}${(x + trackOffset(y, bends)).toFixed(2)} ${y.toFixed(2)}`).join(' ');
  return { left: path(12), right: path(32), sleepers: path(22) };
}
