import {
  type Predicate,
  action,
  actionStartsWith,
  all,
  either,
  isDead,
  isGrabbed,
  isInGroundedControl,
  isInHitstun,
  isMissedLCancel,
  isOffstage,
  isOpponentCloserToCenter,
  not,
  opponent,
} from "~/common/search/framePredicates";
import { type Query } from "~/common/search/search";

const killComboQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isInHitstun) },
    { predicate: opponent(isDead), delayed: true },
  ],
  not(opponent(isInGroundedControl)),
];
const grabPunishQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isGrabbed) },
    {
      predicate: all(
        not(opponent(isDead)),
        either(not(opponent(isInGroundedControl)), opponent(isOffstage)),
      ),
    },
  ],
];
const edgeguardQuery: [Query, Predicate?] = [
  [
    { predicate: opponent(isOffstage) },
    { predicate: not(opponent(isInHitstun)), delayed: true },
    { predicate: opponent(isInHitstun), delayed: true },
  ],
  not(opponent(isInGroundedControl)),
];
const crouchCancelQuery: [Query, Predicate?] = [
  [{ predicate: action("SquatWait") }, { predicate: isInHitstun }],
];
const shieldOptionQuery: [Query, Predicate?] = [
  [{ predicate: action("GuardSetOff") }],
  either(
    actionStartsWith("Guard"),
    actionStartsWith("Jump"),
    actionStartsWith("Fall"),
  ),
];
const ledgeOptionQuery: [Query, Predicate?] = [
  [
    {
      predicate: all(
        action("CliffWait"),
        isOpponentCloserToCenter,
        not(opponent(isOffstage)),
      ),
    },
    { predicate: not(action("CliffWait")), minimumLength: 60 },
  ],
];

const missedLCancelQuery: [Query, Predicate?] = [
  [{ predicate: isMissedLCancel }],
];

export const queries = {
  "Kill Combos": killComboQuery,
  Grabs: grabPunishQuery,
  Edgeguards: edgeguardQuery,
  "Crouch Cancels": crouchCancelQuery,
  "Missed L-Cancels": missedLCancelQuery,
  "Shield Options": shieldOptionQuery,
  "Ledge Options": ledgeOptionQuery,
} as const satisfies Record<string, [Query, Predicate?]>;