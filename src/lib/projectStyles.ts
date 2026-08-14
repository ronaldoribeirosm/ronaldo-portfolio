import type { ProjectCategory } from '@/data/content';

/** Cor temática por categoria de projeto (compartilhada entre grade e modal). */
export const categoryColor: Record<ProjectCategory, string> = {
  automation: 'accent',
  backend: 'secondary',
  frontend: 'primary',
  fullstack: 'violet',
  data: 'grass',
};

export const textColor: Record<string, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  violet: 'text-violet',
  grass: 'text-grass',
};

export const borderHover: Record<string, string> = {
  primary: 'hover:border-primary',
  secondary: 'hover:border-secondary',
  accent: 'hover:border-accent',
  violet: 'hover:border-violet',
  grass: 'hover:border-grass',
};

export const barColor: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  violet: 'bg-violet',
  grass: 'bg-grass',
};
