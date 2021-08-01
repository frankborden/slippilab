# Replay Viewer

## Character

- Shield put up / take down animation
- Show Shield tilting (original visualiser reads inputs and checks for stun)
- Bubble view when off camera / near blastzone?
- Powershield animation
  - 0x0b6: 'GUARD', //GuardReflect (182 decimal)
- Lightshield
  - Read pre.trigger, do some math?
- Death animation
- Hit effect
- Electric effect for knee/shine
- Fire effect for spacie upB, falcon specials
- Sword trails
- Color by costume instead of port (first attempt = ugly)
- indicate CPUs (Gray?)
- Optional state-dependent colors? (hitstun, shieldstun, actionable)
- Marth sideB colors

## Stage

- Background visuals / color stages
- Fountain platforms (infeasible until it's added to .slp spec)
- Wispy (infeasible until it's added to .slp spec)

## Game UI / Viewer UI

- Game timer
  - Seems present in .slp spec but not exposed in slippi-js?
  - I can probably just add manually without issues..
- Higher % = darker text
- % dances when hit
- % resets immediately on death
- Stock icons that look like the character
- Actionstate/frame below % as option (stun/lag remaining too)
- Play/Pause button, other GUI controls..
- Input display?

## Other

- colorblind friendly colors
  - make every match red vs blue?
- Separate project (game.ts and children)
- debug canvas for viewing individual animations
- Tests

# Search

- Other filters (matchup, date, player, stage)
- opponent available to frame predicates (at least in singles)

# Export

- export to other formats better than GIF? apng, webp, mp4?
  - Discord doesn't like .apng and .webp. Will it allow embeded mp4 from url?
- Upload gif to some host (example project with imgur: https://github.com/eirikb/gifie)
- adjust start/end clip

# App

- Tests
- Replace wire components
- Fix tsc complaining about json modules (resolveJsonModule=true makes
  tsc crash a lot due to json sizes)
- Show combos/conversions/etc from .slp getStats()
- Webworkers?
- Waiting for game...
