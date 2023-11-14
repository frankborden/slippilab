/* @refresh reload */
import "@fontsource-variable/inter";
import { Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { render } from "solid-js/web";

import FileRouter from "~/client/FileRoutes";
import Layout from "~/client/components/Layout";
import "~/client/index.css";

render(
  () => (
    <QueryClientProvider client={new QueryClient()}>
      <Router>
        <Layout>
          <FileRouter />
        </Layout>
      </Router>
    </QueryClientProvider>
  ),
  document.getElementById("root")!,
);
