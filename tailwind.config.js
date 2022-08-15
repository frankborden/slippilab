/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slippi: {
          50: "#BFE5CB",
          100: "#B1DFBF",
          200: "#94D4A7",
          300: "#77C890",
          400: "#59BC78",
          500: "#44A963",
          600: "#34814C",
          700: "#245934",
          800: "#14311D",
          900: "#040905",
        },
      },
      animation: {
        draw: "draw 2s ease-in-out forwards",
      },
      keyframes: {
        draw: {
          to: { "stroke-dashoffset": 0 },
        },
      },
    },
  },
  plugins: [],
};
