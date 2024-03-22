import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "app/schema.ts",
  out: "sql",
  driver: "d1",
  dbCredentials: {
    wranglerConfigPath: "./wrangler.toml",
    dbName: "DB",
  },
});
