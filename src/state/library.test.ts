import { createRoot } from "solid-js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createLibrary, Library } from "~/state/library";

describe("library", () => {
  let library: Library<string>;
  let cleanup: () => void;

  beforeEach(() => {
    createRoot((dispose) => {
      library = createLibrary();
      cleanup = dispose;
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("filters items", () => {
    library.setItems(["a", "b", "c"]);
    expect(library.filteredItems()).toEqual(["a", "b", "c"]);

    library.setFilters([(item) => item !== "b"]);
    expect(library.filteredItems()).toEqual(["a", "c"]);
  });

  it("selects specific index from filtered items", () => {
    library.setItems(["a", "b", "c", "d"]);
    library.setFilters([(item) => item !== "b"]);
    expect(library.selectedItem()).toBeUndefined();

    library.setSelection(1);
    expect(library.selectedItem()).toBe("c");
  });

  it("selects next from filtered items", () => {
    library.setItems(["a", "b", "c", "d"]);
    library.setFilters([(item) => item !== "b"]);

    // undefined => first
    expect(library.selectedItem()).toBeUndefined();
    library.selectNext();
    expect(library.selectedItem()).toBe("a");

    // next
    library.selectNext();
    expect(library.selectedItem()).toBe("c");
    library.selectNext();
    expect(library.selectedItem()).toBe("d");

    // wraps
    library.selectNext();
    expect(library.selectedItem()).toBe("a");
  });

  it("selects previous from filtered items", () => {
    library.setItems(["a", "b", "c", "d"]);
    library.setFilters([(item) => item !== "b"]);

    // undefined => first
    expect(library.selectedItem()).toBeUndefined();
    library.selectPrevious();
    expect(library.selectedItem()).toBe("a");

    // previous
    library.selectPrevious();
    expect(library.selectedItem()).toBe("d");
    library.selectPrevious();
    expect(library.selectedItem()).toBe("c");
    library.selectPrevious();
    expect(library.selectedItem()).toBe("a");

    // wraps
    library.selectPrevious();
    expect(library.selectedItem()).toBe("d");
  });

  it("keeps selection through changes if possible", () => {
    library.setItems(["a", "b", "c", "d"]);
    library.setSelection(2);
    expect(library.selectedItem()).toBe("c");

    // when items change
    library.setItems(["a", "c", "d"]);
    expect(library.selectedItem()).toBe("c");

    // when filters change
    library.setFilters([(item) => item !== "a"]);
    expect(library.selectedItem()).toBe("c");
  });

  it("drops selection through changes when not possible to keep", () => {
    library.setItems(["a", "b", "c", "d"]);
    library.setSelection(2);
    expect(library.selectedItem()).toBe("c");

    // when items change
    library.setItems(["a", "b", "d"]);
    expect(library.selectedItem()).toBe(undefined);

    library.setSelection(1);
    expect(library.selectedItem()).toBe("b");

    //when filters change
    library.setFilters([(item) => item !== "b"]);
    expect(library.selectedItem()).toBe(undefined);
  });
});
