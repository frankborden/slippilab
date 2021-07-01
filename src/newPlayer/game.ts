import type { FrameEntryType, PlayerType, SlippiGame } from '@slippi/slippi-js';
import {
  characters,
  characterDataById,
  CharacterData,
} from './characters/character';
import { CharacterAnimations, fetchAnimation } from './animations';
import { actions, specials } from './animations/actions';
import { stagesById, Stage } from './stages/stage';

// modified from ts-essentials, also made all functions return nonnullables
type Primitive = string | number | boolean | bigint | symbol | undefined | null;
type Builtin = Primitive | Function | Date | Error | RegExp;
type DeepRequired<T> = T extends (...args: any) => any
  ? (...args: Parameters<T>) => DeepRequired<ReturnType<T>>
  : T extends Builtin
  ? NonNullable<T>
  : T extends Map<infer K, infer V>
  ? Map<DeepRequired<K>, DeepRequired<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepRequired<K>, DeepRequired<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepRequired<K>, DeepRequired<V>>
  : T extends Set<infer U>
  ? Set<DeepRequired<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepRequired<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepRequired<U>>
  : T extends Promise<infer U>
  ? Promise<DeepRequired<U>>
  : T extends {}
  ? {
      [K in keyof T]-?: DeepRequired<T[K]>;
    }
  : NonNullable<T>;

const colors = ['red', 'blue', 'yellow', 'green'];
const teamColors = ['red', 'blue', 'green'];

class Player {
  public static async create(
    settings: DeepRequired<PlayerType>,
    isDoubles: boolean,
  ): Promise<Player> {
    const animations = await fetchAnimation(settings.characterId);
    return new Player(settings, animations, isDoubles);
  }

  private character: CharacterData;

  private constructor(
    private settings: DeepRequired<PlayerType>,
    private animations: CharacterAnimations,
    private isDoubles: boolean,
  ) {
    this.character = characterDataById[this.settings.characterId];
  }

  public renderUi(
    frame: DeepRequired<FrameEntryType>,
    renderer: CanvasRenderingContext2D,
  ): void {
    renderer.save();
    const playerUiX = 1200 * 0.2 * (this.settings.playerIndex + 1);
    const playerUiY = -600;
    renderer.translate(playerUiX, playerUiY);
    this.renderStocks(frame, renderer);
    this.renderPercent(frame, renderer);
    renderer.restore();
  }

  private renderStocks(
    frame: DeepRequired<FrameEntryType>,
    renderer: CanvasRenderingContext2D,
  ): void {
    const playerFrame = frame.players[this.settings.playerIndex].post;
    const stockCount = playerFrame.stocksRemaining;
    renderer.save();
    renderer.fillStyle = this.isDoubles
      ? teamColors[this.settings.teamId]
      : colors[playerFrame.playerIndex];
    for (let stockIndex = 0; stockIndex < stockCount; stockIndex++) {
      const x = (stockIndex - 2) * 30;
      const y = 0;
      const radius = 12;
      renderer.beginPath();
      renderer.arc(x, y, radius, 0, 2 * Math.PI);
      renderer.closePath();
      renderer.fill();
    }
    renderer.restore();
  }

  private renderPercent(
    frame: DeepRequired<FrameEntryType>,
    renderer: CanvasRenderingContext2D,
  ): void {
    const playerFrame = frame.players[this.settings.playerIndex].post;
    const percent = playerFrame.percent;
    renderer.save();
    renderer.font = '900 53px Arial';
    renderer.textAlign = 'center';
    renderer.fillStyle = 'white';
    renderer.strokeStyle = this.isDoubles
      ? teamColors[this.settings.teamId]
      : colors[playerFrame.playerIndex];
    // renderer.scale(0.8, 1);
    const x = 0;
    const y = -70;
    renderer.translate(x, y);
    renderer.scale(1, -1); // flip text back right-side after global flip
    renderer.fillText(`${Math.floor(percent)}%`, 0, 0);
    renderer.strokeText(`${Math.floor(percent)}%`, 0, 0);
    renderer.restore();
  }

  public renderCharacter(
    frame: DeepRequired<FrameEntryType>,
    renderer: CanvasRenderingContext2D,
    stage: Stage,
  ): void {
    const playerFrame = frame.players[this.settings.playerIndex].post;
    renderer.save();
    renderer.lineWidth = 2;
    renderer.strokeStyle = this.isDoubles
      ? teamColors[this.settings.teamId]
      : colors[playerFrame.playerIndex];
    renderer.translate(stage.offset.x, stage.offset.y);
    renderer.scale(stage.scale, stage.scale);
    renderer.lineWidth /= stage.scale;
    renderer.translate(playerFrame.positionX, playerFrame.positionY);
    // 4.5 is magic, -y is because the data seems to be flipped relative to
    // the stage data..
    renderer.scale(this.character.scale / 4.5, -this.character.scale / 4.5);
    renderer.lineWidth /= this.character.scale / 4.5;
    renderer.scale(playerFrame.facingDirection, 1);

    const animationName =
      actions[playerFrame.actionStateId] ??
      specials[characters[this.settings.characterId]][
        playerFrame.actionStateId
      ];
    if (animationName === undefined) {
      console.log(
        'characterId',
        this.settings.characterId,
        'actionStateId',
        playerFrame.actionStateId,
      );
    }
    if (animationName.match('DEAD')) {
      renderer.restore();
      return;
    }
    const animationData =
      this.animations[animationName] ??
      this.animations[
        animationName.substr(0, 6) + 'FOX' + animationName.substr(6, 10)
      ];
    if (animationData === undefined) {
      console.log(
        'actionStateCounter',
        playerFrame.actionStateCounter,
        'animationData',
        animationData,
        'animationName',
        animationName,
      );
    }
    const animationFrameIndex =
      Math.max(0, Math.floor(playerFrame.actionStateCounter) - 1) %
      animationData.length;
    const animationFrameLine = animationData[animationFrameIndex][0];
    renderer.beginPath();
    renderer.moveTo(animationFrameLine[0], animationFrameLine[1]);
    // starting from index 2, each set of 6 numbers are bezier curve coords
    for (var k = 2; k < animationFrameLine.length; k += 6) {
      const a = animationFrameLine;
      renderer.bezierCurveTo(
        a[k],
        a[k + 1],
        a[k + 2],
        a[k + 3],
        a[k + 4],
        a[k + 5],
      );
      // renderer.lineTo(animationFrameLine[k + 4], animationFrameLine[k + 5]);
    }
    renderer.closePath();
    renderer.fill();
    renderer.stroke();
    renderer.restore();
  }

  public renderShield(
    frame: DeepRequired<FrameEntryType>,
    renderer: CanvasRenderingContext2D,
    stage: Stage,
  ): void {
    const playerFrame = frame.players[this.settings.playerIndex].post;
    if (
      playerFrame.actionStateId < 0x0b2 ||
      playerFrame.actionStateId > 0x0b6
    ) {
      return;
    }
    renderer.save();
    renderer.globalAlpha = 0.75;
    renderer.fillStyle = this.isDoubles
      ? teamColors[this.settings.teamId]
      : colors[playerFrame.playerIndex];
    const shieldPercent = playerFrame.shieldSize / 60;
    const shieldScale = 7.7696875;
    renderer.translate(stage.offset.x, stage.offset.y);
    renderer.scale(stage.scale, stage.scale);
    renderer.translate(playerFrame.positionX, playerFrame.positionY);
    renderer.translate(
      this.character.shieldOffset.x / 4.5,
      this.character.shieldOffset.y / 4.5,
    );
    renderer.scale(shieldScale, shieldScale);
    // fixes weird left-facing shield stuff for some reason
    renderer.scale(-playerFrame.facingDirection, 1);
    renderer.arc(0, 0, shieldPercent, 0, 2 * Math.PI);
    renderer.fill();
    renderer.restore();
  }

  public renderShine(
    frame: DeepRequired<FrameEntryType>,
    renderer: CanvasRenderingContext2D,
    stage: Stage,
  ) {
    const playerFrame = frame.players[this.settings.playerIndex].post;
    const character = characters[this.settings.characterId];
    if (
      (character !== 'Fox' && character !== 'Falco') ||
      playerFrame.actionStateId < 360 ||
      playerFrame.actionStateId > 369
    ) {
      return;
    }
    renderer.save();
    renderer.fillStyle = '#00FFFF';
    renderer.strokeStyle = '#00FFFF';
    renderer.lineWidth = 5;
    const shieldScale = 7.7696875;
    renderer.translate(stage.offset.x, stage.offset.y);
    renderer.scale(stage.scale, stage.scale);
    renderer.lineWidth /= stage.scale;
    renderer.translate(playerFrame.positionX, playerFrame.positionY);
    renderer.translate(
      this.character.shieldOffset.x / 4.5,
      this.character.shieldOffset.y / 4.5,
    );
    renderer.scale(shieldScale, shieldScale);
    renderer.lineWidth /= shieldScale;
    // fixes weird left-facing shield stuff for some reason
    renderer.scale(-playerFrame.facingDirection, 1);
    renderer.beginPath();
    renderer.scale(0.9, 0.9); // not as big as shield because we have linewidth
    const sixths = (2 * Math.PI) / 6;
    renderer.moveTo(0, 1);
    for (var hexPart = 0; hexPart < 6; hexPart++) {
      renderer.lineTo(
        1 * Math.sin(sixths * hexPart + 1),
        1 * Math.cos(sixths * hexPart + 1),
      );
    }
    renderer.moveTo(0, 0.5);
    for (var hexPart = 0; hexPart < 6; hexPart++) {
      renderer.lineTo(
        0.5 * Math.sin(sixths * hexPart + 1),
        0.5 * Math.cos(sixths * hexPart + 1),
      );
    }

    renderer.closePath();
    renderer.stroke();
    renderer.restore();
  }
}

export class Game {
  private currentFrameNumber = -123;
  private stage: Stage;

  public static async create(
    replay: SlippiGame,
    baseCanvas: CanvasRenderingContext2D,
  ): Promise<Game> {
    const requiredReplay = replay as DeepRequired<SlippiGame>;
    const players = await Promise.all(
      requiredReplay
        .getSettings()
        .players.map((playerType) =>
          Player.create(playerType, requiredReplay.getSettings().isTeams),
        ),
    );
    return new Game(requiredReplay, baseCanvas, players);
  }

  constructor(
    private replay: DeepRequired<SlippiGame>,
    private renderer: CanvasRenderingContext2D,
    private players: Player[],
  ) {
    renderer.scale(1, -1);
    this.stage = stagesById[replay.getSettings().stageId];
    setInterval(() => this.tick(), 1000 / 60);
  }

  private tick(): void {
    const frame = this.replay.getFrames()[this.currentFrameNumber];
    this.renderer.clearRect(0, 0, 1200, -750);
    for (const player of this.players) {
      player.renderCharacter(frame, this.renderer, this.stage);
      player.renderShield(frame, this.renderer, this.stage);
      player.renderShine(frame, this.renderer, this.stage);
    }
    this.renderStage();
    this.renderBlastzones();
    for (const player of this.players) {
      player.renderUi(frame, this.renderer);
    }
    this.currentFrameNumber++;
  }

  private renderStage(): void {
    this.renderer.save();
    this.renderer.lineWidth = 2;
    this.renderer.strokeStyle = 'white';
    this.renderer.translate(this.stage.offset.x, this.stage.offset.y);
    this.renderer.scale(this.stage.scale, this.stage.scale);
    this.renderer.lineWidth /= this.stage.scale;
    this.stage.lines.forEach((line) => {
      this.renderer.beginPath();
      this.renderer.moveTo(line[0].x, line[0].y);
      this.renderer.lineTo(line[1].x, line[1].y);
      this.renderer.closePath();
      this.renderer.stroke();
    });
    this.renderer.restore();
  }

  private renderBlastzones(): void {
    this.renderer.save();
    this.renderer.lineWidth = 2;
    this.renderer.strokeStyle = 'white';
    this.renderer.translate(this.stage.offset.x, this.stage.offset.y);
    this.renderer.scale(this.stage.scale, this.stage.scale);
    this.renderer.lineWidth /= this.stage.scale;
    this.renderer.strokeRect(
      this.stage.bottomLeftBlastzone.x,
      this.stage.bottomLeftBlastzone.y,
      this.stage.topRightBlastzone.x - this.stage.bottomLeftBlastzone.x,
      this.stage.topRightBlastzone.y - this.stage.bottomLeftBlastzone.y,
    );
    this.renderer.restore();
  }
}
