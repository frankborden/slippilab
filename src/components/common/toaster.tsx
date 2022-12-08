import { useActor, useMachine, normalizeProps } from "@zag-js/solid";
import * as toast from "@zag-js/toast";
import { createMemo, createUniqueId, For } from "solid-js";
import { Portal } from "solid-js/web";
import { WhiteButton } from "~/components/common/Button";

function Toast(props: { actor: toast.Service }) {
  const [state, send] = useActor(props.actor);
  const api = createMemo(() => toast.connect(state, send, normalizeProps));

  return (
    <div
      {...api().rootProps}
      class="flex items-center gap-5 rounded border bg-slate-50 p-3"
    >
      <div class="flex flex-col gap-3">
        <div {...api().titleProps}>{api().title}</div>
        {api()?.render()}
      </div>
      <WhiteButton
        class="material-icons cursor-pointer px-1 py-0"
        onClick={api().dismiss}
      >
        close
      </WhiteButton>
    </div>
  );
}

const [state, send] = useMachine(toast.group.machine({ id: createUniqueId() }));
const api = createMemo(() => toast.group.connect(state, send, normalizeProps));

export function ToastGroup() {
  return (
    <>
      <Portal>
        <For each={Object.entries(api().toastsByPlacement)}>
          {([placement, toasts]) => (
            <div
              {...api().getGroupProps({
                placement: placement as toast.Placement,
              })}
            >
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
