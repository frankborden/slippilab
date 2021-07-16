# Slp Viewer

## Ideas

### Replay Viewer

#### Character

- Something wrong with laser shooting animations (air and ground)
- Something wrong with shield breaker animation
- Something wrong with position when getting thrown (ex: dthrown by falcon)
- walk animation scaling based on speed
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
- Add characters, peach sheik at least.
  - Needs zelda and everybody's turnip animations
  - WebGL renderer with raw models + animations?
  - HSDraw export model + animations, then generate SVG?
    - Need Windows machine
- Color by costume instead of port (first attempt = ugly)
- indicate CPUs (Gray?)
- Optional state-dependent colors? (hitstun, shieldstun, actionable)

#### Stage

- Background visuals / color stages
- Fountain platforms (infeasible until it's added to .slp spec)
- Wispy (infeasible until it's added to .slp spec)

#### Game UI / Viewer UI

- Game timer
  - Seems present in .slp spec but not exposed in slippi-js?
  - I can probably just add manually without issues..
- Higher % = darker text
- % dances when hit
- Stock icons that look like the character
- Actionstate/frame below % as option (stun/lag remaining too)
- Play/Pause button, other GUI controls..
- Input display?

#### Other

- colorblind friendly colors
  - make every match red vs blue?
- Separate project (game.ts and children)
- debug canvas for viewing individual animations
- Tests

### App

- Tests
- Filter replays (matchup, date, player)
- Fix VSCode complaining about json modules (resolveJsonModule=true makes
  tsc crash a lot due to json sizes)
- export to other formats better than GIF? apng, webp, mp4?
  - Discord doesn't like .apng and .webp. Will it allow embeded mp4 from url?
- Upload gif to some host (example project with imgur: https://github.com/eirikb/gifie)
- adjust start/end clip
- Find clips within files
- Show combos/conversions/etc from .slp getStats()
- Webworkers
