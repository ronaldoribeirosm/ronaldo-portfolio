import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { profile, ui } from '@/data/content';
import { useT } from '@/lib/i18n';
import { useGame, levelInfo } from '@/store/game';
import { playSfx } from '@/lib/sound';
import CartridgeLogo from '@/components/ui/CartridgeLogo';

const NAV = [
  { id: 'about', label: ui.nav.about },
  { id: 'projects', label: ui.nav.projects },
  { id: 'skills', label: ui.nav.skills },
  { id: 'experience', label: ui.nav.experience },
  { id: 'contact', label: ui.nav.contact },
] as const;

interface HeaderProps {
  onSecret: () => void;
}

export default function Header({ onSecret }: HeaderProps) {
  const { t, lang } = useT();
  const { unlocked, soundEnabled, theme, toggleSound, toggleTheme, toggleLang } = useGame();
  const lvl = levelInfo(unlocked);
  const [active, setActive] = useState<string>('hero');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logoClicks = useRef<{ n: number; timer: number }>({ n: 0, timer: 0 });

  const handleLogoClick = () => {
    go('hero');
    const state = logoClicks.current;
    state.n += 1;
    window.clearTimeout(state.timer);
    if (state.n >= 3) {
      state.n = 0;
      playSfx('secret');
      onSecret();
      return;
    }
    state.timer = window.setTimeout(() => {
      state.n = 0;
    }, 600);
  };

  // scrollspy leve: descobre a seção mais próxima do topo
  useEffect(() => {
    const ids = ['hero', ...NAV.map((n) => n.id)];
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      let current = 'hero';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // trava o scroll do corpo quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    playSfx('select');
  };

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-[30] transition-colors duration-300',
        scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-8">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLogoClick();
          }}
          className="group flex items-center gap-2.5"
          aria-label={`${profile.handle} — início`}
        >
          <CartridgeLogo className="h-8 w-8 transition-transform duration-200 ease-out group-hover:-translate-y-0.5" />
          <span className="hidden font-pixel text-xs text-ink xs:inline">
            RONALDO<span className="text-primary">.DEV</span>
          </span>
        </a>

        {/* HUD nível + XP */}
        <div className="ml-1 hidden items-center gap-2 md:flex" aria-hidden>
          <span className="font-pixel text-[0.55rem] text-dim">
            {t(ui.hud.level)} <span className="text-accent">{lvl.level}</span>
          </span>
          <div className="h-2 w-20 overflow-hidden border border-line bg-surface-2">
            <div
              className="h-full bg-accent transition-[width] duration-500 ease-out"
              style={{ width: `${Math.round(lvl.progress * 100)}%`, boxShadow: '0 0 10px -1px currentColor' }}
            />
          </div>
        </div>

        {/* Nav desktop */}
        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(item.id);
              }}
              onMouseEnter={() => soundEnabled && playSfx('hover')}
              className={clsx(
                'relative px-3 py-2 text-sm transition-colors duration-150',
                active === item.id ? 'text-primary' : 'text-dim hover:text-ink',
              )}
            >
              {t(item.label)}
              {active === item.id && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary shadow-[0_0_10px_rgb(var(--c-primary))]" />
              )}
            </a>
          ))}
        </nav>

        {/* Controles */}
        <div className={clsx('flex items-center gap-1.5', 'ml-auto lg:ml-2')}>
          <IconButton label={t(ui.langToggle)} onClick={toggleLang} className="font-pixel text-[0.6rem]">
            {lang.toUpperCase()}
          </IconButton>
          <IconButton label={t(ui.themeToggle)} onClick={toggleTheme}>
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </IconButton>
          <IconButton
            label={soundEnabled ? t(ui.soundOn) : t(ui.soundOff)}
            onClick={toggleSound}
            active={soundEnabled}
          >
            {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
          </IconButton>

          {/* Hambúrguer mobile */}
          <button
            type="button"
            onClick={() => {
              setOpen((v) => !v);
              playSfx('select');
            }}
            aria-label="Menu"
            aria-expanded={open}
            className="ml-0.5 grid h-9 w-9 place-items-center border-2 border-line text-ink transition-colors hover:border-primary lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={clsx(
                  'absolute left-0 h-0.5 w-4 bg-current transition-all duration-200',
                  open ? 'top-1.5 rotate-45' : 'top-0',
                )}
              />
              <span
                className={clsx(
                  'absolute left-0 top-1.5 h-0.5 w-4 bg-current transition-opacity duration-200',
                  open && 'opacity-0',
                )}
              />
              <span
                className={clsx(
                  'absolute left-0 h-0.5 w-4 bg-current transition-all duration-200',
                  open ? 'top-1.5 -rotate-45' : 'top-3',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Badge disponível */}
      <div className="pointer-events-none absolute right-4 top-16 hidden sm:right-8 lg:block">
        <span className="pointer-events-auto inline-flex items-center gap-1.5 border border-grass/40 bg-surface/80 px-2 py-1 text-[0.65rem] text-grass backdrop-blur">
          <span className="h-1.5 w-1.5 animate-blink bg-grass" />
          {t(ui.openToWork)}
        </span>
      </div>

      {/* Menu mobile */}
      <div
        className={clsx(
          'overflow-hidden border-b border-line bg-bg/95 backdrop-blur-md transition-[max-height] duration-300 ease-out lg:hidden',
          open ? 'max-h-96' : 'max-h-0',
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-8">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                go(item.id);
              }}
              className={clsx(
                'border-b border-line/50 py-3 text-sm last:border-0',
                active === item.id ? 'text-primary' : 'text-dim',
              )}
            >
              <span className="font-pixel text-[0.6rem] text-line">▸ </span>
              {t(item.label)}
            </a>
          ))}
          <span className="mt-3 inline-flex w-fit items-center gap-1.5 border border-grass/40 px-2 py-1 text-[0.65rem] text-grass">
            <span className="h-1.5 w-1.5 animate-blink bg-grass" />
            {t(ui.openToWork)}
          </span>
        </nav>
      </div>
    </header>
  );
}

/* --- botões de ícone --- */

function IconButton({
  children,
  label,
  onClick,
  active,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={clsx(
        'grid h-9 w-9 place-items-center border-2 text-ink transition-all duration-150 active:scale-95',
        active ? 'border-primary text-primary' : 'border-line hover:border-primary',
        className,
      )}
    >
      {children}
    </button>
  );
}

/* --- ícones (SVG, stroke consistente) --- */

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const MoonIcon = () => (
  <svg {...iconProps} aria-hidden>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const SunIcon = () => (
  <svg {...iconProps} aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const SoundOnIcon = () => (
  <svg {...iconProps} aria-hidden>
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);
const SoundOffIcon = () => (
  <svg {...iconProps} aria-hidden>
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="m22 9-6 6" />
    <path d="m16 9 6 6" />
  </svg>
);
