import { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

/** Cena de parallax autoral: estrelas + silhuetas de montanha em pixel. */
export default function ParallaxScene() {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  const yStars = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 120]);
  const yFar = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 60]);
  const yNear = useTransform(scrollY, [0, 800], [0, reduced ? 0 : -40]);

  const stars = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        left: (i * 97.13) % 100,
        top: (i * 53.7) % 70,
        size: (i % 3) + 1,
        delay: (i % 7) * 0.4,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* estrelas */}
      <motion.div style={{ y: yStars }} className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute bg-ink/70"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animation: reduced ? undefined : `twinkle ${2 + s.delay}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </motion.div>

      {/* montanha distante */}
      <motion.svg
        style={{ y: yFar }}
        className="absolute bottom-0 left-0 h-[45%] w-full"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        <polygon points="0,40 0,26 14,14 26,24 40,10 54,22 70,8 84,20 100,12 100,40" fill="rgb(var(--c-violet) / 0.12)" />
      </motion.svg>

      {/* montanha próxima */}
      <motion.svg
        style={{ y: yNear }}
        className="absolute bottom-0 left-0 h-[32%] w-full"
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
      >
        <polygon points="0,30 0,20 12,10 24,18 38,6 52,16 66,7 80,17 92,9 100,16 100,30" fill="rgb(var(--c-primary) / 0.1)" />
      </motion.svg>

      {/* piso com brilho */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/10 to-transparent" />

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.25} 50%{opacity:.9} }
      `}</style>
    </div>
  );
}
