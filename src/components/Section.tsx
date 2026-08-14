import { createContext, useContext, type ReactNode } from 'react';
import clsx from 'clsx';
import { useOnScreen } from '@/lib/hooks';

/** Contexto que recebe o id da seção visitada (para XP + conquista Explorador). */
export const VisitContext = createContext<(id: string) => void>(() => {});
export const useVisit = () => useContext(VisitContext);

interface SectionProps {
  id: string;
  className?: string;
  children: ReactNode;
  as?: 'section' | 'div';
}

/** Container de seção que registra a visita quando entra na viewport. */
export default function Section({ id, className, children }: SectionProps) {
  const onVisit = useVisit();
  const ref = useOnScreen<HTMLElement>(() => onVisit(id), { threshold: 0.25 });

  return (
    <section
      ref={ref}
      id={id}
      className={clsx('relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28', className)}
    >
      {children}
    </section>
  );
}
