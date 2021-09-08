#!/usr/bin/env zx

/**
 * This step uses potrace to trace the .bmp files into .svg files.
 * Maya can output .svg's directly but potrace does a better job.
 * I installed potrace from apt:
 * 
 * $ sudo apt install potrace
 * 
 * but the javascript port from npm may work well too:
 * 
 * $ npm install -g potrace
 * 
 * The input root should be the output of the .mel Maya script
 * from step 0. It is expected to be structured like this:
 * 
 * $inputRoot/
 * --Ply$Character_Share_ACTION_$Animation1_figatree/
 * ----Ply$Character_Share_ACTION_$Animation_figatree_0_tmp.bmp
 * ----Ply$Character_Share_ACTION_$Animation_figatree_1_tmp.bmp
 * ----...
 * --Ply$Character_Share_ACTION_$Animation2_figatree/
 * ----...
 * --...
 * 
 * The output structure will be:
 * 
 * $outputRoot/
 * --$Animation1/
 * ----0.svg
 * ----1.svg
 * ----...
 * --$Animation2/
 * ----...
 * --...
 * 
 * Runtime for me: 3.5 hours
 */
const inputRoot = process.argv[3];
const outputRoot = process.argv[4];
if (inputRoot === undefined || outputRoot === undefined) {
  console.log('please provide input and output roots');
  process.exit(1);
}

await fs.emptyDir(outputRoot);
const animationDirectories = await fs.readdir(inputRoot);
for (const animationName of animationDirectories) {
  const trimmedAnimationName = animationName.match(/.*_ACTION_(.*)_figatree.*/)[1];
  const animationInputDirectory = path.join(inputRoot, animationName);
  const animationOutputDirectory = path.join(outputRoot, trimmedAnimationName);
  await fs.ensureDir(animationOutputDirectory);

  const animationBmps = await fs.readdir(animationInputDirectory);
  await Promise.all(animationBmps.map((animationBmp) => {
    const frameNumber = Number(
      animationBmp.match(/.*_figatree_([0-9]+)_tmp.bmp/)[1],
    );
    const animationBmpInputPath = path.join(
      animationInputDirectory,
      animationBmp,
    );
    const animationSvgOutputPath = path.join(
      animationOutputDirectory,
      `${frameNumber}.svg`,
    );
    return $`potrace --svg --opaque ${animationBmpInputPath} -o ${animationSvgOutputPath}`;
  }))
}
