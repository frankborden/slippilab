import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { render } from "solid-testing-library";
import { Result } from "solid-testing-library/dist/types";
import { Timer } from "~/viewer/Timer";
import { ReplayStoreContext } from "~/state/replayStore";
import { createFakeReplayStore, sampleReplay } from "~/state/replayStore.fake";

describe("<Timer />", () => {
  let component: Result;
  const [store, setState] = createFakeReplayStore();

  beforeAll(() => {
    setState("replayData", sampleReplay);
    expect(sampleReplay.settings.timerStart).toBe(
      8 * 60 /* 8 minutes in seconds */
    );
  });

  beforeEach(() => {
    setState("frame", 0);
    component = render(() => (
      <ReplayStoreContext.Provider value={store}>
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
    setState("frame", 123);
    expect(component.container.querySelector("text")!.textContent).toBe(
      "08:00:00"
    );
  });

  test("counts down 2 minutes", () => {
    setState("frame", 123 + 60 * 60 * 2);
    expect(component.container.querySelector("text")!.textContent).toBe(
      "06:00:00"
    );
  });

  test("counts down 3 seconds", () => {
    setState("frame", 123 + 60 * 3);
    expect(component.container.querySelector("text")!.textContent).toBe(
      "07:57:00"
    );
  });

  test("counts down 50 hundredths", () => {
    setState("frame", 123 + 30);
    expect(component.container.querySelector("text")!.textContent).toBe(
      "07:59:51"
    );
  });
});
