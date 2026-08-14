import { useEffect } from 'react';
import { useGame } from '@/store/game';
import { playSfx } from '@/lib/sound';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/** Escuta o código clássico de arcade e libera o modo "lendário". */
export default function KonamiListener() {
  const unlock = useGame((s) => s.unlock);
  const alreadyGot = useGame((s) => s.unlocked.includes('secret'));

  useEffect(() => {
    let progress = 0;
    const onKey = (e: KeyboardEvent) => {
      // ignora quando digitando em campos de formulário
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[progress]) {
        progress++;
        if (progress === SEQUENCE.length) {
          progress = 0;
          trigger();
        }
      } else {
        // recomeça, mas aceita este toque como possível primeiro passo
        progress = key === SEQUENCE[0] ? 1 : 0;
      }
    };

    const trigger = () => {
      playSfx('secret');
      unlock('secret');
      const root = document.documentElement;
      root.classList.add('legendary');
      window.setTimeout(() => root.classList.remove('legendary'), 2600);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [unlock, alreadyGot]);

  return null;
}
