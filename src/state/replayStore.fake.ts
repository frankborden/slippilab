import { createStore, SetStoreFunction } from "solid-js/store";
import { ReplayStoreState, ReplayStore } from "~/state/replayStore";

export function createFakeReplayStore(): [
  ReplayStore,
  SetStoreFunction<ReplayStoreState>
] {
  const fakeState = createStore<ReplayStoreState>({
    highlights: {},
    frame: 0,
    renderDatas: [],
    animations: Array(4).fill(undefined),
    fps: 60,
    framesPerTick: 1,
    running: false,
    zoom: 1,
    isDebug: false,
  });
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
