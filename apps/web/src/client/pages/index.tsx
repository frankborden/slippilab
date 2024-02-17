import { OrbitControls, OrthographicCamera, Stats } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { decode } from "@shelacek/ubjson";
import { RenderData, ReplayData } from "@slippilab/common";
import { parseReplay } from "@slippilab/parser";
import { useState } from "react";

import { Character } from "~/client/viewer/Character";
import { Battlefield } from "~/client/viewer/models/Battlefield";
import { renderReplay } from "~/common/render";

export default function Page() {
  const [renderData, setRenderData] = useState<RenderData[][] | null>(null);
  const [replay, setReplay] = useState<ReplayData | null>(null);
  return (
    <>
      <input
        type="file"
        onInput={async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) return;
          const { metadata, raw } = decode(await file.arrayBuffer(), {
            useTypedArrays: true,
          });
          const r = parseReplay(metadata, raw);
          setReplay(r);
          setRenderData(renderReplay(r));
        }}
        className="mb-2"
      />
      <Canvas
        className="bg-neutral-800 rounded mx-auto"
        style={{
          height: `${100 * (1080 / 1920)}vmin`,
          width: "100vmin",
        }}
      >
        <Stats />
        <OrthographicCamera
          makeDefault
          position={[-100, 0, 0]}
          left={-1920 / 6}
          right={1920 / 6}
          top={1080 / 6 + 15}
          bottom={-1080 / 6 + 15}
          zoom={3}
        />
        <OrbitControls />
        <ambientLight intensity={5} />
        {renderData !== null &&
          replay !== null &&
          replay.settings.playerSettings.map((player, i) => (
            <Character
              key={i}
              replay={replay}
              playerIndex={player.playerIndex}
            />
          ))}
        <Battlefield />
      </Canvas>
    </>
  );
}

// let lastActions: (AnimationAction | undefined)[] = [undefined, undefined];

// function Character({
//   replay,
//   playerIndex,
//   modelUrl,
// }: {
//   replay: RenderData[][];
//   playerIndex: number;
//   modelUrl: string;
// }) {
//   const { scene: model, animations } = useGLTF(modelUrl);
//   const { actions } = useAnimations(animations, model);

//   model.traverse((obj) => {
//     if ("material" in obj) {
//       (obj.material as MeshStandardMaterial).metalness = 0;
//     }
//   });

//   // TODO: Position already captures movement caused by animations JOBJ_1
//   // and JOBJ_0 keyframes should be cleared in Blender.
//   animations.forEach((animation) => {
//     animation.tracks = animation.tracks.filter(
//       (track) =>
//         track.name !== "JOBJ_0.position" && track.name !== "JOBJ_1.position",
//     );
//   });

//   useFrame(({ clock }) => {
//     const frame = Math.floor(clock.getElapsedTime() * 60);
//     const nextData = replay[(frame + 1) % replay.length]?.find(
//       (d) => d.playerSettings.playerIndex === playerIndex,
//     );
//     const data = replay[frame % replay.length]?.find(
//       (d) => d.playerSettings.playerIndex === playerIndex,
//     );
//     if (!data) return;
//     if (!nextData) return;

//     let animStartFacingDir = nextData?.facingDirection;
//     let prevData = data;
//     while (nextData.animationName === prevData.animationName) {
//       animStartFacingDir = prevData.facingDirection;
//       const nextPrevData = replay[
//         (prevData.playerState.frameNumber - 1) % replay.length
//       ]?.find((d) => d.playerSettings.playerIndex === playerIndex);
//       if (!nextPrevData) break;
//       prevData = nextPrevData;
//     }

//     model.position.set(
//       0,
//       data.playerState.yPosition,
//       data.playerState.xPosition,
//     );

//     const lastAction = lastActions[playerIndex];
//     if (lastAction) {
//       lastAction.time = data.playerState.actionStateFrameCounter / 60;

//       if (nextData.playerState.hitlagRemaining > 0) {
//         lastAction.paused = true;
//       } else if (data && data.playerState.hitlagRemaining > 0) {
//         lastAction.paused = false;
//       }
//     }

//     const action = actions[nextData.animationName];
//     if (lastActions[playerIndex] === action) return;

//     if (action) {
//       lastAction?.fadeOut(1 / 60);
//       lastActions[playerIndex] = action;

//       action.reset().play();
//       model.rotation.set(
//         0,
//         Math.PI / 2 - (animStartFacingDir * Math.PI) / 2,
//         0,
//       );
//     }
//   });

//   return <primitive object={model} />;
// }
