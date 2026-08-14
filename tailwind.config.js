/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        dim: 'rgb(var(--c-dim) / <alpha-value>)',
        primary: 'rgb(var(--c-primary) / <alpha-value>)',
        secondary: 'rgb(var(--c-secondary) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        violet: 'rgb(var(--c-violet) / <alpha-value>)',
        grass: 'rgb(var(--c-grass) / <alpha-value>)',
        danger: 'rgb(var(--c-danger) / <alpha-value>)',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--c-primary) / 0.4), 0 0 24px -6px rgb(var(--c-primary) / 0.55)',
        'glow-pink': '0 0 0 1px rgb(var(--c-secondary) / 0.4), 0 0 24px -6px rgb(var(--c-secondary) / 0.55)',
        card: '0 8px 24px -12px rgb(0 0 0 / 0.7)',
        panel: 'inset 0 0 0 1px rgb(var(--c-line) / 0.9)',
      },
      screens: {
        xs: '400px',
      },
      transitionTimingFunction: {
        'out-quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-strong': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 6px' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        floaty: 'floaty 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
