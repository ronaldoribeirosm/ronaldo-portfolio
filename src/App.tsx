import { useCallback, useEffect, useRef, useState } from 'react';
import { projects } from '@/data/content';
import { customAssets, asset } from '@/data/assets';
import { useGame } from '@/store/game';
import { setSoundEnabled, registerSamples } from '@/lib/sound';
import { VisitContext } from '@/components/Section';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

import MiniGame from '@/components/MiniGame';
import AchievementToasts from '@/components/hud/AchievementToasts';
import LevelUpFlash from '@/components/hud/LevelUpFlash';
import KonamiListener from '@/components/effects/KonamiListener';
import SpriteCompanion from '@/components/effects/SpriteCompanion';

const NAV_SECTIONS = ['about', 'projects', 'skills', 'experience', 'contact'];

export default function App() {
  const theme = useGame((s) => s.theme);
  const lang = useGame((s) => s.lang);
  const soundEnabled = useGame((s) => s.soundEnabled);
  const unlock = useGame((s) => s.unlock);

  const visited = useRef<Set<string>>(new Set());
  const opened = useRef<Set<string>>(new Set());
  const [miniOpen, setMiniOpen] = useState(false);

  // aplica tema e idioma no documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
  }, [lang]);

  // registra amostras de áudio personalizadas (se houver)
  useEffect(() => {
    if (customAssets.sfx) {
      const resolved = Object.fromEntries(
        Object.entries(customAssets.sfx).map(([k, v]) => [k, asset(v)]),
      ) as Parameters<typeof registerSamples>[0];
      registerSamples(resolved);
    }
  }, []);

  // mantém o motor de áudio em sincronia com o estado salvo
  useEffect(() => {
    setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // "Insira a ficha" ao carregar
  useEffect(() => {
    const timer = window.setTimeout(() => unlock('first-boot'), 900);
    return () => window.clearTimeout(timer);
  }, [unlock]);

  const visitSection = useCallback(
    (id: string) => {
      if (visited.current.has(id)) return;
      visited.current.add(id);
      if (id === 'contact') unlock('challenger');
      if (NAV_SECTIONS.every((s) => visited.current.has(s))) unlock('explorer');
    },
    [unlock],
  );

  const openProject = useCallback(
    (id: string) => {
      if (opened.current.has(id)) return;
      opened.current.add(id);
      if (opened.current.size >= projects.length) unlock('collector');
    },
    [unlock],
  );

  return (
    <VisitContext.Provider value={visitSection}>
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:border-2 focus:border-primary focus:bg-surface focus:px-4 focus:py-2 focus:text-primary"
      >
        Pular para o conteúdo
      </a>

      <Header onSecret={() => setMiniOpen(true)} />

      <main>
        <Hero />
        <About />
        <Projects onOpenProject={openProject} />
        <Skills />
        <Experience />
        <Contact />
      </main>

      <Footer />

      {/* Mini-game (easter egg: 3 cliques no logo) */}
      <MiniGame open={miniOpen} onClose={() => setMiniOpen(false)} />

      {/* HUD e efeitos */}
      <AchievementToasts />
      <LevelUpFlash />
      <KonamiListener />
      <SpriteCompanion />
    </VisitContext.Provider>
  );
}
