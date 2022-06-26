import { Dialog, DialogContents, DialogTrigger } from "~/common/Dialog";
import { Links } from "~/common/Links";
import { SettingsTab } from "~/sidebar/SettingsTab";
import { Upload } from "~/sidebar/Upload";

export function TopBar() {
  return (
    <div class="flex items-center justify-between gap-20 bg-slate-200 px-5 py-3">
      <div class="flex gap-10">
        <h1 class="text-4xl">Slippi Lab</h1>
        <Upload />
      </div>
      <div class="flex items-center gap-4">
        <Links />
        <Dialog>
          <DialogTrigger class="h-6 w-6 cursor-pointer">
            <div class="material-icons w-6 text-3xl leading-6">settings</div>
          </DialogTrigger>
          <DialogContents>
            <SettingsTab />
          </DialogContents>
        </Dialog>
      </div>
    </div>
  );
}
