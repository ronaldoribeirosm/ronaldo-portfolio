import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { achievements, type Achievement, type AchievementId, type Lang } from '@/data/content';
import { playSfx, setSoundEnabled } from '@/lib/sound';

export type Theme = 'retro' | 'cyber';

export const MAX_LEVEL = 20;

/** Limiares cumulativos de XP para cada nível (índice = nível - 1). */
const LEVEL_THRESHOLDS: number[] = (() => {
  const thresholds = [0];
  let acc = 0;
  for (let level = 1; level < MAX_LEVEL; level++) {
    const gap = 90 + (level - 1) * 12; // curva suave: completar o site chega ao nível máximo
    acc += gap;
    thresholds.push(acc);
  }
  return thresholds;
})();

export interface LevelInfo {
  level: number;
  intoLevel: number;
  need: number;
  progress: number; // 0..1 dentro do nível atual
}

export function levelInfo(xp: number): LevelInfo {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  if (level >= MAX_LEVEL) {
    return { level: MAX_LEVEL, intoLevel: 0, need: 0, progress: 1 };
  }
  const base = LEVEL_THRESHOLDS[level - 1];
  const next = LEVEL_THRESHOLDS[level];
  const intoLevel = xp - base;
  const need = next - base;
  return { level, intoLevel, need, progress: Math.min(1, intoLevel / need) };
}

const achievementMap = new Map<AchievementId, Achievement>(achievements.map((a) => [a.id, a]));

interface GameState {
  xp: number;
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
      theme: 'retro',
      lang: 'pt',
      toasts: [],
      levelUpTo: null,

      addXp: (amount) => {
        if (amount <= 0) return;
        const before = levelInfo(get().xp).level;
        const nextXp = get().xp + amount;
        const after = levelInfo(nextXp).level;
        set({ xp: nextXp });
        if (after > before) {
          playSfx('levelup');
          set({ levelUpTo: after });
        }
      },

      unlock: (id) => {
        if (get().unlocked.includes(id)) return;
        const achievement = achievementMap.get(id);
        if (!achievement) return;
        set((state) => ({
          unlocked: [...state.unlocked, id],
          toasts: [...state.toasts, achievement],
        }));
        playSfx('achievement');
        get().addXp(achievement.xp);

        // Meta-conquista: alcançou o nível máximo.
        if (id !== 'maxed' && levelInfo(get().xp).level >= MAX_LEVEL) {
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
        set({ theme: get().theme === 'retro' ? 'cyber' : 'retro' });
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
      partialize: (state) => ({
        xp: state.xp,
        unlocked: state.unlocked,
        soundEnabled: state.soundEnabled,
        theme: state.theme,
        lang: state.lang,
      }),
      onRehydrateStorage: () => (state) => {
        // aplica o estado de som salvo no motor de áudio
        if (state?.soundEnabled) setSoundEnabled(true);
      },
    },
  ),
);
