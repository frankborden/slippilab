import * as esbuild from 'esbuild';

const packageName = 'packages/parser';
const watchOptions = ['-w', '--watch'];
const isWatch = process.argv.some(arg => watchOptions.includes(arg));
function onRebuild(error) {
  if (!error) {
    console.log(`${packageName} esbuild succeeded (${new Date().toLocaleTimeString()})`);
  }
}
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
    watch: isWatch ? {onRebuild} : undefined,
  })
  .then(result => {if (isWatch) console.log(`starting esbuild watch for ${packageName}`);})
  .catch(() => process.exit(1));
