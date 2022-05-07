import { createMemo } from "solid-js";
import { state } from "../state";

export function Timer() {
  const time = createMemo(() => {
    const frames = state.replayData()!.settings.timerStart * 60 - state.frame();
    const minutes = Math.floor(frames / (60 * 60))
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((frames % (60 * 60)) / 60)
      .toString()
      .padStart(2, "0");
    // TODO match Melee's frame -> hundredths calculation
    const hundredths = ((frames % 60) / 60).toFixed(2).slice(2);
    return `${minutes}:${seconds}:${hundredths}`;
  });
  return (
    <text
      style={{ font: "bold 15px sans-serif", transform: "scaleY(-1)" }}
      text-anchor="middle"
      y="-42%"
      textContent={time()}
      fill="#DDDDDD"
    />
  );
}
