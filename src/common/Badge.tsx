import { JSX } from "solid-js";

export function Badge(props: {
  class?: string;
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <span
      class={`mr-2 rounded px-2.5 py-0.5 text-sm font-medium ${
        props.class ? props.class : ""
      }`}
    >
      {props.children}
    </span>
  );
}
