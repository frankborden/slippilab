import { For, JSX } from "solid-js";

export function Picker<T>(props: {
  items: T[];
  render: (item: T, index: number) => JSX.Element;
  onClick: (item: T, index: number) => unknown;
  selected: (item: T, index: number) => boolean;
}) {
  return (
    <>
      <div class="flex flex-col items-center divide-y border">
        <For each={props.items}>
          {(item, index) => (
            <div
              role="button"
              class="w-full whitespace-normal p-1 hover:bg-slate-100"
              classList={{
                "bg-slate-200 hover:bg-slate-300": props.selected(
                  item,
                  index()
                ),
              }}
              onClick={() => props.onClick(item, index())}
            >
              {props.render(item, index())}
            </div>
          )}
        </For>
      </div>
    </>
  );
}
