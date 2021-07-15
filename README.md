# SlpTube

Replay your .slp files in the browser. SlpTube is still in development.

Background: https://github.com/project-slippi/project-slippi

## Features

SlpTube does not re-simulate your match, it reads position and animation data directly from the .slp file. The main advantage of this is that playback is instantaneous from any given starting point whereas Dolphin needs to play through the entire match from the beginning in order to re-compute the game state at the given starting point. This enables a lot of convenience features (rewind, frame advance forwards and backwards) as well as analysis features that require a lot of jumping around (ex: search for a given situation across replays). 

SlpTube does not upload your replay files anywhere, everything happens on your computer to reduce load times. This means SlpTube can open huge replay folders quickly (200gb of replays takes about 5 seconds on my laptop).  

## Development

Local development:
> yarn start

Build static site:
> yarn build
