import type { ReactNode } from 'react';

interface SectionHeadingProps {
  index: string; // ex.: "02"
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

/** Cabeçalho de seção com marcador de "fase" — o número faz parte da metáfora de jogo. */
export default function SectionHeading({ index, title, subtitle, children }: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:mb-14">
      <div className="flex items-center gap-3 text-primary">
        <span className="font-pixel text-xs">{index}</span>
        <span className="h-px flex-1 max-w-[3rem] bg-primary/50" />
        <span className="font-pixel text-[0.55rem] uppercase tracking-widest text-dim">STAGE</span>
      </div>
      <h2 className="font-pixel text-lg leading-[1.5] text-ink xs:text-xl sm:text-3xl">{title}</h2>
      {subtitle && <p className="max-w-[60ch] text-dim">{subtitle}</p>}
      {children}
    </div>
  );
}
