import { Dialog, DialogContents, DialogTrigger } from "~/common/Dialog";
import { Links } from "~/common/Links";
import { NowPlaying } from "~/sidebar/NowPlaying";
import { Settings } from "~/sidebar/Settings";
import { Upload } from "~/sidebar/Upload";

export function TopBar() {
  return (
    <div class="flex items-center justify-between gap-20 border-b border-slate-500 bg-slippi-50 px-5 py-2">
      <div class="flex gap-10">
        <div class="flex items-center gap-2">
          <div class="-my-1 rounded-full border-2 border-slate-500 bg-white p-2">
            <img title="logo" class="h-8" src="logo-square.png" />
          </div>
          <div class="whitespace-nowrap font-['Comfortaa-Bold'] text-3xl tracking-tighter">
            Slippi Lab
          </div>
        </div>
        <Upload />
      </div>
      <div>
        <NowPlaying />
      </div>
      <div class="flex items-center gap-4">
        <Links />
        <Dialog>
          <DialogTrigger class="h-6 w-6 cursor-pointer">
            <div class="material-icons w-6 text-3xl leading-6">settings</div>
          </DialogTrigger>
          <DialogContents>
            <Settings />
          </DialogContents>
        </Dialog>
      </div>
    </div>
  );
}
