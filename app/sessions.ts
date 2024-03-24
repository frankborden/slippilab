import { createCookieSessionStorage } from "@remix-run/cloudflare";

type SessionData = {};

type SessionFlashData = {
  uploadedSlug: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: { name: "__session" },
  });

export { getSession, commitSession, destroySession };
