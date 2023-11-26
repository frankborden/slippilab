import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { Component } from "solid-js";
import { splitProps } from "solid-js";

import type { BadgeProps } from "~/client/components/ui/badge";
import { Badge } from "~/client/components/ui/badge";
import { cn } from "~/client/components/utils";

type DeltaType =
  | "increase"
  | "moderateIncrease"
  | "unchanged"
  | "moderateDecrease"
  | "decrease";

const badgeDeltaVariants = cva("", {
  variants: {
    variant: {
      success: "bg-success hover:bg-success text-success-foreground",
      warning: "bg-warning hover:bg-warning text-warning-foreground",
      error: "bg-error hover:bg-error text-error-foreground",
    },
  },
});
type DeltaVariant = NonNullable<
  VariantProps<typeof badgeDeltaVariants>["variant"]
>;

const iconMap: { [key in DeltaType]: string } = {
  increase: "i-tabler-arrow-up",
  moderateIncrease: "i-tabler-arrow-up-right",
  unchanged: "i-tabler-arrow-right",
  moderateDecrease: "i-tabler-arrow-down-right",
  decrease: "i-tabler-arrow-down",
};

const variantMap: { [key in DeltaType]: DeltaVariant } = {
  increase: "success",
  moderateIncrease: "success",
  unchanged: "warning",
  moderateDecrease: "error",
  decrease: "error",
};

export interface BadgeDeltaProps extends Omit<BadgeProps, "variant"> {
  deltaType: DeltaType;
}

const BadgeDelta: Component<BadgeDeltaProps> = (props) => {
  const [, rest] = splitProps(props, ["class", "children", "deltaType"]);
  const iconClass = iconMap[props.deltaType];
  const variant = variantMap[props.deltaType];

  return (
    <Badge class={cn(badgeDeltaVariants({ variant }), props.class)} {...rest}>
      <span class="flex gap-1">
        <div class={cn("h-4 w-4", iconClass)} />
        {props.children}
      </span>
    </Badge>
  );
};

export { BadgeDelta };
