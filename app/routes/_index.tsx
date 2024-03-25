import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { decode } from "@shelacek/ubjson";
import { InferInsertModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { generateSlug } from "random-word-slugs";
import { useState } from "react";

import { ReplayStub, ReplayType } from "~/common/types";
import { Controller } from "~/components/app/Controller";
import { Controls } from "~/components/app/Controls";
import { Highlights } from "~/components/app/Highlights";
import { ReplaySelect } from "~/components/app/Replays";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { parseReplay } from "~/parser";
import * as schema from "~/schema";
import { commitSession, getSession } from "~/sessions";
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

  const session = await getSession(request.headers.get("Cookie"));
  session.flash("uploadedSlug", slug);

  return redirect(`/?watch=${slug}`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ context, request }: LoaderFunctionArgs) {
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
  const session = await getSession(request.headers.get("Cookie"));
  const uploadedSlug = session.get("uploadedSlug");

  return json(
    { stubs, uploadedSlug },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
}

export default function Page() {
  const { uploadedSlug } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen gap-8 overflow-y-auto p-4">
      {uploadedSlug && <UploadDialog />}
      <div className="flex shrink grow flex-col">
        <div className="mb-2">
          <ReplaySelect />
        </div>
        <Replay />
        <Controls />
        <div className="grid grid-cols-4 gap-4">
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

function UploadDialog() {
  const { uploadedSlug } = useLoaderData<typeof loader>();
  const [copied, setCopied] = useState(false);

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload complete</AlertDialogTitle>
          <div className="flex flex-col py-4 text-foreground/90">
            <div>Your replay is publicly available at the following URL:</div>
            <div className="flex items-center gap-2 self-center py-2">
              <div>
                {globalThis.location?.origin}?watch={uploadedSlug}
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${globalThis.location?.origin}?watch=${uploadedSlug}`,
                  );
                  setCopied(true);
                }}
              >
                {copied ? (
                  <CheckIcon className="size-5" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
