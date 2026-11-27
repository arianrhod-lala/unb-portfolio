import { useEffect, useRef, useState } from 'react';
import TrainIllustration from './TrainIllustration';
import RailPassenger from './RailPassenger';
import { STATIONS } from '../data/stations';
import { RAILWAY_TRIAL, STATION_SCENES, passengerPose, railPaths, trackOffset, trackAngle, type StationScene } from '../utils/journeyMotion';

const stops = STATIONS.map(station => station.id);
const departures = stops.flatMap((stop, index) => Array.from({ length: index % 2 + 1 }, (_, person) => ({ stop, person })));
const boarders = Array.from({ length: departures.length }, (_, index) => index);

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
    const boardingPeople = [...track.querySelectorAll<HTMLElement>('[data-boarding]')];
    const exitingPeople = [...track.querySelectorAll<HTMLElement>('[data-exit]')];

    const update = () => {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      const y = motion.matches ? 0 : progress * travel;
      const center = y + train.offsetHeight / 2;
      const offset = motion.matches ? 0 : trackOffset(center, bendRef.current);
      const scene = bendRef.current.find(event => event.amplitude && center > event.start && center < event.end);
      const sceneOffset = scene ? trackOffset(center, [scene]) : 0;
      const closeup = scene ? Math.min(1, Math.max(0, sceneOffset / scene.amplitude) * 1.4) : 0;
      const zoom = 1 + (RAILWAY_TRIAL.maxZoom - 1) * closeup;
      track.dataset.event = motion.matches ? 'parked' : scene?.id ?? 'travel';
      train.style.transform = `translate(${offset}px, ${y}px)`;
      train.style.setProperty('--train-zoom', String(zoom));
      train.style.setProperty('--train-angle', `${motion.matches ? 0 : trackAngle(center, bendRef.current)}deg`);
      const width = track.clientWidth;
      boardingPeople.forEach((person, index) => {
        const pose = passengerPose((y - index * 7) / 65, 'board', width);
        person.style.transform = `translate(${(index % 2 ? 1 : -1) * width * 0.24}px, ${pose.y}px)`;
        person.style.opacity = motion.matches ? '0' : String(pose.opacity);
      });
      exitingPeople.forEach((person, index) => {
        const departure = departures[index];
        const stop = measuredStops.find(station => station.id === departure.stop);
        if (!stop) return;
        const start = Math.max(0, Math.min(travel - 150, stop.top + width / 2 - 34 * train.clientWidth / 44));
        const pose = passengerPose((y - start) / 120 - departure.person * 0.16, 'exit', width);
        // Desktop platforms alternate sides; the mobile track only has room to its right.
        const direction = width < 44 || departure.stop === 'about' || departure.stop === 'contact' ? 1 : -1;
        const x = trackOffset(stop.top, bendRef.current) + width / 2 + direction * pose.x - (width < 44 ? 3 : 7);
        person.style.transform = `translate(${x}px, ${stop.top + width / 2 + pose.y - (width < 44 ? 5 : 10)}px)`;
        person.style.opacity = motion.matches ? '0' : String(pose.opacity);
      });
    };
    const measure = () => {
      measureFrame = 0;
      if (disposed) return;
      travel = Math.max(0, track.clientHeight - train.offsetHeight - 12);
      const trackTop = track.getBoundingClientRect().top;
      const next = stops.flatMap(id => {
        const section = document.getElementById(id);
        return section ? [{ id, top: Math.max(0, section.getBoundingClientRect().top - trackTop + 48) }] : [];
      });
      measuredStops = next;
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
      update();
    };
    const onScroll = () => {
      if (!motion.matches && !frame) frame = window.requestAnimationFrame(update);
    };
    const scheduleMeasure = () => {
      if (!disposed && !measureFrame) measureFrame = window.requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(root);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    motion.addEventListener('change', scheduleMeasure);
    desktop.addEventListener('change', scheduleMeasure);
    document.fonts.ready.then(scheduleMeasure);
    measure();
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleMeasure);
      motion.removeEventListener('change', scheduleMeasure);
      desktop.removeEventListener('change', scheduleMeasure);
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
        <div className="journey-train__model">
          <TrainIllustration />
          {boarders.map(index => <span key={index} className="journey-passenger journey-passenger--boarding" data-boarding={index}><RailPassenger /></span>)}
        </div>
      </div>
      {departures.map(({ stop, person }) => <span key={`${stop}-${person}`} className="journey-passenger" data-exit={stop} data-person={person}><RailPassenger /></span>)}
      <span className="journey-buffer" />
    </div>
  );
}
