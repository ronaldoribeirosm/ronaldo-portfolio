import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  // Em produção no GitHub Pages o site fica em /ronaldo-portfolio/.
  // Localmente (dev/preview) permanece na raiz.
  base: process.env.GITHUB_ACTIONS ? '/ronaldo-portfolio/' : '/',
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
});
