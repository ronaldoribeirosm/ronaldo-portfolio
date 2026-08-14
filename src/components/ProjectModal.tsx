import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '@/data/content';
import { ui } from '@/data/content';
import { useT } from '@/lib/i18n';
import { playSfx } from '@/lib/sound';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { categoryColor, textColor, barColor } from '@/lib/projectStyles';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  const { t } = useT();
  const reduced = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        playSfx('select');
        return;
      }
      // mantém o foco dentro do diálogo
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  const c = project ? categoryColor[project.category] : 'primary';

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[50] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={project.name}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" onClick={onClose} />

          {/* painel */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            ref={panelRef}
            className="scanlines panel relative z-10 w-full max-w-lg overflow-hidden"
          >
            {/* topo */}
            <div className="flex items-start justify-between gap-4 border-b border-line p-5">
              <div>
                <span className={clsx('font-pixel text-[0.55rem] uppercase tracking-wider', textColor[c])}>
                  {t(project.element)} · {project.year}
                </span>
                <h3 className="mt-2 font-pixel text-base text-ink">{project.name}</h3>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label={t(ui.projects.close)}
                className="grid h-8 w-8 shrink-0 place-items-center border-2 border-line text-dim transition-colors hover:border-danger hover:text-danger active:scale-95"
              >
                ✕
              </button>
            </div>

            {/* corpo */}
            <div className="p-5">
              <p className="text-[15px] leading-relaxed text-ink">{t(project.description)}</p>

              <div className="mt-5">
                <span className="font-pixel text-[0.5rem] uppercase tracking-widest text-dim">
                  {t(ui.projects.stack)}
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs text-dim">
                  <span>{t(ui.projects.power)}</span>
                  <span className="font-pixel text-[0.5rem] tabular-nums">{project.power}/100</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden border border-line bg-surface-2">
                  <div className={clsx('h-full', barColor[c])} style={{ width: `${project.power}%`, boxShadow: '0 0 12px -2px currentColor' }} />
                </div>
              </div>

              {(project.links.repo || project.links.demo) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.links.repo && (
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                      onClick={() => playSfx('coin')}
                    >
                      {'</>'} {t(ui.projects.viewCode)}
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      onClick={() => playSfx('coin')}
                    >
                      ▶ {t(ui.projects.viewDemo)}
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
