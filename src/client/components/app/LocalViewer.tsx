import { Viewer } from "~/client/components/app/Viewer";
import { Button } from "~/client/components/ui/button";
import { selected } from "~/client/state/personal";
import { ReplayData } from "~/common/model/types";

export function LocalViewer(props: { replay: ReplayData }) {
  return (
    <>
      <Button
        onClick={() => {
          const form = new FormData();
          form.set("file", selected()![1]);
          fetch("/api/replay", {
            method: "POST",
            body: form,
          });
        }}
      >
        Upload
      </Button>
      <Viewer replay={props.replay} />
    </>
  );
}
