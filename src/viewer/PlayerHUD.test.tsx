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
import { PlayerHUD } from "~/viewer/PlayerHUD";
import { ReplayStoreContext } from "~/state/replayStore";
import {
  createFakeReplayStore,
  createFakeRenderData,
  sampleReplay,
} from "~/state/replayStore.fake";

describe("<PlayerHUD />", () => {
  let component: Result;
  const [store, setState] = createFakeReplayStore();

  beforeAll(() => {
    setState("frame", 300);
    setState("replayData", sampleReplay);
    setState("renderDatas", [createFakeRenderData(300, 0, sampleReplay)]);
  });

  beforeEach(() => {
    component = render(() => (
      <ReplayStoreContext.Provider value={store}>
        <PlayerHUD player={0} />
      </ReplayStoreContext.Provider>
    ));
  });

  afterEach(() => {
    component?.unmount();
  });

  test("renders", () => {
    expect(component.container).toMatchInlineSnapshot(`
      <div>
        <circle
          cx="-33%"
          cy="-40%"
          fill="red"
          r="5"
          stroke="black"
        />
        <circle
          cx="-31%"
          cy="-40%"
          fill="red"
          r="5"
          stroke="black"
        />
        <circle
          cx="-29%"
          cy="-40%"
          fill="red"
          r="5"
          stroke="black"
        />
        <circle
          cx="-27%"
          cy="-40%"
          fill="red"
          r="5"
          stroke="black"
        />
        <text
          fill="red"
          stroke="black"
          style="font: sans-serif 15px bold 15px; transform: scaleY(-1);"
          text-anchor="middle"
          x="-30%"
          y="44%"
        >
          20%
        </text>
        <text
          fill="red"
          stroke="black"
          style="font: sans-serif 15px bold 15px; transform: scaleY(-1);"
          text-anchor="middle"
          x="-30%"
          y="47%"
        >
          Fox
        </text>
      </div>
    `);
  });

  test("shows stock count", () => {
    expect(component.container.querySelectorAll("circle")).toHaveLength(4);
  });

  test("shows percent", () => {
    const percentElement = component.getByText("%", {
      exact: false,
    }) as HTMLElement;
    expect(percentElement.textContent).toBe(
      `${sampleReplay.frames[300].players[0].state.percent}%`
    );
  });

  test("shows character", () => {
    expect(component.getByText("Fox")).toHaveProperty("textContent");
  });
});
