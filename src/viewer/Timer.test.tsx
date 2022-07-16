import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { render } from "solid-testing-library";
import { Result } from "solid-testing-library/dist/types";
import { Timer } from "~/viewer/Timer";
import { ReplayStoreContext, ReplayStoreState } from "~/state/replayStore";
import { createStore, SetStoreFunction } from "solid-js/store";

describe("<Timer />", () => {
  let component: Result;
  let setStore: SetStoreFunction<ReplayStoreState>;

  beforeEach(() => {
    const store = createStore<ReplayStoreState>({
      replayData: {
        // @ts-ignore fake is missing settings
        settings: { timerStart: 8 * 60 /* seconds */ },
      },
      frame: 0,
    });
    setStore = store[1];
    component = render(() => (
      // @ts-ignore fake is missing actions
      <ReplayStoreContext.Provider value={[store[0], {}]}>
        <Timer />
      </ReplayStoreContext.Provider>
    ));
  });

  afterEach(() => {
    component?.unmount();
  });

  test("renders", () => {
    expect(component.container.querySelector("text")).toMatchInlineSnapshot(`
      <text
        class="fill-slate-800"
        style="font: sans-serif 15px bold 15px; transform: scaleY(-1);"
        text-anchor="middle"
        y="-42%"
      >
        08:02:06
      </text>
    `);
  });

  test("timer is offset by 123 frames", () => {
    // The timer doesn't start until after the characters drop in and "GO!" appears.
    setStore("frame", 123);
    expect(component.container.querySelector("text")!.textContent).toBe(
      "08:00:00"
    );
  });

  test("counts down 2 minutes", () => {
    setStore("frame", 123 + 60 * 60 * 2);
    expect(component.container.querySelector("text")!.textContent).toBe(
      "06:00:00"
    );
  });

  test("counts down 3 seconds", () => {
    setStore("frame", 123 + 60 * 3);
    expect(component.container.querySelector("text")!.textContent).toBe(
      "07:57:00"
    );
  });

  test("counts down 50 hundredths", () => {
    setStore("frame", 123 + 30);
    expect(component.container.querySelector("text")!.textContent).toBe(
      "07:59:51"
    );
  });
});
