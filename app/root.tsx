import "@fontsource-variable/inter";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/cloudflare";
import {
  ClientLoaderFunctionArgs,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { decode } from "@shelacek/ubjson";

import { ReplayData } from "~/common/types";
import { parseReplay } from "~/parser";
import { useFileStore } from "~/stores/fileStore";
import { useReplayStore } from "~/stores/replayStore";
import "~/tailwind.css";

export function meta() {
  return [
    { title: "Slippilab" },
    {
      name: "description",
      content: "Watch Slippi replays",
    },
  ];
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("watch");
  if (!slug || slug.startsWith("local-")) {
    return null;
  }
  const { BUCKET } = context.cloudflare.env;
  const object = await BUCKET.get(slug);
  if (!object) {
    return null;
  }
  const buffer = await object.arrayBuffer();
  const { metadata, raw } = decode(buffer, {
    useTypedArrays: true,
  });
  const replay = parseReplay(metadata, raw);
  return json({ replay });
}

export async function clientLoader({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("watch");
  const startFrame = Number(url.searchParams.get("start") || 0);
  if (!slug) {
    return null;
  }
  const store = useReplayStore.getState();
  if (slug.startsWith("local-")) {
    const file = useFileStore
      .getState()
      .stubs.find(([stub]) => stub.slug === slug)?.[1];
    if (file) {
      const { metadata, raw } = decode(await file.arrayBuffer(), {
        useTypedArrays: true,
      });
      const replay = parseReplay(metadata, raw);
      store.loadReplay(replay, startFrame);
      return null;
    }
  } else {
    const replay = ((await serverLoader()) as { replay?: ReplayData }).replay;
    if (replay) {
      store.loadReplay(replay, startFrame);
      return null;
    }
  }

  return redirect("/");
}
clientLoader.hydrate = true;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
