import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['.zip', 'zip', 'src/viewer/animations/zips/', 'src/viewer/animations/zips/*'],
  build: {
    lib: {
      entry: 'src/app-root.ts',
      formats: ['es'],
    },
  },
});
