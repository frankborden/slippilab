import * as menu from "@zag-js/menu";
import { normalizeProps, useMachine } from "@zag-js/solid";
import { createMemo, createUniqueId, Show } from "solid-js";
import { loadFromSupabase } from "~/stateUtil";
import { PrimaryButton } from "~/common/Button";
import { filterFiles } from "~/common/util";
import { load } from "~/state/fileStore";
import { Portal } from "solid-js/web";

export function OpenMenu(props: { name: string }) {
  const [menuState, menuSend] = useMachine(
    menu.machine({
      id: createUniqueId(),
      "aria-label": "Open Replays",
      onSelect: (value) => {
        switch (value) {
          case "file":
            fileInput.click();
            break;
          case "folder":
            folderInput.click();
            break;
          case "demo":
            loadFromSupabase("sample", load);
            break;
        }
      },
    })
  );
  const api = createMemo(() =>
    menu.connect(menuState, menuSend, normalizeProps)
  );

  let fileInput!: HTMLInputElement;
  let folderInput!: HTMLInputElement;

  async function onFileSelected(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;

    if (input.files === null || input.files.length === 0) {
      return;
    }
    const files = Array.from(input.files);
    const filteredFiles = await filterFiles(files);
    return await load(filteredFiles);
  }

  return (
    <>
      <div>
        <PrimaryButton {...api().triggerProps} class="flex items-center gap-2">
          <Show when={props.name !== ""}>
            <div class="hidden md:block">{props.name}</div>
          </Show>
          <div class="material-icons" aria-label="Open File or Folder">
            folder_open
          </div>
        </PrimaryButton>
        <Portal>
          <div {...api().positionerProps} class="bg-white opacity-100">
            <ul {...api().contentProps} class="border border-slate-300">
              <li
                {...api().getItemProps({ id: "file" })}
                class="w-full cursor-pointer py-2 px-4 hover:bg-slate-200"
              >
                Open File(s)
              </li>
              <li
                {...api().getItemProps({ id: "folder" })}
                class="w-full cursor-pointer py-2 px-4 hover:bg-slate-200"
              >
                Open Folder
              </li>
              <li
                {...api().getItemProps({ id: "demo" })}
                class="w-full cursor-pointer py-2 px-4 hover:bg-slate-200"
              >
                Load Demo
              </li>
            </ul>
          </div>
        </Portal>
      </div>
      <input
        class="hidden"
        type="file"
        accept=".slp,.zip"
        multiple
        ref={fileInput}
        onChange={onFileSelected}
      />
      <input
        class="hidden"
        type="file"
        // @ts-expect-error folder input is not standard, but is supported by all
        // modern browsers
        webkitDirectory
        ref={folderInput}
        onChange={onFileSelected}
      />
    </>
  );
}
