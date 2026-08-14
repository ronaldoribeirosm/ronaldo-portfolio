import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useOnScreen, usePrefersReducedMotion } from '@/lib/hooks';

const colorClass: Record<string, string> = {
  primary: 'bg-primary text-primary',
  secondary: 'bg-secondary text-secondary',
  accent: 'bg-accent text-accent',
  violet: 'bg-violet text-violet',
  grass: 'bg-grass text-grass',
};

interface StatBarProps {
  label: string;
  value: number; // 0..100
  color?: keyof typeof colorClass;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

/** Barra de status estilo ficha de jogo — preenche ao entrar na tela. */
export default function StatBar({ label, value, color = 'primary', showValue = true, size = 'md' }: StatBarProps) {
  const reduced = usePrefersReducedMotion();
  const [fill, setFill] = useState(0);
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>();

  const ref = useOnScreen<HTMLDivElement>(() => {
    if (reduced) {
      setFill(value);
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // ease-out quint
      const eased = 1 - Math.pow(1 - p, 5);
      setFill(value * eased);
      setDisplay(Math.round(value * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  });

  useEffect(() => () => cancelAnimationFrame(rafRef.current ?? 0), []);

  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={clsx('text-ink/90', size === 'sm' ? 'text-xs' : 'text-sm')}>{label}</span>
        {showValue && (
          <span className="font-pixel text-[0.6rem] tabular-nums text-dim" aria-hidden>
            {display}
          </span>
        )}
      </div>
      <div
        className={clsx(
          'mt-1.5 w-full overflow-hidden border border-line bg-surface-2',
          size === 'sm' ? 'h-2.5' : 'h-3.5',
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={clsx('h-full transition-none', colorClass[color])}
          style={{
            width: `${fill}%`,
            boxShadow: '0 0 12px -2px currentColor',
          }}
        />
      </div>
    </div>
  );
}
