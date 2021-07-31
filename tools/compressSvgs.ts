import { walkSync } from 'https://deno.land/std@0.103.0/fs/mod.ts';
import { parse } from 'https://deno.land/x/xml/mod.ts';
for (const baseSvg of walkSync('./tools/output/maya/')) {
  if (baseSvg.isDirectory) {
    continue;
  }
  console.log('parsing', baseSvg.path);
  const contents: any = parse(Deno.readTextFileSync(baseSvg.path));
  const dStrings = contents.svg.g.map((group: any) => group.path['@d']);
  const dedupedDStrings = dStrings.filter(
    (dString: string, index: number, _array: String[]) =>
      dStrings.indexOf(dString) === index,
  );
  console.log(' -', dedupedDStrings.length, 'total frames');
  const animationName = baseSvg.name
    .replace(/.*ACTION_/, '')
    .replace(/_figatree.*$/, '');
  const outputPath = `tools/output/compression/${animationName}.json`;
  Deno.writeTextFileSync(outputPath, JSON.stringify(dedupedDStrings));
  console.log(' - saved', outputPath);
}
