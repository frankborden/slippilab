import { unzipSync } from "fflate";

export async function filterFiles(files: File[]): Promise<File[]> {
  const slpFiles = files.filter((file) => file.name.endsWith(".slp"));
  const zipFiles = files.filter((file) => file.name.endsWith(".zip"));
  const blobsFromZips = (await Promise.all(zipFiles.map(unzip)))
    .flat()
    .filter((file) => file.name.endsWith(".slp"));
  return [...slpFiles, ...blobsFromZips];
}

export async function unzip(zipFile: File): Promise<File[]> {
  const fileBuffers = unzipSync(new Uint8Array(await zipFile.arrayBuffer()));
  return Object.entries(fileBuffers).map(
    ([name, buffer]) => new File([buffer], name)
  );
}
