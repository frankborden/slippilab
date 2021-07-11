import type {
  FrameEntryType,
  FramesType,
  ItemUpdateType,
} from '@slippi/slippi-js';

import type { DeepRequired } from './common';
import type { Render } from './game';
import type { Layers } from './layer';

const supportedItems = [
  54, // Fox Laser
  55, // Falco Laser
  210, // Fly guy
];

const renderItem = (
  worldContext: CanvasRenderingContext2D,
  item: DeepRequired<ItemUpdateType>,
  frame: DeepRequired<FrameEntryType>,
): void => {
  worldContext.save();
  worldContext.strokeStyle = 'red';
  worldContext.fillStyle = 'red';
  worldContext.translate(item.positionX, item.positionY);
  switch (item.typeId) {
    case 54:
    case 55:
      // Laser
      const owner = frame.players[item.owner]?.post;
      if (!owner) {
        return;
      }
      // TODO: currently length is based on current owner position, rather than
      // owner position when item spawned.
      const angle = Math.atan2(item.velocityY, item.velocityX);
      const distToOwner = Math.max(
        0,
        Math.sqrt(
          Math.pow(item.positionX - owner.positionX, 2) +
            Math.pow(item.positionY - owner.positionY, 2),
        ) - 10, // 10 = guess to account for edge of char to center of char
      );
      const length = Math.min(
        item.typeId === 54 ? 25 : 30, // guesses
        Math.abs(distToOwner),
      );
      worldContext.rotate(angle);
      // leading edge is at positionX,positionY, draw the rest trailing behind
      worldContext.fillRect(-length, 0, length, 1);
      break;
    case 210:
      // Fly guy
      // estimated size/shape
      worldContext.scale(0.8, 1);
      worldContext.beginPath();
      worldContext.arc(0, 0, 5, 0, Math.PI * 2);
      worldContext.closePath();
      worldContext.stroke();
      break;
  }
  worldContext.restore();
};

export const createItemRender = (): Render => {
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
