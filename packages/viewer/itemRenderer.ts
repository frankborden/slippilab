import type { Frame, ItemUpdateEvent } from '@slippilab/parser';
import type { Render } from './game';
import type { Layers } from './layer';

const supportedItems = [
  54, // Fox Laser
  55, // Falco Laser
  210, // Fly guy
];

const renderItem = (
  worldContext: CanvasRenderingContext2D,
  item: ItemUpdateEvent,
  frame: Frame,
): void => {
  worldContext.save();
  worldContext.strokeStyle = 'red';
  worldContext.fillStyle = 'red';
  worldContext.translate(item.xPosition, item.yPosition);
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
      const angle = Math.atan2(item.yVelocity, item.xVelocity);
      const distToOwner = Math.max(
        0,
        Math.sqrt(
          Math.pow(item.xPosition - owner.xPosition, 2) +
            Math.pow(item.yPosition - owner.yPosition, 2),
        ) - 10, // 10 = guess to account for edge of char to center of char
      );
      const length = Math.min(
        30, // guess
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
  return (layers: Layers, frame: Frame, _frames: Frame[]) => {
    frame.items
      ?.filter((item) => supportedItems.includes(item.typeId))
      ?.forEach((item) => {
        renderItem(layers.worldSpace.context, item, frame);
      });
  };
};
