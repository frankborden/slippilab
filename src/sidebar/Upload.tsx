import { load, store } from "../state";
import { Button } from "../common/Button";
import {
  createDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  notificationService,
} from "@hope-ui/solid";
import { createSignal, Show } from "solid-js";
import { uploadReplay } from "../supabaseClient";
import { filterFiles } from "../common/util";
import { OpenMenu } from "../common/OpenMenu";

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
        <OpenMenu name={"Open"} />
        <Show when={store.files.length > 0}>
          <Button class="whitespace-normal py-1" onClick={onUpload}>
            <div class="flex items-center gap-2">
              Upload
              <div class="material-icons-outlined" aria-label="Upload File">
                cloud_upload
              </div>
            </div>
          </Button>
        </Show>
        <Modal opened={isOpen()} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Replay Upload</ModalHeader>
            <ModalBody>
              <div class="flex items-center justify-center">
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
                        <div
                          class="material-icons cursor-pointer text-4xl"
                          aria-label="Copy URL"
                        >
                          content_copy
                        </div>
                      </div>
                    </div>
                  </Show>
                </Show>
              </div>
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
