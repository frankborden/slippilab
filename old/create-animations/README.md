# Adding a character:

## One time setup

1. Get student license with .edu email and download Maya 2018 (not newer)
2. Download "New and Improved Animation Pack" and "Animation_Pack"
  - https://www.mediafire.com/file/cmasv6kab9271p0/New_and_Improved_Animation_Pack.zip/file
  - http://www.mediafire.com/file/b9yyt3dd2ll1dzv/SSBMelee_Animation_Model_Pack.zip/file

## Step 0: Render animations with Maya

1. Open character scene in Maya (from New and Improved Animation Pack)
2. Set side camera environemnt background color to white
3. Set framerate to 60
4. Delete all the textures:
  - Window -> Rendering Editors -> Hypershade, Edit -> Delete All By Type -> Textures
5. Set render settings to match vectorize command and render to check
6. Adjust the step0renderAnimations.mel script to your character and input/output directories
7. Run script
8. Delete any animations you don't care about:
  - Heavy*, Item*, and PlyTaro thrown animations should not be needed

## Step 1: Trace .bmp's into .svgs (adjust step1 input directory in package.json first)
yarn packages/create-animations step1

## Step 2: Optimize svgs with SVGO
yarn packages/create-animations step2

## Step 3: Collect path strings from SVGs into a single .json for each animation
yarn packages/create-animations step3

## Step 4: Compress all the .json files into a single .zip
yarn packages/create-animations step4

## Step 5: Move the .zip file to the zips directory
cp packages/create-animations/.out/step4/animations.zip packages/viewer/src/animations/zips/$CHARACTER.zip

## Step 6: Add the character's stats and action state <-> animation mapping
Copy an existing character for the new character

cp packages/viewer/src/characters/mario.ts packages/viewer/src/characters/$CHARACTER.ts

Adjust the mappings for:
- Taunts (Appeal vs AppealL vs AppealR)
- Wait animation (Wait vs Wait1)
- Forward tilt / Forward smash (some characters can be angled, some cannot)
- Specials
- Anything else unique (example: air tethers)

Specials/other unique animations:
https://docs.google.com/spreadsheets/d/1Nu3hSc1U6apOhU4JIJaWRC4Lj0S1inN8BFsq3Y8cFjI/preview#gid=517965147

Model scaling and shield size:
https://docs.google.com/spreadsheets/d/1JX2w-r2fuvWuNgGb6D3Cs4wHQKLFegZe2jhbBuIhCG8/preview#gid=21

If an animation cannot be found it will use Appeal, so play some replays to identify incorrect or missing
mappings.

## Step 7: Add the character to be usable:
packages/viewer/src/characters/index.ts supportedCharactersByInternalId function
packages/viewer/src/animations/index.ts importAnimation function

External character ID list:
https://docs.google.com/spreadsheets/d/1JX2w-r2fuvWuNgGb6D3Cs4wHQKLFegZe2jhbBuIhCG8/preview#gid=20
