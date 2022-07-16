import { createMemo, createUniqueId, For, Show, useContext } from "solid-js";
import { PlayerBadge } from "~/common/Badge";
import { Picker } from "~/common/Picker";
import { Highlight } from "~/search/search";
import { ReplayStoreContext } from "~/state/replayStore";
import * as accordion from "@zag-js/accordion";
import { normalizeProps, useMachine, useSetup, PropTypes } from "@zag-js/solid";

export function ClipsTab() {
  const [replayState, { selectHighlight }] = useContext(ReplayStoreContext);
  const data = createMemo(() =>
    Object.keys(replayState.highlights).map((name) => ({
      title: name,
      content: (
        <Picker
          items={replayState.highlights[name].map(
            (highlight) => [name, highlight] as [string, Highlight]
          )}
          render={ClipRow}
          onClick={(nameAndHighlight) => selectHighlight(nameAndHighlight)}
          selected={([name, highlight]) =>
            replayState.selectedHighlight?.[0] === name &&
            replayState.selectedHighlight?.[1].startFrame ===
              highlight.startFrame &&
            replayState.selectedHighlight?.[1].endFrame ===
              highlight.endFrame &&
            replayState.selectedHighlight?.[1].playerIndex ===
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
                    replayState.highlights[item.title].length === 0,
                }}
                {...api().getTriggerProps({
                  value: item.title,
                  disabled: replayState.highlights[item.title].length === 0,
                })}
              >
                {item.title}
                <Show when={replayState.highlights[item.title].length > 0}>
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
  return (
    <>
      <div class="flex w-full items-center">
        <div class="flex items-center gap-1">
          <PlayerBadge port={props[1].playerIndex + 1} />
        </div>
        <div class="flex flex-grow items-center justify-center">
          {`${props[1].startFrame}-${props[1].endFrame}`}
        </div>
      </div>
    </>
  );
}
