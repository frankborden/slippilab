import { Button, useColorModeValue, VStack } from "@hope-ui/solid";
import { For, JSX } from "solid-js";

export function Picker<T>(props: {
  items: T[];
  render: (item: T, index: number) => JSX.Element;
  onClick: (item: T, index: number) => unknown;
  selected: (item: T, index: number) => boolean;
}) {
  const borderColor = useColorModeValue("$primary9", "white");
  return (
    <>
      <VStack>
        <For each={props.items}>
          {(item, index) => (
            <Button
              size="sm"
              borderColor={borderColor()}
              borderWidth="1px"
              borderStyle="solid"
              paddingTop="$1"
              paddingBottom="$1"
              width="100%"
              height="initial"
              css={{ "white-space": "normal" }}
              variant={props.selected(item, index()) ? "solid" : "outline"}
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
