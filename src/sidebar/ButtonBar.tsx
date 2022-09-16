import { useContext } from "solid-js";
import { IconButton } from "~/common/Button";
import { OpenMenu } from "~/common/OpenMenu";
import { UploadDialog } from "~/sidebar/UploadDialog";
import { SelectionStoreContext } from "~/state/selectionStore";

export function ButtonBar() {
  const [replayState] = useContext(SelectionStoreContext);
  return (
    <div class="flex items-center gap-4">
      <OpenMenu name="" />
      <UploadDialog />
      <IconButton
        class="material-icons text-xl"
        onClick={() => {
          if (replayState.selectedFileAndSettings === undefined) {
            return;
          }
          const file = replayState.selectedFileAndSettings[0];
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
        download
      </IconButton>
    </div>
  );
}
