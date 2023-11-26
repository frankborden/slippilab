import cn from "clsx";
import { For, Match, Switch, createMemo } from "solid-js";

import {
  defaultItemFillColor,
  flyGuyFillColor,
  laserHitboxFillColor,
  laserStrokeColor,
} from "~/client/components/app/Viewer/colors";
import { items } from "~/common/model/names";
import {
  type ItemUpdate,
  type PlayerUpdate,
  type ReplayData,
} from "~/common/model/types";

// TODO: characters projectiles

// Note: Most items coordinates and sizes are divided by 256 to convert them
// from hitboxspace to worldspace.
export function Item(props: { replay: ReplayData; item: ItemUpdate }) {
  const itemName = createMemo(() => items[props.item.typeId]);
  return (
    <Switch>
      <Match when={itemName() === "Needle(thrown)"}>
        <Needle item={props.item} />
      </Match>
      <Match when={itemName() === "Fox's Laser"}>
        <FoxLaser item={props.item} />
      </Match>
      <Match when={itemName() === "Falco's Laser"}>
        <FalcoLaser item={props.item} />
      </Match>
      <Match when={itemName() === "Turnip"}>
        <Turnip replay={props.replay} item={props.item} />
      </Match>
      <Match when={itemName() === "Yoshi's egg(thrown)"}>
        <YoshiEgg replay={props.replay} item={props.item} />
      </Match>
      <Match when={itemName() === "Luigi's fire"}>
        <LuigiFireball item={props.item} />
      </Match>
      <Match when={itemName() === "Mario's fire"}>
        <MarioFireball item={props.item} />
      </Match>
      <Match when={itemName() === "Missile"}>
        <Missile item={props.item} />
      </Match>
      <Match when={itemName() === "Samus's bomb"}>
        <SamusBomb item={props.item} />
      </Match>
      <Match when={itemName() === "Samus's chargeshot"}>
        <SamusChargeshot item={props.item} />
      </Match>
      <Match when={itemName() === "Shyguy (Heiho)"}>
        <FlyGuy item={props.item} />
      </Match>
    </Switch>
  );
}

function SamusChargeshot(props: { item: ItemUpdate }) {
  // charge levels go 0 to 7
  const hitboxesByChargeLevel = [300, 400, 500, 600, 700, 800, 900, 1200];
  return (
    <>
      <circle
        cx={props.item.xPosition}
        cy={props.item.yPosition}
        r={hitboxesByChargeLevel[props.item.chargeShotChargeLevel] / 256}
        class={cn(defaultItemFillColor)}
      />
    </>
  );
}

function SamusBomb(props: { item: ItemUpdate }) {
  // states: 1 = falling, 3 = exploding
  return (
    <>
      <circle
        cx={props.item.xPosition}
        cy={props.item.yPosition}
        r={(props.item.state === 3 ? 1536 : 500) / 256}
        class={cn(defaultItemFillColor)}
      />
    </>
  );
}

function Missile(props: { item: ItemUpdate }) {
  // samusMissileTypes: 0 = homing missile, 1 = smash missile
  return (
    <>
      <circle
        cx={props.item.xPosition}
        cy={props.item.yPosition}
        r={(props.item.samusMissileType === 0 ? 500 : 600) / 256}
        class={cn(defaultItemFillColor)}
      />
    </>
  );
}

function MarioFireball(props: { item: ItemUpdate }) {
  return (
    <>
      <circle
        cx={props.item.xPosition}
        cy={props.item.yPosition}
        r={600 / 256}
        class={cn(defaultItemFillColor)}
      />
    </>
  );
}

function LuigiFireball(props: { item: ItemUpdate }) {
  return (
    <>
      <circle
        cx={props.item.xPosition}
        cy={props.item.yPosition}
        r={500 / 256}
        class={cn(defaultItemFillColor)}
      />
    </>
  );
}

function YoshiEgg(props: { replay: ReplayData; item: ItemUpdate }) {
  // states: 0 = held, 1 = thrown, 2 = exploded
  const ownerState = createMemo(() => getOwner(props.replay, props.item).state);
  return (
    <>
      <circle
        cx={
          props.item.state === 0 ? ownerState().xPosition : props.item.xPosition
        }
        cy={
          props.item.state === 0
            ? ownerState().yPosition + 8
            : props.item.yPosition
        }
        r={props.item.state === 2 ? 2500 / 256 : 1000 / 256}
        class={cn(defaultItemFillColor)}
        opacity={props.item.state === 1 ? 1 : 0.5}
      />
    </>
  );
}

function Turnip(props: { replay: ReplayData; item: ItemUpdate }) {
  // states: 0 = held, 1 = bouncing?, 2 = thrown
  // face: props.item.peachTurnipFace
  const ownerState = createMemo(() => getOwner(props.replay, props.item).state);
  return (
    <>
      <circle
        cx={
          props.item.state === 0 ? ownerState().xPosition : props.item.xPosition
        }
        cy={
          props.item.state === 0
            ? ownerState().yPosition + 8
            : props.item.yPosition
        }
        r={600 / 256}
        class={cn(defaultItemFillColor)}
        opacity={props.item.state === 0 ? 0.5 : 1}
      />
    </>
  );
}

function Needle(props: { item: ItemUpdate }) {
  return (
    <>
      <circle
        cx={props.item.xPosition}
        cy={props.item.yPosition}
        r={500 / 256}
        class={cn(defaultItemFillColor)}
      />
    </>
  );
}

function FoxLaser(props: { item: ItemUpdate }) {
  // There is a 4th hitbox for the first frame only at -3600 (hitboxspace) with
  // size 400 / 256 that I am skipping.
  const hitboxOffsets = [-200, -933, -1666].map((x) => x / 256);
  const hitboxSize = 300 / 256;
  // Throws and deflected lasers are not straight horizontal
  const rotations = createMemo(() => {
    const direction = Math.atan2(props.item.yVelocity, props.item.xVelocity);
    return [Math.cos(direction), Math.sin(direction)];
  });
  return (
    <>
      <line
        x1={
          props.item.xPosition +
          hitboxOffsets[0] * props.item.facingDirection * rotations()[0]
        }
        y1={
          props.item.yPosition +
          hitboxOffsets[0] * props.item.facingDirection * rotations()[1]
        }
        x2={
          props.item.xPosition +
          hitboxOffsets[hitboxOffsets.length - 1] *
            props.item.facingDirection *
            rotations()[0]
        }
        y2={
          props.item.yPosition +
          hitboxOffsets[hitboxOffsets.length - 1] *
            props.item.facingDirection *
            rotations()[1]
        }
        class={cn(laserStrokeColor)}
      />
      <For each={hitboxOffsets}>
        {(hitboxOffset) => (
          <circle
            cx={
              props.item.xPosition +
              hitboxOffset * props.item.facingDirection * rotations()[0]
            }
            cy={
              props.item.yPosition +
              hitboxOffset * props.item.facingDirection * rotations()[1]
            }
            r={hitboxSize}
            class={cn(laserHitboxFillColor)}
          />
        )}
      </For>
    </>
  );
}

function FalcoLaser(props: { item: ItemUpdate }) {
  const hitboxOffsets = [-200, -933, -1666, -2400].map((x) => x / 256);
  const hitboxSize = 300 / 256;
  // Throws and deflected lasers are not straight horizontal
  const rotations = createMemo(() => {
    const direction = Math.atan2(props.item.yVelocity, props.item.xVelocity);
    return [Math.cos(direction), Math.sin(direction)];
  });
  return (
    <>
      <line
        x1={props.item.xPosition + hitboxOffsets[0] * rotations()[0]}
        y1={props.item.yPosition + hitboxOffsets[0] * rotations()[1]}
        x2={
          props.item.xPosition +
          hitboxOffsets[hitboxOffsets.length - 1] * rotations()[0]
        }
        y2={
          props.item.yPosition +
          hitboxOffsets[hitboxOffsets.length - 1] * rotations()[1]
        }
        class={cn(laserStrokeColor)}
      />
      <For each={hitboxOffsets}>
        {(hitboxOffset) => (
          <circle
            cx={props.item.xPosition + hitboxOffset * rotations()[0]}
            cy={props.item.yPosition + hitboxOffset * rotations()[1]}
            r={hitboxSize}
            class={cn(laserHitboxFillColor)}
          />
        )}
      </For>
    </>
  );
}

function FlyGuy(props: { item: ItemUpdate }) {
  return (
    <>
      <circle
        cx={props.item.xPosition}
        cy={props.item.yPosition}
        r={5 * 0.85}
        class={cn(flyGuyFillColor)}
      />
    </>
  );
}

function getOwner(replay: ReplayData, item: ItemUpdate): PlayerUpdate {
  return replay.frames[item.frameNumber].players[item.owner];
}
