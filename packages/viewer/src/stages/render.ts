import type { Frame } from '@slippilab/common';
import type { Line, Stage } from '../common';
import type { Layer, Layers } from '../layer';
import type { Vector } from '../vector';

export function renderStage(
  stage: Stage,
  layers: Layers,
  frame: Frame,
  isDarkMode: boolean,
  timer?: string[],
) {
  if (timer) {
    renderTimer(layers.screenSpace, timer, isDarkMode);
  }
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

function renderTimer(screenLayer: Layer, timer: string[], isDarkMode: boolean) {
  const bigText = timer.slice(0, 2).join(':'); // minutes:seconds
  const smallText = timer.at(-1) ?? ''; // hundredths
  screenLayer.context.save();
  const playerUiX = screenLayer.canvas.width / 2;
  const playerUiY = screenLayer.canvas.height * 0.95;
  screenLayer.context.translate(playerUiX, playerUiY);
  const fontSize = screenLayer.canvas.height / 30;
  screenLayer.context.font = `900 ${fontSize}px Arial`;
  screenLayer.context.textAlign = 'right';
  screenLayer.context.strokeStyle = isDarkMode ? 'white' : 'black';
  screenLayer.context.fillStyle = isDarkMode ? 'white' : 'black';
  // flip text back right-side after global flip
  screenLayer.context.scale(1, -1);
  screenLayer.context.fillText(bigText, 0, 0);
  screenLayer.context.strokeText(bigText, 0, 0);
  screenLayer.context.textAlign = 'left';
  screenLayer.context.font = `900 ${fontSize / 1.5}px Arial`;
  screenLayer.context.fillText(smallText, 0, 0);
  screenLayer.context.strokeText(smallText, 0, 0);
  screenLayer.context.restore();
}
