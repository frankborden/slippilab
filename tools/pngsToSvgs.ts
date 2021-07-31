import {
  ensureDirSync,
  expandGlobSync,
} from 'https://deno.land/std@0.103.0/fs/mod.ts';

const character = 'Fox';
const pngHierarchyRoot = `/media/psf/Home/Downloads/Animation_Pack/Textured_Models/${character}/output/`;

for (const inputPng of expandGlobSync('**/*.png', { root: pngHierarchyRoot })) {
  console.log(inputPng.name);
  const actionName = inputPng.name.match(/ACTION_(.*)_figatree/)?.[1];
  console.log(actionName);
  const frameNumber = inputPng.name.match(/figatree_(.*)_tmp/)?.[1];
  console.log(frameNumber);
  if (frameNumber === null || frameNumber === undefined) {
    continue;
  }
  const trimmedFrameNumber = parseInt(frameNumber, 10);
  const outputDir = `tools/output/${character}/${actionName}`;
  const outputPath = `${outputDir}/${trimmedFrameNumber}.svg`;
  console.log(outputPath);
  ensureDirSync(outputDir);

  // TODO: call converter directly instead of going through CLI
  const result = Deno.run({
    cmd: [
      'node',
      'node_modules/imagetracerjs/nodecli/nodecli.js',
      inputPng.path,
      'outfilename',
      outputPath,
      'scale',
      '1',
    ],
  });
  console.log(await result.status());
}
