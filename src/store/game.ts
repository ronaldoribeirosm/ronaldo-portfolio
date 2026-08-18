import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { achievements, type Achievement, type AchievementId, type Lang } from '@/data/content';
import { playSfx, setSoundEnabled } from '@/lib/sound';

export type Theme = 'dark' | 'light'; // dark = noite, light = dia

/**
 * O nível agora é atrelado às conquistas: cada conquista "colecionável" vale um
 * nível e, ao reunir todas, chega-se ao nível máximo (que desbloqueia a coroa).
 * A conquista `maxed` é a recompensa do topo e não conta como nível.
 */
const LEVELING_IDS: AchievementId[] = achievements
  .map((a) => a.id)
  .filter((id) => id !== 'maxed');

export const MAX_LEVEL = LEVELING_IDS.length;

export interface LevelInfo {
  level: number;
  total: number;
  progress: number; // 0..1 = conquistas / total
  atMax: boolean;
}

/** Nível derivado das conquistas desbloqueadas (ignora a coroa `maxed`). */
export function levelInfo(unlocked: AchievementId[]): LevelInfo {
  const level = Math.min(MAX_LEVEL, unlocked.filter((id) => id !== 'maxed').length);
  return { level, total: MAX_LEVEL, progress: level / MAX_LEVEL, atMax: level >= MAX_LEVEL };
}

const achievementMap = new Map<AchievementId, Achievement>(achievements.map((a) => [a.id, a]));

interface GameState {
  xp: number; // acumulador cosmético (soma de XP das conquistas / mini-game)
  unlocked: AchievementId[];
  soundEnabled: boolean;
  theme: Theme;
  lang: Lang;

  // transitório (não persistido)
  toasts: Achievement[];
  levelUpTo: number | null;

  // ações
  addXp: (amount: number) => void;
  unlock: (id: AchievementId) => void;
  toggleSound: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  dismissToast: (id: AchievementId) => void;
  clearLevelUp: () => void;
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      unlocked: [],
      soundEnabled: false,
      theme: 'dark',
      lang: 'pt',
      toasts: [],
      levelUpTo: null,

      // XP virou só enfeite (número): não influencia mais o nível.
      addXp: (amount) => {
        if (amount <= 0) return;
        set({ xp: get().xp + amount });
      },

      unlock: (id) => {
        if (get().unlocked.includes(id)) return;
        const achievement = achievementMap.get(id);
        if (!achievement) return;

        const before = levelInfo(get().unlocked).level;
        set((state) => ({
          unlocked: [...state.unlocked, id],
          toasts: [...state.toasts, achievement],
          xp: state.xp + achievement.xp,
        }));
        const after = levelInfo(get().unlocked).level;

        // Cada conquista colecionável sobe um nível -> mostra o "NÍVEL UP".
        // (first-boot acontece no carregamento, então não estoura o flash.)
        if (after > before && id !== 'first-boot') {
          playSfx('levelup');
          set({ levelUpTo: after });
        } else {
          playSfx('achievement');
        }

        // Reuniu todas as conquistas colecionáveis -> topo -> ganha a coroa.
        if (id !== 'maxed' && levelInfo(get().unlocked).atMax) {
          get().unlock('maxed');
        }
      },

      toggleSound: () => {
        const next = !get().soundEnabled;
        setSoundEnabled(next);
        set({ soundEnabled: next });
        if (next) playSfx('select');
      },

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' });
        playSfx('select');
      },

      setLang: (lang) => set({ lang }),
      toggleLang: () => {
        set({ lang: get().lang === 'pt' ? 'en' : 'pt' });
        playSfx('select');
      },

      dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
      clearLevelUp: () => set({ levelUpTo: null }),
    }),
    {
      name: 'ronaldo-portfolio-save',
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Partial<GameState> | undefined;
        if (state && version < 1) {
          // temas antigos (retro/cyber) -> dark
          state.theme = state.theme === 'light' ? 'light' : 'dark';
        }
        // v2: nível passou a derivar das conquistas — nada a migrar (usa `unlocked`).
        return state as GameState;
      },
      partialize: (state) => ({
        xp: state.xp,
        unlocked: state.unlocked,
        soundEnabled: state.soundEnabled,
        theme: state.theme,
        lang: state.lang,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // aplica o estado de som salvo no motor de áudio
        if (state.soundEnabled) setSoundEnabled(true);
        // garante um tema válido
        if (state.theme !== 'light' && state.theme !== 'dark') state.theme = 'dark';
      },
    },
  ),
);
