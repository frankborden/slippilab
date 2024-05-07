import {
  cloudflareDevProxyVitePlugin as cloudflare,
  vitePlugin as remix,
} from "@remix-run/dev";
import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [cloudflare(), remix(), paths()],
});
