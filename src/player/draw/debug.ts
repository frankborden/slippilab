import type { Game } from '../js/game';

export const drawDebug = function (g: Game) {
  (document.querySelector('#currentFrame') as HTMLSpanElement).innerText =
    g.currentFrameIdx.toString();
  for (var i = 0; i < g.playerAmount; i++) {
    var p = g.players[i];
    var port = p.port;
    (
      document.querySelector('#p' + port + '_charname') as HTMLSpanElement
    ).innerText = p.charName;
    (
      document.querySelector('#p' + port + '_action_id') as HTMLSpanElement
    ).innerText = p.actionStateId.toString();
    (
      document.querySelector('#p' + port + '_action_name') as HTMLSpanElement
    ).innerText = p.actionState.toString();
    (
      document.querySelector('#p' + port + '_action_counter') as HTMLSpanElement
    ).innerText = p.actionStateCounter.toString();

    (
      document.querySelector('#p' + port + '_input_lsX') as HTMLSpanElement
    ).innerText = p.input.lStick.x.toString();
    (
      document.querySelector('#p' + port + '_input_lsY') as HTMLSpanElement
    ).innerText = p.input.lStick.y.toString();
    (
      document.querySelector(
        '#p' + port + '_input_l_trigger',
      ) as HTMLSpanElement
    ).innerText = p.input.lA.toString();
    (
      document.querySelector(
        '#p' + port + '_input_r_trigger',
      ) as HTMLSpanElement
    ).innerText = p.input.rA.toString();
  }
};
