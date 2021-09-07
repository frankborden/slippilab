import { walkSync } from 'https://deno.land/std@0.103.0/fs/mod.ts';
import { parse } from 'https://deno.land/x/xml/mod.ts';

for (const folder of walkSync('./tools/output/svgo', { maxDepth: 1 })) {
  if (folder.path === 'tools/output/svgo') {
    continue;
  }
  const fileNameMatcher = /.*figatree_([0-9]+)_tmp.*/;
  const files = Array.from(walkSync(folder.path))
    .filter((file) => file.isFile)
    .map((file) => file.path);
  files.sort(
    (a, b) =>
      Number((a.match(fileNameMatcher)!)[1]) -
      Number((b.match(fileNameMatcher)!)[1]),
  );
  const dStrings = files.map((file) => {
    const svg = (parse(Deno.readTextFileSync(file)) as any).svg;
    return svg.path['@d'] ?? svg.path[0]['@d'];
  });
  const dedupedDStrings = dStrings.map(
    (dString: string, index: number, _array: String[]) => {
      const firstIndex = dStrings.indexOf(dString);
      if (firstIndex === index) {
        return dString;
      } else {
        return `frame${firstIndex}`;
      }
    },
  );
  console.log(' -', dedupedDStrings.length, 'total frames');
  const animationName = folder.name
    .replace(/.*ACTION_/, '')
    .replace(/_figatree.*$/, '');
  const outputPath = `tools/output/compression/${animationName}.json`;
  Deno.writeTextFileSync(outputPath, JSON.stringify(dedupedDStrings));
  console.log(' - saved', outputPath);
}
