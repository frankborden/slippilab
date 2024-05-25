import "@fontsource-variable/inter";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Button } from "react-aria-components";

import { useFileStore } from "~/stores/fileStore";
import "~/styles.css";

export function meta() {
  return [
    { title: "Slippilab" },
    {
      name: "description",
      content: "Watch, analyze, and share Slippi replays",
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const loadProgress = useFileStore((state) => state.loadProgress);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="sticky top-0 z-10 border-b border-gray-300 bg-white py-1.5">
          <div className="container flex items-center justify-between">
            <div className="text-xl font-medium tracking-tight">
              Slippi
              <span className="ml-1 rounded bg-emerald-600 px-2 py-0.5 text-emerald-50">
                Lab
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button className="flex rounded p-0.5 hover:bg-gray-100">
                <div className="i-tabler-settings size-7 text-gray-600 hover:text-black" />
              </Button>
              <Button className="flex rounded p-0.5 hover:bg-gray-100">
                <div className="i-tabler-user-circle size-7 text-gray-600 hover:text-black" />
              </Button>
            </div>
          </div>
        </header>
        {loadProgress !== undefined && (
          <div
            className="absolute h-1 w-screen bg-emerald-600"
            style={{
              transform: `translateX(${-100 + loadProgress}%)`,
            }}
          />
        )}
        <main className="container pt-6">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
