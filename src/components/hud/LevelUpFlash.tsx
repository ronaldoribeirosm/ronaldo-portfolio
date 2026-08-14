import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '@/store/game';
import { useT } from '@/lib/i18n';
import { ui } from '@/data/content';
import { usePrefersReducedMotion } from '@/lib/hooks';

export default function LevelUpFlash() {
  const levelUpTo = useGame((s) => s.levelUpTo);
  const clear = useGame((s) => s.clearLevelUp);
  const { t } = useT();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (levelUpTo == null) return;
    const timer = window.setTimeout(clear, 1800);
    return () => window.clearTimeout(timer);
  }, [levelUpTo, clear]);

  return (
    <AnimatePresence>
      {levelUpTo != null && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[55] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="scanlines border-2 border-accent bg-surface/90 px-8 py-6 text-center shadow-[0_0_40px_-8px_rgb(var(--c-accent))] backdrop-blur"
          >
            <p className="font-pixel text-sm text-accent neon">{t(ui.hud.level)} UP!</p>
            <p className="mt-3 font-pixel text-3xl text-ink">LV.{levelUpTo}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
