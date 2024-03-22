import "@fontsource-variable/inter";
import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
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

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  if (!slug || slug.startsWith("local-")) {
    return null;
  }
  const { BUCKET } = context.cloudflare.env;
  const object = await BUCKET.get(slug);
  if (!object) {
    return redirect("/");
  }
  const buffer = await object.arrayBuffer();
  const file = new File([buffer], `${slug}.slp`);
  return { file };
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
      return redirect("/");
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
