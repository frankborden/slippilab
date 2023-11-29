import pages from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import { defineConfig, loadEnv } from "vite";
import paths from "vite-tsconfig-paths";

const entry = "src/index.ts";
export default defineConfig(({ mode }) => {
  const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } =
    loadEnv(mode, process.cwd(), "");

  return {
    server: { port: 5174 },
    plugins: [
      paths(),
      pages({
        emptyOutDir: false,
        entry,
        external:
          process.env.NODE_ENV === "production" ? [] : ["random-word-slugs"],
      }),
      devServer({
        entry,
        cf: {
          bindings: {
            DISCORD_CLIENT_ID,
            DISCORD_CLIENT_SECRET,
            DISCORD_REDIRECT_URI,
          },
          d1Databases: ["DB"],
          d1Persist: ".wrangler/state/v3/d1",
          r2Buckets: ["BUCKET"],
          r2Persist: ".wrangler/state/v3/r2",
        },
      }),
    ],
  };
});
