import { createStore, SetStoreFunction } from "solid-js/store";
import { ReplayData } from "~/common/types";
import { parseReplay } from "~/parser/parser";
import {
  ReplayStoreState,
  ReplayStore,
  defaultReplayStoreState,
  RenderData,
} from "~/state/replayStore";
import { fox } from "~/viewer/characters/fox";
import { readFileSync } from "fs";

export function createFakeReplayStore(): [
  ReplayStore,
  SetStoreFunction<ReplayStoreState>
] {
  const fakeState = createStore<ReplayStoreState>(defaultReplayStoreState);
  const fakeActions = {
    selectHighlight: () => {},
    nextHighlight: () => {},
    previousHighlight: () => {},
    speedNormal: () => {},
    speedFast: () => {},
    speedSlow: () => {},
    zoomIn: () => {},
    zoomOut: () => {},
    toggleDebug: () => {},
    togglePause: () => {},
    pause: () => {},
    jump: () => {},
    jumpPercent: () => {},
    adjust: () => {},
  };
  return [[fakeState[0], fakeActions], fakeState[1]];
}

export const sampleReplay = parseReplay(readFileSync("sample.slp"));

// state, inputs, and settings are correct, rest is made up.
export function createFakeRenderData(
  frame: number,
  playerIndex: number,
  replayData: ReplayData
): RenderData {
  return {
    playerState: replayData.frames[frame].players[playerIndex].state,
    playerInputs: replayData.frames[frame].players[playerIndex].inputs,
    playerSettings: replayData.settings.playerSettings[playerIndex],
    innerColor: "red",
    outerColor: "black",
    transforms: [],
    animationName: "Wait",
    characterData: fox,
  };
}
