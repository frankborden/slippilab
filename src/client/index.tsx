/* @refresh reload */
import "@fontsource-variable/inter";
import { RouteDefinition, Router, useRoutes } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { lazy } from "solid-js";
import { render } from "solid-js/web";

import Layout from "~/client/components/Layout";
import "~/client/index.css";
import HomeData from "~/client/pages/home.data";
import { WatchData } from "~/client/pages/watch.data";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/",
        component: lazy(() => import("./pages/home")),
        data: HomeData,
      },
      {
        path: "/browse",
        component: lazy(() => import("./pages/browse")),
      },
      {
        path: "/personal",
        component: lazy(() => import("./pages/personal")),
      },
      {
        path: "/watch/:id",
        component: lazy(() => import("./pages/watch")),
        data: WatchData,
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
