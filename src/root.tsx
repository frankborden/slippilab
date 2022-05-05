import { render } from "solid-js/web";
import { App } from "./App";
import { HopeProvider, HopeThemeConfig } from "@hope-ui/solid";

const config: HopeThemeConfig = {
  initialColorMode: "system",
};
render(
  () => (
    <HopeProvider config={config}>
      <App />
    </HopeProvider>
  ),
  document.querySelector("#root")!
);
