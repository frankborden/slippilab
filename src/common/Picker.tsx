import { For, JSX } from "solid-js";
import { Button } from "./Button";

export function Picker<T>(props: {
  items: T[];
  render: (item: T, index: number) => JSX.Element;
  onClick: (item: T, index: number) => unknown;
  selected: (item: T, index: number) => boolean;
}) {
  return (
    <>
      <div class="flex flex-col items-center">
        <For each={props.items}>
          {(item, index) => (
            <Button
              class="w-full border border-solid border-blue-300 py-1 whitespace-normal"
              selected={props.selected(item, index())}
              onClick={() => props.onClick(item, index())}
            >
              {props.render(item, index())}
            </Button>
          )}
        </For>
      </div>
    </>
  );
}
