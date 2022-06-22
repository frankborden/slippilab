import { createMemo } from "solid-js";
import { Badge } from "~/common/Badge";
import { Picker } from "~/common/Picker";
import { Highlight } from "~/search/search";
import { replayStore, selectHighlight } from "~/state/replayStore";

export function ClipsTab() {
  const entries = createMemo(() => {
    return Array.from(Object.entries(replayStore.highlights)).flatMap(
      ([name, clips]) => clips.map((clip): [string, Highlight] => [name, clip])
    );
  });
  return (
    <>
      <div class="h-full overflow-y-auto">
        <Picker
          items={entries()}
          render={ClipRow}
          onClick={(nameAndHighlight) => selectHighlight(nameAndHighlight)}
          selected={([name, highlight]) =>
            replayStore.selectedHighlight?.[0] === name &&
            replayStore.selectedHighlight?.[1] === highlight
          }
        />
      </div>
    </>
  );
}

function ClipRow(props: [string, Highlight]) {
  const index = Object.keys(replayStore.highlights).indexOf(props[0]);
  const typeColor = [
    "bg-purple-700 text-purple-100",
    "bg-blue-700 text-blue-100",
    "bg-teal-700 text-teal-100",
    "bg-lime-700 text-lime-100",
    "bg-orange-700 text-orange-100",
  ][index];
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
          <Badge class={typeColor}>{props[0]}</Badge>
        </div>
        <div class="flex flex-grow items-center justify-center">
          {`${props[1].startFrame}-${props[1].endFrame}`}
        </div>
      </div>
    </>
  );
}
