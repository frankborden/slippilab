import type {
  FrameEntryType,
  PostFrameUpdateType,
  SlippiGame,
} from '@slippi/slippi-js';
import { characters, characterDataById } from './characters/character';
import { CharacterAnimations, fetchAnimation } from './animations';
import { actions, specials } from './animations/actions';
import { stagesById, Stage } from './stages/stage';

interface CanvasLayers {
  stage: HTMLCanvasElement;
  characters: HTMLCanvasElement;
  ui: HTMLCanvasElement;
  base: HTMLCanvasElement;
}
interface CanvasRenderers {
  stage: CanvasRenderingContext2D;
  characters: CanvasRenderingContext2D;
  ui: CanvasRenderingContext2D;
  base: CanvasRenderingContext2D;
}

const colors = ['red', 'lightblue', 'yellow', 'green'];

export class Game {
  private static createCanvas(baseCanvas: HTMLCanvasElement) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 750;
    return canvas;
  }

  private currentFrameNumber = -123;
  private canvasLayers: CanvasLayers;
  private canvasRenderers: CanvasRenderers;
  private stage: Stage;
  private animationsByPlayer: { [playerIndex: number]: CharacterAnimations } =
    [];
  private characterIdByPlayer: { [playerIndex: number]: number } = [];

  constructor(private replay: SlippiGame, baseCanvas: HTMLCanvasElement) {
    this.canvasLayers = {
      stage: Game.createCanvas(baseCanvas),
      characters: Game.createCanvas(baseCanvas),
      ui: Game.createCanvas(baseCanvas),
      base: baseCanvas,
    };
    this.canvasRenderers = {
      stage: this.canvasLayers.stage.getContext('2d')!,
      characters: this.canvasLayers.characters.getContext('2d')!,
      ui: this.canvasLayers.ui.getContext('2d')!,
      base: baseCanvas.getContext('2d')!,
    };

    this.stage = stagesById[this.replay.getSettings()!.stageId!];
  }

  async start() {
    const players = this.replay.getSettings()?.players;
    if (!players) {
      return;
    }
    for (const player of players) {
      this.animationsByPlayer[player.playerIndex] = await fetchAnimation(
        player.characterId!,
      );
      this.characterIdByPlayer[player.playerIndex] = player.characterId!;
    }

    setInterval(() => this.tick(), 1000 / 60);
  }

  private tick() {
    const frame = this.replay.getFrames()[this.currentFrameNumber];
    this.clearDynamicCanvases();
    this.renderStage();
    this.renderCharacters(frame);
    this.renderUi(frame);
    this.drawCanvas();
    this.currentFrameNumber++;
  }

  private clearDynamicCanvases() {
    this.canvasRenderers.stage.clearRect(0, 0, 1200, 750);
    this.canvasRenderers.characters.clearRect(0, 0, 1200, 750);
    this.canvasRenderers.ui.clearRect(0, 0, 1200, 750);
    this.canvasRenderers.base.clearRect(0, 0, 1200, 750);
  }

  private drawCanvas() {
    this.canvasRenderers.base.drawImage(this.canvasLayers.stage, 0, 0);
    this.canvasRenderers.base.drawImage(this.canvasLayers.characters, 0, 0);
    this.canvasRenderers.base.drawImage(this.canvasLayers.ui, 0, 0);
  }

  private renderStage() {
    const renderer = this.canvasRenderers.stage;
    renderer.save();
    this.stage.lines.forEach((line) => {
      renderer.strokeStyle = 'white';
      renderer.beginPath();
      renderer.moveTo(
        line[0].x * this.stage.scale + this.stage.offset.x,
        line[0].y * -this.stage.scale + this.stage.offset.y,
      );
      renderer.lineTo(
        line[1].x * this.stage.scale + this.stage.offset.x,
        line[1].y * -this.stage.scale + this.stage.offset.y,
      );
      renderer.closePath();
      renderer.stroke();
    });
    renderer.restore();
  }

  private renderCharacters(frame: FrameEntryType) {
    this.canvasRenderers.characters;
    for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
      const player = frame.players[playerIndex];
      if (!player) {
        continue;
      }
      this.renderPlayerCharacter(player.post);
    }
  }

  private renderPlayerCharacter(player: PostFrameUpdateType) {
    const port = player.playerIndex;
    if (port === null) {
      return;
    }
    const characterId = this.characterIdByPlayer[port];
    const character = characterDataById[characterId];
    var baseX = player.positionX! * this.stage.scale + this.stage.offset.x;
    var baseY = player.positionY! * -this.stage.scale + this.stage.offset.y;
    const renderer = this.canvasRenderers.characters;
    renderer.save();
    // renderer.translate(x, y);
    renderer.fillStyle = colors[port];
    renderer.lineWidth = 3;
    renderer.strokeStyle = colors[port];
    const animations = this.animationsByPlayer[port];
    if (player.actionStateId === null || player.actionStateCounter === null) {
      renderer.restore();
      return;
    }
    const animationName =
      actions[player.actionStateId] ??
      specials[characters[characterId]][player.actionStateId];
    if (animationName.match('DEAD')) {
      renderer.restore();
      return;
    }
    const animationData =
      animations[animationName] ??
      animations[
        animationName.substr(0, 6) + 'FOX' + animationName.substr(6, 10)
      ];
    if (animationData === undefined) {
      console.log(player.actionStateCounter, animationData, animationName);
    }
    const animationFrameIndex =
      Math.max(0, Math.floor(player.actionStateCounter) - 1) %
      animationData.length;
    const animationFrameLine = animationData[animationFrameIndex][0];
    renderer.beginPath();
    const startX =
      animationFrameLine[0] *
        player.facingDirection! *
        character.scale *
        (this.stage.scale / 4.5) +
      baseX;
    const startY =
      animationFrameLine[1] * character.scale * (this.stage.scale / 4.5) +
      baseY;
    renderer.moveTo(startX, startY);
    // starting from index 2, each set of 6 numbers are bezier curve coords
    for (var k = 2; k < animationFrameLine.length; k += 6) {
      renderer.lineTo(
        animationFrameLine[k] *
          player.facingDirection! *
          character.scale *
          (this.stage.scale / 4.5) +
          baseX,
        animationFrameLine[k + 1] * character.scale * (this.stage.scale / 4.5) +
          baseY,
      );
    }
    renderer.closePath();
    renderer.stroke();
    renderer.restore();
  }

  private renderUi(frame: FrameEntryType) {
    this.renderAllStocks(frame);
    this.renderAllPercents(frame);
    this.canvasRenderers.ui;
  }

  private renderAllStocks(frame: FrameEntryType) {
    for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
      const player = frame.players[playerIndex];
      if (!player) {
        continue;
      }
      this.renderPlayerStocks(player.post);
    }
  }

  private renderPlayerStocks(player: PostFrameUpdateType) {
    const port = player.playerIndex;
    if (port === null) {
      return;
    }
    const stockCount = player.stocksRemaining;
    if (stockCount === null) {
      return;
    }
    const renderer = this.canvasRenderers.ui;
    renderer.save();
    renderer.lineWidth = 2;
    renderer.fillStyle = colors[port];
    for (let stockIndex = 0; stockIndex < stockCount; stockIndex++) {
      const x = 337 + port * 145 + stockIndex * 30;
      const y = 600;
      const radius = 12;
      renderer.beginPath();
      renderer.arc(x, y, radius, 0, 2 * Math.PI);
      renderer.closePath();
      renderer.fill();
    }
    renderer.restore();
  }

  private renderAllPercents(frame: FrameEntryType) {
    for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
      const player = frame.players[playerIndex];
      if (!player) {
        continue;
      }
      this.renderPlayerPercent(player.post);
    }
  }

  private renderPlayerPercent(player: PostFrameUpdateType) {
    const port = player.playerIndex;
    if (port === null) {
      return;
    }
    const percent = player.percent;
    if (percent === null) {
      return;
    }
    const renderer = this.canvasRenderers.ui;
    renderer.save();
    renderer.font = '900 53px Arial';
    renderer.textAlign = 'end';
    renderer.fillStyle = 'white';
    renderer.strokeStyle = colors[port];
    renderer.scale(0.8, 1);
    const x = (450 + port * 145) * 1.25;
    const y = 670;
    renderer.fillText(`${Math.floor(percent)}%`, x, y);
    renderer.strokeText(`${Math.floor(percent)}%`, x, y);
    renderer.restore();
  }
}
