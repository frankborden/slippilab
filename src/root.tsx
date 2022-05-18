import { render } from "solid-js/web";
import { App } from "./App";
import {
  HopeProvider,
  HopeThemeConfig,
  NotificationsProvider,
} from "@hope-ui/solid";

const config: HopeThemeConfig = {
  initialColorMode: "system",
};
render(
  () => (
    <HopeProvider config={config}>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </HopeProvider>
  ),
  document.querySelector("#root")!
);
