import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [paths(), react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5174",
    },
  },
});
