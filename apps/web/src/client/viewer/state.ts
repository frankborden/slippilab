import { create } from "zustand";

export type ViewerStore = {
  frame: number;
  renderDatas: any[];
  setFrame: (frame: number) => void;
  setRenderDatas: (renderDatas: any) => void;
};

export const useViewerStore = create<ViewerStore>((set) => ({
  frame: 0,
  renderDatas: [],
  setFrame(frame: number) {
    set({ frame });
  },
  setRenderDatas(renderDatas: any) {
    set({ renderDatas });
  },
}));
