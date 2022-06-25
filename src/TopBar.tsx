import { Dialog, DialogContents, DialogTrigger } from "~/common/Dialog";
import { Links } from "~/common/Links";
import { SettingsTab } from "~/sidebar/SettingsTab";

export function TopBar() {
  return (
    <div class="bg-slate-200 flex justify-between items-center px-5 py-3">
      <h1 class="text-2xl">Slippi Lab</h1>
      <div class="flex gap-4 items-center">
        <Links />
        <div>
        <Dialog>
          <DialogTrigger class="h-6 w-6 cursor-pointer">
            <div class="material-icons text-3xl leading-6 w-6">settings</div>
          </DialogTrigger>
          <DialogContents>
            <SettingsTab />
          </DialogContents>
        </Dialog></div>
      </div>
    </div>
  );
}
