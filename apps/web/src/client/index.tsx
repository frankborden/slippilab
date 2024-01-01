import "@fontsource-variable/inter";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "~/client/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: () => <div>Home</div>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router}></RouterProvider>,
);
