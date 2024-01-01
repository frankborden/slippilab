import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons";
import type { Config } from "tailwindcss";

export default {
  darkMode: "media",
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    fontFamily: {
      sans: ["Inter Variable", "sans-serif"],
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["game-icons", "tabler"]),
    }),
  ],
} satisfies Config;
