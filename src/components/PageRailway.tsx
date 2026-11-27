import { useEffect, useRef, useState } from 'react';
import TrainIllustration from './TrainIllustration';
import RailPassenger from './RailPassenger';
import { STATIONS } from '../data/stations';
import { RAILWAY_TRIAL, STATION_SCENES, commuterPose, trainCarPoses, railPaths, trackOffset, type StationScene } from '../utils/journeyMotion';
import { StationJourney, STATION_DWELL_MS } from '../utils/stationJourney';

const stops = STATIONS.map(station => station.id);
const commuters = stops.flatMap((stop, station) => [0, 1, 2].flatMap(car => [-1, 1].map((side, person) => ({
  stop, car, side, person,
  kind: station === 0 ? 'board' as const : station === stops.length - 1 ? 'exit' as const
    : (car + person + station) % 2 ? 'board' as const : 'exit' as const,
}))));

export default function PageRailway({ activeSection }: { activeSection: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const [stations, setStations] = useState<Array<{ id: string; top: number }>>([]);
  const bendRef = useRef<StationScene[]>([]);
  const [paths, setPaths] = useState(() => railPaths(1, bendRef.current));

  useEffect(() => {
    const track = trackRef.current;
    const train = trainRef.current;
    const root = track?.parentElement;
    if (!track || !train || !root) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 1101px)');
    let frame = 0;
    let measureFrame = 0;
    let disposed = false;
    let travel = 0;
    let measuredStops: Array<{ id: string; top: number }> = [];
    const journey = new StationJourney();
    let hasMeasured = false;
    let resetJourney = false;
    const cars = [...train.querySelectorAll<SVGGElement>('[data-car]')];
    const couplings = [...train.querySelectorAll<SVGPathElement>('[data-coupling]')];
    const people = [...track.querySelectorAll<HTMLElement>('[data-commuter]')];

    const update = (now = performance.now()) => {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      const width = track.clientWidth;
      const scale = train.clientWidth / 44;
      const compact = !desktop.matches;
      const target = motion.matches ? 0 : progress * travel;
      const docks = measuredStops.map(stop => ({ id: stop.id, y: stop.id === 'home' ? 0 : Math.max(0, Math.min(travel, stop.top + width / 2 - 118 * scale)) }));
      if (resetJourney || motion.matches) journey.reset(target);
      resetJourney = false;
      const movement = journey.step(target, now, docks, Math.max(300, window.innerHeight * 0.45));
      const y = movement.y;
      track.dataset.phase = motion.matches ? 'parked' : movement.phase;
      track.dataset.dwellStop = movement.stopId ?? '';
      const poses = trainCarPoses(y, scale, width, bendRef.current);
      const scene = bendRef.current.find(event => event.amplitude && poses.some(car => car.y > event.start && car.y < event.end));
      track.dataset.event = motion.matches ? 'parked' : scene?.id ?? 'travel';
      train.style.transform = `translateY(${y}px)`;
      cars.forEach((car, index) => {
        const pose = poses[index];
        const offset = (pose.x - width / 2) / scale;
        car.setAttribute('transform', `translate(${offset} ${index * 82}) rotate(${pose.angle} 22 36)`);
      });
      // Endpoints are derived from each car's own transform, keeping the joints attached.
      couplings.forEach((coupling, index) => {
        const endpoints = [poses[index], poses[index + 1]].map((car, end) => {
          const distance = (end ? -36 : 36) * scale;
          const angle = car.angle * Math.PI / 180;
          return {
            x: 22 + (car.x - width / 2 - Math.sin(angle) * distance) / scale,
            y: (car.y - y + Math.cos(angle) * distance) / scale,
          };
        });
        coupling.setAttribute('d', `M${endpoints[0].x} ${endpoints[0].y}L${endpoints[1].x} ${endpoints[1].y}`);
      });
      people.forEach((person, index) => {
        const actor = commuters[index];
        const station = measuredStops.find(stop => stop.id === actor.stop);
        if (!station) return;
        const boarding = actor.kind === 'board';
        const elapsed = movement.dwellProgress * STATION_DWELL_MS;
        const phase = (elapsed - (boarding ? 420 : 100) - actor.person * 90 - actor.car * 55) / (boarding ? 1050 : 850);
        const pose = commuterPose(phase, actor.kind, poses[actor.car], poses[actor.car].y, actor.side, scale, compact);
        person.style.transform = `translate(${pose.x - (compact ? 6 : 12)}px, ${pose.y - (compact ? 10 : 17) + pose.bob}px)`;
        person.style.opacity = motion.matches || movement.phase !== 'dwelling' || movement.stopId !== actor.stop ? '0' : String(pose.opacity);
        person.style.setProperty('--stride', `${pose.stride}deg`);
      });
      if (movement.needsFrame && !motion.matches && !disposed) frame = window.requestAnimationFrame(update);
    };
    const measure = () => {
      measureFrame = 0;
      if (disposed) return;
      const nextTravel = Math.max(0, track.clientHeight - train.offsetHeight - 12);
      const trackTop = track.getBoundingClientRect().top;
      const next = stops.flatMap(id => {
        const section = document.getElementById(id);
        return section ? [{ id, top: Math.max(0, section.getBoundingClientRect().top - trackTop + 48) }] : [];
      });
      if (hasMeasured && (nextTravel !== travel || next.some((stop, index) => measuredStops[index]?.top !== stop.top))) resetJourney = true;
      travel = nextTravel;
      measuredStops = next;
      hasMeasured = true;
      const enabled = RAILWAY_TRIAL.enabled && desktop.matches && !motion.matches;
      bendRef.current = next.flatMap((stop, index) => {
        const config = STATION_SCENES.find(scene => scene.id === stop.id);
        if (!config) return [];
        const start = Math.max(0, stop.top - 180);
        const end = Math.min(stop.top + 300, (next[index + 1]?.top ?? Infinity) - 180, track.clientHeight);
        return [{ id: config.id, start, end, amplitude: enabled && end > start ? config.amplitude : 0 }];
      });
      setPaths(railPaths(track.clientHeight, bendRef.current));
      setStations(previous => previous.length === next.length && previous.every((stop, index) => stop.top === next[index].top) ? previous : next);
      window.cancelAnimationFrame(frame);
      update();
    };
    const onScroll = () => {
      if (!motion.matches && !frame) frame = window.requestAnimationFrame(update);
    };
    const scheduleMeasure = () => {
      if (!disposed && !measureFrame) measureFrame = window.requestAnimationFrame(measure);
    };
    const onResize = () => {
      resetJourney = true;
      scheduleMeasure();
    };
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(root);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    motion.addEventListener('change', onResize);
    desktop.addEventListener('change', onResize);
    document.fonts.ready.then(scheduleMeasure);
    measure();
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      motion.removeEventListener('change', onResize);
      desktop.removeEventListener('change', onResize);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(measureFrame);
    };
  }, []);

  return (
    <div ref={trackRef} className="journey-track" aria-hidden="true">
      <svg className="journey-rails" width="44" height="100%" focusable="false">
        <path d={paths.sleepers} stroke="currentColor" strokeWidth="40" strokeDasharray="2 26" fill="none" />
        <path d={paths.left} stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d={paths.right} stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
      {stations.map((stop, index) => <span key={stop.id} data-stop={stop.id} className={`journey-station${stop.id === activeSection ? ' is-active' : ''}`} style={{ top: stop.top, left: trackOffset(stop.top, bendRef.current) }}>0{index + 1}</span>)}
      <div ref={trainRef} className="journey-train">
        <div className="journey-train__model"><TrainIllustration /></div>
      </div>
      {commuters.map((actor, index) => (
        <span key={`${actor.stop}-${actor.car}-${actor.side}`} className="journey-passenger"
          data-commuter={actor.stop} data-kind={actor.kind} data-car-door={actor.car} data-side={actor.side}
          data-outfit={index % 4}>
          <RailPassenger variant={index} />
        </span>
      ))}
      <span className="journey-buffer" />
    </div>
  );
}
