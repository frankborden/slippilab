import "@fontsource-variable/inter";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "~/client/index.css";
import { Root } from "~/client/pages/Root";
import Index from "~/client/pages/index";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        path: "/",
        Component: Index,
      },
      {
        path: "/about",
        Component: () => <div>about</div>,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router}></RouterProvider>,
);
