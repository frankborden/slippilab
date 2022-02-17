import type { Stage } from './common';
import { createItemRender } from './itemRenderer';
import { createPlayerRender } from './characters';
import { supportedStagesById, createStageRender } from './stages';
import { clearLayers, drawToBase, resizeLayers, setupLayers } from './layer';
import type { Layers } from './layer';
import { Camera } from './camera';
import type { Frame, ReplayData } from '@slippilab/common';

// TODO: frames should just go into generators
export type Render = (
  layers: Layers,
  frame: Frame,
  frames: Frame[],
  isDarkMode: boolean,
  isDebugMode: boolean,
) => void;

export class Game {
  public currentFrameNumber = 0;

  private camera = new Camera();
  private stage?: Stage;
  private renderInterval = 1000 / 60; // 60fps
  private lastRenderTime = 0;
  private tickOnceEvenIfPaused = false;
  private framesPerRender = 1; // used for fast-forwarding
  private normalSpeedRenderInterval = 1000 / 60;
  private slowSpeedRenderInterval = this.normalSpeedRenderInterval * 3; // 20fps
  private tickHandler?: (currentFrameNumber: number) => any;
  private isPaused = false;
  private isStopped = false;
  private layers: Layers;
  private renders: Render[] = [];
  private replay?: ReplayData;
  private animationFrame?: number;

  constructor(
    baseCanvas: HTMLCanvasElement,
    private isDarkMode: boolean,
    private isDebugMode: boolean,
  ) {
    this.layers = setupLayers(baseCanvas);
  }

  public resize(newWidth: number, newHeight: number) {
    this.layers.base.canvas.width = newWidth;
    this.layers.base.canvas.height = newHeight;
    // TODO: maintain zoomed amount somehow?
    this.camera.resetCamera(this.layers);
    resizeLayers(this.layers);
  }

  public loadReplay(replay: ReplayData, startFrame: number): void {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
    this.layers.base.context.save();
    this.layers.base.context.fillStyle = 'black';
    this.layers.base.context.font = `${
      this.layers.base.canvas.height / 80
    }px Verdana`;
    this.layers.base.context.textAlign = 'center';
    this.layers.base.context?.fillText(
      'Loading and caching animations',
      this.layers.base.canvas.width / 2,
      this.layers.base.canvas.height / 2,
    );
    this.layers.base.context.restore();
    this.replay = replay;
    this.camera.resetCamera(this.layers);
    this.stage = supportedStagesById[replay.settings.stageId];
    this.currentFrameNumber = startFrame;
    this.lastRenderTime = Date.now();
    Promise.all(
      replay.settings.playerSettings
        .filter((player) => Boolean(player))
        .map((player) =>
          createPlayerRender(
            player,
            replay.settings.playerSettings,
            replay.settings.isTeams,
          ),
        ),
    ).then((playerRenders) => {
      this.renders = [
        createStageRender(supportedStagesById[replay.settings.stageId]),
        ...playerRenders,
        createItemRender(),
      ];
      this.isPaused = false;
      this.tick();
    });
  }

  public playHighlight(): void {}

  public stop() {
    this.isStopped = true;
    this.layers.base.context.resetTransform();
    this.tickHandler = undefined;
  }

  public onTick(handler: (currentFrameNumber: number) => void) {
    this.tickHandler = handler;
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
    this.tickOnceEvenIfPaused = true;
  }

  public zoomOut(): void {
    this.layers.worldSpace.context.scale(1 / 1.1, 1 / 1.1);
    this.currentFrameNumber--;
    this.tickOnceEvenIfPaused = true;
  }

  public setDarkMode(dark: boolean) {
    this.isDarkMode = dark;
    this.currentFrameNumber--;
    this.tickOnceEvenIfPaused = true;
  }

  public setDebugMode(debug: boolean) {
    this.isDebugMode = debug;
    this.currentFrameNumber--;
    this.tickOnceEvenIfPaused = true;
  }

  public setFastSpeed(): void {
    this.framesPerRender = 3; // 180 fps
  }

  public setSlowSpeed(): void {
    this.renderInterval = this.slowSpeedRenderInterval;
    this.framesPerRender = 1;
  }

  public setNormalSpeed(): void {
    this.renderInterval = this.normalSpeedRenderInterval;
    this.framesPerRender = 1;
  }

  public setFrame(newFrameNumber: number): void {
    this.currentFrameNumber = newFrameNumber;
    this.renderInterval = this.normalSpeedRenderInterval;
    this.tickOnceEvenIfPaused = true;
  }

  public tick(): void {
    if (this.isStopped) {
      return;
    }
    this.animationFrame = window.requestAnimationFrame(() => this.tick());
    const now = Date.now();
    const elapsed = now - this.lastRenderTime;
    if (elapsed <= this.renderInterval) {
      return;
    }
    this.lastRenderTime = now - (elapsed % this.renderInterval);

    const frames = this.replay?.frames;
    const frame = frames?.[this.currentFrameNumber];
    // Ignore pause if fastforward or slowmo
    if (
      !this.replay ||
      !frames ||
      !frame ||
      !this.stage ||
      (this.renderInterval === this.normalSpeedRenderInterval &&
        this.framesPerRender === 1 &&
        this.isPaused &&
        !this.tickOnceEvenIfPaused)
    ) {
      return;
    }
    this.tickOnceEvenIfPaused = false;

    this.tickHandler?.(this.currentFrameNumber);
    clearLayers(this.layers, this.isDarkMode);
    this.camera.updateCamera(frame, this.replay, this.stage, this.layers);
    this.renders.forEach((render) =>
      render(this.layers, frame, frames, this.isDarkMode, this.isDebugMode),
    );
    drawToBase(this.layers);
    this.currentFrameNumber += this.framesPerRender;
  }
}
