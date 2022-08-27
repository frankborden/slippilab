import * as menu from "@zag-js/menu";
import { normalizeProps, useMachine, useSetup, PropTypes } from "@zag-js/solid";
import { createMemo, useContext } from "solid-js";
import { loadFromSupabase } from "~/stateUtil";
import { PrimaryButton } from "~/common/Button";
import { filterFiles } from "~/common/util";
import { FileStoreContext } from "~/state/fileStore";

export function OpenMenu(props: { name: string }) {
  const [_, { load }] = useContext(FileStoreContext);
  const [menuState, menuSend] = useMachine(
    menu.machine({ "aria-label": "Open Replays" })
  );
  const menuRef = useSetup({ send: menuSend, id: "1" });
  const menuApi = createMemo(() =>
    menu.connect<PropTypes>(menuState, menuSend, normalizeProps)
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
        <PrimaryButton
          {...menuApi().triggerProps}
          class="flex items-center gap-2"
        >
          <div class="hidden lg:block">{props.name}</div>
          <div class="material-icons" aria-label="Open File or Folder">
            folder_open
          </div>
        </PrimaryButton>
        <div {...menuApi().positionerProps} class="z-10 bg-white opacity-100">
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
                  loadFromSupabase("sample", load);
                  break;
              }
            }}
          >
            <li
              {...menuApi().getItemProps({ id: "file" })}
              class="w-full cursor-pointer py-2 px-4 hover:bg-slate-200"
            >
              Open File(s)
            </li>
            <li
              {...menuApi().getItemProps({ id: "folder" })}
              class="w-full cursor-pointer py-2 px-4 hover:bg-slate-200"
            >
              Open Folder
            </li>
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
