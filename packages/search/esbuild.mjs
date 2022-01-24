import * as esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir: 'dist',
    platform: 'browser',
    format: 'esm',
    sourcemap: true,
    minify: true,
  })
  .catch(() => process.exit(1));
