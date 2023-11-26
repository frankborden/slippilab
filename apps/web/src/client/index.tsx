/* @refresh reload */
import "@fontsource-variable/inter";
import { RouteDefinition, Router, useRoutes } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { lazy } from "solid-js";
import { render } from "solid-js/web";

import Layout from "~/client/components/Layout";
import "~/client/index.css";
import BrowseData from "~/client/pages/browse.data";
import { WatchLocalData } from "~/client/pages/watchLocal.data";
import { WatchServerData } from "~/client/pages/watchServer.data";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/",
        component: lazy(() => import("./pages/home")),
      },
      {
        path: "/browse",
        component: lazy(() => import("./pages/browse")),
        data: BrowseData,
      },
      {
        path: "/personal",
        component: lazy(() => import("./pages/personal")),
      },
      {
        path: "/watch/local",
        component: lazy(() => import("./pages/watchLocal")),
        data: WatchLocalData,
      },
      {
        path: "/watch/:slug",
        component: lazy(() => import("./pages/watchServer")),
        data: WatchServerData,
      },
    ],
  },
];
const Routes = useRoutes(routes);

render(
  () => (
    <QueryClientProvider client={new QueryClient()}>
      <Router>
        <Routes />
      </Router>
    </QueryClientProvider>
  ),
  document.getElementById("root")!,
);
