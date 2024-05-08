import {
  getIconCollections,
  iconsPlugin as icons,
} from "@egoist/tailwindcss-icons";
import type { Config } from "tailwindcss";
import aria from "tailwindcss-react-aria-components";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "ui-sans-serif"],
      },
    },
  },
  plugins: [
    icons({ collections: getIconCollections(["tabler"]) }),
    aria(),
    require("tailwindcss-animate"),
  ],
} satisfies Config;
