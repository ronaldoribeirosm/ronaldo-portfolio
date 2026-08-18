import { createContext, useContext, type ReactNode } from 'react';
import clsx from 'clsx';
import { useOnScreen } from '@/lib/hooks';
import SectionScene, { type SceneVariant } from '@/components/effects/SectionScene';

/** Contexto que recebe o id da seção visitada (para XP + conquista Explorador). */
export const VisitContext = createContext<(id: string) => void>(() => {});
export const useVisit = () => useContext(VisitContext);

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
  /** Fundo pixel art full-bleed da seção (opcional). */
  scene?: SceneVariant;
}

/** Container de seção que registra a visita quando entra na viewport. */
export default function Section({ id, className, children, scene }: SectionProps) {
  const onVisit = useVisit();
  const ref = useOnScreen<HTMLElement>(() => onVisit(id), { threshold: 0.25 });

  return (
    <section ref={ref} id={id} className="relative w-full overflow-hidden scroll-mt-24">
      {scene && <SectionScene variant={scene} />}
      <div
        className={clsx(
          'relative z-10 mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28',
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
