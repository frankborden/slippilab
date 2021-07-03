import type { FrameEntryType, ItemUpdateType } from '@slippi/slippi-js';
import type { DeepRequired } from './common';
import type { Renderer } from './gameRenderer';

const supportedItems = [
  54, // Fox Laser
  55, // Falco Laser
  210, // Fly guy
];

// lasers, needles, turnips, shy guys
export class ItemRenderer implements Renderer {
  public static create(
    worldSpaceRenderingContext: CanvasRenderingContext2D,
  ): ItemRenderer {
    return new ItemRenderer(worldSpaceRenderingContext);
  }
  private constructor(
    private worldSpaceRenderingContext: CanvasRenderingContext2D,
  ) {}

  public render(frame: DeepRequired<FrameEntryType>): void {
    frame.items
      ?.filter((item) => supportedItems.includes(item.typeId))
      ?.forEach((item) => this.renderItem(item, frame));
  }

  private renderItem(
    item: DeepRequired<ItemUpdateType>,
    frame: DeepRequired<FrameEntryType>,
  ) {
    const renderer = this.worldSpaceRenderingContext;
    renderer.save();
    renderer.strokeStyle = 'red';
    renderer.translate(item.positionX, item.positionY);
    renderer.scale(-item.facingDirection, 1);
    switch (item.typeId) {
      case 54:
        // TODO: if throw, need to angle lasers
        const foxLaserOwner = frame.players[item.owner].post;
        const foxLaserLength = Math.min(
          25,
          Math.abs(foxLaserOwner.positionX - item.positionX),
        );
        renderer.strokeRect(0, 0, foxLaserLength, 1);
        break;
      case 55:
        // TODO: if throw, need to angle lasers
        const falcoLaserOwner = frame.players[item.owner].post;
        const falcoLaserLength = Math.min(
          50,
          Math.abs(falcoLaserOwner.positionX - item.positionX),
        );
        renderer.strokeRect(0, 0, falcoLaserLength, 1);
        break;
      case 210:
        // estimated size/shape
        renderer.scale(0.6, 1);
        renderer.beginPath();
        renderer.arc(0, 0, 5, 0, Math.PI * 2);
        renderer.closePath();
        renderer.stroke();
        break;
    }
    renderer.restore();
  }
}
