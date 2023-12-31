/* @refresh reload */
import "@fontsource-variable/inter";
import { RouteDefinition, Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { lazy } from "solid-js";
import { render } from "solid-js/web";

import "~/client/index.css";
import { BrowseData } from "~/client/pages/browse.data";
import Layout from "~/client/pages/layout";
import { LayoutData } from "~/client/pages/layout.data";
import { WatchServerData } from "~/client/pages/watchServer.data";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Layout,
    load: LayoutData,
    children: [
      {
        path: "/",
        component: lazy(() => import("./pages/home")),
      },
      {
        path: "/browse",
        component: lazy(() => import("./pages/browse")),
        load: BrowseData,
      },
      {
        path: "/personal",
        component: lazy(() => import("./pages/personal")),
      },
      {
        path: "/watch/local",
        component: lazy(() => import("./pages/watchLocal")),
      },
      {
        path: "/watch/:slug",
        component: lazy(() => import("./pages/watchServer")),
        load: WatchServerData,
      },
    ],
  },
];

render(
  () => (
    <QueryClientProvider client={new QueryClient()}>
      <Router>{routes}</Router>
    </QueryClientProvider>
  ),
  document.getElementById("root")!,
);
