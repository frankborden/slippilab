import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { fireEvent, render as renderForTest } from "solid-testing-library";
import { createSignal } from "solid-js";
import { inc } from "rambda";
import { Options, Result, Ui } from "solid-testing-library/dist/types";

function Hello(props: { initialCount: number }) {
  const [count, setCount] = createSignal(props.initialCount);
  return (
    <div>
      <div>Count is {count()}</div>
      <button onClick={() => setCount(inc)}>Increment</button>
    </div>
  );
}

describe("<Hello />", () => {
  let result: Result | undefined;

  function render(component: Ui, options?: Options) {
    result = renderForTest(component, options);
    return result;
  }

  beforeEach(() => {
    result = undefined;
  });

  afterEach(() => {
    result?.unmount();
  });

  test("renders", () => {
    const { container } = render(() => <Hello initialCount={4} />);
    expect(container.innerHTML).toMatchInlineSnapshot(
      '"<div><div>Count is 4</div><button>Increment</button></div>"'
    );
  });

  test("updates", async () => {
    const { container, queryByText } = render(() => <Hello initialCount={4} />);
    const button = (await queryByText("Increment")) as HTMLButtonElement;
    fireEvent.click(button);

    expect(container.innerHTML).toMatchInlineSnapshot(
      '"<div><div>Count is 5</div><button>Increment</button></div>"'
    );
  });
});
