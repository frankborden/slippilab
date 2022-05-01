import { render } from "solid-js/web";
import { App } from "./App";
import { HopeProvider } from "@hope-ui/solid";

render(
  () => (
    <HopeProvider>
      <App />
    </HopeProvider>
  ),
  document.querySelector("#root")!
);
