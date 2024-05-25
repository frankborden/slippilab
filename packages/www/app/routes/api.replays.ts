import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "~/schema";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const { DB } = context.cloudflare.env;
  const db = drizzle(DB, { schema });
  const url = new URL(request.url);
  const since = url.searchParams.get("since");
  if (!since) {
    throw new Response("Not Found", { status: 404 });
  }

  const results = await db.query.replays.findMany({
    where: lt(schema.replays.uploadTimestamp, since),
  });
  return json({ results });
}
