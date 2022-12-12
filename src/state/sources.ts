import { createComputed, createSignal, on } from "solid-js";
import { GameSettings } from "~/common/types";
import { createLibrary } from "~/state/library";

export type ReplayStub = GameSettings;

export const localLibrary = createLibrary<ReplayStub>();
export const cloudLibrary = createLibrary<ReplayStub>();

const [selected, setSelected] = createSignal<ReplayStub>();
createComputed(on(localLibrary.selectedItem, setSelected, { defer: true }));
createComputed(on(cloudLibrary.selectedItem, setSelected, { defer: true }));

export { selected };
