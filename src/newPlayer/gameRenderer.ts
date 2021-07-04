import type { FrameEntryType, SlippiGame } from '@slippi/slippi-js';
import type { DeepRequired } from './common';
import { Vector } from './common';
import { ItemRenderer } from './itemRenderer';
import { PlayerRenderer } from './playerRenderer';
import { StageRenderer } from './stageRenderer';
import { Stage, stagesById } from './stages/stage';

export interface Renderer {
  render(frame: DeepRequired<FrameEntryType>): void;
}

interface Camera {
  scale: number;
  offset: Vector;
}

export class GameRenderer {
  public currentFrameNumber = -123;

  private camera: Camera = {
    scale: 1,
    offset: new Vector(0, 0),
  };
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
    worldSpaceRenderingContext.translate(0, 750);
    worldSpaceRenderingContext.scale(1, -1);
    worldSpaceRenderingContext.translate(600, 375);
    // move origin to center of stage
    // worldSpaceRenderingContext.translate(stage.offset.x, stage.offset.y);
    // worldSpaceRenderingContext.scale(stage.scale, stage.scale);
    // worldSpaceRenderingContext.lineWidth = 1 / stage.scale;

    const screenSpaceCanvas = document.createElement('canvas');
    screenSpaceCanvas.width = 1200;
    screenSpaceCanvas.height = 750;
    const screenSpaceRenderingContext = screenSpaceCanvas.getContext('2d')!;
    screenSpaceRenderingContext.scale(1, -1); // make origin at bottom left corner

    const stageRenderer = StageRenderer.create(
      stage,
      worldSpaceRenderingContext,
    );
    const itemRenderer = ItemRenderer.create(worldSpaceRenderingContext);
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
      (playerRenderers as Renderer[]).concat(itemRenderer, stageRenderer),
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
    this.worldSpaceRenderingContext.scale(1.1, 1.1);
    this.currentFrameNumber--;
    this.tick();
  }

  public zoomOut(): void {
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
    this.worldSpaceRenderingContext.save();
    this.worldSpaceRenderingContext.resetTransform();
    this.worldSpaceRenderingContext.clearRect(0, 0, 1200, 750);
    this.worldSpaceRenderingContext.restore();
    this.updateCamera(frame);
    this.renderers.forEach((renderer) => {
      renderer.render(frame);
    });
    this.baseRenderingContext.drawImage(this.worldSpaceCanvas, 0, 0);
    this.baseRenderingContext.drawImage(this.screenSpaceCanvas, 0, 0);
    this.currentFrameNumber++;
  }

  private focus(subjects: Vector[]) {
    const padding = 60;
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
      .scale(1 / 100)
      .plus(this.camera.offset);

    const unadjustedScale = new Vector(1200, 750);
    const totalSubjectDifference = topRightBound.minus(bottomLeftBound);
    const targetScale = unadjustedScale
      .scale(totalSubjectDifference.inverse())
      .getMin();
    const newScale =
      (targetScale - this.camera.scale) / 100 + this.camera.scale;

    // Return to scale = 1, stage(0,0) in center of screen
    this.worldSpaceRenderingContext.translate(
      this.camera.offset.x,
      this.camera.offset.y,
    );
    this.worldSpaceRenderingContext.scale(
      1 / this.camera.scale,
      1 / this.camera.scale,
    );
    this.worldSpaceRenderingContext.lineWidth *= this.camera.scale;

    // apply new scale and new offset
    this.worldSpaceRenderingContext.scale(newScale, newScale);
    this.worldSpaceRenderingContext.lineWidth /= newScale;
    this.worldSpaceRenderingContext.translate(-newOffset.x, -newOffset.y);

    this.camera.offset = newOffset;
    this.camera.scale = newScale;
  }

  private updateCamera(frame: DeepRequired<FrameEntryType>): void {
    const subjects: Vector[] = [];
    for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
      const playerFrame = frame.players[playerIndex]?.post;
      if (!playerFrame || playerFrame.actionStateId <= 0x00a /* dead */) {
        continue;
      }
      subjects.push(new Vector(playerFrame.positionX, playerFrame.positionY));
    }
    if (subjects.length === 0) {
      subjects.push(
        this.stage.bottomLeftBlastzone,
        this.stage.topRightBlastzone,
      );
    }
    this.focus(subjects);
  }
}
