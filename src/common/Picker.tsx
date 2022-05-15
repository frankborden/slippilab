import { Button, VStack } from "@hope-ui/solid";
import { For, JSX } from "solid-js";

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
              size="sm"
              borderColor="white"
              borderWidth="1px"
              borderStyle="solid"
              paddingTop="$1"
              paddingBottom="$1"
              width="100%"
              height="initial"
              css={{ "white-space": "normal" }}
              variant={index() === props.selected ? "solid" : "outline"}
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
