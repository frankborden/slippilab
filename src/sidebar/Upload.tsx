import { OpenMenu } from "~/common/OpenMenu";
import { UploadDialog } from "~/common/UploadDialog";

export function Upload() {
  return (
    <div class="flex w-full items-center justify-between">
      <OpenMenu name={"Open"} />
      <UploadDialog />
    </div>
  );
}
