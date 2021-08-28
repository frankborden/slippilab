import { defineConfig } from 'vite';

export default defineConfig({
  cacheDir: '.vite',
  build: {
    lib: {
      entry: 'src/app-root.ts',
      formats: ['es'],
    },
  },
});
