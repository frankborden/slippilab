import type {
  FrameEntryType,
  FramesType,
  PlayerType,
  PostFrameUpdateType,
} from '@slippi/slippi-js';

import {
  CharacterAnimations,
  fetchAnimation,
  isOneIndexed,
  actions,
  specials,
} from '../animations';
import { supportedCharactersById } from '../characters';
import {
  CharacterName,
  characterNamesById,
  characterNamesByInternalId,
  DeepRequired,
} from '../common';
import type { Render } from '../game';
import type { Layer, Layers } from '../layer';

export const createPlayerRender = async (
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): Promise<Render> => {
  const animations = await fetchAnimation(player.characterId);
  return (
    layers: Layers,
    frame: DeepRequired<FrameEntryType>,
    frames: DeepRequired<FramesType>,
  ) => {
    if (!isInFrame(frame, player)) {
      return;
    }
    renderUi(layers.screenSpace, frame, player, isDoubles);
    renderCharacter(
      layers.worldSpace.context,
      frame,
      frames,
      player,
      isDoubles,
      animations,
    );
    renderShield(layers.worldSpace.context, frame, player, isDoubles);
    renderShine(layers.worldSpace.context, frame, player);
  };
};

const colors = ['pink', 'lightblue', 'yellow', 'lightgreen'];
const teamColors = ['pink', 'lightblue', 'lightgreen'];

const isInFrame = (
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
): boolean => {
  return Boolean(frame.players[player.playerIndex]);
};

const renderStocks = (
  screenLayer: Layer,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  const stockCount = playerFrame.stocksRemaining;
  screenLayer.context.save();
  screenLayer.context.fillStyle = isDoubles
    ? teamColors[player.teamId]
    : colors[playerFrame.playerIndex];
  screenLayer.context.strokeStyle = 'black';
  for (let stockIndex = 0; stockIndex < stockCount; stockIndex++) {
    const x = ((stockIndex - 2) * screenLayer.canvas.width) / 40;
    const y = 0;
    const radius = screenLayer.canvas.width / 100;
    screenLayer.context.beginPath();
    screenLayer.context.arc(x, y, radius, 0, 2 * Math.PI);
    screenLayer.context.closePath();
    screenLayer.context.fill();
    screenLayer.context.stroke();
  }
  screenLayer.context.restore();
};

const renderPercent = (
  screenLayer: Layer,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  const percent = playerFrame.percent;
  screenLayer.context.save();
  const fontSize = screenLayer.canvas.height / 15;
  screenLayer.context.font = `900 ${fontSize}px Arial`;
  screenLayer.context.textAlign = 'center';
  screenLayer.context.strokeStyle = 'black';
  screenLayer.context.fillStyle = isDoubles
    ? teamColors[player.teamId]
    : colors[playerFrame.playerIndex];
  const x = 0;
  const y = -screenLayer.canvas.height / 10;
  screenLayer.context.translate(x, y);
  // flip text back right-side after global flip
  screenLayer.context.scale(1, -1);
  screenLayer.context.fillText(`${Math.floor(percent)}%`, 0, 0);
  screenLayer.context.strokeText(`${Math.floor(percent)}%`, 0, 0);
  screenLayer.context.restore();
};

const renderPlayerDetails = (
  screenLayer: Layer,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  screenLayer.context.save();
  const fontSize = screenLayer.canvas.height / 30;
  screenLayer.context.font = `900 ${fontSize}px Verdana`;
  screenLayer.context.textAlign = 'center';
  screenLayer.context.strokeStyle = 'black';
  screenLayer.context.fillStyle = isDoubles
    ? teamColors[player.teamId]
    : colors[playerFrame.playerIndex];
  const x = 0;
  const y = -screenLayer.canvas.height / 7.5;
  screenLayer.context.translate(x, y);
  // flip text back right-side after global flip
  screenLayer.context.scale(1, -1);
  const name = player.displayName?.length ? player.displayName : player.nametag;
  // const name = `${playerFrame.actionStateId},${playerFrame.actionStateCounter}`;
  screenLayer.context.fillText(name, 0, 0);
  screenLayer.context.strokeText(name, 0, 0);
  screenLayer.context.restore();
};

const getFirstFrameOfAnimation = (
  playerFrame: DeepRequired<PostFrameUpdateType>,
  frames: DeepRequired<FramesType>,
): DeepRequired<PostFrameUpdateType> => {
  let frameIndex = playerFrame.frame - 1;
  let pastConfirmedFrame = playerFrame;
  let pastFrameToCheck =
    frames[frameIndex]?.players?.[playerFrame.playerIndex]?.post;
  while (
    pastFrameToCheck &&
    pastFrameToCheck.actionStateId === playerFrame.actionStateId
  ) {
    pastConfirmedFrame = pastFrameToCheck;
    frameIndex--;
    pastFrameToCheck =
      frames[frameIndex]?.players?.[playerFrame.playerIndex]?.post;
  }
  return pastConfirmedFrame;
};

const getFrameIndexFromDuration = (
  playerFrame: DeepRequired<PostFrameUpdateType>,
  frames: DeepRequired<FramesType>,
  player: DeepRequired<PlayerType>,
): number => {
  const firstIndex = isOneIndexed(player.characterId, playerFrame.actionStateId)
    ? 1
    : 0;
  const firstFrame = getFirstFrameOfAnimation(playerFrame, frames);
  const framesInAnimation = playerFrame.frame - firstFrame.frame;
  return (
    framesInAnimation * (firstFrame.lCancelStatus === 1 ? 2 : 1) - firstIndex
  );
};

const getFacingDirection = (
  frameFacing: number,
  animationName: string,
  character: CharacterName,
  animationFrameIndex: number,
): number => {
  const isMarthBairTurnaround =
    animationName === 'ATTACKAIRB' &&
    character === 'Marth' &&
    animationFrameIndex > 30;
  const isSmashTurn = animationName === 'SMASHTURN';
  const isSpacieBthrowTurnaround =
    animationName === 'THROWBACK' &&
    (character === 'Falco' || character === 'Fox') &&
    animationFrameIndex > 8;
  return isMarthBairTurnaround || isSmashTurn || isSpacieBthrowTurnaround
    ? -frameFacing
    : frameFacing;
};

const getThrowerName = (
  player: DeepRequired<PlayerType>,
  animationName: string,
  frames: DeepRequired<FrameEntryType>,
): string => {
  const throwerAnimationName = `THROW${animationName.substr(6)}`;
  for (let i = 0; i < 4; i++) {
    if (i === player.playerIndex) {
      continue;
    }
    const otherPlayerFrame = frames.players[i];
    if (!otherPlayerFrame) {
      continue;
    }
    // this could be wrong if there's multiple of the same throw happening. I
    // don't know if replay data can connect thrower to throwee for doubles.
    if (actions[otherPlayerFrame.post.actionStateId] === throwerAnimationName) {
      const throwerName =
        characterNamesByInternalId[otherPlayerFrame.post.internalCharacterId];
      switch (throwerName) {
        case 'Fox':
          return 'FOX';
        case 'Captain Falcon':
          return 'FALCON';
        case 'Falco':
          return 'FALCO';
        case 'Jigglypuff':
          return 'PUFF';
        case 'Marth':
          return 'MARTH';
      }
    }
  }
  console.log('Failed to find thrower', player.playerIndex, animationName);
  return 'FOX';
};

const renderCharacter = (
  worldContext: CanvasRenderingContext2D,
  frame: DeepRequired<FrameEntryType>,
  frames: DeepRequired<FramesType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
  animations: CharacterAnimations,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  const character = characterNamesById[player.characterId];
  const characterData = supportedCharactersById[player.characterId];
  worldContext.save();
  worldContext.lineWidth *= 2;

  const lCancelStatus = getFirstFrameOfAnimation(
    playerFrame,
    frames,
  ).lCancelStatus;
  worldContext.strokeStyle =
    playerFrame.hurtboxCollisionState > 0
      ? 'blue' // invinc / invuln
      : lCancelStatus === 2
      ? 'red' // missed lcanc
      : 'black';
  worldContext.fillStyle = isDoubles
    ? teamColors[player.teamId]
    : colors[playerFrame.playerIndex];
  worldContext.translate(playerFrame.positionX, playerFrame.positionY);
  // world space -> animation data space, -y is because the data seems to be
  // flipped relative to the stage data..
  worldContext.scale(characterData.scale, -characterData.scale);
  worldContext.lineWidth /= characterData.scale;
  const animationName =
    actions[playerFrame.actionStateId] ??
    specials[characterNamesById[player.characterId]][playerFrame.actionStateId];
  console.assert(
    animationName !== undefined,
    'characterId',
    player.characterId,
    'actionStateId',
    playerFrame.actionStateId,
  );
  if (animationName.match('DEAD')) {
    worldContext.restore();
    return;
  }
  const animationData =
    animations[animationName] ??
    animations[
      animationName.substr(0, 6) +
        getThrowerName(player, animationName, frame) +
        animationName.substr(6)
    ];
  console.assert(
    animationData !== undefined,
    'actionStateCounter',
    playerFrame.actionStateCounter,
    'animationData',
    animationData,
    'animationName',
    animationName,
  );
  const firstIndex =
    playerFrame.actionStateCounter < 0 ||
    isOneIndexed(player.characterId, playerFrame.actionStateId)
      ? 1
      : 0;

  const animationFrameIndex =
    animationName.startsWith('LANDINGATTACKAIR') ||
    animationName.startsWith('THROWN')
      ? Math.min(
          getFrameIndexFromDuration(playerFrame, frames, player),
          animationData.length - 1,
        )
      : // ENTRANCE has some negative actionStateCounters for some reason...
        // TODO: switch ENTRANCE to IndexFromDuration
        Math.max(0, Math.floor(playerFrame.actionStateCounter) - firstIndex) %
        animationData.length;
  const animationFrameLine = animationData[animationFrameIndex][0];
  const isSpacieUpBLaunchAction =
    playerFrame.actionStateId === 355 || playerFrame.actionStateId === 356;
  const isSpacieUpBMovementFrame =
    (character === 'Fox' && animationFrameIndex < 31) ||
    (character === 'Falco' && animationFrameIndex < 23);

  if (isSpacieUpBLaunchAction && isSpacieUpBMovementFrame) {
    // just a guess, especially with 2 different characters...
    const rotationYOffset = -125;
    const rawAngle = Math.atan2(
      playerFrame.selfInducedSpeeds.y + playerFrame.selfInducedSpeeds.attackY,
      playerFrame.selfInducedSpeeds.airX +
        playerFrame.selfInducedSpeeds.attackX +
        playerFrame.selfInducedSpeeds.groundX,
    );
    const angleFromUp = rawAngle - Math.PI / 2;
    worldContext.translate(0, rotationYOffset);
    worldContext.rotate(-angleFromUp);
    worldContext.translate(0, -rotationYOffset);
  }

  const facingDirection = getFacingDirection(
    playerFrame.facingDirection,
    animationName,
    character,
    animationFrameIndex,
  );
  worldContext.scale(facingDirection, 1);
  worldContext.beginPath();
  worldContext.moveTo(animationFrameLine[0], animationFrameLine[1]);
  // starting from index 2, each set of 6 numbers are bezier curve coords
  for (var k = 2; k < animationFrameLine.length; k += 6) {
    const a = animationFrameLine;
    worldContext.bezierCurveTo(
      a[k],
      a[k + 1],
      a[k + 2],
      a[k + 3],
      a[k + 4],
      a[k + 5],
    );
    // renderer.lineTo(animationFrameLine[k + 4], animationFrameLine[k + 5]);
  }
  worldContext.closePath();
  worldContext.fill();
  worldContext.stroke();
  worldContext.restore();
};

const renderShield = (
  worldContext: CanvasRenderingContext2D,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  const characterData = supportedCharactersById[player.characterId];
  if (playerFrame.actionStateId < 0x0b2 || playerFrame.actionStateId > 0x0b6) {
    return;
  }
  worldContext.save();
  worldContext.globalAlpha = 0.75;
  worldContext.fillStyle = isDoubles
    ? teamColors[player.teamId]
    : colors[playerFrame.playerIndex];
  worldContext.strokeStyle = 'white';
  const shieldPercent = playerFrame.shieldSize / 60;
  worldContext.translate(playerFrame.positionX, playerFrame.positionY);
  worldContext.translate(
    characterData.shieldOffset.x,
    characterData.shieldOffset.y,
  );
  // world space -> shield space (unit render distance === max shield size)
  const magic = 7.7696875;
  worldContext.scale(magic, magic);
  worldContext.lineWidth /= magic;
  worldContext.beginPath();
  worldContext.arc(0, 0, shieldPercent, 0, 2 * Math.PI);
  worldContext.closePath();
  worldContext.fill();
  worldContext.stroke();
  worldContext.restore();
};

const renderShine = (
  worldContext: CanvasRenderingContext2D,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  const character = characterNamesById[player.characterId];
  const characterData = supportedCharactersById[player.characterId];
  if (
    (character !== 'Fox' && character !== 'Falco') ||
    playerFrame.actionStateId < 360 ||
    playerFrame.actionStateId > 369
  ) {
    return;
  }
  worldContext.save();
  worldContext.strokeStyle = 'aqua';
  worldContext.lineWidth *= 5;

  worldContext.translate(playerFrame.positionX, playerFrame.positionY);
  worldContext.translate(
    characterData.shieldOffset.x,
    characterData.shieldOffset.y,
  );
  const magic = 7.7696875; // "shield scale"
  worldContext.scale(magic, magic); // world space -> shield space
  worldContext.lineWidth /= magic;
  worldContext.beginPath();
  // TODO: spacies have different sized shines
  // not as big as shield because we have linewidth
  worldContext.scale(0.9, 0.9);
  const sixths = (2 * Math.PI) / 6;
  let radius = 1;
  worldContext.moveTo(0, radius);
  for (var hexPart = 0; hexPart < 6; hexPart++) {
    worldContext.lineTo(
      radius * Math.sin(sixths * (hexPart + 1)),
      radius * Math.cos(sixths * (hexPart + 1)),
    );
  }
  radius = 0.5;
  worldContext.moveTo(0, radius);
  for (var hexPart = 0; hexPart < 6; hexPart++) {
    worldContext.lineTo(
      radius * Math.sin(sixths * (hexPart + 1)),
      radius * Math.cos(sixths * (hexPart + 1)),
    );
  }

  worldContext.closePath();
  worldContext.stroke();
  worldContext.restore();
};

const renderUi = (
  screenLayer: Layer,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): void => {
  screenLayer.context.save();
  const playerUiX = screenLayer.canvas.width * 0.2 * (player.playerIndex + 1);
  const playerUiY = screenLayer.canvas.height / 5;
  screenLayer.context.translate(playerUiX, playerUiY);
  renderStocks(screenLayer, frame, player, isDoubles);
  renderPercent(screenLayer, frame, player, isDoubles);
  renderPlayerDetails(screenLayer, frame, player, isDoubles);
  screenLayer.context.restore();
};
