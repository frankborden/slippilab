#!/usr/bin/env zx

/**
 * This step uses zip to combine all the .json files. Install it with
 * 
 * $ sudo apt install zip
 * 
 * The input structure is expected to be:
 * 
 * $inputRoot/
 * --$Animation1.json
 * --$Animation2.json
 * --...
 * 
 * The output structure is a single file:
 * $outputRoot/
 * --animations.zip
 * 
 * Runtime for me: 2 seconds
*/

const inputRoot = process.argv[3];
const outputRoot = process.argv[4];
if (inputRoot === undefined || outputRoot === undefined) {
  console.log('please provide input and output roots');
  process.exit(0);
}
await fs.emptyDir(outputRoot);
await $`zip -r9j ${path.join(outputRoot, 'animations.zip')} ${inputRoot}`