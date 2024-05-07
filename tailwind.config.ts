import {
  getIconCollections,
  iconsPlugin as icons,
} from "@egoist/tailwindcss-icons";
import type { Config } from "tailwindcss";

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
    require("tailwindcss-animate"),
  ],
} satisfies Config;
