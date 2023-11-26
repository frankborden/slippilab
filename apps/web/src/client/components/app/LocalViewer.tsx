import { ReplayData } from "@slippilab/common";

import { Viewer } from "~/client/components/app/Viewer";
import { Button } from "~/client/components/ui/button";
import { selected } from "~/client/state/personal";

export function LocalViewer(props: { replay: ReplayData }) {
  return (
    <>
      <Button
        onClick={() => {
          const form = new FormData();
          form.set("file", selected()![1]);
          fetch("/api/upload", {
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
