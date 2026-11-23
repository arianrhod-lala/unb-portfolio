import { useEffect, useRef } from 'react';
import StationSign from './StationSign';
import { RAILWAY_TRIAL } from '../utils/journeyMotion';

export default function StationHeading({ number, name, title }: { number: string; name: string; title: string }) {
  const headingRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!RAILWAY_TRIAL.enabled || motion.matches || !('IntersectionObserver' in window)) {
      heading.dataset.arrival = 'arrived';
      return;
    }
    heading.dataset.arrival = 'pending';
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        heading.dataset.arrival = 'arrived';
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    const onMotionChange = () => {
      if (motion.matches) { heading.dataset.arrival = 'arrived'; observer.disconnect(); }
    };
    observer.observe(heading);
    motion.addEventListener('change', onMotionChange);
    return () => { observer.disconnect(); motion.removeEventListener('change', onMotionChange); };
  }, []);
  return (
    <div ref={headingRef} className="station-heading">
      <div className="station-heading__inner">
        <StationSign number={number} name={name} />
        <h2 className="display">{title}</h2>
      </div>
    </div>
  );
}
