import createRAF, { targetFPS } from "@solid-primitives/raf";
import { add, curry, map, max, modulo, pipe, times, update } from "rambda";
import {
  batch,
  Context,
  createContext,
  createEffect,
  createResource,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  actionNameById,
  characterNameByExternalId,
  characterNameByInternalId,
} from "~/common/ids";
import {
  PlayerInputs,
  PlayerSettings,
  PlayerState,
  PlayerUpdate,
  PlayerUpdateWithNana,
  ReplayData,
} from "~/common/types";
import { parseReplay } from "~/parser/parser";
import { queries } from "~/search/queries";
import { Highlight, search } from "~/search/search";
import { SelectionStoreState } from "~/state/selectionStore";
import { CharacterAnimations, fetchAnimations } from "~/viewer/animationCache";
import { actionMapByInternalId } from "~/viewer/characters";
import { Character } from "~/viewer/characters/character";
import { getPlayerOnFrame, getStartOfAction } from "~/viewer/viewerUtil";

export interface RenderData {
  playerState: PlayerState;
  playerInputs: PlayerInputs;
  playerSettings: PlayerSettings;

  // main render
  path?: string;
  innerColor: string;
  outerColor: string;
  transforms: string[];

  // shield/shine renders
  animationName: string;
  characterData: Character;
}

export interface ReplayStoreState {
  replayData?: ReplayData;
  highlights: Record<string, Highlight[]>;
  selectedHighlight?: [string, Highlight];
  animations: (CharacterAnimations | undefined)[];
  frame: number;
  renderDatas: RenderData[];
  fps: number;
  framesPerTick: number;
  running: boolean;
  zoom: number;
  isDebug: boolean;
}
export const defaultReplayStoreState: ReplayStoreState = {
  highlights: {},
  frame: 0,
  renderDatas: [],
  animations: Array(4).fill(undefined),
  fps: 60,
  framesPerTick: 1,
  running: false,
  zoom: 1,
  isDebug: false,
};

export type ReplayStore = ReturnType<typeof createReplayStore>;
export const ReplayStoreContext =
  createContext<ReplayStore>() as Context<ReplayStore>;

export function createReplayStore(selectionState: SelectionStoreState) {
  const [replayState, setReplayState] = createStore<ReplayStoreState>({
    ...defaultReplayStoreState,
    highlights: map(() => [], queries),
  });

  function selectHighlight(nameAndHighlight: [string, Highlight]) {
    batch(() => {
      setReplayState("selectedHighlight", nameAndHighlight);
      setReplayState(
        "frame",
        wrapFrame(replayState, nameAndHighlight[1].startFrame - 30)
      );
    });
  }

  function nextHighlight() {
    const highlights = Object.entries(replayState.highlights).flatMap(
      ([name, highlights]) =>
        highlights.map((highlight) => [name, highlight] as const)
    );
    const currentIndex =
      replayState.selectedHighlight !== undefined
        ? highlights.findIndex(
            ([name, highlight]) =>
              replayState.selectedHighlight![1] === highlight
          )
        : -1;
    const nextIndex = wrapHighlight(replayState, currentIndex + 1);
    batch(() => {
      setReplayState("selectedHighlight", highlights[nextIndex]);
      setReplayState("frame", highlights[nextIndex][1].startFrame - 30);
    });
  }

  function previousHighlight() {
    const highlights = Object.entries(replayState.highlights).flatMap(
      ([name, highlights]) =>
        highlights.map((highlight) => [name, highlight] as const)
    );
    const currentIndex =
      replayState.selectedHighlight !== undefined
        ? highlights.findIndex(
            ([name, highlight]) =>
              replayState.selectedHighlight![1] === highlight
          )
        : 1;
    const previousIndex = wrapHighlight(replayState, currentIndex - 1);
    batch(() => {
      setReplayState("selectedHighlight", highlights[previousIndex]);
      setReplayState("frame", highlights[previousIndex][1].startFrame - 30);
    });
  }

  function speedNormal(): void {
    batch(() => {
      setReplayState("fps", 60);
      setReplayState("framesPerTick", 1);
    });
  }

  function speedFast(): void {
    setReplayState("framesPerTick", 2);
  }

  function speedSlow(): void {
    setReplayState("fps", 30);
  }

  function zoomIn(): void {
    setReplayState("zoom", (z) => z * 1.01);
  }

  function zoomOut(): void {
    setReplayState("zoom", (z) => z / 1.01);
  }

  function toggleDebug(): void {
    setReplayState("isDebug", (isDebug) => !isDebug);
  }

  function togglePause(): void {
    running() ? stop() : start();
  }

  function pause(): void {
    stop();
  }

  function jump(target: number): void {
    setReplayState("frame", wrapFrame(replayState, target));
  }

  // percent is [0,1]
  function jumpPercent(percent: number): void {
    setReplayState(
      "frame",
      Math.round((replayState.replayData?.frames.length ?? 0) * percent)
    );
  }

  function adjust(delta: number): void {
    setReplayState("frame", pipe(add(delta), curry(wrapFrame)(replayState)));
  }

  const [running, start, stop] = createRAF(
    targetFPS(
      () =>
        setReplayState(
          "frame",
          pipe(add(replayState.framesPerTick), curry(wrapFrame)(replayState))
        ),
      () => replayState.fps
    )
  );
  createEffect(() => setReplayState("running", running()));

  createEffect(async () => {
    const selected = selectionState.selectedFileAndSettings;
    if (selected === undefined) {
      setReplayState({
        highlights: map(() => [], queries),
        frame: 0,
        renderDatas: [],
      });
      return;
    }
    const replayData = parseReplay(await selected[0].arrayBuffer());
    const highlights = map((query) => search(replayData, ...query), queries);
    setReplayState({ replayData, highlights, frame: 0, renderDatas: [] });
    start();
  });

  times(
    (playerIndex) =>
      createResource(
        () => {
          const replay = replayState.replayData;
          if (replay === undefined) {
            return undefined;
          }
          const playerSettings = replay.settings.playerSettings[playerIndex];
          if (playerSettings === undefined) {
            return undefined;
          }
          const playerUpdate =
            replay.frames[replayState.frame].players[playerIndex];
          if (playerUpdate === undefined) {
            return playerSettings.externalCharacterId;
          }
          if (
            playerUpdate.state.internalCharacterId ===
            characterNameByInternalId.indexOf("Zelda")
          ) {
            return characterNameByExternalId.indexOf("Zelda");
          }
          if (
            playerUpdate.state.internalCharacterId ===
            characterNameByInternalId.indexOf("Sheik")
          ) {
            return characterNameByExternalId.indexOf("Sheik");
          }
          return playerSettings.externalCharacterId;
        },
        (id) => (id === undefined ? undefined : fetchAnimations(id))
      ),
    4
  ).forEach(([dataSignal], playerIndex) =>
    createEffect(() =>
      // I can't use the obvious setReplayState("animations", playerIndex, dataSignal())
      // because it will merge into the previous animations data object,
      // essentially overwriting the previous characters animation data forever
      setReplayState("animations", (animations) =>
        update(playerIndex, dataSignal(), animations)
      )
    )
  );

  createEffect(() => {
    if (replayState.replayData === undefined) {
      return;
    }
    setReplayState(
      "renderDatas",
      replayState.replayData.frames[replayState.frame].players
        .filter((playerUpdate) => playerUpdate)
        .flatMap((playerUpdate) => {
          const animations = replayState.animations[playerUpdate.playerIndex];
          if (animations === undefined) return [];
          const renderDatas = [];
          renderDatas.push(
            computeRenderData(replayState, playerUpdate, animations, false)
          );
          if (playerUpdate.nanaState != null) {
            renderDatas.push(
              computeRenderData(replayState, playerUpdate, animations, true)
            );
          }
          return renderDatas;
        })
    );
  });

  return [
    replayState,
    {
      selectHighlight,
      nextHighlight,
      previousHighlight,
      speedNormal,
      speedFast,
      speedSlow,
      zoomIn,
      zoomOut,
      toggleDebug,
      togglePause,
      pause,
      jump,
      jumpPercent,
      adjust,
    },
  ] as const;
}

function computeRenderData(
  replayState: ReplayStoreState,
  playerUpdate: PlayerUpdate,
  animations: CharacterAnimations,
  isNana: boolean
): RenderData {
  const playerState = (playerUpdate as PlayerUpdateWithNana)[
    isNana ? "nanaState" : "state"
  ];
  const playerInputs = (playerUpdate as PlayerUpdateWithNana)[
    isNana ? "nanaInputs" : "inputs"
  ];
  const playerSettings = replayState
    .replayData!.settings.playerSettings.filter(Boolean)
    .find((settings) => settings.playerIndex === playerUpdate.playerIndex)!;

  const startOfActionPlayerState: PlayerState = (
    getPlayerOnFrame(
      playerUpdate.playerIndex,
      getStartOfAction(playerState, replayState.replayData!),
      replayState.replayData!
    ) as PlayerUpdateWithNana
  )[isNana ? "nanaState" : "state"];
  const actionName = actionNameById[playerState.actionStateId];
  const characterData = actionMapByInternalId[playerState.internalCharacterId];
  const animationName =
    characterData.animationMap.get(actionName) ??
    characterData.specialsMap.get(playerState.actionStateId) ??
    actionName;
  const animationFrames = animations[animationName];
  // TODO: validate L cancels, other fractional frames, and one-indexed
  // animations. I am currently just flooring. Converts - 1 to 0 and loops for
  // Entry, Guard, etc.
  const frameIndex = modulo(
    Math.floor(max(0, playerState.actionStateFrameCounter)),
    animationFrames?.length ?? 1
  );
  // To save animation file size, duplicate frames just reference earlier
  // matching frames such as "frame20".
  const animationPathOrFrameReference = animationFrames?.[frameIndex];
  const path =
    animationPathOrFrameReference !== undefined &&
    (animationPathOrFrameReference.startsWith("frame") ?? false)
      ? animationFrames?.[
          Number(animationPathOrFrameReference.slice("frame".length))
        ]
      : animationPathOrFrameReference;
  const rotation =
    animationName === "DamageFlyRoll"
      ? getDamageFlyRollRotation(replayState, playerState)
      : isSpacieUpB(playerState)
      ? getSpacieUpBRotation(replayState, playerState)
      : 0;
  // Some animations naturally turn the player around, but facingDirection
  // updates partway through the animation and incorrectly flips the
  // animation. The solution is to "fix" the facingDirection for the duration
  // of the action, as the animation expects. However upB turnarounds and
  // Jigglypuff/Kirby mid-air jumps are an exception where we need to flip
  // based on the updated state.facingDirection.
  const facingDirection = actionFollowsFacingDirection(animationName)
    ? playerState.facingDirection
    : startOfActionPlayerState.facingDirection;
  return {
    playerState,
    playerInputs,
    playerSettings,
    path,
    innerColor: getPlayerColor(replayState, playerUpdate.playerIndex),
    outerColor:
      startOfActionPlayerState.lCancelStatus === "missed"
        ? "red"
        : playerState.hurtboxCollisionState !== "vulnerable"
        ? "blue"
        : "black",
    transforms: [
      `translate(${playerState.xPosition} ${playerState.yPosition})`,
      // TODO: rotate around true character center instead of current guessed
      // center of position+(0,8)
      `rotate(${rotation} 0 8)`,
      `scale(${characterData.scale} ${characterData.scale})`,
      `scale(${facingDirection} 1)`,
      "scale(.1 -.1) translate(-500 -500)",
    ],
    animationName,
    characterData,
  };
}

// DamageFlyRoll default rotation is (0,1), but we calculate rotation from (1,0)
// so we need to subtract 90 degrees. Quick checks:
// 0 - 90 = -90 which turns (0,1) into (1,0)
// -90 - 90 = -180 which turns (0,1) into (-1,0)
// Facing direction is handled naturally because the rotation will go the
// opposite direction (that scale happens first) and the flip of (0,1) is still
// (0, 1)
function getDamageFlyRollRotation(
  replayState: ReplayStoreState,
  playerState: PlayerState
): number {
  const previousState = (
    getPlayerOnFrame(
      playerState.playerIndex,
      playerState.frameNumber - 1,
      replayState.replayData!
    ) as PlayerUpdateWithNana
  )[playerState.isNana ? "nanaState" : "state"];
  const deltaX = playerState.xPosition - previousState.xPosition;
  const deltaY = playerState.yPosition - previousState.yPosition;
  return (Math.atan2(deltaY, deltaX) * 180) / Math.PI - 90;
}

// Rotation will be whatever direction the player was holding at blastoff. The
// default rotation of the animation is (1,0), so we need to subtract 180 when
// facing left, and subtract 0 when facing right.
// Quick checks:
// 0 - 0 = 0, so (1,0) is unaltered when facing right
// 0 - 180 = -180, so (1,0) is flipped when facing left
function getSpacieUpBRotation(
  replayState: ReplayStoreState,
  playerState: PlayerState
): number {
  const startOfActionPlayer = getPlayerOnFrame(
    playerState.playerIndex,
    getStartOfAction(playerState, replayState.replayData!),
    replayState.replayData!
  );
  const joystickDegrees =
    ((startOfActionPlayer.inputs.processed.joystickY === 0 &&
    startOfActionPlayer.inputs.processed.joystickX === 0
      ? Math.PI / 2
      : Math.atan2(
          startOfActionPlayer.inputs.processed.joystickY,
          startOfActionPlayer.inputs.processed.joystickX
        )) *
      180) /
    Math.PI;
  return (
    joystickDegrees -
    ((startOfActionPlayer as PlayerUpdateWithNana)[
      playerState.isNana ? "nanaState" : "state"
    ].facingDirection === -1
      ? 180
      : 0)
  );
}

// All jumps and upBs either 1) Need to follow the current frame's
// facingDirection, or 2) Won't have facingDirection change during the action.
// In either case we can grab the facingDirection from the current frame.
function actionFollowsFacingDirection(animationName: string): boolean {
  return (
    animationName.includes("Jump") ||
    ["SpecialHi", "SpecialAirHi"].includes(animationName)
  );
}

function isSpacieUpB(playerState: PlayerState): boolean {
  const character = characterNameByInternalId[playerState.internalCharacterId];
  return (
    ["Fox", "Falco"].includes(character) &&
    [355, 356].includes(playerState.actionStateId)
  );
}

function getPlayerColor(
  replayState: ReplayStoreState,
  playerIndex: number
): string {
  // https://www.radix-ui.com/docs/colors/palette-composition/the-scales
  if (replayState.replayData!.settings.isTeams) {
    const settings =
      replayState.replayData!.settings.playerSettings[playerIndex];
    return [
      ["#aa2429", "#e5484d"], // redDark8, redDark9
      ["#0954a5", "#0091ff"], // blueDark8, blueDark9
      ["#236e4a", "#46a758"], // greenDark8, greenDark9
    ][settings.teamId][settings.teamShade];
  }
  // redDark8, blueDark8, yellowDark11, greenDark8
  return ["#aa2429", "#0954a5", "#f0c000", "#236e4a"][playerIndex];
}

function wrapFrame(replayState: ReplayStoreState, frame: number): number {
  if (!replayState.replayData) return frame;
  return (
    (frame + replayState.replayData.frames.length) %
    replayState.replayData.frames.length
  );
}

function wrapHighlight(
  replayState: ReplayStoreState,
  highlight: number
): number {
  const length = Object.entries(replayState.highlights).flatMap(
    ([name, highlights]) => highlights
  ).length;
  return (highlight + length) % length;
}
