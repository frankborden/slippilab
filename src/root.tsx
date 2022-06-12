import { render } from "solid-js/web";
import { App } from "./App";
import {
  HopeProvider,
  HopeThemeConfig,
  NotificationsProvider,
} from "@hope-ui/solid";

const config: HopeThemeConfig = {
  initialColorMode: "light",
  lightTheme: {
    colors: {
      primary1: "#fbfefb",
      primary2: "#f3fcf3",
      primary3: "#ebf9eb",
      primary4: "#dff3df",
      primary5: "#ceebcf",
      primary6: "#b7dfba",
      primary7: "#97cf9c",
      primary8: "#65ba75",
      primary9: "#46a758",
      primary10: "#3d9a50",
      primary11: "#297c3b",
      primary12: "#1b311e",
    },
  },
  darkTheme: {
    colors: {
      primary1: "#0d1912",
      primary2: "#0f1e13",
      primary3: "#132819",
      primary4: "#16301d",
      primary5: "#193921",
      primary6: "#1d4427",
      primary7: "#245530",
      primary8: "#2f6e3b",
      primary9: "#46a758",
      primary10: "#55b467",
      primary11: "#63c174",
      primary12: "#e5fbeb",
    },
  },
};

const root = document.querySelector("#root");
if (root !== null) {
  render(
    () => (
      <HopeProvider config={config}>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </HopeProvider>
    ),
    root
  );
}
