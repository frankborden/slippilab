import {
  Box,
  Environment,
  OrbitControls,
  OrthographicCamera,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { decode } from "@shelacek/ubjson";
import { RenderData } from "@slippilab/common";
import { parseReplay } from "@slippilab/parser";
import { useState } from "react";
import { type AnimationAction } from "three";

import { renderReplay } from "~/common/render";

export default function Page() {
  const [renderData, setRenderData] = useState<RenderData[][] | null>(null);
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
          setRenderData(renderReplay(parseReplay(metadata, raw)));
        }}
        className="mb-2"
      />
      <Canvas
        className="bg-neutral-600 rounded"
        style={{
          height: `${150 / (448 / 208.8)}vmin`,
          width: "150vmin",
        }}
      >
        <OrthographicCamera
          makeDefault
          position={[-100, 0, 0]}
          left={-224}
          right={224}
          top={200}
          bottom={-108.8}
          zoom={1.5}
        />
        <OrbitControls />
        <Environment preset="warehouse" />
        {renderData !== null && (
          <>
            <Model
              replay={renderData}
              playerIndex={0}
              modelUrl="models/falco.glb"
              modelActionPrefix="Falco"
            />
            <Model
              replay={renderData}
              playerIndex={1}
              modelUrl="/models/falco.glb"
              modelActionPrefix="Falco"
            />
            <Box material-color="black" args={[1, 1, 68.4 * 2]} />
            <Box
              material-color="black"
              args={[1, 1, 18.8 * 2]}
              position={[0, 54.4, 0]}
            />
            <Box
              material-color="black"
              args={[1, 1, -57.6 - -20]}
              position={[0, 27.2, (-57.6 + -20) / 2]}
            />
            <Box
              material-color="black"
              args={[1, 1, 57.6 - 20]}
              position={[0, 27.2, (57.6 + 20) / 2]}
            />
          </>
        )}
      </Canvas>
    </>
  );
}

let lastActions: (AnimationAction | undefined)[] = [undefined, undefined];

function Model({
  replay,
  playerIndex,
  modelUrl,
  modelActionPrefix,
}: {
  replay: RenderData[][];
  playerIndex: number;
  modelUrl: string;
  modelActionPrefix: string;
}) {
  const { scene, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, scene);

  // temporary: Position already captures movement caused by animations JOBJ_1
  // and JOBJ_0 keyframes should be cleared in blender.
  animations.forEach((animation) => {
    animation.tracks = animation.tracks.filter(
      (track) =>
        track.name !== "JOBJ_0.position" && track.name !== "JOBJ_1.position",
    );
  });

  if (modelActionPrefix === "Falco") {
    scene.scale.setScalar(1.1);
  }

  useFrame(({ clock }) => {
    const frame = Math.floor(clock.getElapsedTime() * 60);
    const data = replay[frame % replay.length]?.find(
      (d) => d.playerSettings.playerIndex === playerIndex,
    );
    const previousData = replay[(frame - 1) % replay.length]?.find(
      (d) => d.playerSettings.playerIndex === playerIndex,
    );
    if (!data) return;

    scene.position.set(
      0,
      data.playerState.yPosition,
      data.playerState.xPosition,
    );

    const lastAction = lastActions[playerIndex];
    if (lastAction) {
      lastAction.time = data.playerState.actionStateFrameCounter / 60;

      if (data.playerState.hitlagRemaining > 0) {
        lastAction.paused = true;
      } else if (previousData && previousData.playerState.hitlagRemaining > 0) {
        lastAction.paused = false;
      }
    }

    const action =
      actions[
        `Ply${modelActionPrefix}5K_Share_ACTION_${data.animationName}_figatree`
      ];
    if (lastActions[playerIndex] === action) return;

    if (action) {
      lastAction?.fadeOut(1 / 60);
      lastActions[playerIndex] = action;

      action.reset().play();
      // action.time = data.playerState.actionStateFrameCounter / 60;
      scene.rotation.set(
        0,
        Math.PI / 2 - (data.facingDirection * Math.PI) / 2,
        0,
      );
    }
  });

  return <primitive object={scene} />;
}
