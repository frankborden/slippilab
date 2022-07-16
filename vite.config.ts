/// <reference types="vitest" />
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  assetsInclude: /.*zip$/,
  plugins: [solidPlugin(), viteTsconfigPaths()],
  test: {
    environment: "jsdom",
    transformMode: {
      web: [/.[jt]sx?/],
    },
    deps: {
      inline: [/solid-js/, /solid-testing-library/],
    },
  },
});
