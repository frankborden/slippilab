import { createStore } from "solid-js/store";
import { GameSettings } from "~/common/types";
import {
  characterNameByExternalId,
  ExternalCharacterName,
  ExternalStageName,
  stageNameByExternalId,
} from "~/common/ids";
import { Context, createContext, createEffect, on } from "solid-js";
import { groupBy, map, zip } from "rambda";
import { FileStoreState } from "~/state/fileStore";

export type Filter =
  | { type: "character"; label: ExternalCharacterName }
  | { type: "stage"; label: ExternalStageName }
  | { type: "codeOrName"; label: string };

export interface SelectionStoreState {
  filters: Filter[];
  filteredFilesAndSettings: [File, GameSettings][];
  selectedFileAndSettings?: [File, GameSettings];
}

export type SelectionStore = ReturnType<typeof createSelectionStore>;
export const SelectionStoreContext =
  createContext<SelectionStore>() as Context<SelectionStore>;

export function createSelectionStore(fileStoreState: FileStoreState) {
  const [selectionState, setSelectionState] = createStore<SelectionStoreState>({
    filters: [],
    filteredFilesAndSettings: [],
  });

  function setFilters(filters: Filter[]) {
    setSelectionState("filters", filters);
  }

  function select(fileAndSettings: [File, GameSettings]) {
    setSelectionState("selectedFileAndSettings", fileAndSettings);
  }

  function nextFile() {
    if (selectionState.filteredFilesAndSettings.length === 0) {
      return;
    }
    if (selectionState.selectedFileAndSettings === undefined) {
      setSelectionState(
        "selectedFileAndSettings",
        selectionState.filteredFilesAndSettings[0]
      );
    } else {
      const currentIndex = selectionState.filteredFilesAndSettings.findIndex(
        ([file]) => file === selectionState.selectedFileAndSettings![0]
      );
      const nextIndex = wrap(
        currentIndex + 1,
        selectionState.filteredFilesAndSettings.length
      );
      setSelectionState(
        "selectedFileAndSettings",
        selectionState.filteredFilesAndSettings[nextIndex]
      );
    }
  }

  function previousFile() {
    if (selectionState.filteredFilesAndSettings.length === 0) {
      return;
    }
    if (selectionState.selectedFileAndSettings === undefined) {
      setSelectionState(
        "selectedFileAndSettings",
        selectionState.filteredFilesAndSettings[0]
      );
    } else {
      const currentIndex = selectionState.filteredFilesAndSettings.findIndex(
        ([file]) => file === selectionState.selectedFileAndSettings![0]
      );
      const nextIndex = wrap(
        currentIndex - 1,
        selectionState.filteredFilesAndSettings.length
      );
      setSelectionState(
        "selectedFileAndSettings",
        selectionState.filteredFilesAndSettings[nextIndex]
      );
    }
  }

  createEffect(
    on(
      () => fileStoreState.files,
      () => {
        setSelectionState({ selectedFileAndSettings: undefined });
      }
    )
  );

  // Update filter results if files, gameSettings, or filters change
  createEffect(() => {
    const filesWithSettings = zip(
      fileStoreState.files,
      fileStoreState.gameSettings
    ) as [File, GameSettings][];
    setSelectionState(
      "filteredFilesAndSettings",
      applyFilters(filesWithSettings, selectionState.filters)
    );
  });

  // ???
  createEffect(() => {
    if (
      selectionState.filteredFilesAndSettings.length > 0 &&
      selectionState.selectedFileAndSettings === undefined
    ) {
      setSelectionState(
        "selectedFileAndSettings",
        selectionState.filteredFilesAndSettings[0]
      );
    }
  });

  return [
    selectionState,
    { setFilters, select, nextFile, previousFile },
  ] as const;
}

function applyFilters(
  filesWithSettings: [File, GameSettings][],
  filters: Filter[]
): [File, GameSettings][] {
  const charactersNeeded = map(
    (filters: Filter[]) => filters.length,
    groupBy(
      (filter) => filter.label,
      filters.filter((filter) => filter.type === "character")
    )
  );
  const stagesAllowed = filters
    .filter((filter) => filter.type === "stage")
    .map((filter) => filter.label);
  const namesNeeded = filters
    .filter((filter) => filter.type === "codeOrName")
    .map((filter) => filter.label);
  const filtered = filesWithSettings.filter(([file, gameSettings]) => {
    const areCharactersSatisfied = Object.entries(charactersNeeded).every(
      ([character, amountRequired]) =>
        gameSettings.playerSettings.filter(
          (p) => character === characterNameByExternalId[p.externalCharacterId]
        ).length === amountRequired
    );
    const stagePass =
      stagesAllowed.length === 0 ||
      stagesAllowed.includes(stageNameByExternalId[gameSettings.stageId]);
    const areNamesSatisfied = namesNeeded.every((name) =>
      gameSettings.playerSettings.some((p) =>
        [
          p.connectCode?.toLowerCase(),
          p.displayName?.toLowerCase(),
          p.nametag?.toLowerCase(),
        ].includes(name.toLowerCase())
      )
    );
    return stagePass && areCharactersSatisfied && areNamesSatisfied;
  });
  let filenames = [''];
  filtered.forEach((element) => {
    filenames.push(element[0]['name']);
  });
  console.log(filenames);
  return filtered;
}

function wrap(index: number, limit: number): number {
  if (limit === 0) {
    return 0;
  }
  return (index + limit) % limit;
}
