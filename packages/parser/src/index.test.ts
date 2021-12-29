import { Game } from './index';
import * as fs from 'fs';

// TODO: singles test, especially for matches with port 1 or 2 missing

describe('parser', () => {
  let replay: Game;

  beforeAll(() => {
    replay = new Game(fs.readFileSync('doubles_test.slp'));
  });

  test('frames includes negative frames', () => {
    expect(replay.frames).toHaveLength(7259);
    expect(replay.frames[-123].frameNumber).toBe(-123);
    expect(replay.frames[7258].frameNumber).toBe(7258);
  });

  test('player inputs', () => {
    expect(replay.frames[200].players[1].pre[0]).toStrictEqual({
      actionStateId: 66,
      cStickX: 0,
      cStickY: 0,
      facingDirection: 1,
      frameNumber: 200,
      isFollower: false,
      joystickX: 0.949999988079071,
      joystickY: 0,
      percent: 0,
      physicalButtons: 256,
      physicalLTrigger: 0.014285714365541935,
      physicalRTrigger: 0,
      playerIndex: 1,
      processedButtons: 524544,
      trigger: 0,
      xPosition: -37.20393371582031,
      yPosition: 14.560099601745605,
    });
  });

  test('character state', () => {
    expect(replay.frames[200].players[1].post[0]).toStrictEqual({
      actionStateFrameCounter: 10,
      actionStateId: 66,
      attackBasedXSpeed: 0,
      attackBasedYSpeed: 0,
      currentComboCount: 1,
      facingDirection: 1,
      frameNumber: 200,
      hitlagRemaining: 0,
      hurtboxCollisionState: 0,
      internalCharacterId: 2,
      isFollower: false,
      isGrounded: false,
      jumpsRemaining: 1,
      lCancelStatus: 0,
      lastGroundId: 0,
      lastHitBy: 6,
      lastHittingAttackId: 14,
      percent: 0,
      playerIndex: 1,
      selfInducedAirXSpeed: 1.8077337741851807,
      selfInducedAirYSpeed: 0.21000003814697266,
      selfInducedGroundXSpeed: 0,
      shieldSize: 60,
      stocksRemaining: 4,
      xPosition: -35.39619827270508,
      yPosition: 14.770099639892578,
    });
  });

  // TODO: test Ice climbers have multiple pre/posts.

  test('item frame', () => {
    const frameNumber = 1752;
    expect(replay.frames[frameNumber].items[0]).toStrictEqual({
      damageTaken: 0,
      expirationTimer: 3,
      facingDirection: -1,
      frameNumber: frameNumber,
      owner: 2,
      peachTurnipFace: 68,
      samusMissileType: 40,
      spawnId: 0,
      state: 1,
      typeId: 56, // laser
      xPosition: 113.04617309570312,
      xVelocity: 0,
      yPosition: -14.260993003845215,
      yVelocity: 0,
    });
  });

  test('gameStart contents', () => {
    expect(replay.gameStart.replayFormatVersion).toBe('3.9.0.0');
    expect(replay.gameStart.stageId).toBe(32); // FD
    expect(replay.gameStart.isTeams).toBe(true);
    expect(replay.gameStart.playerSettings).toHaveLength(4);
    expect(replay.gameStart.playerSettings[1]).toStrictEqual({
      connectCode: 'CROU#224',
      controllerFix: 'UCF',
      costumeIndex: 4,
      cpuLevel: 1,
      defenseRatio: 1,
      displayName: 'crouchpotato',
      externalCharacterId: 0, // captain falcon
      handicap: 9,
      modelScale: 1,
      nametag: '',
      offenseRatio: 1,
      playerBitfield: 192,
      playerIndex: 1,
      playerType: 0,
      port: 2,
      startStocks: 4,
      teamId: 2,
      teamShade: 0,
    });
  });
});
