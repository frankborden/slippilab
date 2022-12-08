import { createSignal } from "solid-js";

export type Sidebar = "replays" | "clips" | "inputs";

export const [currentSidebar, setSidebar] = createSignal<Sidebar>("replays");
