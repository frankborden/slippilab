# Search

Search for complex situations in .slp files.

## Example

```
import { framePredicates } from '@slippilab/common';
import type { ReplayData } from '@slippilab/parser';
import { run } from '@slippilab/search';

// 1. Load a replay with @slippilab/parser
let replay: ReplayData;

// 2. Build your query with @slippilab/common predicates or custom ones.
// In this example we start when the player is grabbed, and continue until
// they are back in grounded control.
const grabPunishQuery: [Query, Predicate?] = [
  [
    { predicate: framePredicates.isGrabbed },
    { predicate: framePredicates.not(framePredicates.isInGroundedControl) },
  ],
];

// 3. Get your results: the start and end frames of each clip.
console.log(run(replay, ...grabPunishQuery));
```
