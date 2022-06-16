import { createEffect, splitProps } from "solid-js";

export function Button(props: any) {
  const [classProp, selectedProp, otherProps] = splitProps(
    props,
    ["class"],
    ["selected"]
  );
  createEffect(() => console.log(classProp));

  return (
    <button
      {...otherProps}
      class={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        classProp?.class ?? ""
      }`}
      classList={{
        "bg-blue-600 text-blue-100 hover:bg-blue-500": selectedProp.selected,
        "bg-blue-100 text-blue-600 hover:bg-blue-200": !selectedProp.selected,
      }}
    >
      {props.children}
    </button>
  );
}
