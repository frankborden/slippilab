import type { Frame, ReplayData } from '@slippilab/common';
import type { Stage } from './common';
import type { Layers } from './layer';
import { Vector } from './vector';

export class Camera {
  private scale = 1;
  private offset = new Vector(0, 0);

  public resetCamera(layers: Layers): void {
    // Return to scale = 1 (excluding zoom), stage(0,0) in center of screen
    layers.worldSpace.context.translate(this.offset.x, this.offset.y);
    layers.worldSpace.context.scale(1 / this.scale, 1 / this.scale);
    layers.worldSpace.context.lineWidth *= this.scale;
    this.scale = 1;
    this.offset = new Vector(0, 0);
  }

  public updateCamera(
    currentFrame: Frame,
    game: ReplayData,
    stage: Stage,
    layers: Layers,
  ): void {
    const subjects: Vector[] = [];
    const lookaheadTime = 5;
    const lastFrameIndex = Math.min(
      game.frames.length - 1,
      currentFrame.frameNumber + lookaheadTime,
    );
    for (
      let frameIndex = currentFrame.frameNumber;
      frameIndex <= lastFrameIndex;
      frameIndex++
    ) {
      const frameToConsider = game.frames[frameIndex];
      for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
        const frames = [];
        if (frameToConsider.players[playerIndex]?.state) {
          frames.push(frameToConsider.players[playerIndex]?.state!);
        }
        if (frameToConsider.players[playerIndex]?.nanaState) {
          frames.push(frameToConsider.players[playerIndex]?.nanaState!);
        }
        for (const playerFrame of frames) {
          if (
            !playerFrame ||
            playerFrame.actionStateId <= 0x00a /* dead */ ||
            playerFrame.actionStateId === 0x00c /* respawn dropping in */
          ) {
            continue;
          }
          subjects.push(
            new Vector(playerFrame.xPosition, playerFrame.yPosition),
          );
        }
      }
    }
    if (subjects.length === 0) {
      subjects.push(stage.bottomLeftBlastzone, stage.topRightBlastzone);
    }
    this.focus(subjects, layers);
  }

  private focus(subjects: Vector[], layers: Layers) {
    const padding = 60; // world space
    const followSpeed = 30;
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
      .minus(this.offset)
      .scale(1 / followSpeed)
      .plus(this.offset);
    const unadjustedScale = new Vector(
      layers.base.canvas.width,
      layers.base.canvas.height,
    );
    const totalSubjectDifference = topRightBound.minus(bottomLeftBound);
    const targetScale = unadjustedScale
      .scale(totalSubjectDifference.inverse())
      .getMin();
    const newScale = (targetScale - this.scale) / followSpeed + this.scale;
    // Return to scale = 1 (excluding zoom), stage(0,0) in center of screen
    layers.worldSpace.context.translate(this.offset.x, this.offset.y);
    layers.worldSpace.context.scale(1 / this.scale, 1 / this.scale);
    layers.worldSpace.context.lineWidth *= this.scale;
    // apply new scale and new offset
    layers.worldSpace.context.scale(newScale, newScale);
    layers.worldSpace.context.lineWidth /= newScale;
    layers.worldSpace.context.translate(-newOffset.x, -newOffset.y);
    this.offset = newOffset;
    this.scale = newScale;
  }
}
