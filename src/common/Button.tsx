import { JSX, splitProps } from "solid-js";

export function Button(
  props: JSX.HTMLAttributes<HTMLButtonElement> & { selected?: boolean }
) {
  const [classProp, selectedProp, otherProps] = splitProps(
    props,
    ["class"],
    ["selected"]
  );

  return (
    <button
      {...otherProps}
      class={`inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        selectedProp.selected
          ? "bg-slate-600 text-slate-100 hover:bg-slate-500"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      } ${classProp?.class ?? ""}`}
    >
      {props.children}
    </button>
  );
}
