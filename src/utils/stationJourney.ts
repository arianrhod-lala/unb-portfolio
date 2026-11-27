export const STATION_DWELL_MS = 1800;
const ARRIVAL_MS = 220;
const DEPARTURE_MS = 280;
export interface JourneyStop { id: string; y: number }
export interface JourneyFrame {
  y: number;
  phase: 'travel' | 'arriving' | 'dwelling' | 'departing';
  stopId: string | null;
  dwellProgress: number;
  needsFrame: boolean;
}
const ease = (progress: number) => {
  const phase = Math.max(0, Math.min(1, progress));
  return phase * phase * (3 - 2 * phase);
};

// Only one stop can be active. Page scrolling stays free throughout the dwell.
export class StationJourney {
  private position = 0;
  private initialized = false;
  private active: { stop: JourneyStop; from: number; at: number; arrival: number; direction: number } | null = null;
  private departure: { from: number; at: number } | null = null;

  reset(y: number) {
    this.position = y;
    this.initialized = true;
    this.active = null;
    this.departure = null;
  }

  step(target: number, now: number, stops: readonly JourneyStop[], skipDistance = 360): JourneyFrame {
    if (!this.initialized) {
      this.reset(target);
      const origin = stops.find(stop => stop.y === 0);
      if (target <= 1 && origin) this.active = { stop: origin, from: 0, at: now, arrival: 0, direction: 1 };
    }
    if (this.active) {
      // A large jump or a deliberate reversal should never lock the page at a stop.
      const distance = target - this.active.stop.y;
      if (Math.abs(distance) > skipDistance || distance * this.active.direction < -48) {
        this.reset(target);
      }
    } else if (!this.departure && target !== this.position) {
      const direction = Math.sign(target - this.position);
      const crossed = stops.filter(stop => direction * (stop.y - this.position) > 0 && direction * (target - stop.y) >= 0);
      const stop = direction > 0 ? crossed[crossed.length - 1] : crossed[0];
      if (stop && Math.abs(target - stop.y) <= skipDistance) {
        this.active = { stop, from: this.position, at: now, arrival: ARRIVAL_MS, direction };
      }
    }
    if (this.active) {
      const { stop, from, at, arrival } = this.active;
      const arrivedAt = at + arrival;
      if (now < arrivedAt) {
        this.position = from + (stop.y - from) * ease((now - at) / arrival);
        return { y: this.position, phase: 'arriving', stopId: stop.id, dwellProgress: 0, needsFrame: true };
      }
      this.position = stop.y;
      const dwellProgress = (now - arrivedAt) / STATION_DWELL_MS;
      if (dwellProgress < 1) return { y: this.position, phase: 'dwelling', stopId: stop.id, dwellProgress, needsFrame: true };
      this.departure = { from: stop.y, at: arrivedAt + STATION_DWELL_MS };
      this.active = null;
    }
    if (this.departure) {
      const progress = (now - this.departure.at) / DEPARTURE_MS;
      this.position = this.departure.from + (target - this.departure.from) * ease(progress);
      if (progress < 1) return { y: this.position, phase: 'departing', stopId: null, dwellProgress: 1, needsFrame: true };
      this.departure = null;
    }
    this.position = target;
    return { y: target, phase: 'travel', stopId: null, dwellProgress: 1, needsFrame: false };
  }
}
