/**
 * Assets personalizados (opcionais).
 *
 * Este é um projeto pessoal: se você quiser trocar a arte e os sons autorais
 * por sprites/áudios seus, é só colocar os arquivos em `public/assets/` e
 * apontar os caminhos aqui. Onde ficar em branco, o site usa a arte e o som
 * autorais que já vêm no projeto.
 *
 * Exemplos:
 *   heroAvatar: '/assets/hero.png'
 *   companion:  '/assets/companion.png'
 *   sfx: { coin: '/assets/coin.mp3', levelup: '/assets/levelup.mp3' }
 *
 * Dica: sprites pixel ficam nítidos porque o CSS aplica `image-rendering: pixelated`.
 */

import type { SfxName } from '@/lib/sound';

export interface CustomAssets {
  /** Imagem do avatar do "jogador" no cartão do hero. */
  heroAvatar?: string;
  /** Imagem do companheiro que segue o cursor. */
  companion?: string;
  /** Arquivos de áudio por efeito. Onde faltar, usa o som chiptune sintetizado. */
  sfx?: Partial<Record<SfxName, string>>;
}

export const customAssets: CustomAssets = {
  heroAvatar: '',
  companion: '',
  sfx: {},
};

/** Normaliza para `undefined` quando o caminho está vazio. */
export function asset(path?: string): string | undefined {
  return path && path.trim() ? path.trim() : undefined;
}
