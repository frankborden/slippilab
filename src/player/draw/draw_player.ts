import { fg2, drawArrayPathCompress } from './draw';
import { makeColour } from '../utils/makeColour';
import { Vec2D } from '../utils/Vec2D';
import { externalCharacterIDs } from '../js/characters';
import type { Game } from '../js/game';
import '../js/animations.js';
export const palettes = [
  [
    'rgb(250, 89, 89)',
    'rgb(255, 170, 170)',
    'rgba(255, 206, 111, ',
    'rgb(244, 68, 68)',
    'rgba(255, 225, 167, ',
  ],
  [
    'rgb(95, 216, 84)',
    'rgb(184, 253, 154)',
    'rgba(252, 95, 95, ',
    'rgb(255, 182, 96)',
    'rgba(254, 141, 141, ',
  ],
  [
    'rgb(5, 195, 255)',
    'rgb(121, 223, 255)',
    'rgba(218, 96, 254, ',
    'rgb(231, 134, 255)',
    'rgba(230, 144, 255, ',
  ],
  [
    'rgb(255, 187, 70)',
    'rgb(248, 255, 122)',
    'rgba(80, 182, 255, ',
    'rgb(255, 142, 70)',
    'rgba(139, 203, 249, ',
  ],
  [
    'rgb(177, 89, 255)',
    'rgb(203, 144, 255)',
    'rgba(144, 255, 110, ',
    'rgb(247, 126, 250)',
    'rgba(190, 255, 170, ',
  ],
  [
    'rgb(182, 131, 70)',
    'rgb(252, 194, 126)',
    'rgba(47, 186, 123, ',
    'rgb(255, 112, 66)',
    'rgba(111, 214, 168, ',
  ],
  [
    'rgb(232, 232, 208)',
    'rgb(255, 255, 255)',
    'rgba(244, 255, 112, ',
    'rgb(191, 119, 119)',
    'rgba(255, 255, 200, ',
  ],
];

declare const animations: any;
type Model = number[][];
const twoPi = Math.PI * 2;

// takes in player and stage
export function drawPlayer(g: Game, i: number) {
  var stage = g.stage;
  var p = g.players[i];
  if (p.dead) return;
  var temX = p.phys.pos.x * stage.scale + stage.offset.x;
  var temY = p.phys.pos.y * -stage.scale + stage.offset.y;
  var face = p.phys.face;
  var frame = Math.floor(p.action.counter);
  if (frame == 0) {
    frame = 1;
  }
  /*if (frame > framesData[characterSelections[i]][p.action.name]) {
        frame = framesData[characterSelections[i]][p.action.name];
    }*/
  if (animations[p.attributes.animID][p.action.name] === undefined) {
    return;
  }

  if (frame - 1 > animations[p.attributes.animID][p.action.name].length - 1) {
    frame = animations[p.attributes.animID][p.action.name].length;
  }

  if (animations[p.attributes.animID][p.action.name][frame - 1] === undefined) {
    frame = animations[p.attributes.animID][p.action.name].length;
  }
  var model: Model = animations[p.attributes.animID][p.action.name][frame - 1];

  // TURN
  if (p.action.name == 'SMASHTURN') {
    face *= -1;
  }
  // MARTH BAIR
  else if (
    p.action.name == 'ATTACKAIRB' &&
    externalCharacterIDs[p.charID] == 'MARTH'
  ) {
    if (frame > 29) {
      face *= -1;
    }
  }
  // FOX/FALCO BTHROW
  else if (
    p.action.name == 'THROWBACK' &&
    (externalCharacterIDs[p.charID] == 'FOX' ||
      externalCharacterIDs[p.charID] == 'FALCO')
  ) {
    if (frame >= 10) {
      face *= -1;
    }
  }

  p.rotation = 0;
  p.rotationPoint = new Vec2D(0, 0);
  // FIREFOX
  if (p.action.name == 'UPSPECIALLAUNCH') {
    if (
      (externalCharacterIDs[p.charID] == 'FOX' && frame < 31) ||
      (externalCharacterIDs[p.charID] == 'FALCO' && frame < 23)
    ) {
      p.rotation =
        Math.PI / 2 - Math.atan2(p.phys.posDelta.y, p.phys.posDelta.x);
      p.rotationPoint = new Vec2D(0, 40);
    }
  }

  var palette = palettes[p.playerIndex];
  var col = palette[0];
  if (temX > 1220 || temX < -20 || temY > 880 || temY < -30) {
    var pA = new Vec2D(temX - 600, temY - 375);
    var pB = new Vec2D(0, 0);
    var s = (pA.y - pB.y) / (pA.x - pB.x);
    if (-375 <= s * 600 && s * 600 <= 375) {
      if (pA.x > pB.x) {
        p.miniViewPoint = new Vec2D(1150, s * 600 + 375);
        p.miniViewSide = 0;
      } else {
        p.miniViewPoint = new Vec2D(50, -s * 600 + 375);
        p.miniViewSide = 1;
      }
      p.miniView = true;
    } else if (-600 <= 375 / s && 375 / s <= 600) {
      if (pA.y > pB.y) {
        if (temX < 50) {
          p.miniViewPoint = new Vec2D(50, 700);
        } else if (temX > 1150) {
          p.miniViewPoint = new Vec2D(1150, 700);
        } else {
          //p.miniViewPoint = new Vec2D(375/s+stage.offset.x,700);
          p.miniViewPoint = new Vec2D(temX, 700);
        }
        p.miniViewSide = 2;
      } else {
        p.miniViewPoint = new Vec2D(-375 / s + stage.offset.x, 50);
        p.miniViewSide = 2;
      }
      p.miniView = true;
    } else {
      p.miniView = false;
    }
  } else {
    p.miniView = false;
  }
  if (p.miniView && p.action.name != 'SLEEP' && !p.starKO) {
    fg2.fillStyle = 'black';
    fg2.strokeStyle = palette[0];
    fg2.beginPath();
    fg2.arc(p.miniViewPoint.x, p.miniViewPoint.y, 35, twoPi, 0);
    fg2.fill();
    fg2.lineWidth = 6;
    fg2.stroke();
    fg2.lineWidth = 1;

    drawArrayPathCompress(
      fg2,
      col,
      face,
      p.miniViewPoint.x,
      p.miniViewPoint.y + 30,
      model,
      p.attributes.bubbleScale,
      p.attributes.bubbleScale,
      p.rotation,
      p.rotationPoint.x,
      p.rotationPoint.y,
    );
  } else {
    if (p.action.name == 'ENTRANCE') {
      drawArrayPathCompress(
        fg2,
        col,
        face,
        temX,
        temY,
        model,
        p.attributes.scale * (stage.scale / 4.5),
        Math.min(
          p.attributes.scale,
          p.attributes.scale * (2.05 - g.startTimer),
        ) *
          (stage.scale / 4.5),
        p.rotation,
        p.rotationPoint.x,
        p.rotationPoint.y,
      );
    } else {
      var scale = 1;
      if (p.starKO) {
        scale = 0.25;
      }
      drawArrayPathCompress(
        fg2,
        col,
        face,
        temX,
        temY,
        model,
        p.attributes.scale * (stage.scale / 4.5) * scale,
        p.attributes.scale * (stage.scale / 4.5) * scale,
        p.rotation,
        p.rotationPoint.x,
        p.rotationPoint.y,
      );
    }

    if (p.shield.active) {
      var shield_pos = p.getShieldPosition();
      var sX = shield_pos.x * stage.scale + stage.offset.x;
      var sY = shield_pos.y * -stage.scale + stage.offset.y;
      var sCol = palette[2];
      if (Math.floor(p.shield.stun) > 0) {
        sCol = palette[4];
      }
      fg2.fillStyle = sCol + 0.6 * p.shield.analog + ')';
      fg2.beginPath();
      fg2.arc(sX, sY, p.shield.size * stage.scale, twoPi, 0);
      fg2.fill();
    }
    if (p.hasNametag) {
      fg2.fillStyle = makeColour(0, 0, 0, 0.5);
      fg2.strokeStyle = palette[0];
      fg2.lineWidth = 1;
      var size = 10 * p.nametag.length;
      fg2.fillRect(temX - size / 2, temY - 130 * (stage.scale / 4.5), size, 20);
      fg2.strokeRect(
        temX - size / 2,
        temY - 130 * (stage.scale / 4.5),
        size,
        20,
      );
      fg2.font = '13px Lucida Console, monaco, monospace';
      fg2.textAlign = 'center';
      fg2.fillStyle = 'white';
      fg2.fillText(p.nametag, temX, temY + 15 - 130 * (stage.scale / 4.5));
      fg2.fillStyle = palette[0];
      fg2.beginPath();
      fg2.moveTo(temX - 8, temY + 20 - 130 * (stage.scale / 4.5));
      fg2.lineTo(temX + 8, temY + 20 - 130 * (stage.scale / 4.5));
      fg2.lineTo(temX, temY + 28 - 130 * (stage.scale / 4.5));
      fg2.closePath();
      fg2.fill();
      fg2.textAlign = 'start';
    }
  }
  if (p.action.name == 'REBIRTH' || p.action.name == 'REBIRTHWAIT') {
    fg2.fillStyle = palette[1];
    fg2.strokeStyle = palette[0];
    fg2.lineWidth = 1;
    fg2.beginPath();
    fg2.moveTo(
      temX + 18 * (stage.scale / 4.5),
      temY + 13.5 * (stage.scale / 4.5),
    );
    fg2.lineTo(temX + 31.5 * (stage.scale / 4.5), temY);
    fg2.lineTo(temX - 31.5 * (stage.scale / 4.5), temY);
    fg2.lineTo(
      temX - 18 * (stage.scale / 4.5),
      temY + 13.5 * (stage.scale / 4.5),
    );
    fg2.closePath();
    fg2.fill();
    fg2.stroke();
  }
}
