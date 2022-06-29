import { For } from "solid-js";
import { setStory, setVariant, store } from "~/test/components/store";

export function Sidebar() {
  return (
    <div class="flex h-full">
      <List name="Components">
        <StoryList />
      </List>
      <List name="Variants">
        <VariantList />
      </List>
    </div>
  );
}

export function List(props: { name: string; children?: any }) {
  return (
    <div class="flex h-full w-40 flex-col gap-5 overflow-y-auto border-r border-gray-200 bg-white py-5">
      <div class="flex items-center justify-center px-4 text-xl">
        {props.name}
      </div>
      <div class="flex-grow space-y-1 bg-white px-2">{props.children}</div>
    </div>
  );
}

function StoryList() {
  return (
    <For each={store.stories}>
      {(story) => (
        <div
          role="button"
          onClick={() => setStory(story)}
          class={`${
            store.currentStory === story
              ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }
                  flex cursor-pointer items-center justify-center rounded-md px-2 py-2 text-sm font-medium`}
        >
          {story.name}
        </div>
      )}
    </For>
  );
}

function VariantList() {
  return (
    <For each={store.currentStory.variants}>
      {(variant) => (
        <div
          role="button"
          onClick={() => setVariant(variant)}
          class={`${
            store.currentVariant === variant
              ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }
                  flex cursor-pointer items-center justify-center rounded-md px-2 py-2 text-sm font-medium`}
        >
          {variant.name}
        </div>
      )}
    </For>
  );
}
