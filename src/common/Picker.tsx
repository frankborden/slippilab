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
      <VStack>
        <For each={props.items}>
          {(item, index) => (
            <Button
              borderColor="white"
              borderWidth="1px"
              borderStyle="solid"
              width="100%"
              class={`${index() === props.selected ? styles.selected : ""}`}
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
