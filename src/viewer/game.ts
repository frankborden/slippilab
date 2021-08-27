import type { Frame, Game as ParsedGame } from '../parser/slp';
import type { Stage } from './common';
import { createItemRender } from './itemRenderer';
import { createPlayerRender } from './characters';
import { supportedStagesById, createStageRender } from './stages';
import { clearLayers, drawToBase, setupLayers } from './layer';
import type { Layers } from './layer';
import { Vector } from './vector';
import type { Replay } from '../common';

// TODO: frames and settings should just go into generators
export type Render = (
  layers: Layers,
  frame: Frame,
  frames: Frame[],
  isDarkMode: boolean,
) => void;

interface Camera {
  scale: number;
  offset: Vector;
}

export class Game {
  public currentFrameNumber = -123;

  private camera: Camera = {
    scale: 1,
    offset: new Vector(0, 0),
  };
  private stage: Stage;
  private intervalId: number;
  private tickHandler?: (currentFrameNumber: number) => any;
  private isPaused = false;

  // You can't have an async constructor so I have to introduce a factory
  public static async create(
    replay: Replay,
    baseCanvas: HTMLCanvasElement,
    isDarkMode: boolean,
    startFrame: number,
  ): Promise<Game> {
    return new Game(
      replay,
      setupLayers(baseCanvas),
      [
        createStageRender(supportedStagesById[replay.game.gameStart.stageId]),
        ...(await Promise.all(
          replay.game.gameStart.playerSettings.map((player) =>
            createPlayerRender(
              player,
              replay.game.gameStart.playerSettings,
              replay.game.gameStart.isTeams,
            ),
          ),
        )),
        createItemRender(),
      ],
      isDarkMode,
      startFrame,
    );
  }

  constructor(
    private replay: Replay,
    private layers: Layers,
    private renders: Render[],
    private isDarkMode: boolean,
    startFrame: number,
  ) {
    this.stage = supportedStagesById[replay.game.gameStart.stageId];
    this.intervalId = window.setInterval(() => this.maybeTick(), 1000 / 60);
    this.currentFrameNumber = startFrame;
  }

  public resize(newWidth: number, newHeight: number) {
    this.layers.base.canvas.width = newWidth;
    this.layers.base.canvas.height = newHeight;
    this.layers = setupLayers(this.layers.base.canvas);
    // TODO: maintain zoomed amount somehow?
    this.camera = {
      scale: 1,
      offset: new Vector(0, 0),
    };
  }

  public stop() {
    window.clearInterval(this.intervalId);
    this.layers.base.context.resetTransform();
    this.tickHandler = undefined;
  }

  public onTick(tickHandler: (currentFrameNumber: number) => any) {
    this.tickHandler = tickHandler;
  }

  public togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  public setPause(): void {
    this.isPaused = true;
  }

  public zoomIn(): void {
    this.layers.worldSpace.context.scale(1.1, 1.1);
    this.currentFrameNumber--;
    this.tick();
  }

  public zoomOut(): void {
    this.layers.worldSpace.context.scale(1 / 1.1, 1 / 1.1);
    this.currentFrameNumber--;
    this.tick();
  }

  public setDarkMode(dark: boolean) {
    this.isDarkMode = dark;
    this.currentFrameNumber--;
    this.tick();
  }

  public speedUp(): void {
    window.clearInterval(this.intervalId);
    const normalFrameTime = 1000 / 60;
    const speedFactor = 3;
    this.intervalId = window.setInterval(
      () => this.maybeTick(),
      normalFrameTime / speedFactor,
    );
  }

  public slowDown(): void {
    window.clearInterval(this.intervalId);
    const normalFrameTime = 1000 / 60;
    const speedFactor = 1 / 4;
    this.intervalId = window.setInterval(
      () => this.maybeTick(),
      normalFrameTime / speedFactor,
    );
  }

  public normalSpeed(): void {
    window.clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => this.maybeTick(), 1000 / 60);
  }

  public setFrame(newFrameNumber: number): void {
    window.clearInterval(this.intervalId);
    this.currentFrameNumber = newFrameNumber;
    this.tick();
    this.intervalId = window.setInterval(() => this.maybeTick(), 1000 / 60);
  }

  private maybeTick(): void {
    if (this.isPaused) {
      return;
    }
    this.tick();
  }

  public tick(): void {
    const frames = this.replay.game.frames;
    const frame = frames[this.currentFrameNumber];
    if (!frame) {
      window.clearInterval(this.intervalId);
      return;
    }
    this.tickHandler?.(this.currentFrameNumber);
    clearLayers(this.layers, this.isDarkMode);
    this.updateCamera(frame, this.replay.game);
    this.renders.forEach((render) =>
      render(this.layers, frame, frames, this.isDarkMode),
    );
    drawToBase(this.layers);
    this.currentFrameNumber++;
  }

  // TODO: move out of game file
  private updateCamera(currentFrame: Frame, game: ParsedGame): void {
    const subjects: Vector[] = [];
    const lookaheadTime = 5;
    const lastFrameIndex = Math.min(
      // game.getLatestFrame().frame,
      game.metadata.lastFrame,
      currentFrame.frameNumber + lookaheadTime,
    );
    for (
      let frameIndex = currentFrame.frameNumber;
      frameIndex <= lastFrameIndex;
      frameIndex++
    ) {
      // const frameToConsider = game.getFrames()[frameIndex];
      const frameToConsider = game.frames[frameIndex];
      for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
        const playerFrame = frameToConsider.players[playerIndex]?.post;
        if (
          !playerFrame ||
          playerFrame.actionStateId <= 0x00a /* dead */ ||
          playerFrame.actionStateId === 0x00c /* respawn dropping in */
        ) {
          continue;
        }
        subjects.push(new Vector(playerFrame.xPosition, playerFrame.yPosition));
      }
    }
    if (subjects.length === 0) {
      subjects.push(
        this.stage.bottomLeftBlastzone,
        this.stage.topRightBlastzone,
      );
    }
    this.focus(subjects);
  }

  private focus(subjects: Vector[]) {
    const padding = 60; // world space
    const followSpeed = 30;
    let bottomLeftBound = new Vector(Infinity, Infinity);
    let topRightBound = new Vector(-Infinity, -Infinity);
    for (const subject of subjects) {
      bottomLeftBound = bottomLeftBound.min(subject.minus(padding));
      topRightBound = topRightBound.max(subject.plus(padding));
    }
    const unadjustedCenter = new Vector(0, 0);
    const targetCenter = unadjustedCenter.plus(
      bottomLeftBound.average(topRightBound),
    );
    const newOffset = targetCenter
      .minus(this.camera.offset)
      .scale(1 / followSpeed)
      .plus(this.camera.offset);
    const unadjustedScale = new Vector(
      this.layers.base.canvas.width,
      this.layers.base.canvas.height,
    );
    const totalSubjectDifference = topRightBound.minus(bottomLeftBound);
    const targetScale = unadjustedScale
      .scale(totalSubjectDifference.inverse())
      .getMin();
    const newScale =
      (targetScale - this.camera.scale) / followSpeed + this.camera.scale;
    // Return to scale = 1 (excluding zoom), stage(0,0) in center of screen
    this.layers.worldSpace.context.translate(
      this.camera.offset.x,
      this.camera.offset.y,
    );
    this.layers.worldSpace.context.scale(
      1 / this.camera.scale,
      1 / this.camera.scale,
    );
    this.layers.worldSpace.context.lineWidth *= this.camera.scale;
    // apply new scale and new offset
    this.layers.worldSpace.context.scale(newScale, newScale);
    this.layers.worldSpace.context.lineWidth /= newScale;
    this.layers.worldSpace.context.translate(-newOffset.x, -newOffset.y);
    this.camera.offset = newOffset;
    this.camera.scale = newScale;
  }
}
