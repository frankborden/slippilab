import { For, JSX, onMount } from "solid-js";
import { createVirtualizer } from "~/common/virtual";

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
    estimateSize: (i) => props.estimateSize(props.items[i], i),
    overscan: 5,
  });

  return (
    <>
      <div ref={scrollParentRef} class="overflow-auto w-full">
        <div
          class="w-full relative"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          <For each={virtualizer.getVirtualItems()}>
            {(item) => (
              <div
                role="button"
                // ref={(el) => onMount(() => item.measureElement(el))}
                class="absolute top-0 left-0 w-full whitespace-nowrap p-1 hover:bg-slate-100 border overflow-hidden"
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
