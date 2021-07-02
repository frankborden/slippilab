import type { FrameEntryType, SlippiGame } from '@slippi/slippi-js';
import type { DeepRequired } from './common';
import { PlayerRenderer } from './playerRenderer';
import { StageRenderer } from './stageRenderer';
import { Stage, stagesById } from './stages/stage';

export interface Renderer {
  render(frame: DeepRequired<FrameEntryType>): void;
}

export class GameRenderer {
  public currentFrameNumber = -123;
  private stage: Stage;
  private intervalId: number;
  private tickHandler?: (currentFrameNumber: number) => any;
  private isPaused = false;

  public static async create(
    replay: SlippiGame,
    baseRenderingContext: CanvasRenderingContext2D,
  ): Promise<GameRenderer> {
    const requiredReplay = replay as DeepRequired<SlippiGame>;
    const stage = stagesById[requiredReplay.getSettings().stageId];
    const worldSpaceCanvas = document.createElement('canvas');
    worldSpaceCanvas.width = 1200;
    worldSpaceCanvas.height = 750;
    const worldSpaceRenderingContext = worldSpaceCanvas.getContext('2d')!;
    // move origin to bottom left corner
    worldSpaceRenderingContext.scale(1, -1);
    // move origin to center of stage
    worldSpaceRenderingContext.translate(stage.offset.x, stage.offset.y);
    worldSpaceRenderingContext.scale(stage.scale, stage.scale);
    worldSpaceRenderingContext.lineWidth = 1 / stage.scale;

    const screenSpaceCanvas = document.createElement('canvas');
    screenSpaceCanvas.width = 1200;
    screenSpaceCanvas.height = 750;
    const screenSpaceRenderingContext = screenSpaceCanvas.getContext('2d')!;
    screenSpaceRenderingContext.scale(1, -1); // make origin at bottom left corner

    const stageRenderer = StageRenderer.create(
      stage,
      worldSpaceRenderingContext,
    );
    const playerRenderers = await Promise.all(
      requiredReplay
        .getSettings()
        .players.map((playerType) =>
          PlayerRenderer.create(
            playerType,
            screenSpaceRenderingContext,
            worldSpaceRenderingContext,
            requiredReplay.getSettings().isTeams,
          ),
        ),
    );
    return new GameRenderer(
      requiredReplay,
      baseRenderingContext,
      screenSpaceRenderingContext,
      screenSpaceCanvas,
      worldSpaceRenderingContext,
      worldSpaceCanvas,
      (playerRenderers as Renderer[]).concat(stageRenderer),
    );
  }

  constructor(
    private replay: DeepRequired<SlippiGame>,
    private baseRenderingContext: CanvasRenderingContext2D,
    private screenSpaceRenderingContext: CanvasRenderingContext2D,
    private screenSpaceCanvas: HTMLCanvasElement,
    private worldSpaceRenderingContext: CanvasRenderingContext2D,
    private worldSpaceCanvas: HTMLCanvasElement,
    private renderers: Renderer[],
  ) {
    this.stage = stagesById[replay.getSettings().stageId];
    this.intervalId = window.setInterval(() => this.maybeTick(), 1000 / 60);
  }

  public onTick(tickHandler: (currentFrameNumber: number) => any) {
    this.tickHandler = tickHandler;
  }

  public togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  public zoomIn(): void {
    this.stage.scale *= 1.1;
    this.worldSpaceRenderingContext.scale(1.1, 1.1);
    this.currentFrameNumber--;
    this.tick();
  }

  public zoomOut(): void {
    this.stage.scale /= 1.1;
    this.worldSpaceRenderingContext.scale(1 / 1.1, 1 / 1.1);
    this.currentFrameNumber--;
    this.tick();
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

  private tick(): void {
    const frame = this.replay.getFrames()[this.currentFrameNumber];
    if (!frame) {
      window.clearInterval(this.intervalId);
      return;
    }
    this.tickHandler?.(this.currentFrameNumber);
    this.baseRenderingContext.clearRect(0, 0, 1200, 750);
    this.screenSpaceRenderingContext.clearRect(0, 0, 1200, -750);
    // Inverse of the screen --> world transformation
    this.worldSpaceRenderingContext.clearRect(
      -this.stage.offset.x / this.stage.scale,
      (-750 - this.stage.offset.y) / this.stage.scale,
      1200 / this.stage.scale,
      750 / this.stage.scale,
    );
    this.renderers.forEach((renderer) => {
      renderer.render(frame);
    });
    this.baseRenderingContext.drawImage(this.worldSpaceCanvas, 0, 0);
    this.baseRenderingContext.drawImage(this.screenSpaceCanvas, 0, 0);
    this.currentFrameNumber++;
  }
}
