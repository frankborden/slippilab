import * as menu from "@zag-js/menu";
import { normalizeProps, useMachine, useSetup } from "@zag-js/solid";
import { createMemo } from "solid-js";
import { load } from "../state";
import { loadFromSupabase } from "../stateUtil";
import { Button } from "./Button";
import { filterFiles } from "./util";

export function OpenMenu(props: { name: string }) {
  const [menuState, menuSend] = useMachine(
    menu.machine({ "aria-label": "Open Replays" })
  );
  const menuRef = useSetup({ send: menuSend, id: "1" });
  const menuApi = createMemo(() =>
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
      <div ref={menuRef}>
        {/* @ts-ignore */}
        <Button
          {...menuApi().triggerProps}
          class="text-md flex items-center gap-2"
        >
          {props.name}
          <div class="material-icons" aria-label="Open File or Folder">
            folder_open
          </div>
        </Button>
        {/* @ts-ignore */}
        <div {...menuApi().positionerProps} class="z-10 bg-white opacity-100">
          {/* @ts-ignore */}
          <ul
            {...menuApi().contentProps}
            class="flex flex-col border border-slate-300"
            onClick={(e) => {
              switch (e.target.id) {
                case "file":
                  fileInput.click();
                  break;
                case "folder":
                  folderInput.click();
                  break;
                case "demo":
                  loadFromSupabase("sample");
                  break;
              }
            }}
          >
            {/* @ts-ignore */}
            <li
              {...menuApi().getItemProps({ id: "file" })}
              class="w-full cursor-pointer py-2 px-4 hover:bg-slate-200"
            >
              Open File(s)
            </li>
            {/* @ts-ignore */}
            <li
              {...menuApi().getItemProps({ id: "folder" })}
              class="w-full cursor-pointer py-2 px-4 hover:bg-slate-200"
            >
              Open Folder
            </li>
            {/* @ts-ignore */}
            <li
              {...menuApi().getItemProps({ id: "demo" })}
              class="w-full cursor-pointer py-2 px-4 hover:bg-slate-200"
            >
              Load Demo
            </li>
          </ul>
        </div>
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
