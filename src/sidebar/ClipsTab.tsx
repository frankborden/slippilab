import { createMemo, createUniqueId, For, Show } from "solid-js";
import { Badge } from "~/common/Badge";
import { Picker } from "~/common/Picker";
import { Highlight } from "~/search/search";
import { replayStore, selectHighlight } from "~/state/replayStore";
import * as accordion from "@zag-js/accordion";
import { normalizeProps, useMachine, useSetup, PropTypes } from "@zag-js/solid";

export function ClipsTab() {
  const data = createMemo(() =>
    Object.keys(replayStore.highlights).map((name) => ({
      title: name,
      content: (
        <Picker
          items={replayStore.highlights[name].map(
            (highlight) => [name, highlight] as [string, Highlight]
          )}
          render={ClipRow}
          onClick={(nameAndHighlight) => selectHighlight(nameAndHighlight)}
          selected={([name, highlight]) =>
            replayStore.selectedHighlight?.[0] === name &&
            replayStore.selectedHighlight?.[1].startFrame ===
              highlight.startFrame &&
            replayStore.selectedHighlight?.[1].endFrame ===
              highlight.endFrame &&
            replayStore.selectedHighlight?.[1].playerIndex ===
              highlight.playerIndex
          }
          estimateSize={() => 32}
        ></Picker>
      ),
    }))
  );
  const [state, send] = useMachine(
    accordion.machine({ multiple: true, collapsible: true })
  );
  const ref = useSetup({ send, id: createUniqueId() });
  const api = createMemo(() =>
    accordion.connect<PropTypes>(state, send, normalizeProps)
  );

  return (
    <div ref={ref} {...api().rootProps}>
      <For each={data()}>
        {(item) => (
          <div {...api().getItemProps({ value: item.title })}>
            <h3>
              <button
                class="flex w-full justify-between gap-3 rounded border border-slate-400 p-2"
                classList={{
                  "text-slate-400":
                    replayStore.highlights[item.title].length === 0,
                }}
                {...api().getTriggerProps({
                  value: item.title,
                  disabled: replayStore.highlights[item.title].length === 0,
                })}
              >
                {item.title}
                <Show when={replayStore.highlights[item.title].length > 0}>
                  <div class="material-icons">
                    {api().getItemState({ value: item.title }).isOpen
                      ? "expand_less"
                      : "expand_more"}
                  </div>
                </Show>
              </button>
            </h3>
            <div class="mb-5" {...api().getContentProps({ value: item.title })}>
              {item.content}
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

function ClipRow(props: [string, Highlight]) {
  const portColor = [
    "bg-red-600 text-red-50",
    "bg-blue-600 text-blue-50",
    "bg-yellow-600 text-yellow-50",
    "bg-green-700 text-green-50",
  ][props[1].playerIndex];
  return (
    <>
      <div class="flex w-full items-center">
        <div class="flex items-center gap-1">
          <Badge class={portColor}>{`P${props[1].playerIndex + 1}`}</Badge>
        </div>
        <div class="flex flex-grow items-center justify-center">
          {`${props[1].startFrame}-${props[1].endFrame}`}
        </div>
      </div>
    </>
  );
}
