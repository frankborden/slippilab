import { useFrame } from "@react-three/fiber";
import { type OrthographicCamera } from "three";

import { store } from "~/store";

export function Camera() {
  const { frame, cameraPositions } = store();
  useFrame(({ camera }) => {
    if (cameraPositions) {
      const cam = camera as OrthographicCamera;
      const { left, right, top, bottom } = cameraPositions[frame];
      cam.left = left;
      cam.right = right;
      cam.top = top;
      cam.bottom = bottom;
      cam.updateProjectionMatrix();
    }
  }, -1);
  return null;
}
