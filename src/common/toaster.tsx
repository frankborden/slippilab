import { useActor, useMachine, useSetup } from "@zag-js/solid";
import * as toast from "@zag-js/toast";
import { createMemo, For } from "solid-js";
import { Portal } from "solid-js/web";
import { Button } from "./Button";

function Toast(props: { actor: any }) {
  const [state, send] = useActor(props.actor);
  // @ts-ignore
  const api = createMemo(() => toast.connect(state, send));

  return (
    // @ts-ignore
    <div
      {...api().rootProps}
      class="flex gap-5 border rounded p-3 bg-slate-50 items-center"
    >
      <div class="flex flex-col gap-3">
        {/* @ts-ignore */}
        <div {...api().titleProps}>{api().title}</div>
        {api()?.render()}
      </div>
      <Button
        class="material-icons cursor-pointer text-lg px-1 py-0"
        onClick={api().dismiss}
      >
        close
      </Button>
    </div>
  );
}

const [state, send] = useMachine(toast.group.machine);
const ref = useSetup({ send, id: "1" });
const api = createMemo(() => toast.group.connect(state, send));

export function ToastGroup() {
  return (
    <>
      <Portal>
        <For each={Object.entries(api().toastsByPlacement)}>
          {([placement, toasts]) => (
            // @ts-ignore
            <div {...api().getGroupProps({ placement })}>
              <For each={toasts}>{(toast) => <Toast actor={toast} />}</For>
            </div>
          )}
        </For>
      </Portal>
    </>
  );
}

export const createToast = api().create;
export const dismissToast = api().dismiss;
