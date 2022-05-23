import { load, store } from "../state";
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
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  HStack,
  Anchor,
  Box,
  notificationService,
} from "@hope-ui/solid";
import { BlobReader, BlobWriter, ZipReader } from "@zip.js/zip.js";
import { createSignal, Show } from "solid-js";
import { uploadReplay } from "../supabaseClient";
import { Copy, FileArrowUp, FolderOpen } from "phosphor-solid";

export function Upload() {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [isUploading, setIsUploading] = createSignal(false);
  const [url, setUrl] = createSignal<string | undefined>();
  const [error, setError] = createSignal<string | undefined>();

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

  async function onShare() {
    setIsUploading(true);
    onOpen();
    const file = store.files[store.currentFile];
    const { id, data, error } = await uploadReplay(file);
    if (data) {
      setUrl(`${window.location.origin}/${id}`);
    } else {
      setError("Error uploading file");
      console.error(error);
    }
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
              Folder
            </MenuItem>
          </MenuContent>
        </Menu>
        <Show when={store.files.length > 0}>
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
                  <Show
                    when={url() !== undefined}
                    fallback={<div>{error()}</div>}
                  >
                    <HStack gap="$4">
                      <Anchor>{url()}</Anchor>
                      <Box
                        cursor="pointer"
                        onClick={() => {
                          navigator.clipboard.writeText(url()!);
                          notificationService.show({
                            status: "success",
                            duration: 1000,
                            title: "Link copied",
                          });
                        }}
                      >
                        <Copy size={24}></Copy>
                      </Box>
                    </HStack>
                  </Show>
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
      .filter(entry => !entry.filename.split("/").at(-1)?.startsWith("."))
      .map(entry =>
        (entry.getData?.(new BlobWriter()) as Promise<Blob>).then(
          blob => new File([blob], entry.filename)
        )
      )
  );
}
