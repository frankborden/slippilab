import { Vec2D } from '../utils/Vec2D';
import { externalCharacterIDs, characters, Character } from './characters';
import { actions, specials } from './actions';
import { Input } from './input';
import { lostStockQueue } from '../draw/draw_ui';
import type {
  PostFrameUpdateType,
  PreFrameUpdateType,
} from '@slippi/slippi-js';

class PhysState {
  pos: Vec2D;
  posPrev = new Vec2D(0, 0);
  posDelta = new Vec2D(0, 0);
  grounded = false;
  airborneTimer = 0;
  face: number;
  facePrev = 1;
  constructor(pos: Vec2D, face: number) {
    this.pos = new Vec2D(pos.x, pos.y);
    this.face = face;
  }

  update(state: PostFrameUpdateType, prevState: PostFrameUpdateType) {
    this.pos.x = state.positionX!;
    this.pos.y = state.positionY!;
    this.posPrev.x = prevState.positionX!;
    this.posPrev.y = prevState.positionY!;
    this.posDelta.x = this.pos.x - this.posPrev.x;
    this.posDelta.y = this.pos.y - this.posPrev.y;
    this.face = state.facingDirection!;
    this.facePrev = prevState.facingDirection!;
  }
}

class Action {
  id = 0;
  name = 'NONE';
  counter = 0;

  update(
    charID: number,
    actionID: number,
    state: PostFrameUpdateType,
    opponent: Player,
  ) {
    this.id = actionID;
    this.counter = state.actionStateCounter!;
    this.name = actions[actionID];

    // THROWN STATES
    if (actionID >= 0x0ef && actionID <= 0x0f3) {
      this.name =
        this.name.substr(0, 6) +
        externalCharacterIDs[opponent.charID] +
        this.name.substr(6, 10);
    }

    //SPECIALS
    if (actionID >= 341 && actionID <= 372) {
      this.name = specials[externalCharacterIDs[charID]][actionID];
    }
  }
}

class Shield {
  active = false;
  HP = 60;
  size = 0;
  analog = 0;
  position = new Vec2D(0, 0);
  stun = 0;

  update(actionID: number, state: PostFrameUpdateType, input: Input) {
    // SHIELD ON STATES
    if (actionID >= 0x0b2 && actionID <= 0x0b6) {
      this.active = true;
      this.HP = state.shieldSize!;
      this.size = (this.HP / 60) * 7.7696875;
      this.stun = actionID == 0x0b5 ? 1 : 0;
      this.analog = Math.max(input.rA, input.lA);
      if (!this.stun) {
        var x = input.lStick.x;
        var y = input.lStick.y;
        var offset = Math.sqrt(x * x + y * y) * 3;
        var angle = Math.atan2(y, x);
        this.position = new Vec2D(
          Math.cos(angle) * offset,
          Math.sin(angle) * offset,
        );
      }
    } else {
      this.active = false;
    }
  }
}

export class Player {
  charName: string;
  hasNametag: boolean;
  shield = new Shield();
  input = new Input();
  action = new Action();
  phys: PhysState;
  dead = false;
  starKO = false;
  percent = 0;
  miniView = false;
  rotation = 0;
  miniViewPoint = new Vec2D(0, 0);
  miniViewSide = 0;
  percent_pos = new Vec2D(0, 0);
  rotationPoint = new Vec2D(0, 0);
  colourOverlay = '';
  colourOverlayBool = false;
  attributes: Character;
  actionStateId = 0;
  actionState = 0;
  actionStateCounter = 0;

  constructor(
    public playerIndex: number,
    public port: number,
    public charID: number,
    public characterColor: number,
    public stocks: number,
    public type: number, // this is probs like CPU or HUMAN?
    public teamId: number,
    public nametag: string,
    pos: Vec2D,
    face: number,
  ) {
    this.charName = externalCharacterIDs[this.charID];
    this.hasNametag = nametag != '';
    this.phys = new PhysState(pos, face);
    this.attributes = characters[this.charName];
  }

  update(
    state: PostFrameUpdateType,
    prevState: PostFrameUpdateType,
    slp_input: PreFrameUpdateType,
    opponent: Player,
  ) {
    this.input.setInput(slp_input);

    if (this.stocks != state.stocksRemaining)
      lostStockQueue.push([this.port - 1, state.stocksRemaining!, 0]);
    if (this.percent != state.percent)
      this.percentShake(Math.abs(state.percent! - this.percent) * 8);

    this.stocks = state.stocksRemaining!;
    this.percent = state.percent!;

    this.phys.update(state, prevState);

    var actionID = state.actionStateId!;

    this.action.update(this.charID, actionID, state, opponent);

    this.shield.update(actionID, state, this.input);

    //DEAD
    this.dead = actionID >= 0x000 && actionID <= 0x003;

    //STARKO
    this.starKO = actionID == 0x004;
  }

  getShieldPosition() {
    return new Vec2D(
      this.phys.pos.x +
        this.shield.position.x +
        (this.attributes.shieldOffset.x * this.phys.face) / 4.5,
      this.phys.pos.y +
        this.shield.position.y +
        this.attributes.shieldOffset.y / 4.5,
    );
  }

  percentShake(kb: number) {
    this.percent_pos = new Vec2D(
      kb * 0.1 * Math.random(),
      kb * 0.1 * Math.random(),
    );
    var p = this;
    setTimeout(function () {
      p.percent_pos = new Vec2D(
        kb * 0.05 * Math.random(),
        kb * 0.05 * Math.random(),
      );
    }, 20);
    setTimeout(function () {
      p.percent_pos = new Vec2D(
        -kb * 0.1 * Math.random(),
        -kb * 0.1 * Math.random(),
      );
    }, 40);
    setTimeout(function () {
      p.percent_pos = new Vec2D(
        -kb * 0.05 * Math.random(),
        -kb * 0.05 * Math.random(),
      );
    }, 60);
    setTimeout(function () {
      p.percent_pos = new Vec2D(0, 0);
    }, 80);
  }
}
