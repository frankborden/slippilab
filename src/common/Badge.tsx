import { JSX } from "solid-js";

export function Badge(props: {
  class?: string;
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <span
      class={`text-sm font-medium mr-2 px-2.5 py-0.5 rounded ${
        props.class ? props.class : ""
      }`}
    >
      {props.children}
    </span>
  );
}
