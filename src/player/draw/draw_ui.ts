import { ui, fg2 } from './draw';
import { palettes } from './draw_player';
import type { Game } from '../js/game';

export let lostStockQueue: number[][] = [];
const twoPi = Math.PI * 2;

export const drawOverlay = function (
  game: Game,
  showMatchTimer: boolean,
  showStock: boolean,
) {
  // stocks, percent, timer
  ui.strokeStyle = 'black';
  if (showMatchTimer) {
    ui.fillStyle = 'white';
    ui.lineWidth = 2;
    ui.font = '900 40px Arial';
    ui.textAlign = 'center';
    var min = Math.floor(game.matchTimer / 60).toString();
    var sec = (game.matchTimer % 60).toFixed(2);
    ui.fillText(
      (min.length < 2 ? '0' + min : min) +
        ':' +
        (sec.length < 5 ? '0' + sec[0] : sec[0] + sec[1]),
      590,
      70,
    );
    ui.strokeText(
      (min.length < 2 ? '0' + min : min) +
        ':' +
        (sec.length < 5 ? '0' + sec[0] : sec[0] + sec[1]),
      590,
      70,
    );
    ui.font = '900 25px Arial';
    ui.fillText(sec.length < 5 ? sec[2] + sec[3] : sec[3] + sec[4], 670, 70);
    ui.strokeText(sec.length < 5 ? sec[2] + sec[3] : sec[3] + sec[4], 670, 70);
  }
  if (showStock) {
    ui.font = '900 53px Arial';
    ui.lineWidth = 2;
    ui.textAlign = 'end';
    ui.save();
    ui.scale(0.8, 1);
    for (var i = 0; i < game.playerAmount; i++) {
      var p = game.players[i];
      var portNum = p.port - 1;
      ui.fillStyle =
        'rgb(255,' +
        Math.max(255 - p.percent, 0) +
        ', ' +
        Math.max(255 - p.percent, 0) +
        ')';
      ui.fillText(
        Math.floor(p.percent) + '%',
        (450 + portNum * 145 + p.percent_pos.x) * 1.25,
        670 + p.percent_pos.y,
      );
      ui.strokeText(
        Math.floor(p.percent) + '%',
        (450 + portNum * 145 + p.percent_pos.x) * 1.25,
        670 + p.percent_pos.y,
      );
    }
    ui.restore();
    for (var i = 0; i < game.playerAmount; i++) {
      ui.fillStyle = palettes[game.players[i].playerIndex][0];
      var portNum = game.players[i].port - 1;
      for (var j = 0; j < game.players[i].stocks; j++) {
        ui.beginPath();
        ui.arc(337 + portNum * 145 + j * 30, 600, 12, 0, twoPi);
        ui.closePath();
        ui.fill();
        ui.stroke();
      }
    }
    const lostStockPopQueue = [];
    ui.fillStyle = 'white';
    ui.strokeStyle = 'white';
    for (var i = 0; i < lostStockQueue.length; i++) {
      lostStockQueue[i][2]++;
      if (lostStockQueue[i][2] > 20) {
        lostStockPopQueue.push(i);
      } else {
        ui.save();
        ui.translate(
          337 + lostStockQueue[i][0] * 145 + lostStockQueue[i][1] * 30 - 2,
          600 - 2,
        );
        ui.fillRect(lostStockQueue[i][2], 0, 4, 4);
        ui.fillRect(lostStockQueue[i][2], lostStockQueue[i][2], 4, 4);
        ui.fillRect(-lostStockQueue[i][2], lostStockQueue[i][2], 4, 4);
        ui.fillRect(lostStockQueue[i][2], -lostStockQueue[i][2], 4, 4);
        ui.fillRect(-lostStockQueue[i][2], -lostStockQueue[i][2], 4, 4);
        ui.fillRect(-lostStockQueue[i][2], 0, 4, 4);
        ui.fillRect(0, lostStockQueue[i][2], 4, 4);
        ui.fillRect(0, -lostStockQueue[i][2], 4, 4);
        ui.beginPath();
        ui.arc(2, 2, lostStockQueue[i][2] / 2, 0, twoPi);
        ui.closePath();
        ui.stroke();
        ui.restore();
      }
    }
    for (var k = 0; k < lostStockPopQueue.length; k++) {
      lostStockQueue.splice(lostStockPopQueue[k] - k, 1);
    }
    ui.textAlign = 'start';
  }
};

export const setLostStockQueue = function (index: number, val: number[]) {
  lostStockQueue[index] = val;
};

export const resetLostStockQueue = function () {
  lostStockQueue = [];
};

export const drawGameFinishScreen = function (game: Game) {
  fg2.save();
  fg2.textAlign = 'center';
  var text = 'Game!';
  var size = 300;
  var textScale = 1;
  var textGrad = fg2.createLinearGradient(0, 200, 0, 520);
  if (game.matchTimer <= 0) {
    text = 'Time!';
    //sounds.time.play();
    textGrad.addColorStop(0, 'black');
    textGrad.addColorStop(0.5, 'black');
    textGrad.addColorStop(0.7, 'rgb(21, 51, 180)');
    textGrad.addColorStop(1, 'rgb(71, 94, 250)');
  } else {
    //sounds.game.play();
    textGrad.addColorStop(0, 'black');
    textGrad.addColorStop(0.4, 'black');
    textGrad.addColorStop(0.7, 'rgb(167, 27, 40)');
    textGrad.addColorStop(1, 'rgb(255, 31, 52)');
  }
  fg2.scale(1, textScale);
  fg2.fillStyle = textGrad;
  fg2.lineWidth = 40;
  fg2.strokeStyle = 'black';
  fg2.font = '900 ' + size + 'px Arial';
  fg2.strokeText(text, 600, 470 / textScale);
  fg2.lineWidth = 20;
  fg2.strokeStyle = 'white';
  fg2.font = '900 ' + size + 'px Arial';
  fg2.strokeText(text, 600, 470 / textScale);
  fg2.font = '900 ' + size + 'px Arial';
  fg2.fillText(text, 600, 470 / textScale);
  fg2.restore();
};

export const drawLoading = function () {
  fg2.save();
  fg2.textAlign = 'center';
  var text = 'Loading';
  var size = 150;
  var yoff = -50;
  var textScale = 1;
  var textGrad = fg2.createLinearGradient(
    0,
    200 + 70 + yoff,
    0,
    520 - 30 + yoff,
  );
  textGrad.addColorStop(0, 'black');
  textGrad.addColorStop(0.5, 'black');
  textGrad.addColorStop(0.7, 'rgb(21, 51, 180)');
  textGrad.addColorStop(1, 'rgb(71, 94, 250)');
  fg2.scale(1, textScale);
  fg2.fillStyle = textGrad;
  fg2.lineWidth = 30;
  fg2.strokeStyle = 'black';
  fg2.font = '900 ' + size + 'px Arial';
  fg2.strokeText(text, 600, 470 / textScale - 30 + yoff);
  fg2.lineWidth = 15;
  fg2.strokeStyle = 'white';
  fg2.font = '900 ' + size + 'px Arial';
  fg2.strokeText(text, 600, 470 / textScale - 30 + yoff);
  fg2.font = '900 ' + size + 'px Arial';
  fg2.fillText(text, 600, 470 / textScale - 30 + yoff);
  fg2.restore();
};

export const drawErrorText = function (txtArray: string[]) {
  var y = (txtArray.length - 1) * -50 + 50;
  for (var i = 0; i < txtArray.length; i++) {
    drawErrorTextLine(txtArray[i], y + i * 100);
  }
};

const drawErrorTextLine = function (text: string, yOff: number) {
  fg2.save();
  fg2.textAlign = 'center';
  var size = 100;
  var textScale = 1;
  var textGrad = fg2.createLinearGradient(0, 250 + yOff, 0, 420 + yOff);
  textGrad.addColorStop(0, 'black');
  textGrad.addColorStop(0.4, 'black');
  textGrad.addColorStop(0.7, 'rgb(167, 27, 40)');
  textGrad.addColorStop(1, 'rgb(255, 31, 52)');
  fg2.scale(1, textScale);
  fg2.fillStyle = textGrad;
  fg2.lineWidth = 10;
  fg2.strokeStyle = 'black';
  fg2.font = '900 ' + size + 'px Arial';
  fg2.strokeText(text, 600, 470 / textScale - 100 + yOff);
  fg2.lineWidth = 5;
  fg2.strokeStyle = 'white';
  fg2.font = '900 ' + size + 'px Arial';
  fg2.strokeText(text, 600, 470 / textScale - 100 + yOff);
  fg2.font = '900 ' + size + 'px Arial';
  fg2.fillText(text, 600, 470 / textScale - 100 + yOff);
  // added by me
  fg2.restore();
};
