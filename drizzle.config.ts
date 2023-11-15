import { type Config } from "drizzle-kit";

export default {
  out: "./migrations",
  schema: "./src/server/schema.ts",
} satisfies Config;
