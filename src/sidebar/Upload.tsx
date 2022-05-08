import { load } from "../state";
import { Button } from "@hope-ui/solid";
import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js";

export function Upload() {
  let fileInput!: HTMLInputElement;
  let folderInput!: HTMLInputElement;

  async function onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }
    const files = Array.from(input.files);
    const slpFiles = files.filter(file => file.name.endsWith(".slp"));
    const zipFiles = files.filter(file => file.name.endsWith(".zip"));
    const blobsFromZips = (await Promise.all(zipFiles.map(unzip)))
      .flat()
      .filter(file => file.name.endsWith(".slp"));

    load([...slpFiles, ...blobsFromZips]);
  }

  return (
    <>
      <Button onClick={() => fileInput.click()}>Open File</Button>
      <input
        style="display: none"
        type="file"
        accept=".slp,.zip"
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

async function unzip(zipFile: File): Promise<File[]> {
  const entries = await new ZipReader(new BlobReader(zipFile)).getEntries();
  return Promise.all(
    entries
      .filter(entry => !entry.filename.split("/").at(-1)?.startsWith("."))
      .map(entry =>
        (entry.getData?.(new BlobWriter()) as Promise<Blob>).then(
          blob => new File([blob], entry.filename)
        )
      )
  );
}
