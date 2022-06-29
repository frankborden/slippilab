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

export function PrimaryButton(props: { onClick?: () => void; children: any }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class="inline-flex w-fit items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {props.children}
    </button>
  );
}

export function SecondaryButton(props: {
  onClick?: () => void;
  children: any;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class="inline-flex w-fit items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {props.children}
    </button>
  );
}

export function WhiteButton(props: { onClick?: () => void; children: any }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class="inline-flex w-fit items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {props.children}
    </button>
  );
}
