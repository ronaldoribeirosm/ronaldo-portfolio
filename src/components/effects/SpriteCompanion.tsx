import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useIdle, usePrefersReducedMotion } from '@/lib/hooks';
import { customAssets, asset } from '@/data/assets';

/**
 * Companheiro pixel autoral que segue o cursor com atraso elástico.
 * Um pequeno drone — não representa nenhuma marca. Só aparece em telas
 * grandes com ponteiro fino e quando o movimento não está reduzido.
 */
export default function SpriteCompanion() {
  const reduced = usePrefersReducedMotion();
  const idle = useIdle(3200);
  const [enabled, setEnabled] = useState(false);
  const companionImg = asset(customAssets.companion);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 120, damping: 16, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 16, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    const update = () => setEnabled(mq.matches && !reduced);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      // desloca para o canto superior-direito do cursor
      x.set(e.clientX + 22);
      y.set(e.clientY - 10);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[45] hidden lg:block"
      aria-hidden
    >
      <motion.div
        animate={idle ? { y: [0, -2, 0] } : { y: [0, -4, 0] }}
        transition={{ duration: idle ? 3 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {companionImg ? (
          <img
            src={companionImg}
            alt=""
            className="h-8 w-8 object-contain drop-shadow-[0_0_8px_rgb(var(--c-primary)/0.6)] [image-rendering:pixelated]"
          />
        ) : (
        <svg viewBox="0 0 16 16" className="h-7 w-7 drop-shadow-[0_0_8px_rgb(var(--c-primary)/0.6)]" shapeRendering="crispEdges">
          {/* corpo do drone */}
          <rect x="4" y="4" width="8" height="7" fill="rgb(var(--c-surface-2))" stroke="rgb(var(--c-primary))" />
          {/* olho */}
          <rect x="6" y="6" width="4" height="3" fill="rgb(var(--c-primary))" />
          <rect x="7" y="7" width="1" height="1" fill="rgb(var(--c-bg))" />
          {/* antena */}
          <rect x="7" y="2" width="2" height="2" fill="rgb(var(--c-accent))" />
          {/* propulsor */}
          <rect x="5" y="11" width="2" height="2" fill="rgb(var(--c-secondary))" />
          <rect x="9" y="11" width="2" height="2" fill="rgb(var(--c-secondary))" />
        </svg>
        )}

        {/* z's quando ocioso */}
        {idle && (
          <span className="absolute -right-2 -top-3 select-none font-pixel text-[0.5rem] text-dim">z</span>
        )}
      </motion.div>
    </motion.div>
  );
}
