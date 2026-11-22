import { useEffect, useRef, useState } from 'react';
import TrainIllustration from './TrainIllustration';

const stops = ['home', 'about', 'team', 'contact'];

export default function PageRailway({ activeSection }: { activeSection: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trainRef = useRef<HTMLDivElement>(null);
  const [stations, setStations] = useState<Array<{ id: string; top: number }>>([]);

  useEffect(() => {
    const track = trackRef.current;
    const train = trainRef.current;
    const root = track?.parentElement;
    if (!track || !train || !root) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let measureFrame = 0;
    let disposed = false;
    let travel = 0;

    const update = () => {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      train.style.transform = `translateY(${motion.matches ? 0 : progress * travel}px)`;
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
    document.fonts.ready.then(scheduleMeasure);
    measure();
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleMeasure);
      motion.removeEventListener('change', scheduleMeasure);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(measureFrame);
    };
  }, []);

  return (
    <div ref={trackRef} className="journey-track" aria-hidden="true">
      <svg className="journey-rails" width="44" height="100%" focusable="false">
        <defs><pattern id="journey-sleepers" width="44" height="28" patternUnits="userSpaceOnUse"><path d="M2 14H42" stroke="currentColor" strokeWidth="2" /></pattern></defs>
        <rect width="44" height="100%" fill="url(#journey-sleepers)" />
        <line x1="12" x2="12" y1="0" y2="100%" stroke="currentColor" strokeWidth="1.5" />
        <line x1="32" x2="32" y1="0" y2="100%" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {stations.map((stop, index) => <span key={stop.id} data-stop={stop.id} className={`journey-station${stop.id === activeSection ? ' is-active' : ''}`} style={{ top: stop.top }}>0{index + 1}</span>)}
      <div ref={trainRef} className="journey-train">
        <TrainIllustration />
      </div>
      <span className="journey-buffer" />
    </div>
  );
}
