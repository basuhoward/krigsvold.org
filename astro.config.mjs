import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://krigsvold.org',
  output: 'static',
  trailingSlash: 'always',
  publicDir: './.generated/public',
  build: { format: 'directory' },
});
