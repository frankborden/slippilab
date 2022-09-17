import { createMemo, createUniqueId, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { useMachine, normalizeProps } from "@zag-js/solid";
import * as dialog from "@zag-js/dialog";
import { WhiteButton } from "~/common/Button";

export function SettingsDialog() {
  const [state, send] = useMachine(dialog.machine({ id: createUniqueId() }));
  const api = createMemo(() => dialog.connect(state, send, normalizeProps));
  return (
    <>
      <button
        {...api().triggerProps}
        class="material-icons h-6 w-6 cursor-pointer text-3xl leading-6"
      >
        settings
      </button>
      <Show when={api().isOpen}>
        <Portal>
          <div
            {...api().backdropProps}
            class="fixed inset-0 backdrop-blur-md backdrop-brightness-90"
          />
          <div
            {...api().underlayProps}
            class="fixed inset-0 flex h-screen w-screen items-center justify-center"
          >
            <div
              {...api().contentProps}
              class="w-full max-w-xl rounded-md border bg-white p-8"
              // don't trigger replay shortcuts here.
              onkeydown={(e: Event) => e.stopPropagation()}
              onkeyup={(e: Event) => e.stopPropagation()}
            >
              <h2 {...api().titleProps} class="text-lg">
                Playback Shortcuts
              </h2>
              <div {...api().descriptionProps} class="my-5">
                <Settings />
              </div>
              <div class="flex w-full justify-end">
                <WhiteButton {...api().closeButtonProps}>Close</WhiteButton>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </>
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
                  C
                </kbd>
              </td>
              <td class="pl-3">Toggle input display</td>
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
                  d
                </kbd>
              </td>
              <td class="pl-3">Toggle debug output</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}