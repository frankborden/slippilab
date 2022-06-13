import { splitProps } from "solid-js";

export function Button(props: any) {
  const [classProp, selectedProp, otherProps] = splitProps(
    props,
    ["class"],
    ["selected"]
  );

  return (
    <button
      {...otherProps}
      class={`inline-flex justify-center rounded-md border border-transparent ${
        selectedProp.selected ? "bg-blue-600" : "bg-blue-100"
      } px-4 py-2 text-sm font-medium ${
        selectedProp.selected ? "text-blue-100" : "text-blue-600"
      } ${
        selectedProp.selected ? "hover:bg-blue-500" : "hover:bg-blue-200"
      } focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        classProp.class ?? ""
      }`}
    >
      {props.children}
    </button>
  );
}
