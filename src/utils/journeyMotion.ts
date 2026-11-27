// Set enabled to false to park this experiment without changing the page layout.
export const RAILWAY_TRIAL = { enabled: true, bendPixels: 24 };
export interface TrackBend { start: number; end: number; amplitude: number }
export interface StationScene extends TrackBend { id: string }
export interface CarPose { x: number; y: number; angle: number }

// Sample each car separately: cars outside a bend remain straight.
export function trainCarPoses(y: number, scale: number, trackWidth: number, bends: readonly TrackBend[]): CarPose[] {
  return [36, 118, 200].map(center => {
    const position = y + center * scale;
    return { x: trackWidth / 2 + trackOffset(position, bends), y: position, angle: trackAngle(position, bends) };
  });
}

// Side-door choreography follows the actual car, then joins the station platform.
// Everything is scroll-derived, so scrubbing never accumulates timers or actors.
export function commuterPose(progress: number, kind: 'board' | 'exit', car: CarPose, stationY: number, side: number, scale: number, compact: boolean) {
  const phase = Math.max(0, Math.min(1, progress));
  const eased = phase * phase * (3 - 2 * phase);
  const angle = car.angle * Math.PI / 180;
  const doorDistance = 16 * scale + (compact ? 3 : 7);
  const doorX = car.x + Math.cos(angle) * side * doorDistance;
  const doorY = car.y + Math.sin(angle) * side * doorDistance;
  const outward = kind === 'board' ? 1 - eased : eased;
  return {
    x: doorX + side * outward * (compact ? 7 : 32),
    y: doorY * (1 - outward) + (stationY + side * (compact ? 7 : 16)) * outward,
    opacity: progress < 0 || progress >= 1 ? 0 : kind === 'board'
      ? Math.min(1, (1 - phase) * 5)
      : Math.min(1, phase * 7, (1 - phase) * 5),
    stride: Math.sin(phase * Math.PI * 8) * 18,
    bob: Math.sin(phase * Math.PI * 16) * (compact ? 0.4 : 1),
  };
}
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
