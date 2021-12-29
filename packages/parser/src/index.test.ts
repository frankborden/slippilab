import { Game } from './index';
import * as fs from 'fs';

describe('parser', () => {
  let replay: Game;

  beforeAll(() => {
    replay = new Game(fs.readFileSync('doubles_test.slp'));
  });

  test('gameStart', () => {
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
      externalCharacterId: 0,
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
