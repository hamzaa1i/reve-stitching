import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel({
    // Don't specify runtime — let adapter handle it
    includeFiles: [],
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  site: 'https://revestitching.com',
  build: {
    inlineStylesheets: 'auto',
  },
});