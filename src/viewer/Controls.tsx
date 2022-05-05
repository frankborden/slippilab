import {
  adjust,
  jump,
  jumpPercent,
  pause,
  play,
  tick,
  tickBack,
  togglePause,
} from "../state";
import { Button } from "@hope-ui/solid";
import { onCleanup, onMount } from "solid-js";

export function Controls() {
  onMount(() => window.addEventListener("keydown", handleKey));
  onCleanup(() => window.addEventListener("keydown", handleKey));
  function handleKey({ key }: KeyboardEvent) {
    switch (key) {
      case "k":
      case " ":
        togglePause();
        break;
      case "ArrowRight":
      case "l":
        adjust(120);
        break;
      case "ArrowLeft":
      case "j":
        adjust(-120);
        break;
      case ".":
        pause();
        tick();
        break;
      case ",":
        pause();
        tickBack();
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        const percent = Number(key) * 0.1; // [0,1]
        jumpPercent(percent);
        break;
    }
  }
  return (
    <foreignObject
      transform="scale(1 -1)"
      x="-50%"
      y="-50%"
      width="100%"
      height="100%"
    >
      <Button onClick={() => play()}>Play</Button>
      <Button onClick={() => pause()}>Pause</Button>
      <Button onClick={() => tick()}>Tick</Button>
      <Button onClick={() => tickBack()}>Tick Back</Button>
      <Button onClick={() => jump(0)}>Reset</Button>
      <Button onClick={() => adjust(-120)}>Rewind 2s</Button>
      <Button onClick={() => adjust(120)}>Ahead 2s</Button>
    </foreignObject>
  );
}
