import { useEffect } from 'react';
import {
  motion,
  animate,
  useMotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/hooks';
import { useGame } from '@/store/game';
import { asset } from '@/data/assets';

/**
 * Fundo do hero: pixel art autoral da Serra da Mantiqueira, em camadas.
 *
 * Camadas (do fundo p/ frente): ceu ditherado (dia/noite) -> sol e lua em pixel
 * cruzando um arco -> mar de montanhas com araucarias e a Pedra do Bau (PNG de
 * ceu transparente). Ao trocar o tema, um unico valor `p` (0 = dia, 1 = noite)
 * rege tudo: o sol se poe a oeste, a lua nasce a leste, o ceu escurece e as
 * estrelas (ja no PNG do ceu noturno) surgem — tudo em sincronia e com os astros
 * sumindo naturalmente ATRAS dos picos.
 */

// horizonte e raios do arco (percentuais da caixa da cena)
const HORIZON = 64;
const RX = 60;
const RY = 50;

const arcX = (t: number) => 50 + RX * Math.cos(t);
const arcY = (t: number) => HORIZON - RY * Math.sin(t);

const sunT = (p: number) => Math.PI / 2 - p * (Math.PI / 2 + 0.55); // apex -> oeste
const moonT = (p: number) => Math.PI + 0.55 - p * (Math.PI / 2 + 0.55); // leste -> apex

const PIXELATED = { imageRendering: 'pixelated' as const };

export default function ParallaxScene() {
  const reduced = usePrefersReducedMotion();
  const theme = useGame((s) => s.theme);
  const { scrollY } = useScroll();

  const p = useMotionValue(theme === 'dark' ? 1 : 0);
  useEffect(() => {
    const target = theme === 'dark' ? 1 : 0;
    if (reduced) {
      p.set(target);
      return;
    }
    const controls = animate(p, target, { duration: 1.7, ease: [0.7, 0, 0.2, 1] });
    return () => controls.stop();
  }, [theme, reduced, p]);

  // parallax leve no scroll
  const ySky = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 36]);
  const yAstro = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 66]);
  const yScene = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 95]);

  const dayOp = useTransform(p, (v) => 1 - v);
  const nightOp = p;
  const glowOp = useTransform(p, [0, 0.5, 1], [0.1, 0.7, 0.1]);

  const sunLeft = useMotionTemplate`${useTransform(p, (v) => arcX(sunT(v)))}%`;
  const sunTop = useMotionTemplate`${useTransform(p, (v) => arcY(sunT(v)))}%`;
  const sunOp = useTransform(p, [0, 0.82, 0.96], [1, 1, 0]);
  const moonLeft = useMotionTemplate`${useTransform(p, (v) => arcX(moonT(v)))}%`;
  const moonTop = useMotionTemplate`${useTransform(p, (v) => arcY(moonT(v)))}%`;
  const moonOp = useTransform(p, [0.06, 0.22, 1], [0, 1, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* ceu ditherado — crossfade dia/noite */}
      <motion.img
        src={asset('/assets/bg/hero-sky-day.png')}
        alt=""
        style={{ y: ySky, opacity: dayOp, ...PIXELATED }}
        className="absolute inset-x-0 -top-[4%] bottom-0 h-[108%] w-full object-cover"
      />
      <motion.img
        src={asset('/assets/bg/hero-sky-night.png')}
        alt=""
        style={{ y: ySky, opacity: nightOp, ...PIXELATED }}
        className="absolute inset-x-0 -top-[4%] bottom-0 h-[108%] w-full object-cover"
      />

      {/* SOL e LUA em pixel cruzam o arco — atras das montanhas */}
      <motion.div style={{ y: yAstro }} className="absolute inset-0">
        <motion.img
          src={asset('/assets/bg/sun.png')}
          alt=""
          style={{ left: sunLeft, top: sunTop, opacity: sunOp, ...PIXELATED }}
          className="absolute h-[16%] max-h-32 min-h-14 aspect-square -translate-x-1/2 -translate-y-1/2"
        />
        <motion.img
          src={asset('/assets/bg/moon.png')}
          alt=""
          style={{ left: moonLeft, top: moonTop, opacity: moonOp, ...PIXELATED }}
          className="absolute h-[15%] max-h-28 min-h-12 aspect-square -translate-x-1/2 -translate-y-1/2"
        />
      </motion.div>

      {/* brilho quente do horizonte (auge do por do sol) */}
      <motion.div style={{ opacity: glowOp }} className="absolute inset-x-0 bottom-0 h-1/2" aria-hidden>
        <div
          className="h-full w-full"
          style={{ background: 'linear-gradient(to top, rgba(255,150,80,.5), rgba(255,120,90,.1) 45%, transparent 75%)' }}
        />
      </motion.div>

      {/* mar de montanhas + araucarias + Pedra do Bau (mesma geometria, so a cor muda) */}
      <motion.img
        src={asset('/assets/bg/hero-fg-day.png')}
        alt=""
        style={{ y: yScene, opacity: dayOp, ...PIXELATED }}
        className="absolute inset-x-0 bottom-0 h-[112%] w-full object-cover object-bottom"
      />
      <motion.img
        src={asset('/assets/bg/hero-fg-night.png')}
        alt=""
        style={{ y: yScene, opacity: nightOp, ...PIXELATED }}
        className="absolute inset-x-0 bottom-0 h-[112%] w-full object-cover object-bottom"
      />

      {/* legibilidade: escurece a base, o topo e a coluna esquerda */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-bg/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-transparent to-transparent" />
    </div>
  );
}
