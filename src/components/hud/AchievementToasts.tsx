import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '@/store/game';
import { useT } from '@/lib/i18n';
import { ui, type Achievement } from '@/data/content';
import { usePrefersReducedMotion } from '@/lib/hooks';

export default function AchievementToasts() {
  const toasts = useGame((s) => s.toasts);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Toast({ toast }: { toast: Achievement }) {
  const { t } = useT();
  const dismiss = useGame((s) => s.dismissToast);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(toast.id), 4200);
    return () => window.clearTimeout(timer);
  }, [toast.id, dismiss]);

  return (
    <motion.div
      layout={!reduced}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      onClick={() => dismiss(toast.id)}
      className="scanlines pointer-events-auto flex w-[min(20rem,90vw)] cursor-pointer items-center gap-3 border-2 border-accent bg-surface/95 p-3 shadow-[0_0_24px_-6px_rgb(var(--c-accent))] backdrop-blur"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center border border-accent/50 text-accent">
        {toast.icon}
      </span>
      <div className="min-w-0">
        <p className="font-pixel text-[0.5rem] uppercase tracking-wider text-accent">
          {t(ui.hud.achievements)} · +{toast.xp} {t(ui.hud.xp)}
        </p>
        <p className="mt-1 truncate text-sm font-bold text-ink">{t(toast.title)}</p>
        <p className="truncate text-xs text-dim">{t(toast.desc)}</p>
      </div>
    </motion.div>
  );
}
