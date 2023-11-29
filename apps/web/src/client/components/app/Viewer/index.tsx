import { type ReplayData } from "@slippilab/common";
import { queries, search } from "@slippilab/search";
import { createShortcut } from "@solid-primitives/keyboard";
import {
  type Accessor,
  For,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
} from "solid-js";

import { Controller } from "~/client/components/app/Controller";
import { Camera } from "~/client/components/app/Viewer/Camera";
import { HUD } from "~/client/components/app/Viewer/HUD";
import { Item } from "~/client/components/app/Viewer/Item";
import { Player } from "~/client/components/app/Viewer/Player";
import { Stage } from "~/client/components/app/Viewer/Stage";
import { fetchAnimations } from "~/client/components/app/Viewer/animationCache";
import { bgColor, getPlayerColor } from "~/client/components/app/Viewer/colors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/client/components/ui/select";
import {
  Slider,
  SliderFill,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from "~/client/components/ui/slider";
import { cn } from "~/client/components/utils";
import {
  frame,
  running,
  setFrame,
  setSpeed,
  speed,
  start,
  stop,
} from "~/client/state/watch";
import { renderReplay } from "~/common/render";

export { getPlayerColor, fetchAnimations };

const [resumeAfterDrag, setResumeAfterDrag] = createSignal(false);
start();

export function Viewer(props: { replay: ReplayData; file?: File }) {
  onCleanup(() => {
    stop();
  });
  createEffect(() => {
    if (frame() === props.replay.frames.length - 1) {
      stop();
    }
  });
  const renderDatas = createMemo(() => renderReplay(props.replay));
  const currentPlayers = createMemo(() => renderDatas()[frame()]);
  const currentItems = createMemo(() => props.replay.frames[frame()].items);
  const animationResources = [
    createAnimationResource(() => props.replay, 0)[0],
    createAnimationResource(() => props.replay, 1)[0],
    createAnimationResource(() => props.replay, 2)[0],
    createAnimationResource(() => props.replay, 3)[0],
  ];
  const highlights = createMemo(() =>
    Object.fromEntries(
      Object.entries(queries).map(([name, query]) => [
        name,
        search(props.replay, ...query),
      ]),
    ),
  );
  const [highlightName, setHighlightName] = createSignal(
    "Kill Combos" satisfies keyof typeof queries,
  );

  return (
    <div>
      <div class="flex gap-8">
        <div class="flex flex-col gap-2">
          <svg
            class={cn("w-[36rem] rounded-sm border", bgColor)}
            viewBox="-365 -300 730 600"
          >
            {/* up = positive y axis */}
            <g class="-scale-y-100">
              <Camera replay={props.replay} frame={frame()}>
                <Stage replay={props.replay} frame={frame()} />
                <For each={currentPlayers()}>
                  {(player) => (
                    <Player
                      replay={props.replay}
                      player={player}
                      animations={
                        animationResources[player.playerSettings.playerIndex]
                      }
                    />
                  )}
                </For>
                <For each={currentItems()}>
                  {(item) => <Item replay={props.replay} item={item} />}
                </For>
              </Camera>
              <HUD
                replay={props.replay}
                frame={frame()}
                renderDatas={currentPlayers()}
              />
            </g>
          </svg>
          <Seekbar length={props.replay.frames.length} />
        </div>
        <div>
          <Select
            value={highlightName()}
            onChange={setHighlightName}
            options={Object.keys(queries)}
            itemComponent={(props) => (
              <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
            )}
          >
            <SelectTrigger>
              <SelectValue<string>>
                {(state) => state.selectedOption()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>

          <div class="mt-2 grid max-h-[32rem] grid-cols-[repeat(3,auto)] overflow-y-auto overflow-x-hidden border-b">
            <For
              each={highlights()[highlightName()]}
              fallback={<div>None</div>}
            >
              {(highlight) => (
                <button
                  class="col-span-full grid grid-cols-[subgrid] items-center gap-x-1 rounded-sm px-2 py-1.5 transition-colors duration-100 hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
                  onClick={() => {
                    setFrame(Math.max(0, highlight.startFrame - 60));
                    start();
                  }}
                >
                  <div class="mr-4 flex items-center gap-1.5">
                    <div
                      class={cn(
                        "i-tabler-circle-filled h-2",
                        highlight.playerIndex === 0
                          ? "text-red-500"
                          : highlight.playerIndex === 1
                            ? "text-blue-500"
                            : highlight.playerIndex === 2
                              ? "text-yellow-400"
                              : "text-green-500",
                      )}
                    />
                    <div>P{highlight.playerIndex + 1}</div>
                  </div>
                  <div>Frame</div>
                  <div class="whitespace-nowrap text-sm">
                    {highlight.startFrame}-{highlight.endFrame}
                  </div>
                </button>
              )}
            </For>
          </div>
        </div>
        <div class="grid grow grid-cols-2 gap-x-8">
          <For each={currentPlayers()}>
            {(player) => (
              <div class="flex flex-col items-center [&>svg]:w-[75%]">
                <Controller replay={props.replay} renderData={player} />
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

function Seekbar(props: { length: number }) {
  return (
    <Slider
      value={[frame() + 1]}
      onChange={(newValue) => {
        if (running()) {
          stop();
          setResumeAfterDrag(true);
        }
        setFrame(newValue[0] - 1);
      }}
      onChangeEnd={() => {
        if (resumeAfterDrag()) {
          start();
          setResumeAfterDrag(false);
        }
      }}
      minValue={1}
      maxValue={props.length - 1}
    >
      <SliderTrack>
        <SliderFill />
        <SliderThumb />
      </SliderTrack>
      <div class="mt-1 flex items-center justify-between w-full">
        <div class="flex items-center gap-[0.5ch] text-foreground/80">
          <SliderLabel>Frame</SliderLabel> <SliderValueLabel />
        </div>
        <Controls length={props.length} />
      </div>
    </Slider>
  );
}

function Controls(props: { length: number }) {
  createShortcut(["k"], () => (running() ? stop() : start()));
  createShortcut([" "], () => (running() ? stop() : start()));
  createShortcut(["j"], () => setFrame((f) => Math.max(f - 120, 0)));
  createShortcut(["ArrowLeft"], () => setFrame((f) => Math.max(f - 120, 0)));
  createShortcut(["l"], () =>
    setFrame((f) => Math.min(f + 120, props.length - 1)),
  );
  createShortcut(["ArrowRight"], () =>
    setFrame((f) => Math.min(f + 120, props.length - 1)),
  );
  createShortcut([","], () => {
    stop();
    setFrame(Math.max(0, frame() - 1));
  });
  createShortcut(["."], () => {
    stop();
    setFrame(Math.min(frame() + 1, props.length - 1));
  });
  createShortcut(["0"], () => setFrame(0));
  createShortcut(["1"], () => setFrame(Math.floor(props.length / 10)));
  createShortcut(["2"], () => setFrame(Math.floor((2 * props.length) / 10)));
  createShortcut(["3"], () => setFrame(Math.floor((3 * props.length) / 10)));
  createShortcut(["4"], () => setFrame(Math.floor((4 * props.length) / 10)));
  createShortcut(["5"], () => setFrame(Math.floor((5 * props.length) / 10)));
  createShortcut(["6"], () => setFrame(Math.floor((6 * props.length) / 10)));
  createShortcut(["7"], () => setFrame(Math.floor((7 * props.length) / 10)));
  createShortcut(["8"], () => setFrame(Math.floor((8 * props.length) / 10)));
  createShortcut(["9"], () => setFrame(Math.floor((9 * props.length) / 10)));
  createShortcut(["Shift", "<"], () =>
    setSpeed(speed() === "2x" ? "1x" : "0.5x"),
  );
  createShortcut(["Shift", ">"], () =>
    setSpeed(speed() === "0.5x" ? "1x" : "2x"),
  );

  return (
    <div class="flex items-center gap-1">
      <button
        class={cn(
          "text-3xl",
          speed() === "0.5x"
            ? "i-tabler-multiplier-0-5x"
            : speed() === "1x"
              ? "i-tabler-multiplier-1x"
              : "i-tabler-multiplier-2x",
        )}
        onClick={() =>
          setSpeed(speed() === "2x" ? "0.5x" : speed() === "1x" ? "2x" : "1x")
        }
      />
      <button
        class="text-2xl i-tabler-chevrons-left"
        onClick={() => setFrame((f) => Math.max(f - 120, 0))}
      />
      <button
        class="text-xl i-tabler-chevron-left"
        onClick={() => {
          stop();
          setFrame((f) => Math.max(0, f - 1));
        }}
      />
      <button
        class={cn(
          "text-xl",
          running() ? "i-tabler-player-pause" : "i-tabler-player-play",
        )}
        onClick={() => {
          if (frame() === props.length - 1) {
            setFrame(0);
          }
          running() ? stop() : start();
        }}
      />
      <button
        class="text-xl i-tabler-chevron-right"
        onClick={() => {
          stop();
          setFrame((f) => Math.min(f + 1, props.length - 1));
        }}
      />
      <button
        class="text-2xl i-tabler-chevrons-right"
        onClick={() => setFrame((f) => Math.min(f + 120, props.length - 1))}
      />
    </div>
  );
}

function createAnimationResource(
  replay: Accessor<ReplayData>,
  playerIndex: number,
) {
  return createResource(
    () => {
      if (replay() === undefined) {
        return undefined;
      }
      const playerSettings = replay()!.settings.playerSettings[playerIndex];
      if (playerSettings === undefined) {
        return undefined;
      }
      const playerUpdate = replay()!.frames[frame()].players[playerIndex];
      if (playerUpdate === undefined) {
        return playerSettings.externalCharacterId;
      }
      // Zelda
      if (playerUpdate.state.internalCharacterId === 19) {
        return 18;
      }
      // Sheik
      if (playerUpdate.state.internalCharacterId === 7) {
        return 19;
      }
      return playerSettings.externalCharacterId;
    },
    (id) => (id === undefined ? undefined : fetchAnimations(id)),
  );
}
