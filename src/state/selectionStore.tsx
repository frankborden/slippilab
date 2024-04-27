import { createStore } from "solid-js/store";
import {
  characterNameByExternalId,
  ExternalCharacterName,
  ExternalStageName,
  stageNameByExternalId,
} from "~/common/ids";
import { createComputed, createEffect, createSignal, on } from "solid-js";
import { fileStore } from "~/state/fileStore";
import { listCloudReplays, loadFromCloud } from "~/cloudClient";

export type Filter =
  | { type: "character"; label: ExternalCharacterName }
  | { type: "stage"; label: ExternalStageName }
  | { type: "codeOrName"; label: string };

export interface SelectionState {
  filters: Filter[];
  filteredStubs: ReplayStub[];
  selectedFileAndStub?: [File, ReplayStub];
}

export interface ReplayStub {
  fileName: string;
  playedOn: string;
  numFrames: number;
  stageId: number;
  isTeams: boolean;
  playerSettings: {
    playerIndex: number;
    connectCode: string;
    displayName: string;
    nametag: string;
    externalCharacterId: number;
    teamId: number;
  }[];
}

export interface StubStore {
  stubs: () => ReplayStub[];
  getFile: (stub: ReplayStub) => Promise<File>;
}

export type SelectionStore = ReturnType<typeof createSelectionStore>;

function createSelectionStore(stubStore: StubStore) {
  const [selectionState, setSelectionState] = createStore<SelectionState>({
    filters: [],
    filteredStubs: [],
  });

  function setFilters(filters: Filter[]) {
    setSelectionState("filters", filters);
  }

  async function select(stub: ReplayStub) {
    const file = await stubStore.getFile(stub);
    setSelectionState("selectedFileAndStub", [file, stub]);
  }

  async function nextFile() {
    if (selectionState.filteredStubs.length === 0) {
      return;
    }
    if (selectionState.selectedFileAndStub === undefined) {
      const file = await stubStore.getFile(selectionState.filteredStubs[0]);
      setSelectionState("selectedFileAndStub", [
        file,
        selectionState.filteredStubs[0],
      ]);
    } else {
      const currentIndex = selectionState.filteredStubs.findIndex(
        (stub) => stub === selectionState.selectedFileAndStub![1]
      );
      const nextIndex = wrap(
        currentIndex + 1,
        selectionState.filteredStubs.length
      );
      const file = await stubStore.getFile(
        selectionState.filteredStubs[nextIndex]
      );
      setSelectionState("selectedFileAndStub", [
        file,
        selectionState.filteredStubs[nextIndex],
      ]);
    }
  }

  async function previousFile() {
    if (selectionState.filteredStubs.length === 0) {
      return;
    }
    if (selectionState.selectedFileAndStub === undefined) {
      const file = await stubStore.getFile(selectionState.filteredStubs[0]);
      setSelectionState("selectedFileAndStub", [
        file,
        selectionState.filteredStubs[0],
      ]);
    } else {
      const currentIndex = selectionState.filteredStubs.findIndex(
        (stub) => stub === selectionState.selectedFileAndStub![1]
      );
      const nextIndex = wrap(
        currentIndex - 1,
        selectionState.filteredStubs.length
      );
      const file = await stubStore.getFile(
        selectionState.filteredStubs[nextIndex]
      );
      setSelectionState("selectedFileAndStub", [
        file,
        selectionState.filteredStubs[nextIndex],
      ]);
    }
  }

  createEffect(
    on(
      () => stubStore.stubs(),
      () => {
        setSelectionState({ selectedFileAndStub: undefined });
      }
    )
  );

  // Update filter results if stubs or filters change
  createEffect(() => {
    setSelectionState(
      "filteredStubs",
      applyFilters(stubStore.stubs(), selectionState.filters)
    );
  });

  // Select first one by default. If url is set that will be handled elsewhere.
  createEffect(async () => {
    if (
      selectionState.filteredStubs.length > 0 &&
      selectionState.selectedFileAndStub === undefined &&
      location.pathname.slice(1) === ""
    ) {
      const file = await stubStore.getFile(selectionState.filteredStubs[0]);
      setSelectionState("selectedFileAndStub", [
        file,
        selectionState.filteredStubs[0],
      ]);
    }
  });

  return { data: selectionState, previousFile, setFilters, select, nextFile };
}

function applyFilters(
  filesWithSettings: ReplayStub[],
  filters: Filter[]
): ReplayStub[] {
  const charactersNeeded: Record<string, number> = {};
  filters
    .filter(
      (filter): filter is Filter & { type: "character" } =>
        filter.type === "character"
    )
    .forEach(
      (filter) =>
        (charactersNeeded[filter.label] =
          (charactersNeeded[filter.label] ?? 0) + 1)
    );
  const stagesAllowed = filters
    .filter((filter) => filter.type === "stage")
    .map((filter) => filter.label);
  const namesNeeded = filters
    .filter((filter) => filter.type === "codeOrName")
    .map((filter) => filter.label);
  return filesWithSettings.filter((stub) => {
    const areCharactersSatisfied = Object.entries(charactersNeeded).every(
      ([character, amountRequired]) =>
        stub.playerSettings.filter(
          (p) => character === characterNameByExternalId[p.externalCharacterId]
        ).length >= amountRequired
    );
    const stagePass =
      stagesAllowed.length === 0 ||
      stagesAllowed.includes(stageNameByExternalId[stub.stageId]);
    const areNamesSatisfied = namesNeeded.every((name) =>
      stub.playerSettings.some((p) =>
        [
          p.connectCode?.toLowerCase(),
          p.displayName?.toLowerCase(),
          p.nametag?.toLowerCase(),
        ].includes(name.toLowerCase())
      )
    );
    return stagePass && areCharactersSatisfied && areNamesSatisfied;
  });
}

function wrap(index: number, limit: number): number {
  if (limit === 0) {
    return 0;
  }
  return (index + limit) % limit;
}

const [cloudStubs, setCloudStubs] = createSignal<ReplayStub[]>([]);
export const cloudLibrary = createSelectionStore({
  stubs: cloudStubs,
  getFile(stub) {
    return loadFromCloud(stub.fileName.toString());
  },
});

listCloudReplays().then((rows) => {
  setCloudStubs(rows);
  const path = location.pathname.slice(1);
  if (path !== "") {
    const stub = cloudStubs().find((s) => s.fileName === `${path}.slp`);
    if (stub !== undefined) {
      cloudLibrary.select(stub);
    }
  }
});

export const localLibrary = createSelectionStore({
  stubs: () => fileStore.stubs,
  async getFile(stub) {
    return fileStore.files[fileStore.stubs.indexOf(stub)];
  },
});

export const [currentSelectionStore, setCurrentSelectionStore] =
  createSignal<SelectionStore>(cloudLibrary);
createComputed(
  on(
    () => cloudLibrary.data.selectedFileAndStub,
    () => setCurrentSelectionStore(cloudLibrary)
  )
);
createComputed(
  on(
    () => localLibrary.data.selectedFileAndStub,
    () => setCurrentSelectionStore(localLibrary)
  )
);
