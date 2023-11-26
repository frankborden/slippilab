import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";

const entry = "src/index.ts";
export default defineConfig({
  server: { port: 5174 },
  plugins: [
    paths(),
    pages({ emptyOutDir: false, entry }),
    devServer({
      entry,
      cf: {
        d1Databases: ["DB"],
        d1Persist: ".wrangler/state/v3/d1",
        r2Buckets: ["BUCKET"],
        r2Persist: ".wrangler/state/v3/r2",
      },
    }),
  ],
});
