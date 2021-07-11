# Slp Viewer

## Ideas

### Replay Viewer

- Something wrong with laser shooting animations (air and ground)
- Something wrong with position when getting thrown (ex: dthrown by falcon)
- Keep part of stage in focus?
  - Weird when characters are high above stage and stage goes out of view
- Show Shield tilting (original visualiser reads inputs and checks for stun)
- Customziation (custom colors/colorblind colors, UI info)
- Actionstate/frame below % as option (stun/lag remaining too)
- Separate project
- Team shade (ex: double fox should have a light colored fox)
- debug canvas for viewing individual animations
- indicate CPUs
- Play/Pause button, other GUI controls..
- Game timer
  - Seems present in .slp spec but not exposed in slippi-js?
- Bubble view when off camera / near blastzone?
- Powershield animation
- Death animation
- Hit effect
- Stock icons that look like the character
- Optional state-dependent colors? (hitstun, shieldstun, actionable)
- Electric effect for knee/shine
- Fire effect for spacie upB, falcon specials
- Sword trails
- Background visuals / color stages
- Input display?
- Tests

- Add characters, peach sheik at least.
  - Needs zelda and everybody's turnip animations
  - WebGL renderer with raw models + animations?
  - HSDraw export model + animations, then generate SVG?
- Color by costume instead of port (first attempt = ugly)
- Fountain platforms (infeasible until it's added to .slp spec)
- Wispy (infeasible until it's added to .slp spec)

### App

- Tests
- Fix VSCode complaining about json modules (resolveJsonModule=true makes
  tsc crash a lot due to json sizes)
- Upload gif to some host (example project with imgur: https://github.com/eirikb/gifie)
- adjust start/end clip
- Find clips within files
- Webworkers
