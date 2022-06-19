import { createStore } from "solid-js/store";
import { GameSettings } from "~/common/types";
import {
  characterNameByExternalId,
  ExternalCharacterName,
  ExternalStageName,
  stageNameByExternalId,
} from "~/common/ids";
import { createEffect } from "solid-js";
import { groupBy, map, zip } from "rambda";
import { fileStore } from "~/state/fileStore";

export type Filter =
  | { type: "character"; label: ExternalCharacterName }
  | { type: "stage"; label: ExternalStageName }
  | { type: "codeOrName"; label: string };

export interface FilterStore {
  filters: Filter[];
  filteredFilesAndSettings: [File, GameSettings][];
  selectedFileAndSettings?: [File, GameSettings];
}
const [getStore, setStore] = createStore<FilterStore>({
  filters: [],
  filteredFilesAndSettings: [],
});
export const selectionStore = getStore;

export function setFilters(filters: Filter[]) {
  setStore("filters", filters);
}

export function select(fileAndSettings: [File, GameSettings]) {
  setStore("selectedFileAndSettings", fileAndSettings);
}

export function nextFile() {
  if (selectionStore.filteredFilesAndSettings.length === 0) {
    return;
  }
  if (selectionStore.selectedFileAndSettings === undefined) {
    setStore(
      "selectedFileAndSettings",
      selectionStore.filteredFilesAndSettings[0]
    );
  } else {
    const currentIndex = selectionStore.filteredFilesAndSettings.findIndex(
      ([file]) => file === selectionStore.selectedFileAndSettings![0]
    );
    const nextIndex = wrap(currentIndex + 1);
    setStore(
      "selectedFileAndSettings",
      selectionStore.filteredFilesAndSettings[nextIndex]
    );
  }
}

export function previousFile() {
  if (selectionStore.filteredFilesAndSettings.length === 0) {
    return;
  }
  if (selectionStore.selectedFileAndSettings === undefined) {
    setStore(
      "selectedFileAndSettings",
      selectionStore.filteredFilesAndSettings[0]
    );
  } else {
    const currentIndex = selectionStore.filteredFilesAndSettings.findIndex(
      ([file]) => file === selectionStore.selectedFileAndSettings![0]
    );
    const nextIndex = wrap(currentIndex - 1);
    setStore(
      "selectedFileAndSettings",
      selectionStore.filteredFilesAndSettings[nextIndex]
    );
  }
}

createEffect(() => {
  const filesWithSettings = zip(fileStore.files, fileStore.gameSettings) as [
    File,
    GameSettings
  ][];
  setStore(
    "filteredFilesAndSettings",
    applyFilters(filesWithSettings, selectionStore.filters)
  );
});

createEffect(() => {
  if (
    selectionStore.filteredFilesAndSettings.length > 0 &&
    selectionStore.selectedFileAndSettings === undefined
  ) {
    setStore(
      "selectedFileAndSettings",
      selectionStore.filteredFilesAndSettings[0]
    );
  }
});

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
  return filesWithSettings.filter(([file, gameSettings]) => {
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
}

function wrap(index: number): number {
  if (selectionStore.filteredFilesAndSettings.length === 0) {
    return 0;
  }
  return (
    (index + selectionStore.filteredFilesAndSettings.length) %
    selectionStore.filteredFilesAndSettings.length
  );
}
