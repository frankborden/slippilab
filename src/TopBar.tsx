import { Links } from "~/common/Links";

export function TopBar() {
  return (
    <div class="bg-slate-200 flex justify-between px-5 py-3">
      <h1 class="text-2xl">Slippi Lab</h1>
      <Links />
    </div>
  );
}
