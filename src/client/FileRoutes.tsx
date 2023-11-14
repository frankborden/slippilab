import { RouteDefinition, useRoutes } from "@solidjs/router";
import { lazy } from "solid-js";

const routes: RouteDefinition[] = [];
const modules = import.meta.glob("./pages/**/*.tsx");
for (const path in modules) {
  if (path.endsWith(".data.tsx")) continue;
  routes.push({
    path: path
      .replace(/^\.\/pages\//, "")
      .replace(/\.tsx$/, "")
      .replace(/index$/, "")
      .replace(/\[\.\.\.([^\]]+)\]/g, "*$1")
      .replace(/\[([^\]]+)\]/g, ":$1"),
    component: lazy(modules[path] as any),
    data: ((await modules[path.replace(/tsx$/, "data.tsx")]?.()) as any)
      ?.default,
  });
}
export default useRoutes(routes);
