#!/usr/bin/env zx

/**
 * This step collects all the path strings from the .svg files into a single .json for each animation.
 *
 * Expected input structure:
 *
 * $inputRoot/
 * --$Animation1/
 * ----0.svg
 * ----1.svg
 * ----...
 * --$Animation2/
 * ----...
 * ...
 *
 * The output structure will be:
 *
 * $outputRoot/
 * --$Animation1.json
 * --$Animation2.json
 * --...
 *
 * Runtime for me: 7 seconds
 */

const inputRoot = process.argv[3];
const outputRoot = process.argv[4];
if (inputRoot === undefined || outputRoot === undefined) {
  console.log("please provide input and output roots");
  process.exit(1);
}
await fs.emptyDir(outputRoot);
const animationDirectories = await fs.readdir(inputRoot);
for (const animationName of animationDirectories) {
  const animationInputDirectory = path.join(inputRoot, animationName);
  const animationOutputPath = `${path.join(outputRoot, animationName)}.json`;

  const animationSvgs = await fs.readdir(animationInputDirectory);
  animationSvgs.sort((a, b) =>
    Number(a.replace(".svg", "")) > Number(b.replace(".svg", "")) ? 1 : -1
  );
  const paths = [];
  for (const animationSvg of animationSvgs) {
    const animationSvgPath = path.join(animationInputDirectory, animationSvg);
    const animationSvgContents = await fs.readFile(animationSvgPath, "utf8");
    const pathMatch = animationSvgContents.match(/d="([^"]*)"/);
    paths.push(pathMatch?.[1] ?? "");
  }
  const dedupedPaths = paths.map((path, index) => {
    const firstIndex = paths.indexOf(path);
    if (firstIndex === index) {
      return path;
    } else {
      return `frame${firstIndex}`;
    }
  });
  console.log(`writing ${animationOutputPath}`);
  await fs.writeFile(animationOutputPath, JSON.stringify(dedupedPaths));
}
