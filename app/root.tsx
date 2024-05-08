import "@fontsource-variable/inter";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "@remix-run/react";
import { Button, Link, RouterProvider } from "react-aria-components";

import "~/styles.css";

export function meta() {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="overscroll-none">
        <RouterProvider navigate={navigate}>
          <header className="sticky top-0 z-10 border-b border-b-gray-300 bg-white py-3">
            <div className="container flex items-center justify-between">
              <div className="select-none text-xl font-medium tracking-tight">
                Slippi
                <span className="ml-1 rounded bg-blue-600 px-2 py-0.5 text-gray-100">
                  Lab
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="i-tabler-settings size-7 text-gray-600" />
                <div className="i-tabler-user-circle size-7 text-gray-600" />
              </div>
            </div>
          </header>
          <main className="container mt-8">{children}</main>
        </RouterProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
