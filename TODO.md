# viewer

## SVG

- Bowser upsmash needs to translate up
- Show objects/projectiles
- Use kirby hat stuff or trim their animations
  - dynamically load those?
- Redo Falcon/Falco/Marth/Puff (Sheik/Peach?) to use potrace pipeline. It should shrink their .zip files a bit
- G&W needs all his props
- Samus downB/roll should use ball model
- Dynamic model parts are stuck in t-pose (bowser hair, dresses, capes)
- Thrown animations
- Shield break animations

## Character Render

- Follow animation index added in spec 3.11.0.0 (ex: wait1 vs wait2)
- Calculate shield origins
- Spacies calculate shine origin
- Yoshi shield
- Show Shield tilting (original visualiser reads inputs and checks for stun)
- Shield put up / take down animation
- Tether grabs / air tethers
  Powershield animation 0x0b6: 'GUARD', //GuardReflect (182 decimal)
- Death animation
- Effects for hits/electric/fire/darkness
- Color by costume instead of port
- Marth sideB colors / sword swings in general
- Spacie sideB clones
- Optional state-dependent colors? (hitstun, shieldstun, actionable)
- Yellow flash charging smash attacks

## Performance / Load times

- combine all of a character's jsons into one?
- truncate SVG path values

## Stage

- Background visuals (grid?)
- stage coloring
- Fountain platforms/Wispy indicator
  - infeasible until it's added to .slp spec

## Game UI / Viewer UI

- Higher % = darker text
- % dances when hit
- % hidden immediately on death until respawn
- Stock icons that look like the character
  - First letter(s)?
- More debug information
- Play/Pause button, other GUI controls
- Input display

## Other

- Colorblind friendly colors - Make every match red vs blue?
- Debug canvas for viewing individual animations

# search

- Other filters (matchup, date, player, stage)
- Fix doubles

# parser

- Parse new stuff since 3.9.0.0

# Export Highlight

- .gif or .mp4? What works for Discord?

# slippilab

- Tests
