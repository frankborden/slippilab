import { load } from "../state";
import { Button } from "@hope-ui/solid";

// TODO: zip support
export function Upload() {
  let fileInput!: HTMLInputElement;
  let folderInput!: HTMLInputElement;

  async function onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }
    const slpFiles = Array.from(input.files).filter(file =>
      file.name.endsWith(".slp")
    );
    const files = Array.from(slpFiles);
    load(files);
  }

  return (
    <>
      <Button onClick={() => fileInput.click()}>Open File</Button>
      <input
        style="display: none"
        type="file"
        accept=".slp"
        multiple
        ref={fileInput}
        onChange={onFileSelected}
      />
      <Button onClick={() => folderInput.click()}>Open Folder</Button>
      <input
        style="display: none"
        type="file"
        // @ts-ignore folder input is not standard, but is supported by all
        // modern browsers
        webkitDirectory
        ref={folderInput}
        onChange={onFileSelected}
      />
    </>
  );
}
