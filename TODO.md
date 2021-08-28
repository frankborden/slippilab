# Replay Viewer

## Character

- Peach/Pikachu calculate shield origin
- Spacies calculate shine origin
- Can't do constant slowmo
- Shield put up / take down animation
- Show Shield tilting (original visualiser reads inputs and checks for stun)
- Bubble view when off camera / near blastzone?
- correct laser & fly guy sizes
- show needles, pika jolts, turnips, etc.
- Powershield animation
  - 0x0b6: 'GUARD', //GuardReflect (182 decimal)
- Lightshield
  - Read pre.trigger, do some math?
- Death animation
- Hit effect
- Electric effect for knee/shine
- Fire effect for spacie upB, falcon specials
- Color by costume instead of port (first attempt = ugly)
- Optional state-dependent colors? (hitstun, shieldstun, actionable)
- Marth sideB colors
- spacie sideB clones
- support more characters
  - pre-load fox/falco/falcon/marth, load the rest on demand
- combine all characters jsons into one?

## Stage

- Background visuals (grid?)
- Fountain platforms (infeasible until it's added to .slp spec)
- Wispy (infeasible until it's added to .slp spec)

## Game UI / Viewer UI

- Game timer
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
- debug canvas for viewing individual animations
- Problems on windows firefox

# Search

- Other filters (matchup, date, player, stage)
- opponent frame available to frame predicates (at least in singles)
- Fix doubles

# Parser

- Support older replay formats that do not have all current fields.

# Export

- re-enable
- export to other formats better than gif? apng, webp, mp4?
  - Discord doesn't like .apng and .webp. Will it allow embeded mp4 from url?
- Upload gif to some host (example project with imgur: https://github.com/eirikb/gifie)
- adjust start/end clip

# App

- Tests
- Webworkers?
- git submodules?
- npm org?
