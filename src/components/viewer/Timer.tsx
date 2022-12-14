import { createMemo } from "solid-js";
import { replayStore } from "~/state/replayStore";

export function Timer() {
  const meleeHundredths = [
    "00",
    "02",
    "04",
    "06",
    "07",
    "09",
    "11",
    "12",
    "14",
    "16",
    "17",
    "19",
    "21",
    "22",
    "24",
    "26",
    "27",
    "29",
    "31",
    "32",
    "34",
    "36",
    "37",
    "39",
    "41",
    "42",
    "44",
    "46",
    "47",
    "49",
    "51",
    "53",
    "54",
    "56",
    "58",
    "59",
    "61",
    "63",
    "64",
    "66",
    "68",
    "69",
    "71",
    "73",
    "74",
    "76",
    "78",
    "79",
    "81",
    "83",
    "84",
    "86",
    "88",
    "89",
    "91",
    "93",
    "94",
    "96",
    "98",
    "99",
  ];
  const time = createMemo(() => {
    const frames =
      replayStore.replayData!.settings.timerStart * 60 -
      replayStore.frame +
      123;
    const minutes = Math.floor(frames / (60 * 60))
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((frames % (60 * 60)) / 60)
      .toString()
      .padStart(2, "0");
    const hundredths = meleeHundredths[frames % 60];
    return `${minutes}:${seconds}:${hundredths}`;
  });
  return (
    <text
      style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
      text-anchor="middle"
      y="-42%"
      textContent={time()}
      class="fill-slate-800"
    />
  );
}
