import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons";
import { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "ui-sans-serif"],
      },
    },
  },
  plugins: [iconsPlugin({ collections: getIconCollections(["tabler"]) })],
} satisfies Config;
