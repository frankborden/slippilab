import {
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
import { type AnimationAction, type MeshStandardMaterial } from "three";

import { Battlefield } from "~/client/models/Battlefield";
import { Dreamland } from "~/client/models/Dreamland";
import { Falco } from "~/client/models/Falco";
import { Falcon } from "~/client/models/Falcon";
import { Finaldestination } from "~/client/models/Finaldestination";
import { Fountainofdreams } from "~/client/models/Fountainofdreams";
import { Fox } from "~/client/models/Fox";
import { Jigglypuff } from "~/client/models/Jigglypuff";
import { Mario } from "~/client/models/Mario";
import { Marth } from "~/client/models/Marth";
import { Peach } from "~/client/models/Peach";
import { Pokemonstadium } from "~/client/models/Pokemonstadium";
import { Sheik } from "~/client/models/Sheik";
import { Yoshisstory } from "~/client/models/Yoshisstory";
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
        className="bg-neutral-800 rounded mx-auto"
        style={{
          height: `${100 * (1280 / 1920)}vmin`,
          width: "100vmin",
        }}
      >
        <OrthographicCamera
          makeDefault
          position={[-100, 0, 0]}
          left={-1920 / 8}
          right={1920 / 8}
          top={1280 / 8}
          bottom={-1280 / 8}
          zoom={4}
        />
        <OrbitControls />
        <ambientLight intensity={5} />
        {renderData !== null && (
          <>
            <Character
              replay={renderData}
              playerIndex={0}
              modelUrl="/models/sheik.glb"
            />
            <Fox position={[0, 0, -52.5]} />
            <Falco position={[0, 0, -37.5]} />
            <Sheik position={[0, 0, -22.5]} />
            <Falcon position={[0, 0, -7.5]} />
            <Peach position={[0, 0, 7.5]} />
            <Marth position={[0, 0, 22.5]} />
            <Mario position={[0, 0, 37.5]} />
            <Jigglypuff position={[0, 0, 52.5]} />
            <Battlefield />
            {/* <Dreamland /> */}
            {/* <Fountainofdreams /> */}
            {/* <Yoshisstory /> */}
            {/* <Pokemonstadium /> */}
            {/* <Finaldestination /> */}
          </>
        )}
      </Canvas>
    </>
  );
}

let lastActions: (AnimationAction | undefined)[] = [undefined, undefined];

function Character({
  replay,
  playerIndex,
  modelUrl,
}: {
  replay: RenderData[][];
  playerIndex: number;
  modelUrl: string;
}) {
  const { scene: model, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, model);

  model.traverse((obj) => {
    if ("material" in obj) {
      (obj.material as MeshStandardMaterial).metalness = 0;
    }
  });

  // TODO: Position already captures movement caused by animations JOBJ_1
  // and JOBJ_0 keyframes should be cleared in Blender.
  animations.forEach((animation) => {
    animation.tracks = animation.tracks.filter(
      (track) =>
        track.name !== "JOBJ_0.position" && track.name !== "JOBJ_1.position",
    );
  });

  useFrame(({ clock }) => {
    const frame = Math.floor(clock.getElapsedTime() * 60);
    const nextData = replay[(frame + 1) % replay.length]?.find(
      (d) => d.playerSettings.playerIndex === playerIndex,
    );
    const data = replay[frame % replay.length]?.find(
      (d) => d.playerSettings.playerIndex === playerIndex,
    );
    if (!data) return;
    if (!nextData) return;

    let animStartFacingDir = nextData?.facingDirection;
    let prevData = data;
    while (nextData.animationName === prevData.animationName) {
      animStartFacingDir = prevData.facingDirection;
      const nextPrevData = replay[
        (prevData.playerState.frameNumber - 1) % replay.length
      ]?.find((d) => d.playerSettings.playerIndex === playerIndex);
      if (!nextPrevData) break;
      prevData = nextPrevData;
    }

    model.position.set(
      0,
      data.playerState.yPosition,
      data.playerState.xPosition,
    );

    const lastAction = lastActions[playerIndex];
    if (lastAction) {
      lastAction.time = data.playerState.actionStateFrameCounter / 60;

      if (nextData.playerState.hitlagRemaining > 0) {
        lastAction.paused = true;
      } else if (data && data.playerState.hitlagRemaining > 0) {
        lastAction.paused = false;
      }
    }

    const action = actions[nextData.animationName];
    if (lastActions[playerIndex] === action) return;

    if (action) {
      lastAction?.fadeOut(1 / 60);
      lastActions[playerIndex] = action;

      action.reset().play();
      model.rotation.set(
        0,
        Math.PI / 2 - (animStartFacingDir * Math.PI) / 2,
        0,
      );
    }
  });

  return <primitive object={model} />;
}
