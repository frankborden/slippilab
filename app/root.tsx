import "@fontsource-variable/inter";
import { redirect } from "@remix-run/cloudflare";
import {
  ClientLoaderFunctionArgs,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { decode } from "@shelacek/ubjson";

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

export async function clientLoader({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  let file: File | undefined;
  if (slug?.startsWith("local-")) {
    file = useFileStore
      .getState()
      .stubs.find(([stub]) => stub.slug === slug)?.[1];
    if (!file) {
      url.searchParams.delete("slug");
      url.searchParams.delete("page");
      return redirect(url.toString());
    }
  } else if (slug) {
    file = ((await serverLoader()) as { file?: File }).file;
  }

  if (file) {
    const { metadata, raw } = decode(await file.arrayBuffer(), {
      useTypedArrays: true,
    });
    const replay = parseReplay(metadata, raw);
    useReplayStore.getState().loadReplay(replay);
  }
  return null;
}

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
