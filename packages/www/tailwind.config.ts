import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons";
import { Config } from "tailwindcss";
import aria from "tailwindcss-react-aria-components";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
      fontFamily: {
        sans: ["Inter Variable", "ui-sans-serif"],
      },
    },
  },
  plugins: [
    aria(),
    iconsPlugin({ collections: getIconCollections(["tabler"]) }),
  ],
} satisfies Config;
