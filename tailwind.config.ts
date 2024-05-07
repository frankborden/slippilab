import type { Config } from "tailwindcss";
import {iconsPlugin as icons, getIconCollections} from "@egoist/tailwindcss-icons";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "ui-sans-serif"],
      }
    },
  },
  plugins: [icons({collections: getIconCollections(["tabler"])}), require("tailwindcss-animate")],
} satisfies Config;
