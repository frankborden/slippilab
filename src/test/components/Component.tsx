import { Dynamic } from "solid-js/web";
import { store } from "~/test/components/store";

export function Component() {
  return (
    <div class="p-5">
      <Dynamic component={store.currentVariant.component} />
    </div>
  );
}
