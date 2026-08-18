import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { profile, ui } from '@/data/content';
import { customAssets, asset } from '@/data/assets';
import { useT } from '@/lib/i18n';
import { useGame, levelInfo } from '@/store/game';
import { playSfx } from '@/lib/sound';
import { usePrefersReducedMotion } from '@/lib/hooks';
import ParallaxScene from '@/components/effects/ParallaxScene';

export default function Hero() {
  const { t, lang } = useT();
  const unlocked = useGame((s) => s.unlocked);
  const lvl = levelInfo(unlocked);
  const reduced = usePrefersReducedMotion();

  const roles =
    lang === 'pt'
      ? ['Desenvolvedor Full Stack', 'Especialista em Automação', 'Resolvedor de Problemas']
      : ['Full Stack Developer', 'Automation Specialist', 'Problem Solver'];
  const typed = useTypewriter(roles, reduced);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    playSfx('select');
  };

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] as const },
        };

  return (
    <section id="hero" className="relative flex min-h-[100dvh] items-center overflow-hidden pt-16">
      <ParallaxScene />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Coluna de texto */}
        <div>
          <motion.p {...fade(0)} className="mb-5 flex items-center gap-2 font-pixel text-[0.6rem] text-primary">
            <span className="inline-block h-2 w-2 animate-blink bg-primary" />
            {t(ui.hero.kicker)}
          </motion.p>

          <motion.h1 {...fade(0.06)} className="font-pixel text-3xl leading-[1.35] text-ink sm:text-4xl md:text-5xl">
            RONALDO
            <br />
            <span className="text-primary neon">RIBEIRO</span>
          </motion.h1>

          <motion.p {...fade(0.12)} className="mt-5 min-h-[1.6em] text-lg text-ink sm:text-xl">
            <span className="text-accent">›</span> {typed}
            <span className="ml-0.5 inline-block h-[1.1em] w-[0.55ch] translate-y-0.5 animate-blink bg-accent align-middle" />
          </motion.p>

          <motion.p {...fade(0.18)} className="mt-4 max-w-[52ch] text-dim">
            {t(profile.tagline)}
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-8 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => go('projects')}>
              ▶ {t(ui.hero.ctaProjects)}
            </button>
            <button className="btn btn-ghost" onClick={() => go('contact')}>
              ✉ {t(ui.hero.ctaContact)}
            </button>
          </motion.div>
        </div>

        {/* Coluna do "cartão de jogador" */}
        <motion.div
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0, scale: 0.96, y: 16 },
                animate: { opacity: 1, scale: 1, y: 0 },
                transition: { duration: 0.55, delay: 0.2, ease: [0.23, 1, 0.32, 1] as const },
              })}
          className="scanlines panel relative mx-auto w-full max-w-sm p-5"
        >
          <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
            <span className="font-pixel text-[0.6rem] text-dim">PLAYER-01</span>
            <span className="font-pixel text-[0.6rem] text-grass">● ONLINE</span>
          </div>

          {/* avatar pixel */}
          <div className="flex items-center gap-4">
            <PixelAvatar />
            <div className="min-w-0">
              <p className="font-pixel text-xs text-ink">{profile.name}</p>
              <p className="mt-1 truncate text-sm text-dim">{t(profile.role)}</p>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Row label={t(ui.hud.level)} value={String(lvl.level)} accent />
            <Row label="CLASS" value={t(profile.class)} />
            <Row label="LOC" value={t(profile.location)} span />
          </dl>

          <div className="mt-4 border-t border-line pt-4">
            <div className="flex items-center justify-between text-xs text-dim">
              <span>{t(ui.hud.achievements)}</span>
              <span className="font-pixel text-[0.55rem] tabular-nums text-accent">
                {lvl.atMax ? 'MAX' : `${lvl.level}/${lvl.total}`}
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden border border-line bg-surface-2">
              <div
                className="h-full bg-accent transition-[width] duration-500 ease-out"
                style={{ width: `${Math.round(lvl.progress * 100)}%`, boxShadow: '0 0 12px -1px currentColor' }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* dica de scroll */}
      <button
        onClick={() => go('about')}
        className="absolute inset-x-0 bottom-6 mx-auto flex w-fit flex-col items-center gap-1 text-dim transition-colors hover:text-primary"
        aria-label={t(ui.hero.scroll)}
      >
        <span className="font-pixel text-[0.55rem] uppercase tracking-widest">{t(ui.hero.scroll)}</span>
        <span className={reduced ? '' : 'animate-floaty'}>▼</span>
      </button>
    </section>
  );
}

function Row({ label, value, accent, span }: { label: string; value: string; accent?: boolean; span?: boolean }) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <dt className="font-pixel text-[0.5rem] uppercase tracking-wider text-line">{label}</dt>
      <dd className={accent ? 'text-accent' : 'text-ink'}>{value}</dd>
    </div>
  );
}

/** Avatar do jogador: usa imagem personalizada se definida, senão o pixel autoral. */
function PixelAvatar() {
  const custom = asset(customAssets.heroAvatar);
  if (custom) {
    return (
      <img
        src={custom}
        alt=""
        className="h-16 w-16 shrink-0 object-contain [image-rendering:pixelated]"
        aria-hidden
      />
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="h-16 w-16 shrink-0" shapeRendering="crispEdges" aria-hidden>
      <rect width="16" height="16" fill="rgb(var(--c-bg))" />
      {/* capuz/cabelo */}
      <rect x="4" y="2" width="8" height="3" fill="rgb(var(--c-violet))" />
      <rect x="3" y="3" width="1" height="4" fill="rgb(var(--c-violet))" />
      <rect x="12" y="3" width="1" height="4" fill="rgb(var(--c-violet))" />
      {/* rosto */}
      <rect x="4" y="5" width="8" height="5" fill="#e8b892" />
      {/* olhos */}
      <rect x="6" y="6" width="1" height="2" fill="rgb(var(--c-bg))" />
      <rect x="9" y="6" width="1" height="2" fill="rgb(var(--c-bg))" />
      {/* sorriso */}
      <rect x="6" y="9" width="4" height="1" fill="rgb(var(--c-bg))" />
      {/* gola/ombros */}
      <rect x="3" y="11" width="10" height="4" fill="rgb(var(--c-primary))" />
      <rect x="7" y="11" width="2" height="2" fill="rgb(var(--c-accent))" />
    </svg>
  );
}

/** Efeito de digitação que cicla por várias frases. */
function useTypewriter(phrases: string[], reduced: boolean) {
  const [text, setText] = useState(reduced ? phrases[0] : '');

  useEffect(() => {
    if (reduced) {
      setText(phrases[0]);
      return;
    }
    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer: number;

    const tick = () => {
      const full = phrases[phrase];
      if (!deleting) {
        char++;
        setText(full.slice(0, char));
        if (char === full.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1600);
          return;
        }
      } else {
        char--;
        setText(full.slice(0, char));
        if (char === 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
        }
      }
      timer = window.setTimeout(tick, deleting ? 45 : 85);
    };

    timer = window.setTimeout(tick, 400);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases.join('|'), reduced]);

  return text;
}
