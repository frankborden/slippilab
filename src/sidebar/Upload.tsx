import { load, store } from "../state";
import {
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
  notificationService,
} from "@hope-ui/solid";
import { createSignal, JSX, Show } from "solid-js";
import { uploadReplay } from "../supabaseClient";
import { Copy, FileArrowUp, FolderOpen } from "phosphor-solid";
import { filterFiles } from "../common/util";

export function Upload() {
  const { isOpen, onOpen, onClose } = createDisclosure();
  const [isUploading, setIsUploading] = createSignal(false);
  const [url, setUrl] = createSignal<string | undefined>();
  const [error, setError] = createSignal<string | undefined>();

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

  async function onUpload(): Promise<void> {
    setIsUploading(true);
    onOpen();
    const file = store.files[store.currentFile];
    const { id, data, error } = await uploadReplay(file);
    if (data != null) {
      setUrl(`${window.location.origin}/${id}`);
    } else {
      setError("Error uploading file");
      console.error(error);
    }
    setIsUploading(false);
  }

  return (
    <>
      <div class="flex w-full items-center justify-between gap-2">
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
            onClick={onUpload}
            rightIcon={<FileArrowUp size="24" />}
            variant="subtle"
          >
            Upload
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
                    <div class="flex items-center gap-4">
                      <a href={url()}>{url()}</a>
                      <div
                        class="cursor-pointer"
                        onClick={() => {
                          const link = url();
                          if (link === undefined) return;
                          void navigator.clipboard.writeText(link);
                          notificationService.show({
                            status: "success",
                            duration: 1000,
                            title: "Link copied",
                          });
                        }}
                      >
                        <Copy size={24} />
                      </div>
                    </div>
                  </Show>
                </Show>
              </Center>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
      </div>
    </>
  );
}
