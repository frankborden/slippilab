import { createMemo, createUniqueId, For, Show } from "solid-js";
import { PlayerBadge } from "~/components/common/Badge";
import { Highlight } from "~/search/search";
import {
  replayStore,
  selectCustomAction,
  selectCustomAttack,
  selectHighlight,
} from "~/state/replayStore";
import * as accordion from "@zag-js/accordion";
import { normalizeProps, useMachine } from "@zag-js/solid";
import {
  ActionName,
  actionNameById,
  AttackName,
  attackNamesById,
} from "~/common/ids";

export function Clips() {
  const [state, send] = useMachine(
    accordion.machine({
      id: createUniqueId(),
      multiple: true,
      collapsible: true,
    })
  );
  const api = createMemo(() => accordion.connect(state, send, normalizeProps));

  return (
    <div {...api().rootProps}>
      <For each={Object.entries(replayStore.highlights)}>
        {([name, highlights]) => (
          <div {...api().getItemProps({ value: name })}>
            <h3>
              <button
                class="flex w-full justify-between gap-3 rounded border border-slate-400 p-2"
                classList={{
                  "text-slate-400":
                    highlights.length === 0 &&
                    name !== "customAction" &&
                    name !== "customAttack",
                }}
                {...api().getTriggerProps({
                  value: name,
                  disabled:
                    highlights.length === 0 &&
                    name !== "customAction" &&
                    name !== "customAttack",
                })}
              >
                {name === "customAction" ? (
                  <>
                    Action:
                    <select
                      class="min-w-0 shrink border"
                      value={replayStore.customAction}
                      onChange={(e) =>
                        selectCustomAction(
                          (e.target as HTMLSelectElement).value as ActionName
                        )
                      }
                    >
                      <For each={actionNameById}>
                        {(action) => <option value={action}>{action}</option>}
                      </For>
                    </select>
                  </>
                ) : name === "customAttack" ? (
                  <>
                    Attack:
                    <select
                      class="min-w-0 shrink border"
                      value={replayStore.customAttack}
                      onChange={(e) =>
                        selectCustomAttack(
                          (e.target as HTMLSelectElement).value as AttackName
                        )
                      }
                    >
                      <For each={attackNamesById}>
                        {(attack) => <option value={attack}>{attack}</option>}
                      </For>
                    </select>
                  </>
                ) : (
                  name
                )}
                <Show when={highlights.length > 0}>
                  <div class="material-icons">
                    {api().getItemState({ value: name }).isOpen
                      ? "expand_less"
                      : "expand_more"}
                  </div>
                </Show>
              </button>
            </h3>
            <div class="mb-5" {...api().getContentProps({ value: name })}>
              <For each={highlights}>
                {(highlight) => <ClipRow name={name} highlight={highlight} />}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

function ClipRow(props: { name: string; highlight: Highlight }) {
  return (
    <>
      <div
        class="flex w-full cursor-pointer items-center overflow-hidden whitespace-nowrap border p-1 hover:bg-slate-100"
        classList={{
          "bg-slate-200 hover:bg-slate-300":
            replayStore.selectedHighlight?.[0] === props.name &&
            replayStore.selectedHighlight?.[1].startFrame ===
              props.highlight.startFrame &&
            replayStore.selectedHighlight?.[1].endFrame ===
              props.highlight.endFrame &&
            replayStore.selectedHighlight?.[1].playerIndex ===
              props.highlight.playerIndex,
        }}
        onClick={() => selectHighlight([props.name, props.highlight])}
      >
        <div class="flex items-center gap-1">
          <PlayerBadge port={props.highlight.playerIndex + 1} />
        </div>
        <div class="flex flex-grow items-center justify-center">
          {props.highlight.startFrame}-{props.highlight.endFrame}
        </div>
      </div>
    </>
  );
}
