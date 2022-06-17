import {
  adjust,
  speedFast,
  jump,
  jumpPercent,
  pause,
  speedSlow,
  tick,
  tickBack,
  togglePause,
  speedNormal,
  zoomOut,
  zoomIn,
  nextFile,
  previousFile,
  toggleDebug,
  nextClip,
  previousClip,
  store,
  StoreWithReplay,
} from "~/state";
import { onCleanup, onMount, Show } from "solid-js";

export function Controls() {
  onMount(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  });
  onCleanup(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
  });

  function onKeyDown({ key }: KeyboardEvent): void {
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
        nextClip();
        break;
      case ";":
      case ":":
        previousClip();
        break;
      case "d":
        toggleDebug();
        break;
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
    <foreignObject
      transform="scale(1 -1)"
      x="-50%"
      y="-50%"
      width="100%"
      height="100%"
    >
      <div class="flex items-center justify-evenly gap-4 pl-2 pr-4 text-slate-800">
        <div class="w-[6ch] text-end">
          {store.isDebug ? store.frame - 123 : store.frame}
        </div>
        <div class="flex items-center gap-2">
          <div
            class="material-icons cursor-pointer text-3xl"
            onClick={() => adjust(-120)}
            aria-label="Rewind 2 seconds"
          >
            history
          </div>
          <div
            class="material-icons cursor-pointer text-3xl"
            onClick={() => {
              pause();
              tickBack();
            }}
            aria-label="Rewind 1 frame"
          >
            rotate_left
          </div>
          <Show
            when={store.running}
            fallback={
              <div
                class="material-icons cursor-pointer text-4xl"
                onClick={() => {
                  togglePause();
                  // tick();
                }}
                aria-label="Resume playback"
              >
                play_arrow
              </div>
              // <Play
              //   style={{ cursor: "pointer" }}
              //   size={32}
              //   weight="fill"
              //   onClick={() => togglePause()}
              // />
            }
          >
            <div
              class="material-icons cursor-pointer text-4xl"
              onClick={() => {
                togglePause();
                // tick();
              }}
              aria-label="pause playback"
            >
              pause
            </div>
          </Show>
          <div
            class="material-icons cursor-pointer text-3xl"
            onClick={() => {
              pause();
              tick();
            }}
            aria-label="Skip ahead 1 frame"
          >
            rotate_right
          </div>
          <div
            class="material-icons cursor-pointer text-3xl"
            onClick={() => adjust(120)}
            aria-label="Skip ahead 2 seconds"
          >
            update
          </div>
        </div>
        <input
          class="flex-grow accent-green-900"
          type="range"
          ref={seekbarInput}
          value={store.frame}
          max={(store as StoreWithReplay).replayData.frames.length - 1}
          onInput={() => jump(Number(seekbarInput.value))}
        />
        <div class="flex items-center gap-2">
          <div
            class="material-icons cursor-pointer text-4xl"
            onClick={() => zoomOut()}
            aria-label="Zoom out"
          >
            zoom_out
          </div>
          <div
            class="material-icons cursor-pointer text-4xl"
            onClick={() => zoomIn()}
            aria-label="Zoom in"
          >
            zoom_in
          </div>
        </div>
      </div>
    </foreignObject>
  );
}
