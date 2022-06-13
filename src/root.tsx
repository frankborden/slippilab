import { render } from "solid-js/web";
import { App } from "./App";
import {
  HopeProvider,
  NotificationsProvider,
} from "@hope-ui/solid";

const root = document.querySelector("#root");
if (root !== null) {
  render(
    () => (
      <HopeProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </HopeProvider>
    ),
    root
  );
}
