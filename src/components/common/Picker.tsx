import { For, JSX } from "solid-js";
import { createVirtualizer } from "@tanstack/solid-virtual";

export function Picker<T>(props: {
  items: T[];
  render: (item: T, index: number) => JSX.Element;
  onClick: (item: T, index: number) => unknown;
  selected: (item: T, index: number) => boolean;
  estimateSize: (item: T, index: number) => number;
}) {
  let scrollParentRef: HTMLDivElement | undefined;

  const virtualizer = createVirtualizer({
    get count() {
      return props.items.length;
    },
    getScrollElement: () => scrollParentRef,
    estimateSize: (index: number) =>
      props.estimateSize(props.items[index], index),
    overscan: 25,
  });

  return (
    <>
      <div ref={scrollParentRef} class="w-full overflow-auto">
        <div
          class="relative w-full"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          <For each={virtualizer.getVirtualItems()}>
            {/* item is VirtualItem */}
            {(item: { start: number; index: number }) => (
              <div
                role="button"
                class="absolute top-0 left-0 w-full overflow-hidden whitespace-nowrap border p-1 hover:bg-slate-100"
                style={{ transform: `translateY(${item.start}px)` }}
                classList={{
                  "bg-slate-200 hover:bg-slate-300": props.selected(
                    props.items[item.index],
                    item.index
                  ),
                }}
                onClick={() =>
                  props.onClick(props.items[item.index], item.index)
                }
              >
                {props.render(props.items[item.index], item.index)}
              </div>
            )}
          </For>
        </div>
      </div>
    </>
  );
}
