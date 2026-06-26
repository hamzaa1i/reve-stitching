import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// ─────────────────────────────────────────────────────────────────────────────
// Phase 1 (Secret Hygiene): validate environment at build time.
// Loads .env into process.env before validation.
// ─────────────────────────────────────────────────────────────────────────────
import 'dotenv/config';
import { checkEnvOrExit } from './src/lib/env.ts';
checkEnvOrExit();

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://revestitching.com',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    optimizeDeps: {
      exclude: ['lenis'],
    },
  },
});