import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: /.*\/animations\/zips\/.*\.zip/,
  cacheDir: '.vite',
});
