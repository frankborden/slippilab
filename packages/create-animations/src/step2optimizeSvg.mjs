#!/usr/bin/env zx

/**
 * This step uses svgo to clean up the .svg files. Install it with
 * 
 * $ npm install -g svgo
 * 
 * The input and output file structures are identical:
 * 
 * $root/
 * --$Animation1/
 * ----0.svg
 * ----1.svg
 * --$Animation2/
 * ----...
 * --...
 * 
 * Runtime for me: 4.8 minutes
*/

const inputRoot = process.argv[3];
const outputRoot = process.argv[4];
if (inputRoot === undefined || outputRoot === undefined) {
  console.log('please provide input and output roots');
  process.exit(0);
}
await fs.emptyDir(outputRoot);
const animationDirectories = await fs.readdir(inputRoot);
for (const animationName of animationDirectories) {
  const animationInputDirectory = path.join(inputRoot, animationName);
  const animationOutputDirectory = path.join(outputRoot, animationName);
  await $`svgo -f ${animationInputDirectory} -o ${animationOutputDirectory} -p 1 --multipass --config svgo.config.js`;
}