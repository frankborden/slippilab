import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import wasmPlugin from "vite-plugin-wasm";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  assetsInclude: [/.*zip$/, /.*ttf$/],
  plugins: [solidPlugin(), wasmPlugin(), viteTsconfigPaths()],
  resolve: {
    conditions: ["browser"],
  },
  build: { target: "esnext" },
});
