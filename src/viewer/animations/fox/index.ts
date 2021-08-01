import animationsUrl from './animations.zip';
import * as zip from '@zip.js/zip.js';

export let animations: { [animationName: string]: string[] } = {};
(async () => {
  const animationsZip = await fetch(animationsUrl).then((r) => r.blob());
  const reader = new zip.ZipReader(new zip.BlobReader(animationsZip));
  const files = await reader.getEntries();
  await Promise.all(
    files.map(async (file) => {
      const animationName = file.filename.replace('.json', '');
      const contents = await file.getData?.(new zip.TextWriter());
      const animationData = JSON.parse(contents);
      animations[animationName] = animationData;
    }),
  );
})();

export default animations;
