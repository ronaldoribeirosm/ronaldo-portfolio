import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
// Em produção o site vive em https://ronaldoribeirosm.github.io/ronaldo-portfolio/
// (project page), então a base leva o nome do repo. No dev fica em '/'.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/ronaldo-portfolio/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssMinify: true,
  },
}));
