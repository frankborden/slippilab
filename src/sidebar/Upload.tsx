import { OpenMenu } from "~/common/OpenMenu";
import { UploadDialog } from "~/sidebar/UploadDialog";

export function Upload() {
  return (
    <div class="flex items-center gap-4">
      <OpenMenu name={"Open"} />
      <UploadDialog />
    </div>
  );
}
