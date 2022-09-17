import { PrimaryButton } from "~/common/Button";
import { OpenMenu } from "~/common/OpenMenu";
import { UploadDialog } from "~/sidebar/UploadDialog";
import { selectionStore } from "~/state/selectionStore";

export function ButtonBar() {
  return (
    <div class="flex items-center gap-4">
      <OpenMenu name="" />
      <UploadDialog />
      <PrimaryButton
        class="text-md"
        onClick={() => {
          if (selectionStore.selectedFileAndSettings === undefined) {
            return;
          }
          const file = selectionStore.selectedFileAndSettings[0];
          const element = document.createElement("a");
          const url = URL.createObjectURL(file);
          element.href = url;
          element.setAttribute("download", file.name);
          element.style.display = "none";
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }}
      >
        <div class="material-icons">download</div>
      </PrimaryButton>
    </div>
  );
}
