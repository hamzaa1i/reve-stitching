import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// ─────────────────────────────────────────────────────────────────────────────
// Phase 1 (Secret Hygiene): validate environment at build time.
// Loads .env into process.env before validation.
// ─────────────────────────────────────────────────────────────────────────────
import 'dotenv/config';
import { checkEnvOrExit } from './src/lib/env.ts';
// Review builds render public content without requiring live operational secrets.
const reviewBuild = process.env.VERCEL_ENV === 'preview' || (process.env.VERCEL_ENV !== 'production' && process.env.CATALOGUE_REVIEW_MODE === 'true');
if (!reviewBuild) checkEnvOrExit();

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://www.revestitching.com',
  integrations: [sitemap({
    filter: (page) => {
      const path = new URL(page).pathname;
      return !path.startsWith('/admin') && !path.startsWith('/portal');
    },
  })],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    optimizeDeps: {
      exclude: ['lenis'],
    },
  },
});
