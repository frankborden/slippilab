import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";
import { decode } from "@shelacek/ubjson";
import { InferInsertModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { generateSlug } from "random-word-slugs";

import { ReplayStub, ReplayType } from "~/common/types";
import { Controller } from "~/components/app/Controller";
import { Controls } from "~/components/app/Controls";
import { Highlights } from "~/components/app/Highlights";
import { ReplaySelect } from "~/components/app/Replays";
import { parseReplay } from "~/parser";
import * as schema from "~/schema";
import { Replay } from "~/viewer/Replay";

export async function action({ context, request }: ActionFunctionArgs) {
  const { DB, BUCKET } = context.cloudflare.env;
  const db = drizzle(DB, { schema });
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 20_000_000,
  });
  const form = await unstable_parseMultipartFormData(request, uploadHandler);

  const file = form.get("replay");
  if (!(file instanceof File)) {
    return new Response("No file found", { status: 400 });
  }
  const buffer = new Uint8Array(await file.arrayBuffer());
  const { raw, metadata } = decode(buffer, { useTypedArrays: true });
  const replay = parseReplay(metadata, raw);

  const id = crypto.randomUUID();
  const slug = generateSlug(3, { format: "camel" });
  const dbReplay: InferInsertModel<typeof schema.replays> = {
    id,
    slug,
    type: replay.type,
    stageId: replay.settings.stageId,
    startTimestamp: replay.settings.startTimestamp,
    matchId: replay.settings.matchId,
    gameNumber: replay.settings.gameNumber,
    tiebreakerNumber: replay.settings.tiebreakerNumber,
  };
  const dbPlayers: InferInsertModel<typeof schema.replayPlayers>[] =
    replay.settings.playerSettings.filter(Boolean).map((player) => ({
      replayId: id,
      playerIndex: player.playerIndex,
      connectCode: player.connectCode,
      displayName: player.displayName,
      nametag: player.nametag,
      teamId: player.teamId,
      externalCharacterId: player.externalCharacterId,
      costumeIndex: player.costumeIndex,
    }));

  await BUCKET.put(slug, buffer);
  await db.batch([
    db.insert(schema.replays).values(dbReplay),
    ...dbPlayers.map((dbPlayer) =>
      db.insert(schema.replayPlayers).values(dbPlayer),
    ),
  ]);

  return redirect(`/?watch=${slug}`);
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { DB } = context.cloudflare.env;
  const db = drizzle(DB, { schema });
  const rows = await db.query.replays.findMany({
    with: {
      replayPlayers: true,
    },
  });
  const stubs: ReplayStub[] = rows.map((row) => ({
    slug: row.slug,
    type: row.type as ReplayType,
    startTimestamp: row.startTimestamp,
    stageId: row.stageId,
    players: row.replayPlayers.map((player) => ({
      playerIndex: player.playerIndex,
      connectCode: player.connectCode ?? undefined,
      displayName: player.displayName ?? undefined,
      externalCharacterId: player.externalCharacterId,
      costumeIndex: player.costumeIndex,
    })),
  }));
  return { stubs };
}

export default function Page() {
  return (
    <div className="flex h-screen gap-8 overflow-y-auto p-4">
      <div className="flex shrink grow flex-col">
        <div className="mb-2">
          <ReplaySelect />
        </div>
        <Replay />
        <Controls />
        <div className="mx-auto grid w-full grid-cols-4 gap-4">
          <Controller playerIndex={0} />
          <Controller playerIndex={1} />
          <Controller playerIndex={2} />
          <Controller playerIndex={3} />
        </div>
      </div>
      <div className="w-[200px]">
        <Highlights />
      </div>
    </div>
  );
}
