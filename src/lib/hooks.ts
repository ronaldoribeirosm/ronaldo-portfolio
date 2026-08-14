import { useEffect, useRef, useState } from 'react';

/** Retorna true quando o usuário prefere movimento reduzido. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/** Dispara `onEnter` uma única vez quando o elemento entra na viewport. */
export function useOnScreen<T extends HTMLElement>(
  onEnter: () => void,
  options: IntersectionObserverInit = { threshold: 0.35 },
) {
  const ref = useRef<T | null>(null);
  const fired = useRef(false);
  const cb = useRef(onEnter);
  cb.current = onEnter;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          cb.current();
          observer.disconnect();
        }
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/** Detecta inatividade do mouse por `ms` milissegundos. */
export function useIdle(ms: number): boolean {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let timer: number;
    const reset = () => {
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), ms);
    };
    const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'scroll', 'touchstart', 'pointerdown'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [ms]);
  return idle;
}
