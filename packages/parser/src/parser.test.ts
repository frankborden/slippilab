import { parseReplay, Replay } from './parser';
import * as fs from 'fs';

// TODO: singles test, especially for matches with port 1 or 2 missing
// TODO: test ice climbers having nanaState.

describe('parser', () => {
  let replay: Replay;

  beforeAll(() => {
    replay = parseReplay(fs.readFileSync('doubles_test.slp'));
  });

  test('frames includes negative frames', () => {
    expect(replay.frames).toHaveLength(7259);
    expect(replay.frames[-123].frameNumber).toBe(-123);
    expect(replay.frames[7258].frameNumber).toBe(7258);
  });

  test('player inputs', () => {
    expect(replay.frames[200].players[1].inputs).toStrictEqual({
      frameNumber: 200,
      isNana: false,
      physical: {
        a: true,
        b: false,
        dPadDown: false,
        dPadLeft: false,
        dPadRight: false,
        dPadUp: false,
        lTriggerAnalog: 0.014285714365541935,
        lTriggerDigial: false,
        rTriggerAnalog: 0,
        rTriggerDigial: false,
        start: false,
        x: false,
        y: false,
        z: false,
      },
      playerIndex: 1,
      processed: {
        a: true,
        anyTrigger: 0,
        b: false,
        cStickX: 0,
        cStickY: 0,
        dPadDown: false,
        dPadLeft: false,
        dPadRight: false,
        dPadUp: false,
        joystickX: 0.949999988079071,
        joystickY: 0,
        lTriggerDigial: false,
        rTriggerDigial: false,
        start: false,
        x: false,
        y: false,
        z: false,
      },
    });
  });

  test('character state', () => {
    expect(replay.frames[200].players[1].state).toStrictEqual({
      actionStateFrameCounter: 10,
      actionStateId: 66,
      attackBasedXSpeed: 0,
      attackBasedYSpeed: 0,
      currentComboCount: 1,
      facingDirection: 1,
      frameNumber: 200,
      hitlagRemaining: 0,
      hurtboxCollisionState: 'vulnerable',
      internalCharacterId: 2,
      isNana: false,
      isGrounded: false,
      isDead: false,
      isFastfalling: false,
      isHittingShield: false,
      isInHitstun: false,
      isOffscreen: false,
      isPowershieldActive: false,
      isReflectActive: false,
      isShieldActive: false,
      jumpsRemaining: 1,
      lCancelStatus: undefined,
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
      chargeShotChargeLevel: 0,
      isChargeShotLaunched: false,
    });
  });

  test('game settings', () => {
    expect(replay.settings).toStrictEqual({
      bombRain: false,
      characterUiPlacesCount: 4,
      damageRatio: 1,
      friendlyFireOn: true,
      gameType: 'stock',
      isBreakTheTargetsOrTitleDemo: false,
      isClassicOrAdventureMode: false,
      isHomeRunContestOrEventMatch: false,
      isSingleButtonMode: false,
      isTeams: true,
      isPal: false,
      isFrozenStadium: false, // only set by nintendont
      itemSpawnRate: 'off',
      platform: 'dolphin',
      playerSettings: [
        {
          blackStockIcon: false,
          connectCode: 'ROWF#148',
          controllerFix: 'UCF',
          costumeIndex: 2,
          cpuLevel: 1,
          defenseRatio: 1,
          displayName: 'Ralph',
          externalCharacterId: 9,
          handicap: 9,
          internalCharacterIds: [18],
          invisible: false,
          lowGravity: false,
          metal: false,
          modelScale: 1,
          nametag: '',
          offenseRatio: 1,
          playerIndex: 0,
          playerType: 0,
          port: 1,
          rumbleEnabled: true,
          silentCharacter: false,
          staminaMode: false,
          startGameOnWarpPlatform: true,
          startStocks: 4,
          teamId: 2,
          teamShade: 0,
        },
        {
          blackStockIcon: false,
          connectCode: 'CROU#224',
          controllerFix: 'UCF',
          costumeIndex: 4,
          cpuLevel: 1,
          defenseRatio: 1,
          displayName: 'crouchpotato',
          externalCharacterId: 0,
          handicap: 9,
          internalCharacterIds: [2],
          invisible: false,
          lowGravity: false,
          metal: false,
          modelScale: 1,
          nametag: '',
          offenseRatio: 1,
          playerIndex: 1,
          playerType: 0,
          port: 2,
          rumbleEnabled: true,
          silentCharacter: false,
          staminaMode: false,
          startGameOnWarpPlatform: true,
          startStocks: 4,
          teamId: 2,
          teamShade: 0,
        },
        {
          blackStockIcon: false,
          connectCode: 'SAD#753',
          controllerFix: 'UCF',
          costumeIndex: 1,
          cpuLevel: 1,
          defenseRatio: 1,
          displayName: 'Sad＿Bread',
          externalCharacterId: 2,
          handicap: 9,
          internalCharacterIds: [1],
          invisible: false,
          lowGravity: false,
          metal: false,
          modelScale: 1,
          nametag: '',
          offenseRatio: 1,
          playerIndex: 2,
          playerType: 0,
          port: 3,
          rumbleEnabled: true,
          silentCharacter: false,
          staminaMode: false,
          startGameOnWarpPlatform: true,
          startStocks: 4,
          teamId: 0,
          teamShade: 0,
        },
        {
          blackStockIcon: false,
          connectCode: 'BERI#950',
          controllerFix: 'UCF',
          costumeIndex: 1,
          cpuLevel: 1,
          defenseRatio: 1,
          displayName: 'Berimbau',
          externalCharacterId: 9,
          handicap: 9,
          internalCharacterIds: [18],
          invisible: false,
          lowGravity: false,
          metal: false,
          modelScale: 1,
          nametag: '',
          offenseRatio: 1,
          playerIndex: 3,
          playerType: 0,
          port: 4,
          rumbleEnabled: true,
          silentCharacter: false,
          staminaMode: false,
          startGameOnWarpPlatform: true,
          startStocks: 4,
          teamId: 0,
          teamShade: 0,
        },
      ],
      replayFormatVersion: '3.9.0.0',
      selfDestructScoreValue: -1,
      stageId: 32,
      startTimestamp: '2021-06-12T10:24:18Z',
      timerCountsDuringPause: true,
      timerStart: 480,
      timerType: 'counting down',
    });
  });
});
