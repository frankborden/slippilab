import { RadioGroup as RadioGroupPrimitive } from "@kobalte/core";
import type { Component } from "solid-js";
import { splitProps } from "solid-js";

import { cn } from "~/client/components/utils";

const RadioGroup: Component<RadioGroupPrimitive.RadioGroupRootProps> = (
  props,
) => {
  const [, rest] = splitProps(props, ["class"]);
  return (
    <RadioGroupPrimitive.Root class={cn("grid gap-2", props.class)} {...rest} />
  );
};

const RadioGroupItem: Component<RadioGroupPrimitive.RadioGroupItemProps> = (
  props,
) => {
  const [, rest] = splitProps(props, ["class", "children"]);
  return (
    <RadioGroupPrimitive.Item
      class={cn("flex items-center space-x-2", props.class)}
      {...rest}
    >
      <RadioGroupPrimitive.ItemInput />
      <RadioGroupPrimitive.ItemControl class="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <RadioGroupPrimitive.ItemIndicator class="flex h-full items-center justify-center ">
          <div class="i-tabler-circle h-2.5 w-2.5 fill-current text-current" />
        </RadioGroupPrimitive.ItemIndicator>
      </RadioGroupPrimitive.ItemControl>
      {props.children}
    </RadioGroupPrimitive.Item>
  );
};

export { RadioGroup, RadioGroupItem };
