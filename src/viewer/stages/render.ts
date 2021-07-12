import type { FrameEntryType, FramesType } from '@slippi/slippi-js';
import type { Line, DeepRequired, Stage } from '../common';
import type { Render } from '../game';
import type { Layers } from '../layer';

export const createStageRender = (stage: Stage): Render => {
  return (
    layers: Layers,
    frame: DeepRequired<FrameEntryType>,
    _frames: DeepRequired<FramesType>,
    isDarkMode: boolean,
  ) => {
    renderStageLines(layers.worldSpace.context, frame, stage, isDarkMode);
    renderBlastzones(layers.worldSpace.context, frame, stage, isDarkMode);
  };
};

const renderStageLines = (
  worldContext: CanvasRenderingContext2D,
  frame: DeepRequired<FrameEntryType>,
  stage: Stage,
  isDarkMode: boolean,
): void => {
  worldContext.save();
  worldContext.lineWidth *= 2;
  worldContext.strokeStyle = isDarkMode ? 'white' : 'black';
  stage.lines.forEach((line: Line) => {
    worldContext.beginPath();
    worldContext.moveTo(line[0].x, line[0].y);
    worldContext.lineTo(line[1].x, line[1].y);
    worldContext.closePath();
    worldContext.stroke();
  });
  stage.getMovingPlatforms?.(frame.frame)?.forEach((line: Line) => {
    worldContext.beginPath();
    worldContext.moveTo(line[0].x, line[0].y);
    worldContext.lineTo(line[1].x, line[1].y);
    worldContext.closePath();
    worldContext.stroke();
  });
  worldContext.restore();
};

const renderBlastzones = (
  worldContext: CanvasRenderingContext2D,
  _frame: DeepRequired<FrameEntryType>,
  stage: Stage,
  isDarkMode: boolean,
): void => {
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
};
