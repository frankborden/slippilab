import { createMemo, For, JSX, Show } from "solid-js";
import { PlayerBadge } from "~/components/common/Badge";
import {
  characterNameByExternalId,
  characterNameByInternalId,
} from "~/common/ids";
import { PlayerInputs } from "~/common/types";
import { getPlayerColor, replayStore } from "~/state/replayStore";

export function Inputs() {
  const indexes = [0, 1, 2, 3];
  return (
    <div class="grid w-full grid-cols-2 p-6">
      <For each={indexes}>
        {(index) => (
          <>
            <Summary playerIndex={index} />
            <Controller playerIndex={index} />
          </>
        )}
      </For>
    </div>
  );
}

function Summary(props: { playerIndex: number }) {
  const settings = createMemo(
    () => replayStore.replayData?.settings.playerSettings[props.playerIndex]
  );
  const renderData = createMemo(() => {
    return replayStore.renderDatas.find(
      (renderData) =>
        renderData.playerInputs.playerIndex === props.playerIndex &&
        !renderData.playerState.isNana
    );
  });
  return (
    <Show when={settings()}>
      <div>
        <div class="flex gap-1">
          <PlayerBadge port={settings()!.port} />
          <div class="whitespace-nowrap text-xl">
            {characterNameByExternalId[settings()!.externalCharacterId]}
          </div>
        </div>
        <Show when={renderData()}>
          <Show when={renderData()!.playerSettings.connectCode?.length}>
            <div>{renderData()!.playerSettings.connectCode}</div>
          </Show>
          <div>{renderData()!.animationName}</div>
          <div>
            Frame{" "}
            {roundHundredth(renderData()!.playerState.actionStateFrameCounter)}
          </div>
          <Show when={renderData()!.playerState.hitlagRemaining > 0}>
            <div>Hitlag {renderData()!.playerState.hitlagRemaining}</div>
          </Show>
          <Show when={renderData()!.playerState.isInHitstun}>
            <div>Hitstun {renderData()!.playerState.hitstunRemaining}</div>
          </Show>
          <Show
            when={
              renderData()!.playerState.hurtboxCollisionState !== "vulnerable"
            }
          >
            <div class="capitalize">
              {renderData()!.playerState.hurtboxCollisionState}
            </div>
          </Show>
        </Show>
      </div>
    </Show>
  );
}

// https://www.svgrepo.com/svg/90779/nintendo-gamecube-control
function Controller(
  props: { playerIndex: number } & JSX.HTMLAttributes<SVGSVGElement>
) {
  const settings = createMemo(
    () => replayStore.replayData?.settings.playerSettings[props.playerIndex]
  );
  const inputs = createMemo(() => {
    return replayStore.renderDatas.find(
      (renderData) =>
        renderData.playerInputs.playerIndex === props.playerIndex &&
        !renderData.playerState.isNana
    )?.playerInputs;
  });
  return (
    <Show when={settings()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 585.781 585.782"
        class="text-neutral-800"
      >
        <path
          id="shell"
          fill={getPlayerColor(replayStore, props.playerIndex, false)}
          d="M376.4 33.6c-6 0-11.9 3.9-11.1 11.8 1 11.8-2.6 21.8-12.6 28.8-10 7.2-24.4 4.3-35.2 10.2a53.6 53.6 0 0 0-28.1 40.6c-116.9 1.6-160.5 25.4-160.5 25.4-68.1-13.9-77.4 34-77.4 34-67.5 45-47.9 128.2-47.9 128.2-7 84.3-9.5 239.6 46.8 239.6s56-145.5 56-145.5 9.8 16.2 17.3 37.6c7.5 21.3 63.5 79.7 124.1 15.6 60.7-64.1-23-128.2-23-128.2v-10.2c20.2-5.6 68-6.6 68-6.6s48 1 68.2 6.6v10.2s-83.7 64-23 128.2c60.6 64 116.6 5.7 124-15.6 7.6-21.4 17.4-37.6 17.4-37.6s-.3 145.5 56 145.5 53.7-155.3 46.8-239.6c0 0 19.6-83.1-48-128.2 0 0-9.2-47.9-77.3-34 0 0-39.3-21.4-143-25 5-25.9 37.2-20 54.9-32.7a52.6 52.6 0 0 0 21-47.3c-.8-7.8-7.2-11.8-13.4-11.8z"
        />
        <path
          id="dPadCutout"
          fill="transparent"
          d="M178.6 361.5h20.8c4.8 0 8.8 4 8.8 8.9V392H230c4.8 0 8.8 4 8.8 8.9v20.8c0 4.8-4 8.8-8.8 8.8h-21.8v21.8c0 4.8-4 8.8-8.8 8.8h-20.8c-4.9 0-8.9-4-8.9-8.8v-21.8H148c-4.9 0-8.9-4-8.9-8.8V401a9 9 0 0 1 8.9-8.9h21.7v-21.7a9 9 0 0 1 8.9-8.9z"
        />
        <path
          id="dPad"
          fill="gray"
          stroke="black"
          stroke-width={2.5}
          d="M202 370.4c0-1.5-1.2-2.7-2.6-2.7h-20.8a2.7 2.7 0 0 0-2.7 2.7v27.9h-28a2.7 2.7 0 0 0-2.6 2.7v20.8c0 1.5 1.2 2.7 2.7 2.7h27.9v27.9c0 1.5 1.2 2.7 2.7 2.7h20.8c1.5 0 2.7-1.2 2.7-2.7v-28H230c1.5 0 2.7-1.1 2.7-2.6V401c0-1.5-1.2-2.7-2.7-2.7h-28z"
        />
        <path
          id="startCutout"
          fill="transparent"
          d="M292.9 252a19.8 19.8 0 1 1 0 39.7 19.8 19.8 0 0 1 0-39.6zm-188.2-52.7a75.3 75.3 0 1 1-.2 150.6 75.3 75.3 0 0 1 .2-150.6z"
        />
        {/* here */}
        <path
          id="controlStickCutout"
          fill="transparent"
          d="m 104.65234,199.2793 c 41.488,0 75.23438,33.75128 75.23438,75.23828 0,41.487 -33.74638,75.24023 -75.23438,75.24023 -41.486996,0 -75.238278,-33.75323 -75.238278,-75.24023 0,-41.487 33.751282,-75.23828 75.238278,-75.23828 z"
        />
        <circle
          id="controlStickGate"
          fill="lightgray"
          stroke="black"
          stroke-width={2.5}
          cx={104.7}
          cy={274.5}
          r={69.1}
        />
        <circle
          id="controlStick"
          fill="gray"
          stroke="black"
          stroke-width={2.5}
          cx={104.7 + (inputs()?.processed.joystickX ?? 0) * 34}
          cy={274.5 - (inputs()?.processed.joystickY ?? 0) * 34}
          r={35.1}
        />
        <path
          id="cStickCutout"
          fill="transparent"
          d="M402 361.3c.4 0 .8.1 1.1.3l31.2 18a3 3 0 0 1 1.4 1.8l10.3 34.1a3 3 0 0 1-.3 2.4L427 451.2a3 3 0 0 1-1.9 1.5l-36.2 9.2a3 3 0 0 1-2.3-.3l-32.2-18.9a3 3 0 0 1-1.4-2l-8.7-37.1a3 3 0 0 1 .4-2.4l19.3-30a3 3 0 0 1 1.8-1.3l35-8.6h1.2z"
        />
        <circle
          id="cStickGate"
          fill="gold"
          stroke="black"
          stroke-width={2.5}
          cx={395.2}
          cy={411.6}
          r={44.1}
        />
        <circle
          id="cStick"
          fill="yellow"
          stroke="black"
          stroke-width={2.5}
          cx={395.2 + (inputs()?.processed.cStickX ?? 0) * 19.5}
          cy={411.6 - (inputs()?.processed.cStickY ?? 0) * 19.5}
          r={24.6}
        />
        <circle
          id="startButton"
          fill={inputs()?.processed.start ? "white" : "gray"}
          stroke="black"
          stroke-width={2.5}
          cx="292.9"
          cy="271.9"
          r="13.7"
        />
        <path
          id="faceButtonsCutout"
          fill="transparent"
          d="M478.2 187.8a21.5 21.5 0 0 1 21.6 24.8 69 69 0 0 1 26.6 16 21.4 21.4 0 0 1 13.8-5c9.8 0 18.4 6.6 21 16l.2 1c5.7 18.8 5.7 18.8 9.7 36l.2.9a21.9 21.9 0 0 1-21 27.2 21 21 0 0 1-7.8-1.6 69 69 0 0 1-109.8 26.2 29 29 0 1 1-23.7-45.7h.8l-.2-5.6c0-16.5 5.8-31.6 15.5-43.5a21.6 21.6 0 0 1 10-35.9l1-.3c18.8-5.7 18.8-5.7 36-9.7l.8-.2c1.7-.4 3.5-.6 5.3-.6z"
        />
        <circle
          id="aButton"
          // Use physical A because processed A is bugged. processed A is true
          // whenever physical Z is pressed
          fill={inputs()?.physical.a ? "white" : "green"}
          stroke="black"
          stroke-width={2.5}
          cx={479.4}
          cy={279.7}
          r={33.9}
        />
        <path
          id="bButton"
          fill={inputs()?.processed.b ? "white" : "red"}
          stroke="black"
          stroke-width={2.5}
          d="M417.1 291.3c-2-.8-4.2-1.2-6.5-1.4l-1.6-.2a23 23 0 0 0 0 45.9 22.9 22.9 0 0 0 8.1-44.3z"
        />
        <path
          id="yButton"
          fill={inputs()?.processed.y ? "white" : "gray"}
          stroke="black"
          stroke-width={2.5}
          d="M429.3 229.8a16 16 0 0 0 15.4 4.7c.5-.1 2.3-1 3.7-1.8 3.7-2.1 8.9-5 14.4-6.5 6.7-1.8 15.9-2 19.5-2h.6c3.8-1.1 7-3.6 9-7.1l.2-.3a15.4 15.4 0 0 0-13.9-22.9 17 17 0 0 0-3.9.5l-.8.1c-17 4-17 4-35.6 9.6l-1.2.4a15.6 15.6 0 0 0-11 19 15 15 0 0 0 3.6 6.3zM565.1 278c-4-17-4-17-9.6-35.7l-.3-1a15.8 15.8 0 0 0-19-11 15.5 15.5 0 0 0-9.6 7.5 15.5 15.5 0 0 0-1.4 11.5c.1.5 1.1 2.2 1.9 3.6 2 3.8 4.9 9 6.4 14.4 2 7.4 2 17.8 2 20.1a16 16 0 0 0 19 10.6c8-2.2 12.9-10.6 10.9-19.1zM130 150l-75 35v-10c0-55 55-55 75-35v10zm330 0 75 35v-10c0-55-55-55-75-35v10z"
        />
        <path
          id="xButton"
          fill={inputs()?.processed.x ? "white" : "gray"}
          stroke="black"
          stroke-width={2.5}
          d="M565.1,278 c -4,-16.9 -4,-16.9 -9.6,-35.6 l -0.3,-1 c -2.2,-8.2 -10.9,-13.3 -19.1,-11.1 -2.1,0.6 -4,1.6 -5.6,2.8 -1.6,1.3 -3,2.9 -4,4.7 -1.9,3.4 -2.5,7.5 -1.4,11.5 0.1,0.5 1.1,2.2 1.9,3.6 2.1,3.8 4.9,8.9 6.4,14.4 2,7.4 2,17.8 2.0,20.1 0.7,2.4 2,4.4 3.7,6.1 1.5,1.6 3.3,2.8 5.4,3.7 3.1,1.3 6.5,1.7 9.9,0.8 8.1,-2.2 12.9,-10.6 10.9,-19.1 z"
        />
        <path
          id="lTrigger"
          fill={inputs()?.processed.lTriggerDigital ? "white" : "gray"}
          stroke="black"
          stroke-width={2.5}
          d="m 130,150 l -75,35 l 0,-10 c 0,-55 55,-55 75,-35 l 0,10 z"
        />
        <path
          id="rTrigger"
          fill={inputs()?.processed.rTriggerDigital ? "white" : "gray"}
          stroke="black"
          stroke-width={2.5}
          d="m 460,150 l 75,35 l 0,-10 c 0,-55 -55,-55 -75,-35 l 0,10 z"
        />
        <path
          id="zButton"
          fill={inputs()?.processed.z ? "white" : "purple"}
          stroke="black"
          stroke-width={2.5}
          d="M460 155v-15l75 35v15z"
        />
      </svg>
    </Show>
  );
}

function roundHundredth(num: number) {
  return Math.round(num * 100) / 100;
}
