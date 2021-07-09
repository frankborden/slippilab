import type {
  FrameEntryType,
  FramesType,
  ItemUpdateType,
} from '@slippi/slippi-js';

import type { DeepRequired } from './common';
import type { Render } from './gameRenderer';
import type { Layers } from './layer';

const supportedItems = [
  54, // Fox Laser
  55, // Falco Laser
  210, // Fly guy
];

const renderItem = function (
  worldContext: CanvasRenderingContext2D,
  item: DeepRequired<ItemUpdateType>,
  frame: DeepRequired<FrameEntryType>,
) {
  worldContext.save();
  worldContext.strokeStyle = 'red';
  worldContext.fillStyle = 'red';
  worldContext.translate(item.positionX, item.positionY);
  worldContext.scale(-item.facingDirection, 1);
  switch (item.typeId) {
    case 54:
      // TODO: if throw or deflected by shield, need to angle lasers
      const foxLaserOwner = frame.players[item.owner].post;
      const foxLaserLength = Math.min(
        25,
        Math.abs(foxLaserOwner.positionX - item.positionX),
      );
      worldContext.fillRect(0, 0, foxLaserLength, 1);
      break;
    case 55:
      // TODO: if throw or deflected by shield, need to angle lasers
      const falcoLaserOwner = frame.players[item.owner].post;
      const falcoLaserLength = Math.min(
        50,
        Math.abs(falcoLaserOwner.positionX - item.positionX),
      );
      worldContext.fillRect(0, 0, falcoLaserLength, 1);
      break;
    case 210:
      // estimated size/shape
      worldContext.scale(0.6, 1);
      worldContext.beginPath();
      worldContext.arc(0, 0, 5, 0, Math.PI * 2);
      worldContext.closePath();
      worldContext.stroke();
      break;
  }
  worldContext.restore();
};

export const createItemRender = function (): Render {
  return (
    layers: Layers,
    frame: DeepRequired<FrameEntryType>,
    frames: DeepRequired<FramesType>,
  ) => {
    frame.items
      ?.filter((item) => supportedItems.includes(item.typeId))
      ?.forEach((item) => {
        renderItem(layers.worldSpace.context, item, frame);
      });
  };
};
