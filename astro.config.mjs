import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel({
    // Explicitly set runtime to Node 20
    functionPerRoute: false,
    imageService: true,
  }),
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  site: 'https://revestitching.com',
  build: {
    inlineStylesheets: 'auto',
  },
});