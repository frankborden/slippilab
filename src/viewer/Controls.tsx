import {
  adjust,
  speedFast,
  jump,
  jumpPercent,
  pause,
  speedSlow,
  state,
  tick,
  tickBack,
  togglePause,
  speedNormal,
  zoomOut,
  zoomIn,
  nextFile,
  previousFile,
} from "../state";
import { Center, hope } from "@hope-ui/solid";
import { onCleanup, onMount } from "solid-js";
import styles from "./Controls.module.css";

export function Controls() {
  onMount(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  });
  onCleanup(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  });

  function onKeyDown({ key }: KeyboardEvent) {
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
        const percent = Number(key) * 0.1; // convert 3 => 30%
        jumpPercent(percent);
        break;
      case "ArrowUp":
        speedSlow();
        break;
      case "ArrowDown":
        speedFast();
        break;
      case "-":
      case "_":
        zoomOut();
        break;
      case "=":
      case "+":
        zoomIn();
        break;
      case "]":
      case "}":
        nextFile();
        break;
      case "[":
      case "{":
        previousFile();
        break;
    }
  }

  function onKeyUp({ key }: KeyboardEvent) {
    switch (key) {
      case "ArrowUp":
      case "ArrowDown":
        speedNormal();
        break;
    }
  }

  let seekbarInput!: HTMLInputElement;

  return (
    <foreignObject
      transform="scale(1 -1)"
      x="-50%"
      y="-50%"
      width="100%"
      height="100%"
    >
      <Center>
        <hope.input
          class={styles.seekbarInput}
          type="range"
          width="$lg"
          ref={seekbarInput}
          value={state.frame()}
          max={state.replayData()!.frames.length - 1}
          onInput={() => jump(Number(seekbarInput!.value))}
        ></hope.input>
      </Center>
    </foreignObject>
  );
}
