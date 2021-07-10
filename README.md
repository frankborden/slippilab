# Slp Viewer

## Ideas

### Replay Viewer

- Something wrong with facing dir sometimes (marth bair at least)
- Something wrong with 1-indexed animations (aerials at least)
- Something wrong with laser shooting animations (air and ground)
- Something wrong with Spacie UpB rotation (ex: straight up)
- Show Shield tilting (original code reads inputs and checks for stun)
- Spacie throw lasers and deflected/countered lasers should be angled
- Customziation (custom colors/colorblind colors, UI info)
- Actionstate/frame below % as option (stun/lag remaining too)
- Error messages
- Separate project
- Team shade (ex: double fox has a light colored fox)
- Audio?
- debug canvas for viewing individual animations
- indicate CPUs
- Play/Pause button, other click controls..
- Electricity
- Game timer
- Death animation
- Stock icons that look like the character
- Optional state-dependent colors? (hitstun, actionable)
- Fire effect for firefox, falcon specials
- Input display?
- Tests

- Fractional animations (Lcancel done, throws not done, any others?)
- Add characters, peach sheik at least. turnip throw animations... :'(
  - WebGL renderer with raw models + animations?
  - HSDraw export model + animations, then generate SVG?
- Color by costume instead of port (first attempt = ugly)
- Fountain platforms (infeasible until it's added to .slp spec)
- Wispy (seems infeasible until it's added to .slp spec)

### App

- Tests
- Fix VSCode complaining about json modules (resolveJsonModule=true makes
  tsc crash a lot due to json sizes)
- Upload gif to some host (example project with imgur: https://github.com/eirikb/gifie)
- adjust start/end clip
- Find clips within files
- Webworkers
