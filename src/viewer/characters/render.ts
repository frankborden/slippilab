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
import { characterNamesById, DeepRequired } from '../common';
import type { Render } from '../game';
import type { Layer, Layers } from '../layer';
import {
  isInFrame,
  getFacingDirection,
  getFirstFrameOfAnimation,
  getFrameIndexFromDuration,
  getThrowerName,
  getShade,
} from '../replay';

export const createPlayerRender = async (
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): Promise<Render> => {
  const animations = await fetchAnimation(player.characterId);
  return (
    layers: Layers,
    frame: DeepRequired<FrameEntryType>,
    frames: DeepRequired<FramesType>,
    isDarkMode: boolean,
  ) => {
    if (!isInFrame(frame, player)) {
      return;
    }
    renderUi(layers.screenSpace, frame, player, isDoubles, isDarkMode);
    renderCharacter(
      layers.worldSpace.context,
      frame,
      frames,
      player,
      isDoubles,
      isDarkMode,
      animations,
    );
    renderShield(
      layers.worldSpace.context,
      frame,
      player,
      isDoubles,
      isDarkMode,
    );
    renderShine(layers.worldSpace.context, frame, player);
  };
};

const colors = ['pink', 'lightblue', 'yellow', 'lightgreen'];
const darkColors = ['red', 'blue', 'gold', 'green'];
const teamColors = [
  ['pink', 'pink', 'pink'],
  ['lightblue', 'lightblue', 'lightblue'],
  ['lightgreen', 'lightgreen', 'lightgreen'],
];
const darkTeamColors = [
  ['red', 'red', 'red'],
  ['blue', 'blue', 'blue'],
  ['green', 'green', 'green'],
];

const getPrimaryColor = (
  player: DeepRequired<PlayerType>,
  isDarkMode: boolean,
  isDoubles: boolean,
): string => {
  if (isDoubles) {
    return (isDarkMode ? darkTeamColors : teamColors)[player.teamId][
      getShade()
    ];
  } else {
    return (isDarkMode ? darkColors : colors)[player.playerIndex];
  }
};

const getSecondaryColor = (
  playerFrame: DeepRequired<PostFrameUpdateType>,
  lCancelStatus: number,
): string => {
  return playerFrame.hurtboxCollisionState > 0
    ? 'blue' // invinc / invuln
    : lCancelStatus === 2
    ? 'red' // missed lcanc
    : 'black';
};

const renderStocks = (
  screenLayer: Layer,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
  isDarkMode: boolean,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  const stockCount = playerFrame.stocksRemaining;
  screenLayer.context.save();
  screenLayer.context.fillStyle = getPrimaryColor(
    player,
    isDarkMode,
    isDoubles,
  );
  screenLayer.context.strokeStyle = isDarkMode ? 'white' : 'black';
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
  isDarkMode: boolean,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  const percent = playerFrame.percent;
  screenLayer.context.save();
  const fontSize = screenLayer.canvas.height / 15;
  screenLayer.context.font = `900 ${fontSize}px Arial`;
  screenLayer.context.textAlign = 'center';
  screenLayer.context.strokeStyle = isDarkMode ? 'white' : 'black';
  screenLayer.context.fillStyle = getPrimaryColor(
    player,
    isDarkMode,
    isDoubles,
  );
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
  isDarkMode: boolean,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  screenLayer.context.save();
  const fontSize = screenLayer.canvas.height / 30;
  screenLayer.context.font = `900 ${fontSize}px Verdana`;
  screenLayer.context.textAlign = 'center';
  screenLayer.context.strokeStyle = isDarkMode ? 'white' : 'black';
  screenLayer.context.fillStyle = getPrimaryColor(
    player,
    isDarkMode,
    isDoubles,
  );
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

const renderCharacter = (
  worldContext: CanvasRenderingContext2D,
  frame: DeepRequired<FrameEntryType>,
  frames: DeepRequired<FramesType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
  isDarkMode: boolean,
  animations: CharacterAnimations,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  const character = characterNamesById[player.characterId];
  const characterData = supportedCharactersById[player.characterId];
  worldContext.save();
  worldContext.lineWidth *= isDarkMode ? 3 : 2;

  const lCancelStatus = getFirstFrameOfAnimation(
    playerFrame,
    frames,
  ).lCancelStatus;
  const primaryColor = getPrimaryColor(player, isDarkMode, isDoubles);
  const secondaryColor = getSecondaryColor(playerFrame, lCancelStatus);
  worldContext.strokeStyle = isDarkMode ? primaryColor : secondaryColor;
  worldContext.fillStyle = isDarkMode ? secondaryColor : primaryColor;
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
  isDarkMode: boolean,
): void => {
  const playerFrame = frame.players[player.playerIndex].post;
  const characterData = supportedCharactersById[player.characterId];
  if (playerFrame.actionStateId < 0x0b2 || playerFrame.actionStateId > 0x0b6) {
    return;
  }
  worldContext.save();
  worldContext.globalAlpha = 0.75;
  worldContext.fillStyle = getPrimaryColor(player, isDarkMode, isDoubles);
  worldContext.strokeStyle = isDarkMode ? 'white' : 'black';
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
  isDarkMode: boolean,
): void => {
  screenLayer.context.save();
  const playerUiX = screenLayer.canvas.width * 0.2 * (player.playerIndex + 1);
  const playerUiY = screenLayer.canvas.height / 5;
  screenLayer.context.translate(playerUiX, playerUiY);
  renderStocks(screenLayer, frame, player, isDoubles, isDarkMode);
  renderPercent(screenLayer, frame, player, isDoubles, isDarkMode);
  renderPlayerDetails(screenLayer, frame, player, isDoubles, isDarkMode);
  screenLayer.context.restore();
};
