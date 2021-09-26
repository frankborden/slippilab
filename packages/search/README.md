# Search

A state-machine search for .slp files.

## Concepts

### Predicates

A predicate is a function that takes the state of a player at a specific frame and decides whether it counts or not. It also receives the game object for more advanced predicates.

```
// This predicate that that returns true if the player is dead.
function isDead(frame, game) {
  return frame.actionStateId >= 0x00 && frame.actionStateId <= 0x0a;
}
```

### Units

A unit is a predicate combined with some configuration options:

- `minimumLength`: The number of frames in a row the predicate must return true in order to satisfy the unit.
- `leniency`: The number of allowed frames to miss before a satisfied unit becomes unsatisfied.

### Groups

A group is a collection of units that must all be satisfied at once.

- `requiredUnits`: Whether 'all' or 'any' units need to satisfied to move to the next group.
- `allowDelayed`: Whether this group's units must start progressing right after the last group is matched, or if there can be a delay.

### Search

The overall search is an ordered list of groups, with one special group that is always needed.

## Example

```
// Setup your state machine
const search = new Search({
  permanentGroupSpec: {
    unitSpecs: [{ predicate: FramePredicates.isOffstage }],
  },
  groupSpecs: [
    {
      unitSpecs: [
        {
          options: { minimumLength: 30 },
          predicate: FramePredicates.isOffstage,
        },
      ],
    },
    {
      unitSpecs: [
        {
          predicate: (frame, game) => !FramePredicates.isInHitstun(frame, game),
        },
      ],
    },
    { unitSpecs: [{ predicate: FramePredicates.isInHitstun }] },
    { unitSpecs: [{ predicate: FramePredicates.isDead }] },
  ],
});

// Search your replays
let game: Game;
search.searchFile(game);
```

## Future work ideas

1. Rewrite with a state machine library (xState).
1. Simplify concepts.
