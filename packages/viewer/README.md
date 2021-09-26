# Viewer

Replay .slp files in the browser.

## Usage

The viewer is written as a [lit](https://lit.dev/) component. You can use it as any other webcomponent:

```
import '@slippilab/viewer';

const viewer = document.createElement('replay-viewer');

viewer.replay = myReplay; // Replay object from @slippilab/common
someElementOnYourPage.appendChild(viewer);
```

or however your framework lets you make a html template:

```
<replay-viewer replay=myReplayObject></replay-viewer>
```

## Controls

## Animations

Animations are a .zip for each character containing .json file per animation. Each .json is an array with one .svg path per frame. Each .zip will be dynamically loaded when needed, or you can prefetch them manually by external character ID (Slippilab itself does this prefetch popular characters):

```
import { fetchAnimation } from '@slippilab/viewer';

fetchAnimation(0); // returns a promise. 0=falcon
```
