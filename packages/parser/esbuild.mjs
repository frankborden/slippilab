import * as esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir: 'dist',
    // my dep has a node dependency but seems to work fine in the browser...
    platform: 'node',
    format: 'esm',
    sourcemap: true,
    minify: true,
  })
  .catch(() => process.exit(1));
