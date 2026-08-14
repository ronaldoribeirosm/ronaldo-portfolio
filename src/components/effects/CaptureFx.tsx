import { motion } from 'framer-motion';
import { ui } from '@/data/content';
import { useT } from '@/lib/i18n';
import { usePrefersReducedMotion } from '@/lib/hooks';

/** Flash de "captura" ao abrir um projeto — cápsula autoral + burst de brilho. */
export default function CaptureFx() {
  const { t } = useT();
  const reduced = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 z-[52] grid place-items-center" aria-hidden>
      <div className="relative grid place-items-center">
        {/* cápsula que "fecha" */}
        {!reduced && (
          <motion.svg
            viewBox="0 0 16 16"
            className="h-16 w-16"
            shapeRendering="crispEdges"
            initial={{ scale: 0.2, y: -80, rotate: -40, opacity: 0 }}
            animate={{ scale: [0.2, 1.1, 1, 1], y: [-80, 0, 0, 0], rotate: [-40, 0, 0, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.7, times: [0, 0.4, 0.7, 1], ease: [0.23, 1, 0.32, 1] }}
          >
            <circle cx="8" cy="8" r="6" fill="rgb(var(--c-surface-2))" stroke="rgb(var(--c-primary))" strokeWidth="1" />
            <rect x="2" y="7.5" width="12" height="1" fill="rgb(var(--c-primary))" />
            <circle cx="8" cy="8" r="1.6" fill="rgb(var(--c-accent))" />
          </motion.svg>
        )}

        {/* brilho */}
        {!reduced && (
          <motion.span
            className="absolute h-24 w-24 rounded-full"
            style={{ boxShadow: '0 0 40px 10px rgb(var(--c-accent) / 0.5)' }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.4, 1.8], opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        )}

        {/* texto GOTCHA */}
        <motion.p
          className="absolute -bottom-10 whitespace-nowrap font-pixel text-sm text-accent neon"
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
          animate={reduced ? { opacity: 1 } : { opacity: [0, 1, 1, 0], scale: [0.6, 1.1, 1, 1] }}
          transition={{ duration: 0.75, times: [0, 0.45, 0.7, 1], ease: [0.23, 1, 0.32, 1] }}
        >
          {t(ui.projects.gotcha)}
        </motion.p>
      </div>
    </div>
  );
}
