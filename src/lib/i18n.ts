import { useCallback } from 'react';
import type { Localized } from '@/data/content';
import { useGame } from '@/store/game';

/** Hook de tradução: `t(localized)` devolve o texto no idioma atual. */
export function useT() {
  const lang = useGame((s) => s.lang);
  const t = useCallback((value: Localized) => value[lang], [lang]);
  return { t, lang };
}
