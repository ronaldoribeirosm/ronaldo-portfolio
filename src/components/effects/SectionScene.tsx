import { useGame } from '@/store/game';
import { asset } from '@/data/assets';

export type SceneVariant = 'about' | 'projects' | 'skills' | 'experience' | 'contact';

/**
 * Fundo pixel art full-bleed por seção — mesma linguagem da Serra do hero
 * (céu ditherado + montanhas na bruma), com um motivo próprio na frente:
 * pousada (perfil), vilarejo (projetos), observatório+constelações (skills),
 * trilha (jornada) e fogueira no mirante (contato). Faz crossfade dia/noite
 * junto com o tema e mantém um scrim pra legibilidade do conteúdo.
 */
export default function SectionScene({ variant }: { variant: SceneVariant }) {
  const theme = useGame((s) => s.theme);
  const day = theme !== 'dark';
  const pix = { imageRendering: 'pixelated' as const };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* céu compartilhado (crossfade dia/noite) */}
      <img
        src={asset('/assets/bg/hero-sky-day.png')}
        alt=""
        style={{ opacity: day ? 1 : 0, ...pix }}
        className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ease-out"
      />
      <img
        src={asset('/assets/bg/hero-sky-night.png')}
        alt=""
        style={{ opacity: day ? 0 : 1, ...pix }}
        className="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ease-out"
      />

      {/* motivo da seção (crossfade), ancorado embaixo */}
      <img
        src={asset(`/assets/bg/${variant}-fg-day.png`)}
        alt=""
        style={{ opacity: day ? 1 : 0, ...pix }}
        className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-bottom transition-opacity duration-700 ease-out"
      />
      <img
        src={asset(`/assets/bg/${variant}-fg-night.png`)}
        alt=""
        style={{ opacity: day ? 0 : 1, ...pix }}
        className="absolute inset-x-0 bottom-0 h-full w-full object-cover object-bottom transition-opacity duration-700 ease-out"
      />

      {/* scrim de legibilidade: véu geral + reforço no topo e na base */}
      <div className="absolute inset-0 bg-bg/45" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
    </div>
  );
}
