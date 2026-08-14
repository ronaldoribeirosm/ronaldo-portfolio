import { profile, ui, achievements } from '@/data/content';
import { useT } from '@/lib/i18n';
import { useGame } from '@/store/game';
import { playSfx } from '@/lib/sound';

export default function Footer() {
  const { t } = useT();
  const unlocked = useGame((s) => s.unlocked);
  const unlockUp = useGame((s) => s.unlock);
  const total = achievements.length;
  const pct = Math.round((unlocked.length / total) * 100);
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        {/* progresso da "campanha" */}
        <div className="panel mb-10 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[0.6rem] uppercase tracking-widest text-dim">
              {t(ui.hud.achievements)}
            </span>
            <span className="font-pixel text-[0.6rem] tabular-nums text-accent">
              {unlocked.length}/{total} · {pct}%
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden border border-line bg-surface-2">
            <div
              className="h-full bg-accent transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%`, boxShadow: '0 0 12px -2px currentColor' }}
            />
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {achievements.map((a) => {
              const has = unlocked.includes(a.id);
              return (
                <li
                  key={a.id}
                  title={has ? `${t(a.title)} — ${t(a.desc)}` : '???'}
                  className={`grid h-8 w-8 place-items-center border-2 text-sm transition-colors ${
                    has ? 'border-accent text-accent' : 'border-line text-line'
                  }`}
                  aria-label={has ? t(a.title) : 'bloqueada'}
                >
                  {has ? a.icon : '?'}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-pixel text-xs text-ink">
              RONALDO<span className="text-primary">.DEV</span>
            </p>
            <p className="mt-2 text-sm text-dim">{t(ui.footer.madeWith)}</p>
            <p className="mt-1 text-xs text-dim/80">{t(ui.footer.hint)}</p>
          </div>

          <div className="flex gap-2">
            <FooterLink href={profile.links.github} label="GH" onGo={() => unlockUp('linked')} />
            <FooterLink href={profile.links.linkedin} label="IN" onGo={() => unlockUp('linked')} />
            <FooterLink href={`mailto:${profile.links.email}`} label="@" onGo={() => unlockUp('linked')} />
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-dim sm:flex-row">
          <span>
            © {year} {profile.name}. {t(ui.footer.rights)}
          </span>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              playSfx('select');
            }}
            className="transition-colors hover:text-primary"
          >
            ▲ {t(ui.footer.backToTop)}
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label, onGo }: { href: string; label: string; onGo: () => void }) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={() => {
        onGo();
        playSfx('coin');
      }}
      className="grid h-10 w-10 place-items-center border-2 border-line font-pixel text-[0.6rem] text-dim transition-all duration-150 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
      aria-label={label}
    >
      {label}
    </a>
  );
}
