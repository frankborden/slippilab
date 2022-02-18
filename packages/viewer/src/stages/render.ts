import type { Frame } from '@slippilab/common';
import type { Line, Stage } from '../common';
import type { Layers } from '../layer';
import type { Vector } from '../vector';

export function renderStage(
  stage: Stage,
  layers: Layers,
  frame: Frame,
  isDarkMode: boolean,
) {
  renderStageLines(layers.worldSpace.context, frame, stage, isDarkMode);
  renderBlastzones(layers.worldSpace.context, frame, stage, isDarkMode);
}

function renderStageLines(
  worldContext: CanvasRenderingContext2D,
  frame: Frame,
  stage: Stage,
  isDarkMode: boolean,
): void {
  worldContext.save();
  worldContext.lineWidth *= 2;
  stage.parts.forEach(([color, vectors]) => {
    worldContext.strokeStyle = color;
    worldContext.beginPath();
    vectors.forEach((vector: Vector, index: number) => {
      if (index === 0) {
        worldContext.moveTo(vector.x, vector.y);
      } else {
        worldContext.lineTo(vector.x, vector.y);
      }
    });
    worldContext.stroke();
    worldContext.closePath();
  });
  worldContext.strokeStyle = isDarkMode ? 'white' : 'black';
  stage.getMovingPlatforms?.(frame.frameNumber)?.forEach((line: Line) => {
    worldContext.beginPath();
    worldContext.moveTo(line[0].x, line[0].y);
    worldContext.lineTo(line[1].x, line[1].y);
    worldContext.closePath();
    worldContext.stroke();
  });
  worldContext.restore();
}

function renderBlastzones(
  worldContext: CanvasRenderingContext2D,
  _frame: Frame,
  stage: Stage,
  isDarkMode: boolean,
): void {
  worldContext.save();
  worldContext.lineWidth *= isDarkMode ? 3 : 2;
  worldContext.strokeStyle = isDarkMode ? 'white' : 'black';
  worldContext.strokeRect(
    stage.bottomLeftBlastzone.x,
    stage.bottomLeftBlastzone.y,
    stage.topRightBlastzone.x - stage.bottomLeftBlastzone.x,
    stage.topRightBlastzone.y - stage.bottomLeftBlastzone.y,
  );
  worldContext.restore();
}
