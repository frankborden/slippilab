import { createMemo, createSignal } from "solid-js";

/**
 * A filterable ordered list of items where zero or one can be selected at a
 * time.
 */
export function createLibrary<Item>() {
  type Filter = (t: Item) => boolean;

  const [items, setItemsDirectly] = createSignal<Item[]>([]);
  const [filters, setFiltersDirectly] = createSignal<Filter[]>([]);

  // Importantly [].reduce(..., [1,2,3]) === [1,2,3] so we get all items if
  // there are no filters.
  const filteredIndexes = createMemo(() =>
    filters()
      .reduce(
        (items: [Item, number][], filter: Filter) =>
          items.filter(([item]) => filter(item)),
        items().map((item, i): [Item, number] => [item, i])
      )
      .map(([, index]) => index)
  );

  const filteredItems = createMemo(() =>
    items().filter((_, index) => filteredIndexes().includes(index))
  );

  // This is an index into filteredIndexes/filteredItems, not into items
  const [selection, setSelection] = createSignal<number | undefined>();
  const selectedItem = createMemo(() =>
    selection() !== undefined ? filteredItems()[selection()!] : undefined
  );

  // Adjust selections to point to the same item if it is still present
  function setItems(items: Item[]) {
    const selected = selectedItem();
    setItemsDirectly(items);
    const newSelectionIndex =
      selected !== undefined ? filteredItems().indexOf(selected) : -1;
    if (newSelectionIndex >= 0) {
      setSelection(newSelectionIndex);
    } else {
      setSelection(undefined);
    }
  }

  // Adjusts selection to point to the same item if it is still present
  function setFilters(filters: Filter[]) {
    const selected = selectedItem();
    setFiltersDirectly(filters);
    const newSelectionIndex =
      selected !== undefined ? filteredItems().indexOf(selected) : -1;
    if (newSelectionIndex >= 0) {
      setSelection(newSelectionIndex);
    } else {
      setSelection(undefined);
    }
  }

  function selectNext() {
    setSelection(
      (selection() !== undefined ? selection()! + 1 : 0) %
        filteredItems().length
    );
  }

  function selectPrevious() {
    setSelection(
      (selection() !== undefined
        ? selection()! - 1 + filteredItems().length
        : 0) % filteredItems().length
    );
  }

  return {
    items,
    setItems,
    filters,
    setFilters,
    filteredItems,
    selectedItem,
    setSelection,
    selectNext,
    selectPrevious,
  };
}

export type Library<Item> = ReturnType<typeof createLibrary<Item>>;
