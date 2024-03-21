import {
  Circle,
  Outlines,
  Ring,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  type Euler,
  type Mesh,
  type MeshBasicMaterial,
  type SkinnedMesh,
  type Vector3,
} from "three";

import { type PlayerSettings } from "~/common/types";
import { store } from "~/store";
import { actionMapByInternalId } from "~/viewer/characters";

export function Character({
  settings,
  tint,
}: {
  settings: PlayerSettings;
  tint: boolean;
}) {
  const { openedTimestamp } = store();
  // Junk is appended to the URL to prevent three.js from remounting the same
  // model in dittos and breaking everything. The loader manager must later
  // remove the junk to get back caching.
  const { scene, animations } = useGLTF(
    `/models/${modelFileByExternalId[settings.externalCharacterId]}.glb?openedTimestamp=${openedTimestamp}&playerIndex=${settings.playerIndex}`,
    undefined,
    undefined,
    (loader) => loader.manager.setURLModifier((url) => url.split("?")[0]),
  );

  useEffect(() => {
    // Animations for the top-level bones drive the character's position, so
    // they must be ignored during playback to aviod being double-counted.
    animations.forEach((animation) => {
      animation.tracks = animation.tracks.filter(
        (track) =>
          track.name !== "JOBJ_0.position" && track.name !== "JOBJ_1.position",
      );
    });
  }, [animations]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (!tint) return;
      if ("isMesh" in obj && obj.isMesh) {
        let color = 0xffffff;
        switch (settings.playerIndex) {
          case 0:
            color = 0xffbbbb;
            break;
          case 1:
            color = 0xbbbbff;
            break;
          case 2:
            color = 0xffffbb;
            break;
          case 3:
            color = 0xbbffbb;
            break;
        }
        ((obj as SkinnedMesh).material as MeshBasicMaterial).color.set(color);
      }
    });
  }, [scene, settings, tint]);

  const character = useRef<JSX.IntrinsicElements["group"] | null>(null);
  const shield = useRef<Mesh | null>(null);
  const shine = useRef<Mesh | null>(null);
  const { mixer, actions } = useAnimations(animations, scene);

  useFrame(({ clock }) => {
    clock.running = false;
    const renderData = store
      .getState()
      .renderData?.[
        store.getState().frame
      ].find((r) => r.playerSettings.playerIndex === settings.playerIndex);
    if (!renderData || !character.current) return;
    const action = actions[renderData.animationName];
    if (action) {
      mixer.stopAllAction();
      action.play();
      mixer.setTime(
        renderData.animationName === "GuardOn"
          ? 8 / 60
          : renderData.animationFrame / 60,
      );
    }

    (character.current.position! as Vector3).set(
      renderData.playerState.xPosition,
      renderData.playerState.yPosition,
      0,
    );

    let angle = 0;
    if (renderData.animationName === "DamageFlyRoll") {
      const xSpeed =
        renderData.playerState.selfInducedAirXSpeed +
        renderData.playerState.attackBasedXSpeed;
      const ySpeed =
        renderData.playerState.selfInducedAirYSpeed +
        renderData.playerState.attackBasedYSpeed;
      angle =
        Math.atan2(ySpeed, -renderData.facingDirection * xSpeed) - Math.PI / 2;
    } else if (
      (renderData.playerSettings.externalCharacterId === 2 ||
        renderData.playerSettings.externalCharacterId === 20) &&
      renderData.animationName === "SpecialHi"
    ) {
      const xSpeed =
        renderData.playerState.selfInducedAirXSpeed +
        renderData.playerState.attackBasedXSpeed;
      const ySpeed =
        renderData.playerState.selfInducedAirYSpeed +
        renderData.playerState.attackBasedYSpeed;
      angle =
        -renderData.facingDirection * Math.atan2(ySpeed, xSpeed) -
        (renderData.facingDirection === 1 ? 0 : Math.PI);
    }
    (character.current.rotation! as Euler).reorder("YXZ");
    (character.current.rotation! as Euler).set(
      angle,
      renderData.facingDirection * (Math.PI / 2),
      0,
    );

    const characterData =
      actionMapByInternalId[renderData.playerState.internalCharacterId];
    (character.current.scale! as Vector3).setScalar(characterData.scale);
    shield.current!.visible =
      renderData.animationName === "Guard" ||
      renderData.animationName === "GuardOn" ||
      renderData.animationName === "GuardDamage";
    if (shield.current!.visible) {
      character.current.traverse?.((obj) => {
        if (obj.name === `JOBJ_${characterData.shieldBone}`) {
          const triggerStrength =
            renderData.playerInputs.processed.anyTrigger === 0
              ? 1
              : renderData.playerInputs.processed.anyTrigger;
          const triggerStrengthMultiplier =
            1 - (0.5 * (triggerStrength - 0.3)) / 0.7;
          const shieldHealth = renderData.playerState.shieldSize;
          const shieldSizeMultiplier =
            ((shieldHealth * triggerStrengthMultiplier) / 60) * 0.85 + 0.15;
          obj.getWorldPosition(shield.current!.position);
          shield.current!.position.setZ(20);
          shield.current!.scale.setScalar(
            characterData.shieldSize * shieldSizeMultiplier,
          );
        }
      });
    }
    shine.current!.visible =
      (renderData.playerSettings.externalCharacterId === 2 ||
        renderData.playerSettings.externalCharacterId === 20) &&
      !!renderData.animationName.match("Special(Air)?Lw");
    if (shine.current!.visible) {
      character.current.traverse?.((obj) => {
        if (obj.name === "JOBJ_3") {
          obj.getWorldPosition(shine.current!.position);
          shine.current!.position.setZ(20);
          shine.current!.scale.setScalar(
            renderData.playerSettings.externalCharacterId === 2
              ? 8.031372549019608
              : 6.023529411764706,
          );
        }
      });
    }
  }, -1);

  return (
    <>
      <primitive object={scene} ref={character} />
      <Circle ref={shield} scale={10}>
        <meshBasicMaterial
          color={[0xff4444, 0x4444ff, 0xffff44, 0xbbffbb][settings.playerIndex]}
          transparent
          opacity={0.8}
        />
        <Outlines
          thickness={0.05}
          color={[0xff4444, 0x4444ff, 0xffff44, 0xbbffbb][settings.playerIndex]}
          transparent
          opacity={1}
        />
      </Circle>
      <Ring ref={shine} args={[0.5, 1, 6]} rotation-z={Math.PI / 6}>
        <meshBasicMaterial color={0x00bbbb} />
      </Ring>
    </>
  );
}

const modelFileByExternalId = [
  "falcon",
  "Donkey Kong",
  "fox",
  "Mr. Game & Watch",
  "Kirby",
  "Bowser",
  "Link",
  "Luigi",
  "Mario",
  "marth",
  "Mewtwo",
  "Ness",
  "peach",
  "Pikachu",
  "Ice Climbers",
  "jigglypuff",
  "Samus",
  "Yoshi",
  "Zelda",
  "sheik",
  "falco",
  "Young Link",
  "Dr. Mario",
  "Roy",
  "Pichu",
  "Ganondorf",
];
