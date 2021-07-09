import type {
  FrameEntryType,
  FramesType,
  PlayerType,
  PostFrameUpdateType,
} from '@slippi/slippi-js';

import { CharacterAnimations, fetchAnimation } from './animations';
import { actions, specials } from './animations/actions';
import { isOneIndexed } from './animations/oneIndexed';
import {
  Character,
  characterDataById,
  characters,
} from './characters/character';
import type { DeepRequired } from './common';
import type { Render } from './gameRenderer';
import type { Layer, Layers } from './layer';

const colors = ['pink', 'lightblue', 'yellow', 'lightgreen'];
const teamColors = ['pink', 'lightblue', 'lightgreen'];

const isInFrame = function (
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
): boolean {
  return Boolean(frame.players[player.playerIndex]);
};

const renderStocks = function (
  screenLayer: Layer,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): void {
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

const renderPercent = function (
  screenLayer: Layer,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): void {
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

const renderPlayerDetails = function (
  screenLayer: Layer,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): void {
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
  screenLayer.context.fillText(name, 0, 0);
  screenLayer.context.strokeText(name, 0, 0);
  screenLayer.context.restore();
};

const getLandingAttackAirFrameIndex = function (
  playerFrame: DeepRequired<PostFrameUpdateType>,
  frames: DeepRequired<FramesType>,
): number {
  const firstIndex = 0;
  // MAYBE it's not messed up. Looks like lCancelStatus is only set for
  // the first frame of landing lag instead of all of them..
  // I think the fractional animation counter messed up the table.
  // isOneIndexed(this.settings.characterId, playerFrame.actionStateId)
  //   ? 1
  //   : 0;

  let framesInAnimation = 0;
  let lCancelStatus = 0;
  let frameIndex = playerFrame.frame - 1;
  let frame = frames[frameIndex]?.players?.[playerFrame.playerIndex]?.post;
  while (frame && frame.actionStateId === playerFrame.actionStateId) {
    lCancelStatus = frame.lCancelStatus;
    framesInAnimation++;
    frameIndex--;
    frame = frames[frameIndex]?.players?.[playerFrame.playerIndex]?.post;
  }
  return firstIndex + framesInAnimation * (lCancelStatus === 1 ? 2 : 1);
};

const getFacingDirection = function (
  frameFacing: number,
  animationName: string,
  character: Character,
  animationFrameIndex: number,
): number {
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

const renderCharacter = function (
  worldContext: CanvasRenderingContext2D,
  frame: DeepRequired<FrameEntryType>,
  frames: DeepRequired<FramesType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
  animations: CharacterAnimations,
): void {
  const playerFrame = frame.players[player.playerIndex].post;
  const character = characters[player.characterId];
  const characterData = characterDataById[player.characterId];
  worldContext.save();
  worldContext.lineWidth *= 2;

  // TODO: move to func, lCancelStatus is set at the first frame of landing only
  // so we need to look back.
  let lCancelStatus = 0;
  let frameIndex = playerFrame.frame - 1;
  let pastFrame = frames[frameIndex]?.players?.[playerFrame.playerIndex]?.post;
  while (pastFrame && pastFrame.actionStateId === playerFrame.actionStateId) {
    lCancelStatus = pastFrame.lCancelStatus;
    frameIndex--;
    pastFrame = frames[frameIndex]?.players?.[playerFrame.playerIndex]?.post;
  }

  worldContext.strokeStyle =
    playerFrame.hurtboxCollisionState > 0
      ? 'blue'
      : lCancelStatus === 2
      ? 'red'
      : 'black'; // invinc
  worldContext.fillStyle = isDoubles
    ? teamColors[player.teamId]
    : colors[playerFrame.playerIndex];
  worldContext.translate(playerFrame.positionX, playerFrame.positionY);
  // 4.5 is magic, -y is because the data seems to be flipped relative to
  // the stage data..
  // world space -> animation data space
  worldContext.scale(characterData.scale / 4.5, -characterData.scale / 4.5);
  worldContext.lineWidth /= characterData.scale / 4.5;
  const animationName =
    actions[playerFrame.actionStateId] ??
    specials[characters[player.characterId]][playerFrame.actionStateId];
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
      animationName.substr(0, 6) + 'FOX' + animationName.substr(6, 10)
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
  const animationFrameIndex = animationName.startsWith('LANDINGATTACKAIR')
    ? getLandingAttackAirFrameIndex(playerFrame, frames)
    : (firstIndex + Math.floor(playerFrame.actionStateCounter)) %
      animationData.length;
  const animationFrameLine = animationData[animationFrameIndex][0];
  const isSpacieUpBLaunchAction =
    playerFrame.actionStateId === 355 || playerFrame.actionStateId === 356;
  const isSpacieUpBMovementFrame =
    (character === 'Fox' && animationFrameIndex < 31) ||
    (character === 'Falco' && animationFrameIndex < 23);

  if (isSpacieUpBLaunchAction && isSpacieUpBMovementFrame) {
    // just an estimate, especially with 2 different characters...
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

const renderShield = function (
  worldContext: CanvasRenderingContext2D,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): void {
  const playerFrame = frame.players[player.playerIndex].post;
  const characterData = characterDataById[player.characterId];
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
  const shieldScale = 7.7696875;
  worldContext.translate(playerFrame.positionX, playerFrame.positionY);
  worldContext.translate(
    characterData.shieldOffset.x / 4.5,
    characterData.shieldOffset.y / 4.5,
  );
  // world space -> shield space (unit render distance === max shield size)
  worldContext.scale(shieldScale, shieldScale);
  worldContext.lineWidth /= shieldScale;
  worldContext.beginPath();
  worldContext.arc(0, 0, shieldPercent, 0, 2 * Math.PI);
  worldContext.closePath();
  worldContext.fill();
  worldContext.stroke();
  worldContext.restore();
};

const renderShine = function (
  worldContext: CanvasRenderingContext2D,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
) {
  const playerFrame = frame.players[player.playerIndex].post;
  const character = characters[player.characterId];
  const characterData = characterDataById[player.characterId];
  if (
    (character !== 'Fox' && character !== 'Falco') ||
    playerFrame.actionStateId < 360 ||
    playerFrame.actionStateId > 369
  ) {
    return;
  }
  worldContext.save();
  worldContext.fillStyle = '#00FFFF';
  worldContext.strokeStyle = '#00FFFF';
  worldContext.lineWidth *= 5;
  const shieldScale = 7.7696875;
  worldContext.translate(playerFrame.positionX, playerFrame.positionY);
  worldContext.translate(
    characterData.shieldOffset.x / 4.5,
    characterData.shieldOffset.y / 4.5,
  );
  worldContext.scale(shieldScale, shieldScale); // world space -> shield space
  worldContext.lineWidth /= shieldScale;
  worldContext.beginPath();
  worldContext.scale(0.9, 0.9); // not as big as shield because we have linewidth
  const sixths = (2 * Math.PI) / 6;
  worldContext.moveTo(0, 1);
  for (var hexPart = 0; hexPart < 6; hexPart++) {
    worldContext.lineTo(
      1 * Math.sin(sixths * hexPart + 1),
      1 * Math.cos(sixths * hexPart + 1),
    );
  }
  worldContext.moveTo(0, 0.5);
  for (var hexPart = 0; hexPart < 6; hexPart++) {
    worldContext.lineTo(
      0.5 * Math.sin(sixths * hexPart + 1),
      0.5 * Math.cos(sixths * hexPart + 1),
    );
  }

  worldContext.closePath();
  worldContext.stroke();
  worldContext.restore();
};

const renderUi = function (
  screenLayer: Layer,
  frame: DeepRequired<FrameEntryType>,
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): void {
  screenLayer.context.save();
  const playerUiX = screenLayer.canvas.width * 0.2 * (player.playerIndex + 1);
  const playerUiY = screenLayer.canvas.height / 5;
  screenLayer.context.translate(playerUiX, playerUiY);
  renderStocks(screenLayer, frame, player, isDoubles);
  renderPercent(screenLayer, frame, player, isDoubles);
  renderPlayerDetails(screenLayer, frame, player, isDoubles);
  screenLayer.context.restore();
};

export const createPlayerRender = async function (
  player: DeepRequired<PlayerType>,
  isDoubles: boolean,
): Promise<Render> {
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
