import { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/hooks';

/**
 * Fundo do hero: pixel art autoral da Serra da Mantiqueira à noite,
 * com parallax leve e camadas de brilho/escurecimento para manter o texto legível.
 */
export default function ParallaxScene() {
  const reduced = usePrefersReducedMotion();
  const { scrollY } = useScroll();

  const yScene = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 90]);
  const yStars = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 150]);

  const stars = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        left: (i * 61.7) % 100,
        top: (i * 33.3) % 42,
        size: (i % 3) === 0 ? 2 : 1,
        delay: (i % 6) * 0.5,
      })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* cena em pixel art */}
      <motion.img
        src="/assets/bg/mantiqueira-night.png"
        alt=""
        style={{ y: yScene }}
        className="absolute inset-x-0 bottom-0 h-[112%] w-full object-cover object-bottom opacity-90 [image-rendering:pixelated]"
      />

      {/* estrelas piscando (vida extra sobre o céu) */}
      <motion.div style={{ y: yStars }} className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-ink"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: 0.7,
              animation: reduced ? undefined : `twinkle ${2.4 + s.delay}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </motion.div>

      {/* legibilidade: escurece a base, o topo e a coluna esquerda */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-bg/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-transparent" />
      {/* brilho quente vindo do horizonte */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-secondary/12 to-transparent" />

      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.25} 50%{opacity:.95} }
      `}</style>
    </div>
  );
}
