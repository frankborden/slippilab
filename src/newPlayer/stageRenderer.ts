import type { FrameEntryType } from '@slippi/slippi-js';
import type { DeepRequired } from './common';
import type { Renderer } from './gameRenderer';
import type { Stage } from './stages/stage';

export class StageRenderer implements Renderer {
  public static create(
    stage: Stage,
    renderer: CanvasRenderingContext2D,
  ): StageRenderer {
    return new StageRenderer(stage, renderer);
  }

  private constructor(
    private stage: Stage,
    private worldSpaceRenderingContext: CanvasRenderingContext2D,
  ) {}

  public render(frame: DeepRequired<FrameEntryType>): void {
    this.renderStageLines(frame);
    this.renderBlastzones();
  }

  private renderStageLines(frame: DeepRequired<FrameEntryType>): void {
    const renderer = this.worldSpaceRenderingContext;
    renderer.save();
    renderer.lineWidth *= 2;
    renderer.strokeStyle = 'black';
    this.stage.lines.forEach((line) => {
      renderer.beginPath();
      renderer.moveTo(line[0].x, line[0].y);
      renderer.lineTo(line[1].x, line[1].y);
      renderer.closePath();
      renderer.stroke();
    });
    this.stage.getMovingPlatforms?.(frame.frame)?.forEach((line) => {
      renderer.beginPath();
      renderer.moveTo(line[0].x, line[0].y);
      renderer.lineTo(line[1].x, line[1].y);
      renderer.closePath();
      renderer.stroke();
    });
    renderer.restore();
  }

  private renderBlastzones(): void {
    const renderer = this.worldSpaceRenderingContext;
    renderer.save();
    renderer.lineWidth *= 2;
    renderer.strokeStyle = 'black';
    renderer.strokeRect(
      this.stage.bottomLeftBlastzone.x,
      this.stage.bottomLeftBlastzone.y,
      this.stage.topRightBlastzone.x - this.stage.bottomLeftBlastzone.x,
      this.stage.topRightBlastzone.y - this.stage.bottomLeftBlastzone.y,
    );
    renderer.restore();
  }
}
