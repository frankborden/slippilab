import { useRouteData } from "@solidjs/router";

import Data from "~/client/pages/index.data";

export default function Index() {
  const query = useRouteData<typeof Data>();
  return (
    <div class="flex justify-center items-center">
      <div class="text-4xl font-medium">hi</div>
      <div class="i-mdi-account text-indigo-500 text-9xl" />
      <div>{query.data?.message}</div>
    </div>
  );
}
