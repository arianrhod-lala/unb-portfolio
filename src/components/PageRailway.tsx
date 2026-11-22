import { useEffect, useRef, useState } from 'react';

const stops = ['home', 'about', 'team', 'contact'];

export default function PageRailway() {
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
      <svg className="journey-rails" width="28" height="100%" focusable="false">
        <defs><pattern id="journey-sleepers" width="28" height="24" patternUnits="userSpaceOnUse"><path d="M2 12H26" stroke="currentColor" strokeWidth="2" /></pattern></defs>
        <rect width="28" height="100%" fill="url(#journey-sleepers)" />
        <line x1="8" x2="8" y1="0" y2="100%" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" x2="20" y1="0" y2="100%" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {stations.map((stop, index) => <span key={stop.id} data-stop={stop.id} className="journey-station" style={{ top: stop.top }}>0{index + 1}</span>)}
      <div ref={trainRef} className="journey-train">
        <svg viewBox="0 0 28 88" fill="none" focusable="false">
          <g stroke="var(--main)" strokeWidth="1.5">
            <rect x="2" y="7" width="24" height="22" rx="3" fill="var(--main)" />
            <rect x="2" y="54" width="24" height="22" rx="3" fill="var(--main)" />
            <path d="M11 37h6v13h-6z" fill="var(--main)" />
            <rect x="4" y="1" width="20" height="39" rx="5" fill="var(--text-home)" />
            <path d="M4 52a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v23c0 7-4 12-10 12S4 82 4 75V52Z" fill="var(--lrt-green)" />
            <rect x="8" y="7" width="12" height="12" rx="2" fill="var(--night)" />
            <rect x="8" y="24" width="12" height="10" rx="2" fill="var(--night)" />
            <rect x="8" y="53" width="12" height="12" rx="2" fill="var(--night)" />
            <path d="M8 70h12" />
          </g>
          <path d="M8 78h3m6 0h3" stroke="var(--text-home)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <span className="journey-buffer" />
    </div>
  );
}
