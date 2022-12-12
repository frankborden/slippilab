import { createMemo, For, Match, Switch } from "solid-js";
import { stageNameByExternalId } from "~/common/ids";
import { replayStore } from "~/state/replayStore";

export function Stage() {
  const stageName = createMemo(
    () => stageNameByExternalId[replayStore.replayData!.settings.stageId]
  );
  return (
    <Switch>
      <Match when={stageName() === "Battlefield"}>
        <Battlefield />
      </Match>
      <Match when={stageName() === "Dream Land N64"}>
        <Dreamland />
      </Match>
      <Match when={stageName() === "Final Destination"}>
        <FinalDestination />
      </Match>
      <Match when={stageName() === "Yoshi's Story"}>
        <YoshisStory />
      </Match>
      <Match when={stageName() === "Fountain of Dreams"}>
        <FountainOfDreams />
      </Match>
      <Match when={stageName() === "Pokémon Stadium"}>
        <PokemonStadium />
      </Match>
    </Switch>
  );
}

function Battlefield() {
  const mainStage = [
    "-68.4, 0",
    " 68.4, 0",
    "65, -6",
    "36, -19",
    "39, -21",
    "33, -25",
    "30, -29",
    "29, -35",
    "10, -40",
    "10, -30",
    "-10, -30",
    "-10, -40",
    "-29, -35",
    "-30, -29",
    "-33, -25",
    "-39, -21",
    "-36, -19",
    "-65, -6",
    "-68.4, 0",
  ];
  const platforms = [
    ["-57.6, 27.2", "-20, 27.2"],
    ["20, 27.2", "57.6, 27.2"],
    ["-18.8, 54.4", "18.8, 54.4"],
  ];
  const blastzones = [
    [-224, -108.8],
    [224, 200],
  ];
  return (
    <>
      <Grid blastzones={blastzones} />
      <polyline points={mainStage.join(" ")} class="fill-slate-800" />
      <For each={platforms}>
        {(points) => (
          <polyline points={points.join(" ")} class="stroke-slate-800" />
        )}
      </For>
      <rect
        x={blastzones[0][0]}
        y={blastzones[0][1]}
        width={blastzones[1][0] - blastzones[0][0]}
        height={blastzones[1][1] - blastzones[0][1]}
        fill="none"
        class="stroke-slate-800"
      />
    </>
  );
}

function Dreamland() {
  const mainStage = [
    "-76.5, -11",
    "-77.25, 0",
    "77.25, 0",
    "76.5, -11",
    "76.5, -11",
    "65.75, -36",
    "-65.75, -36",
    "-76.5, -11",
  ];
  const platforms = [
    ["-61.393, 30.142", "-31.725, 30.142"],
    ["31.704, 30.243", "63.075, 30.243"],
    ["-19.018, 51.425", "19.017, 51.425"],
  ];
  const blastzones = [
    [-255, -123],
    [255, 250],
  ];
  return (
    <>
      <Grid blastzones={blastzones} />
      <polyline points={mainStage.join(" ")} class="fill-slate-800" />
      <For each={platforms}>
        {(points) => (
          <polyline points={points.join(" ")} class="stroke-slate-800" />
        )}
      </For>
      <rect
        x={blastzones[0][0]}
        y={blastzones[0][1]}
        width={blastzones[1][0] - blastzones[0][0]}
        height={blastzones[1][1] - blastzones[0][1]}
        fill="none"
        class="stroke-slate-800"
      />
    </>
  );
}

function FinalDestination() {
  const mainStage = [
    "-85.6, 0",
    "85.6, 0",
    "85.6, -10",
    "65, -20",
    "65, -30",
    "60, -47",
    "50, -55",
    "45, -56",
    "-45, -56",
    "-50, -55",
    "-60, -47",
    "-65, -30",
    "-65, -20",
    "-85.6, -10",
    "-85.6, 0",
  ];
  const blastzones = [
    [-246, -140],
    [246, 188],
  ];
  return (
    <>
      <Grid blastzones={blastzones} />
      <polyline points={mainStage.join(" ")} class="fill-slate-800" />
      <rect
        x={blastzones[0][0]}
        y={blastzones[0][1]}
        width={blastzones[1][0] - blastzones[0][0]}
        height={blastzones[1][1] - blastzones[0][1]}
        fill="none"
        class="stroke-slate-800"
      />
    </>
  );
}

function YoshisStory() {
  const mainStage = [
    "-54, -91",
    "-54, -47",
    "-53, -46",
    "-53, -31",
    "-54, -30",
    "-54, -28",
    "-53, -27",
    "-53, -12",
    "-53, -12",
    "-54, -11",
    "-55, -8",
    "-56, -7",
    "-56, -3.5",
    "-39, 0",
    "39, 0",
    "56, -3.5",
    "56, -7",
    "55, -8",
    "54, -11",
    "53, -12",
    "53, -27",
    "54, -28",
    "54, -30",
    "53, -31",
    "53, -46",
    "54, -47",
    "54, -91",
    "-54, -91",
  ];
  const platforms = [
    ["-59.5, 23.45", "-28, 23.45"],
    ["28, 23.45", "59.5, 23.45"],
    ["-15.75, 42", "15.75, 42"],
  ];
  const randall = createMemo(() => {
    const cornerPositions: {
      [frameCount: number]: [y: number, xLeft: number];
    } = {
      416: [-33.184478759765625, 89.75263977050781],
      417: [-33.04470443725586, 90.07878112792969],
      418: [-32.904930114746094, 90.40492248535156],
      419: [-32.76515197753906, 90.73107147216797],
      420: [-32.49260711669922, 90.92455291748047],
      421: [-32.16635513305664, 91.06437683105469],
      422: [-31.84010314941406, 91.20419311523438],
      423: [-31.513851165771484, 91.3440170288086],
      469: [-15.1948881149292, 91.3371353149414],
      470: [-14.868742942810059, 91.1973648071289],
      471: [-14.542601585388184, 91.05758666992188],
      472: [-14.216456413269043, 90.91781616210938],
      473: [-13.967143058776855, 90.71036529541016],
      474: [-13.869664192199707, 90.36917877197266],
      475: [-13.772183418273926, 90.02799224853516],
      476: [-13.674698829650879, 89.68680572509766],
      1069: [-31.59004211425781, -103.554931640625],
      1070: [-31.907413482666016, -103.39625549316406],
      1071: [-32.22478485107422, -103.23756408691406],
      1072: [-32.54215621948242, -103.07887268066406],
      1073: [-32.7216796875, -102.77439880371094],
      1074: [-32.89775085449219, -102.46626281738281],
      1075: [-33.07382583618164, -102.15814208984375],
      1016: [-13.679760932922363, -101.919677734375],
      1017: [-13.819535255432129, -102.24581909179688],
      1018: [-13.959305763244629, -102.57196044921875],
      1019: [-14.099089622497559, -102.8981018066406],
      1020: [-14.320136070251465, -103.1476135253906],
      1021: [-14.6375150680542, -103.3063049316406],
      1022: [-14.954894065856934, -103.4649963378906],
    };
    // return frameNumber to -123 based.
    const frameInLap = (replayStore.frame - 123 + 1200) % 1200;
    const randallWidth = 11.9;

    if (frameInLap > 476 && frameInLap < 1016) {
      const start = 101.235443115234;
      const speed = -0.35484;
      const frameInSection = frameInLap - 477;
      const y = -13.64989;
      const left = [start - randallWidth + speed * frameInSection, y];
      const right = [start + speed * frameInSection, y];
      return [left, right];
    }
    if (frameInLap > 1022 && frameInLap < 1069) {
      const start = -15.2778692245483;
      const speed = -0.354839325;
      const frameInSection = frameInLap - 1023;
      const y = start + speed * frameInSection;
      const left = [-103.6, y];
      const right = [-91.7, y];
      return [left, right];
    }
    if (frameInLap > 1075 || frameInLap < 416) {
      const start = -101.850006103516;
      const speed = 0.35484;
      const frameInSection = frameInLap + (frameInLap < 416 ? 125 : -1076);
      const y = -33.2489;
      const left = [start + speed * frameInSection, y];
      const right = [start + randallWidth + speed * frameInSection, y];
      return [left, right];
    }
    if (frameInLap > 423 && frameInLap < 469) {
      const start = -31.16023254394531;
      const speed = 0.354839325;
      const frameInSection = frameInLap - 424;
      const y = start + speed * frameInSection;
      const left = [91.35, y];
      const right = [103.25, y];
      return [left, right];
    }

    const position = cornerPositions[frameInLap];
    const y = position[0];
    const left = [position[1], y];
    const right = [position[1] + randallWidth, y];
    return [left, right];
  });
  const blastzones = [
    [-175.7, -91],
    [173.6, 169],
  ];
  return (
    <>
      <Grid blastzones={blastzones} />
      <polyline
        points={mainStage.join(" ")}
        class="fill-slate-800 stroke-slate-800"
      />
      <For each={platforms}>
        {(points) => (
          <polyline points={points.join(" ")} class="stroke-slate-800" />
        )}
      </For>
      <polyline points={randall().join(" ")} class="stroke-slate-400" />
      <rect
        x={blastzones[0][0]}
        y={blastzones[0][1]}
        width={blastzones[1][0] - blastzones[0][0]}
        height={blastzones[1][1] - blastzones[0][1]}
        fill="none"
        class="stroke-slate-800"
      />
    </>
  );
}

function FountainOfDreams() {
  const mainStage = [
    "-63.33, 0.62",
    "-53.5, 0.62",
    "-51, 0",
    "51, 0",
    "53.5, 0.62",
    "63.33, 0.62",
    "63.35, 0.62",
    "63.35, -4.5",
    "59.33, -15",
    "56.9, -19.5",
    "55, -27",
    "52, -32",
    "48, -38",
    "41, -42",
    "19, -49.5",
    "13, -54.5",
    "10, -62",
    "8.8, -72",
    "8.8, -150",
    "-8.8, -150",
    "-8.8, -72",
    "-10, -62",
    "-13, -54.5",
    "-19, -49.5",
    "-41, -42",
    "-48, -38",
    "-52, -32",
    "-55, -27",
    "-56.9, -19.5",
    "-59.33, -15",
    "-63.35, -4.5",
    "-63.35, 0.62",
    "-63.35, -4.5",
    "-63.33, 0.62",
  ];
  const platforms = [
    ["-49.5, 16.125", "-21, 16.125"],
    ["21, 22.125", "49.5, 22.125"],
    ["-14.25, 42.75", "14.25, 42.75"],
  ];
  const blastzones = [
    [-198.75, -146.25],
    [198.75, 202.5],
  ];
  return (
    <>
      <Grid blastzones={blastzones} />
      <polyline points={mainStage.join(" ")} class="fill-slate-800" />
      <For each={platforms.slice(0, 2)}>
        {(points) => (
          <polyline
            points={points.join(" ")}
            stroke-dasharray="2,4"
            class="stroke-slate-800"
          />
        )}
      </For>
      <polyline
        points={platforms[platforms.length - 1].join(" ")}
        class="stroke-slate-800"
      />
      <rect
        x={blastzones[0][0]}
        y={blastzones[0][1]}
        width={blastzones[1][0] - blastzones[0][0]}
        height={blastzones[1][1] - blastzones[0][1]}
        fill="none"
        class="stroke-slate-800"
      />
    </>
  );
}

function PokemonStadium() {
  const mainStage = [
    "87.75, 0",
    "87.75, -4",
    "73.75, -15",
    "73.75, -17.75",
    "60, -17.75",
    "60, -38",
    "15, -60",
    "15, -112",
    "-15, -112",
    "-15, -60",
    "-60, -38",
    "-60, -17.75",
    "-73.75, -17.75",
    "-73.75, -15",
    "-87.75, -4",
    "-87.75, 0",
    "87.75, 0",
  ];
  const platforms = [
    ["-55, 25", "-25, 25"],
    ["25, 25", "55, 25"],
  ];
  const blastzones = [
    [-230, -111],
    [230, 180],
  ];
  return (
    <>
      <Grid blastzones={blastzones} />
      <polyline points={mainStage.join(" ")} class="fill-slate-800" />
      <For each={platforms}>
        {(points) => (
          <polyline points={points.join(" ")} class="stroke-slate-800" />
        )}
      </For>
      <rect
        x={blastzones[0][0]}
        y={blastzones[0][1]}
        width={blastzones[1][0] - blastzones[0][0]}
        height={blastzones[1][1] - blastzones[0][1]}
        fill="none"
        class="stroke-slate-800"
      />
    </>
  );
}
function Grid(props: { blastzones: number[][] }) {
  const lines = createMemo(() => {
    const left = props.blastzones[0][0];
    const bottom = props.blastzones[0][1];
    const right = props.blastzones[1][0];
    const top = props.blastzones[1][1];
    const result = [];
    for (let x = props.blastzones[0][0]; x < props.blastzones[1][0]; x += 5) {
      result.push([x, x, bottom, top]);
    }
    for (let y = props.blastzones[0][0]; y < props.blastzones[1][0]; y += 5) {
      result.push([left, right, y, y]);
    }
    return result;
  });
  return (
    <For each={lines()}>
      {([x1, x2, y1, y2]) => (
        <line
          class="stroke-slippi-50 stroke-[0.1]"
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
        />
      )}
    </For>
  );
}
