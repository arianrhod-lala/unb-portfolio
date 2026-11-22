import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { scrollBehavior } from '../utils/motion';

const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));

export function useTeamScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const metrics = useRef({ enabled: false, travel: 0, overflow: 0, navHeight: 0 });
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const scroller = scrollerRef.current;
    const content = pin?.querySelector<HTMLElement>('.team-container');
    if (!section || !pin || !scroller || !content) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let scrollFrame = 0;
    let measureFrame = 0;

    const sync = () => {
      scrollFrame = 0;
      const { enabled, travel, overflow, navHeight } = metrics.current;
      if (!enabled) return;
      const progress = clamp(navHeight - section.getBoundingClientRect().top, travel) / travel;
      const left = progress * overflow;
      if (Math.abs(scroller.scrollLeft - left) > 0.5) scroller.scrollLeft = left;
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(sync);
    };
    const measure = () => {
      measureFrame = 0;
      if (disposed) return;
      // Probe the rail at its natural size without temporarily collapsing the page.
      const oldMinHeight = section.style.minHeight;
      section.style.minHeight = `${section.offsetHeight}px`;
      section.dataset.scrollMode = 'rail';
      const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      const stage = window.innerHeight - navHeight;
      const overflow = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const enabled = !motion.matches && overflow > 0 && content.offsetHeight + 64 <= stage;
      const travel = Math.ceil(overflow * 1.2);
      metrics.current = { enabled, travel, overflow, navHeight };
      section.style.setProperty('--team-stage', `${stage}px`);
      section.style.setProperty('--team-travel', `${enabled ? travel : 0}px`);
      section.dataset.scrollMode = enabled ? 'pinned' : 'stacked';
      section.style.minHeight = oldMinHeight;
      if (!enabled) scroller.scrollLeft = 0;
      setIsPinned(enabled);
      sync();
    };
    const scheduleMeasure = () => {
      if (!disposed && !measureFrame) measureFrame = window.requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(content);
    observer.observe(scroller);
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
      window.cancelAnimationFrame(scrollFrame);
      window.cancelAnimationFrame(measureFrame);
    };
  }, []);

  const moveTo = useCallback((left: number, behavior: ScrollBehavior = scrollBehavior()) => {
    const section = sectionRef.current;
    const { enabled, overflow, travel, navHeight } = metrics.current;
    if (!section || !enabled) return;
    const start = section.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: start + clamp(left, overflow) / overflow * travel, behavior });
  }, []);

  const moveCards = (direction: number) => {
    moveTo((scrollerRef.current?.scrollLeft ?? 0) + direction * 264);
  };

  const onTrackKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !metrics.current.enabled) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      moveCards(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      moveTo(event.key === 'Home' ? 0 : metrics.current.overflow);
    }
  };

  const onCardFocus = (event: FocusEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    const card = (event.target as HTMLElement).closest<HTMLElement>('.member-card');
    if (!scroller || !card || !metrics.current.enabled) return;
    const viewport = scroller.getBoundingClientRect();
    const box = card.getBoundingClientRect();
    let left = scroller.scrollLeft;
    if (box.left < viewport.left) left += box.left - viewport.left - 8;
    if (box.right > viewport.right) left += box.right - viewport.right + 8;
    moveTo(left, 'auto');
  };

  return { sectionRef, pinRef, scrollerRef, isPinned, moveCards, onTrackKeyDown, onCardFocus };
}
