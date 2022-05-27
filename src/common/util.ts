import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'

export async function filterFiles (files: File[]) {
  const slpFiles = files.filter((file) => file.name.endsWith('.slp'))
  const zipFiles = files.filter((file) => file.name.endsWith('.zip'))
  const blobsFromZips = (await Promise.all(zipFiles.map(unzip)))
    .flat()
    .filter((file) => file.name.endsWith('.slp'))
  return [...slpFiles, ...blobsFromZips]
}

export async function unzip (zipFile: File): Promise<File[]> {
  const entries = await new ZipReader(new BlobReader(zipFile)).getEntries()
  return await Promise.all(
    entries
      .filter((entry) => !entry.filename.split('/').at(-1)?.startsWith('.'))
      .map(async (entry) =>
        await (entry.getData?.(new BlobWriter()) as Promise<Blob>).then(
          (blob) => new File([blob], entry.filename)
        )
      )
  )
}
