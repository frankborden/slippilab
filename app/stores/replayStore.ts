import { create } from "zustand";

import { ReplayData } from "~/common/types";
import { queries } from "~/search/queries";
import { Highlight, search } from "~/search/search";

interface ReplayStore {
  replay?: ReplayData;
  highlights: Record<string, Highlight[]>;

  loadReplay: (replay: ReplayData) => void;
}

export const useReplayStore = create<ReplayStore>((set) => ({
  highlights: Object.fromEntries(
    Object.keys(queries).map((name) => [name, []]),
  ),

  loadReplay: (replay) => {
    return set({
      replay,
      highlights: Object.fromEntries(
        Object.entries(queries).map(([name, query]) => [
          name,
          search(replay, ...query),
        ]),
      ),
    });
  },
}));
