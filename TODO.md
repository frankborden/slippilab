# @slippilab/viewer

## Character

- Peach/Pikachu/Samus/Luigi/Mario/Dr. Mario/DK/Roy calculate shield origin
- Luigi upB is rotated
- Samus downB doesn't use ball model
- Spacies calculate shine origin
- Shield put up / take down animation
- Show Shield tilting (original visualiser reads inputs and checks for stun)
- Bubble view when off camera / near blastzone?
- correct laser & fly guy sizes
- show projectiles:
  - needles
  - jolt
  - thunder
  - turnips
  - fireballs
  - pills
  - missiles
  - charge shot
  - samus bombs
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
- combine all of a character's jsons into one?

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
- Render loop problems on windows firefox

# @slippilab/search

- Other filters (matchup, date, player, stage)
- opponent frame available to frame predicates (at least in singles)
- Fix doubles

# @slippilab/parser

- Support older replay formats that do not have all current fields.

# Export Highlight

- re-enable
- export to other formats better than gif? apng, webp, mp4?
  - Discord doesn't like .apng and .webp. Will it allow embeded mp4 from url?
- Upload gif to some host (example project with imgur: https://github.com/eirikb/gifie)
- adjust start/end clip

# @slippilab/slippilab

- Tests
- Site to packages/slippilab?
- Webworkers?
- list supported characters / stages
- publish subpackages
- git submodules?
- about page / link to source
- npm org
