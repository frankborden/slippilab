import { onCleanup, onMount, Show } from "solid-js";
import {
  replayStore,
  adjust,
  jump,
  jumpPercent,
  nextHighlight,
  pause,
  previousHighlight,
  speedFast,
  speedNormal,
  speedSlow,
  toggleDebug,
  toggleFullscreen,
  toggleInputDisplay,
  togglePause,
  zoomIn,
  zoomOut,
} from "~/state/replayStore";
import { nextFile, previousFile } from "~/state/selectionStore";

export function Controls() {
  onMount(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  });
  onCleanup(() => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  });

  function onKeyDown({ key }: KeyboardEvent): void {
    switch (key) {
      case "k":
      case "K":
      case " ":
        togglePause();
        break;
      case "ArrowRight":
      case "l":
      case "L":
        adjust(120);
        break;
      case "ArrowLeft":
      case "j":
      case "J":
        adjust(-120);
        break;
      case ".":
      case ">":
        pause();
        adjust(1);
        break;
      case ",":
      case "<":
        pause();
        adjust(-1);
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
        jumpPercent(Number(key) * 0.1); // convert 3 => 30%
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
        void nextFile();
        break;
      case "[":
      case "{":
        void previousFile();
        break;
      case "'":
      case '"':
        nextHighlight();
        break;
      case ";":
      case ":":
        previousHighlight();
        break;
      case "d":
      case "D":
        toggleDebug();
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
      case "c":
      case "C":
        toggleInputDisplay();
    }
  }

  function onKeyUp({ key }: KeyboardEvent): void {
    switch (key) {
      case "ArrowUp":
      case "ArrowDown":
        speedNormal();
        break;
    }
  }

  let seekbarInput!: HTMLInputElement;

  return (
    <div class="flex flex-wrap items-center justify-evenly gap-4 rounded-lg border pl-2 pr-4 text-slate-800">
      <Show
        when={replayStore.running}
        fallback={
          <div
            class="material-icons cursor-pointer text-7xl md:text-5xl"
            onClick={() => togglePause()}
            aria-label="Resume playback"
          >
            play_arrow
          </div>
        }
      >
        <div
          class="material-icons cursor-pointer text-7xl md:text-5xl"
          onClick={() => togglePause()}
          aria-label="pause playback"
        >
          pause
        </div>
      </Show>
      <label for="seekbar" class="text-sm">
        {replayStore.isDebug ? replayStore.frame - 123 : replayStore.frame}
      </label>
      <input
        id="seekbar"
        class="flex-grow accent-slippi-500"
        type="range"
        ref={seekbarInput}
        value={replayStore.frame}
        max={replayStore.replayData!.frames.length - 1}
        onInput={() => jump(seekbarInput.valueAsNumber)}
      />
      <div class="flex items-center gap-2">
        <div
          class="material-icons cursor-pointer text-7xl md:text-4xl"
          onClick={() => adjust(-120)}
          aria-label="Rewind 2 seconds"
        >
          history
        </div>
        <div
          class="material-icons cursor-pointer text-7xl md:text-4xl"
          onClick={() => {
            pause();
            adjust(-1);
          }}
          aria-label="Rewind 1 frame"
        >
          rotate_left
        </div>
        <div
          class="material-icons cursor-pointer text-7xl md:text-4xl"
          onClick={() => {
            pause();
            adjust(1);
          }}
          aria-label="Skip ahead 1 frame"
        >
          rotate_right
        </div>
        <div
          class="material-icons cursor-pointer text-7xl md:text-4xl"
          onClick={() => adjust(120)}
          aria-label="Skip ahead 2 seconds"
        >
          update
        </div>
        <div
          class="material-icons cursor-pointer text-7xl md:text-4xl"
          onClick={() => toggleFullscreen()}
          aria-label="Toggle fullscreen mode"
        >
          {replayStore.isFullscreen ? "fullscreen_exit" : "fullscreen"}
        </div>
      </div>
    </div>
  );
}
