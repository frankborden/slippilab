# @slippilab/viewer

## Character

- Calculate shield origin
  - Peach/Pikachu/Samus/Luigi/Mario
  - Dr. Mario/DK/Roy/Link/YLink/ICs
  - Yoshi/Pichu/Zelda/Bowser/Ness
- Zelda/Sheik transformations
- Zelda/Sheik invisible upBs
- Bowser upsmash needs to translate up
- Yoshi shield
- Camera freaks out on some replays.. almost all my IC replays
- Luigi upB is rotated
- Samus downB/roll should use ball model
- Spacies calculate shine origin
- Shield put up / take down animation
- Show Shield tilting (original visualiser reads inputs and checks for stun)
- Bubble view when off camera / near blastzone?
- correct laser & fly guy sizes
- show objects/projectiles:
  - needles
  - pika/pichu jolt
  - pika/pichu thunder
  - turnips
  - fireballs
  - pills
  - missiles
  - charge shot
  - samus bombs
  - (y)link arrow
  - (y)link boomerang
  - (y)link bomb
  - yoshi egg
  - yoshi downB stars?
  - ICs blizzard
  - ICs ice block
  - Zelda sideB
  - Zelda neutralB
  - Bowser flame
  - Ness upB
  - Ness sideB
  - Ness neutralB
  - Ness downB
  - Ness Bat/Yoyo
- tether grabs / air tethers
- many animations are backwards if they turn you around
  - rolls
  - some bairs
  - run turn
- dynamic model parts are stuck in t-pose (bowser hair, dresses, capes)
- does shield break use item blind? what about mewtwo downB?
- Powershield animation
  - 0x0b6: 'GUARD', //GuardReflect (182 decimal)
- Lightshield
  - Read pre.trigger, do some math?
- Death animation
- Hit effect
- Electric effect for knee/shine/pika
- Fire effect for spacie upB, falcon specials
- Color by costume instead of port
- Optional state-dependent colors? (hitstun, shieldstun, actionable)
- Marth sideB colors / sword swings in general
- spacie sideB clones
- support more characters, 22/26 done
  - G&W, Ganon, Kirby, Mew2 left
  - Redo Falcon/Falco/Marth/Puff (Sheik/Peach?) to use potrace pipeline
- combine all of a character's jsons into one?

## Stage

- Background visuals (grid?)
- Better stage coloring
- Fountain platforms
  - infeasible until it's added to .slp spec
- Wispy
  - infeasible until it's added to .slp spec

## Game UI / Viewer UI

- Game timer
  - Convert seekbar too?
- Higher % = darker text
- % dances when hit
- % hidden immediately on death until respawn
- Stock icons that look like the character
  - First letter?
- Actionstate/frame below % as option (stun/lag remaining too)
- Play/Pause button, other GUI controls
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

# Export Highlight

- re-enable
- export to other formats better than gif? apng, webp, mp4?
  - Discord doesn't like .apng and .webp. Will it allow embeded mp4 from url?
- Upload gif to some host (example project with imgur: https://github.com/eirikb/gifie)
- adjust start/end clip

# @slippilab/slippilab

- Tests
- Save settings
- Webworkers?
- list supported characters / stages
- publish subpackages
- git submodules?
- about page / link to source
- fix tsconfigs 
