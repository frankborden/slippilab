import { Canvas, useFrame } from "@react-three/fiber";

import { store } from "~/store";
import { Camera } from "~/viewer/Camera";
import { Character } from "~/viewer/Character";
import { HUD } from "~/viewer/HUD";
import { Stage } from "~/viewer/Stage";

export function Replay() {
  return (
    <>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 100] }}
        className="aspect-[73/60] shrink"
      >
        <Scene />
      </Canvas>
      <HUD />
    </>
  );
}

let halfTicked = false;

function Scene() {
  const { replay } = store();
  useFrame(() => {
    const { frame, setFrame, paused, speed } = store.getState();
    if (replay && !paused) {
      let tickAmount = speed;
      if (tickAmount === 0.5) {
        if (halfTicked) {
          halfTicked = false;
          return;
        }
        halfTicked = true;
        tickAmount = 1;
      } else {
        halfTicked = false;
      }
      setFrame(frame === replay.frames.length - 1 ? 0 : frame + tickAmount);
    }
  }, -2);
  const characterIds =
    replay?.settings.playerSettings
      .filter(Boolean)
      .map((settings) => settings.externalCharacterId) ?? [];
  const duplicateCharacter = characterIds.some(
    (id, index) => characterIds.indexOf(id) !== index,
  );

  return (
    <>
      <Camera />
      <Stage />
      {replay?.settings.playerSettings
        .filter(Boolean)
        .map((settings) => (
          <Character
            key={settings.playerIndex}
            settings={settings}
            tint={duplicateCharacter}
          />
        ))}
    </>
  );
}
