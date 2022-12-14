import { WhiteButton } from "~/components/common/Button";
import { Dialog } from "~/components/common/Dialog";
import { KeyboardIcon } from "~/components/common/icons";

export function SettingsDialog() {
  return (
    <div class="h-8 w-8">
      <Dialog>
        <Dialog.Trigger>
          <button class="h-8 w-8">
            <KeyboardIcon title="Keybindings" />
          </button>
        </Dialog.Trigger>
        <Dialog.Title>
          <div class="text-lg">Playback Shortcuts</div>
        </Dialog.Title>
        <Dialog.Contents>
          <div class="my-5">
            <Settings />
          </div>
          <div class="flex w-full justify-end">
            <Dialog.Close>
              <WhiteButton>Close</WhiteButton>
            </Dialog.Close>
          </div>
        </Dialog.Contents>
      </Dialog>
    </div>
  );
}

function Settings() {
  return (
    <>
      <div class="flex flex-col items-center gap-2 overflow-y-auto">
        <table>
          <thead>
            <tr>
              <th>Shortcut</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  space
                </kbd>
                /
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  K
                </kbd>
              </td>
              <td class="pl-3">Toggle pause</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  F
                </kbd>
              </td>
              <td class="pl-3">Toggle fullscreen</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  LeftArrow
                </kbd>
                /
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  J
                </kbd>
              </td>
              <td class="pl-3">Rewind 2 seconds</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  RightArrow
                </kbd>
                /
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  L
                </kbd>
              </td>
              <td class="pl-3">Skip ahead 2 seconds</td>
            </tr>

            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  0
                </kbd>
                -
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  9
                </kbd>
              </td>
              <td class="pl-3">
                Jump to xx%. For example, press{" "}
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  3
                </kbd>{" "}
                for 30%
              </td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  .
                </kbd>
              </td>
              <td class="pl-3">Next frame (pauses if not paused)</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  ,
                </kbd>
              </td>
              <td class="pl-3">Previous frame (pauses if not paused)</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  UpArrow
                </kbd>
              </td>
              <td class="pl-3">Slow speed</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  DownArrow
                </kbd>
              </td>
              <td class="pl-3">Fast speed</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  +
                </kbd>
                /
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  =
                </kbd>
              </td>
              <td class="pl-3">Zoom in</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  -
                </kbd>
                /
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  _
                </kbd>
              </td>
              <td class="pl-3">Zoom out</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  [
                </kbd>
                /
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  {"{"}
                </kbd>
              </td>
              <td class="pl-3">Play previous file</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  ]
                </kbd>
                /
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  {"}"}
                </kbd>
              </td>
              <td class="pl-3">Play next file</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  ;
                </kbd>
                /
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  :
                </kbd>
              </td>
              <td class="pl-3">Play previous clip</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  '
                </kbd>
                /
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  "
                </kbd>
              </td>
              <td class="pl-3">Play next clip</td>
            </tr>
            <tr>
              <td>
                <kbd class="rounded border border-slate-400 bg-slate-50 px-1">
                  D
                </kbd>
              </td>
              <td class="pl-3">Toggle debug output (un-normalizes frame#)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
