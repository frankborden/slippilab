import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";

import { useReplayStore } from "~/stores/replayStore";

export function Stage() {
  const { replay, openedTimestamp } = useReplayStore();

  let stageSrc = "/models/battlefield.glb";
  let stageScale = 0.8;
  switch (replay?.settings.stageId) {
    case 2:
      stageSrc = "/models/fountainofdreams.glb";
      stageScale = 0.75;
      break;
    case 3:
      stageSrc = "/models/pokemonstadium.glb";
      stageScale = 1;
      break;
    case 8:
      stageSrc = "/models/yoshisstory.glb";
      stageScale = 0.7;
      break;
    case 28:
      stageSrc = "/models/dreamland.glb";
      stageScale = 1;
      break;
    case 31:
      stageSrc = "/models/battlefield.glb";
      stageScale = 0.8;
      break;
    case 32:
      stageSrc = "/models/finaldestination.glb";
      stageScale = 1;
      break;
  }
  const { scene, animations } = useGLTF(
    `${stageSrc}?openedTimestamp=${openedTimestamp}`,
    undefined,
    undefined,
    (loader) => {
      loader.manager.setURLModifier((url) => url.split("?")[0]);
      // loader.setRequestHeader({ "Cache-Control": "max-age=0" });
    },
  );
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    actions["anim"]?.play();
  }, [actions]);

  return (
    <primitive
      object={scene}
      rotation={[0, -Math.PI / 2, 0]}
      scale={stageScale}
    />
  );
}
