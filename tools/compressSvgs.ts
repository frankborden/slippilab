import { walkSync } from 'https://deno.land/std@0.103.0/fs/mod.ts';
import { parse } from 'https://deno.land/x/xml/mod.ts';

/*
Adding a character:

1) Render animations with Maya (student license with .edu email)
Open character scene in Maya (from New and Improved Animation Pack)
Set side camera environemnt background color to white
Set framerate to 60!
Delete all the textures. Window -> Rendering Editors -> Hypershade, Edit -> Delete All By Type -> Textures
Set render settings to match vectorize command and render to check (don't skip this)
Adjust .mel script to your character.
Run script (depends on Animation_Pack, which is different from the one above, adjust input/output directories as needed)

2) Trace .bmp's into .svgs (fish script, install potrace)
for folder in /mnt/d/Output/*
  cd $folder; echo $folder;
  ls | parallel potrace --svg --opaque;
  cd ..;
end

3) Remove bmps, prepare pipeline
find /mnt/d/Output/ | rg "bmp\$" | xargs -P 0 rm
yarn clearAnimationBuild
cp -r /mnt/d/Output/* ~/slippilab/tools/output/maya/

4) Optimize svgs with SVGO (fish script)
cd ~/slippilab/tools/output/maya/
for folder in * 
  echo $folder;
  yarn dlx svgo -f $folder -o ~/slippilab/tools/output/svgo/$folder -p 1 --multipass --config ~/slippilab/tools/svgo.config.js;
end

5) Collect path strings from SVGs into a single .json for each animation
yarn compress

Optionally delete stuff you don't want

6) Compress all the .json files into a single .zip
yarn zip

7) Move the .zip file to the zips directory
cp ~/slippilab/tools/output/zip/animations.zip ~/slippilab/packages/viewer/src/animations/zips/$CHARACTER.zip

8) Add the character's action state <-> animation mapping
copy an existing packages/viewer/src/characters/$CHARACTER.ts for the new character and adjust the specials and
any other non-standard mappings.

9) Add the character:
packages/viewer/src/characters/index.ts supportedCharactersById function
packages/viewer/src/animations/index.ts importAnimation function

done!
*/

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
