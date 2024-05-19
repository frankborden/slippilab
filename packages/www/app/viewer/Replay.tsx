import { Canvas, useFrame } from "@react-three/fiber";

import { useReplayStore } from "~/stores/replayStore";
import { Camera } from "~/viewer/Camera";
import { Character } from "~/viewer/Character";
import { HUD } from "~/viewer/HUD";
import { Stage } from "~/viewer/Stage";

export function Replay() {
  const { paused, setPaused } = useReplayStore((store) => ({
    paused: store.paused,
    setPaused: store.setPaused,
  }));
  return (
    <>
      <Canvas
        orthographic
        camera={{ position: [0, 0, 100] }}
        onClick={() => setPaused(!paused)}
      >
        <Scene />
      </Canvas>
      <HUD />
    </>
  );
}

let halfTicked = false;

function Scene() {
  const { replay, openedTimestamp } = useReplayStore();
  useFrame(() => {
    const { frame, setFrame, paused, speed } = useReplayStore.getState();
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
  const doubles = characterIds.length > 2;
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
            key={`${openedTimestamp}~${settings.playerIndex}`}
            settings={settings}
            tint={doubles ? "team" : duplicateCharacter ? "port" : "normal"}
          />
        ))}
    </>
  );
}
