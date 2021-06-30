import type { Game } from '../js/game';
import { drawBackgroundInit, drawStageInit } from '../draw/draw_stage';
import { curGame } from './main';

const $ = document.querySelector;
export class Playback {
  playing = false;
  paused = false;
  finished = false;

  constructor(public game: Game) {}

  start() {
    drawBackgroundInit();
    if (this.game.compatible) {
      drawStageInit(this.game.stage);
      this.playing = true;
      gameTick();
      renderTick();
    } else {
      renderBGOnlyTick();
    }
  }

  restart() {
    this.game.currentFrameIdx = -123;
    this.paused = false;
    this.finished = false;
    this.playing = true;
    (document.querySelector('input[type="range"]') as HTMLInputElement).value =
      this.game.currentFrameIdx.toString(); //.change();

    // $('input[type="range"]').val(this.game.currentFrameIdx).change();
  }

  togglePause() {
    this.paused = !this.paused;
  }

  frameForward() {
    this.paused = true;
    if (this.finished) return;
    this.game.currentFrameIdx++;
    this.game.updateState();
    this.game.renderState();
    (document.querySelector('input[type="range"]') as HTMLInputElement).value =
      this.game.currentFrameIdx.toString(); //.change();

    // $('input[type="range"]').val(this.game.currentFrameIdx).change();
  }

  frameBackward() {
    this.paused = true;
    this.finished = false;
    this.game.currentFrameIdx = Math.max(-123, this.game.currentFrameIdx - 1);
    this.game.updateState();
    this.game.renderState();
    (document.querySelector('input[type="range"]') as HTMLInputElement).value =
      this.game.currentFrameIdx.toString(); //.change();
  }
}

function gameTick() {
  setTimeout(gameTick, 16);
  if (
    !curGame!.playback.playing ||
    curGame!.playback.finished ||
    curGame!.playback.paused
  )
    return;
  curGame!.currentFrameIdx++;
  curGame!.updateState();
  // $('input[type="range"]').val(curGame!.currentFrameIdx).change();
  (document.querySelector('input[type="range"]') as HTMLInputElement).value =
    curGame!.currentFrameIdx.toString(); //.change();
}

function renderTick() {
  window.requestAnimationFrame(renderTick);
  if (!curGame!.playback.playing || curGame!.playback.finished) return;
  curGame!.renderState();
}

function renderBGOnlyTick() {
  window.requestAnimationFrame(renderBGOnlyTick);
  curGame!.renderBGOnly();
}
