import { d1 } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import { hono } from "lucia/middleware";

export function initializeLucia(db: D1Database) {
  const auth = lucia({
    env: "DEV",
    adapter: d1(db, {
      user: "user",
      key: "user_key",
      session: "user_session",
    }),
    middleware: hono(),
  });
  return auth;
}

export type Auth = ReturnType<typeof initializeLucia>;
