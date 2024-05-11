import { create } from "zustand";

import { RenderData, ReplayData } from "~/common/types";
import { queries } from "~/search/queries";
import { Highlight, search } from "~/search/search";
import { renderCamera, renderReplay } from "~/viewer/render";

interface ReplayStore {
  replay?: ReplayData;
  highlights: Record<string, Highlight[]>;
  openedTimestamp: number;
  frame: number;
  renderData?: RenderData[][];
  cameraPositions?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }[];
  paused: boolean;
  speed: number;

  loadReplay: (replay: ReplayData, startFrame?: number) => void;
  setFrame: (frame: number) => void;
  setPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
}

export const useReplayStore = create<ReplayStore>((set) => ({
  replay: undefined,
  highlights: Object.fromEntries(
    Object.keys(queries).map((name) => [name, []]),
  ),
  frame: 0,
  renderData: undefined,
  cameraPositions: undefined,
  openedTimestamp: 0,
  paused: false,
  speed: 1,

  loadReplay: (replay, startFrame) => {
    const renderData = renderReplay(replay);
    const cameraPositions = renderCamera(renderData);
    const highlights = Object.fromEntries(
      Object.entries(queries).map(([name, query]) => [
        name,
        search(replay, ...query),
      ]),
    );
    return set({
      replay,
      renderData,
      cameraPositions,
      openedTimestamp: Date.now(),
      frame: startFrame || 0,
      paused: false,
      speed: 1,
      highlights,
    });
  },
  setFrame: (frame) => set({ frame }),
  setPaused: (paused) => set({ paused }),
  setSpeed: (speed) => set({ speed }),
}));
