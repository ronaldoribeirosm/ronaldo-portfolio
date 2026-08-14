import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { projects, projectFilters, ui, type Project, type ProjectCategory } from '@/data/content';
import { useT } from '@/lib/i18n';
import { playSfx } from '@/lib/sound';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { categoryColor, textColor, borderHover, barColor } from '@/lib/projectStyles';
import Section from '@/components/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectModal from '@/components/ProjectModal';
import CaptureFx from '@/components/effects/CaptureFx';

interface ProjectsProps {
  onOpenProject: (id: string) => void;
}

export default function Projects({ onOpenProject }: ProjectsProps) {
  const { t } = useT();
  const reduced = usePrefersReducedMotion();
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');
  const [selected, setSelected] = useState<Project | null>(null);
  const [capturing, setCapturing] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  const open = (p: Project) => {
    onOpenProject(p.id);
    playSfx('coin');
    if (reduced) {
      setSelected(p);
      return;
    }
    // pequena cena de "captura" antes de abrir a ficha
    const key = Date.now();
    setCapturing(key);
    window.setTimeout(() => {
      setSelected(p);
      setCapturing((c) => (c === key ? null : c));
    }, 680);
  };

  return (
    <Section id="projects">
      <SectionHeading index="02" title={t(ui.projects.title)} subtitle={t(ui.projects.subtitle)} />

      {/* filtros */}
      <div className="mb-8 flex flex-wrap gap-2">
        {projectFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setFilter(f.key);
              playSfx('hover');
            }}
            className={clsx(
              'border px-3 py-1.5 text-xs transition-all duration-150 active:scale-95',
              filter === f.key
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-line text-dim hover:border-dim hover:text-ink',
            )}
          >
            {t(f.label)}
          </button>
        ))}
      </div>

      {/* grade */}
      {visible.length === 0 ? (
        <p className="py-16 text-center text-dim">{t(ui.projects.empty)}</p>
      ) : (
        <motion.ul layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => {
              const c = categoryColor[p.category];
              return (
                <motion.li
                  key={p.id}
                  layout={!reduced}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: reduced ? 0 : Math.min(i * 0.04, 0.24), ease: [0.23, 1, 0.32, 1] }}
                >
                  <button
                    onClick={() => open(p)}
                    className={clsx(
                      'group flex h-full w-full flex-col border-2 border-line bg-surface/80 p-5 text-left transition-all duration-200 ease-out',
                      'hover:-translate-y-1 hover:bg-surface',
                      borderHover[c],
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className={clsx('font-pixel text-[0.55rem] uppercase tracking-wider', textColor[c])}>
                        {t(p.element)}
                      </span>
                      <span className="font-pixel text-[0.5rem] text-dim">{p.year}</span>
                    </div>

                    <h3 className="font-pixel text-sm leading-snug text-ink">{p.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-dim">{t(p.tagline)}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.stack.slice(0, 3).map((s) => (
                        <span key={s} className="chip text-[0.65rem]">
                          {s}
                        </span>
                      ))}
                      {p.stack.length > 3 && <span className="chip text-[0.65rem]">+{p.stack.length - 3}</span>}
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[0.65rem] text-dim">
                        <span>{t(ui.projects.power)}</span>
                        <span className="font-pixel text-[0.5rem] tabular-nums">{p.power}</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden border border-line bg-surface-2">
                        <div className={clsx('h-full', barColor[c])} style={{ width: `${p.power}%` }} />
                      </div>
                    </div>

                    <span className={clsx('mt-4 inline-flex items-center gap-1 text-xs', textColor[c])}>
                      {t(ui.projects.open)}{' '}
                      <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      )}

      {capturing !== null && <CaptureFx key={capturing} />}
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
