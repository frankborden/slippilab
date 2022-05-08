import { Button, VStack } from "@hope-ui/solid";
import { For, JSX } from "solid-js";
import styles from "./Picker.module.css";

export function Picker<T>(props: {
  items: T[];
  render: (item: T, index: number) => JSX.Element;
  onClick: (item: T, index: number) => unknown;
  selected: number;
}) {
  return (
    <>
      <VStack class={styles.picker}>
        <For each={props.items}>
          {(item, index) => (
            <Button
              class={`${styles.row} ${
                index() === props.selected ? styles.selected : ""
              }`}
              onClick={() => props.onClick(item, index())}
            >
              {props.render(item, index())}
            </Button>
          )}
        </For>
      </VStack>
    </>
  );
}
