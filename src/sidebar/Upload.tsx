import { load, state } from "../state";
import {
  hope,
  Button,
  Center,
  createDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Box,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  HStack,
} from "@hope-ui/solid";
import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js";
import { createSignal, Show } from "solid-js";
import { supabase } from "../supabaseClient";
import { FileArrowUp, FolderOpen } from "phosphor-solid";

export function Upload() {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [isUploading, setIsUploading] = createSignal(false);
  const [urlOrError, setUrlOrError] = createSignal("");

  let fileInput!: HTMLInputElement;
  let folderInput!: HTMLInputElement;

  async function onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }
    const files = Array.from(input.files);
    const slpFiles = files.filter((file) => file.name.endsWith(".slp"));
    const zipFiles = files.filter((file) => file.name.endsWith(".zip"));
    const blobsFromZips = (await Promise.all(zipFiles.map(unzip)))
      .flat()
      .filter((file) => file.name.endsWith(".slp"));

    load([...slpFiles, ...blobsFromZips]);
  }

  async function onShare() {
    setIsUploading(true);
    onOpen();
    const file = state.files()[state.currentFile()];
    const id = crypto.randomUUID();
    const { data, error } = await supabase.storage
      .from("replays")
      .upload(`${id}.slp`, file);
    const message = data
      ? `${window.location.origin}/${id}`
      : "Error uploading file";
    if (error) {
      console.error(error);
    }
    setUrlOrError(message);
    setIsUploading(false);
  }

  return (
    <>
      <HStack gap="$2">
        <Menu>
          <MenuTrigger
            as={Button}
            variant="subtle"
            rightIcon={<FolderOpen size="24" />}
          >
            Open
          </MenuTrigger>
          <MenuContent>
            <MenuItem disabled={false} onSelect={() => fileInput.click()}>
              Files
            </MenuItem>
            <MenuItem disabled={false} onSelect={() => folderInput.click()}>
              Directory
            </MenuItem>
          </MenuContent>
        </Menu>
        <Show when={state.files().length > 0}>
          <Button
            onClick={onShare}
            rightIcon={<FileArrowUp size="24" />}
            variant="subtle"
          >
            Share
          </Button>
        </Show>
        <Modal opened={isOpen()} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Replay Upload</ModalHeader>
            <ModalBody>
              <Center>
                <Show when={!isUploading()} fallback={<Spinner />}>
                  <hope.div>{urlOrError()}</hope.div>
                </Show>
              </Center>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <hope.input
          display="none"
          type="file"
          accept=".slp,.zip"
          multiple
          ref={fileInput}
          onChange={onFileSelected}
        />
        <hope.input
          display="none"
          type="file"
          // @ts-ignore folder input is not standard, but is supported by all
          // modern browsers
          webkitDirectory
          ref={folderInput}
          onChange={onFileSelected}
        />
      </HStack>
    </>
  );
}

async function unzip(zipFile: File): Promise<File[]> {
  const entries = await new ZipReader(new BlobReader(zipFile)).getEntries();
  return Promise.all(
    entries
      .filter((entry) => !entry.filename.split("/").at(-1)?.startsWith("."))
      .map((entry) =>
        (entry.getData?.(new BlobWriter()) as Promise<Blob>).then(
          (blob) => new File([blob], entry.filename)
        )
      )
  );
}
