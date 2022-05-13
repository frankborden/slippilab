import { createMemo, For, Match, Switch } from "solid-js";
import { itemNamesById } from "../common/ids";
import { ItemUpdate } from "../common/types";
import { state } from "../state";

// TODO: characters projectiles. Done: Sheik, Fox, Falco, Peach, Yoshi

// Note: Most items coordinates and sizes are divided by 256 to convert them
// from hitboxspace to worldspace. I am not scaling lasers by character model
// scale, but it's not clear if that is correct.
export function Item(props: { item: ItemUpdate }) {
  const itemName = createMemo(() => itemNamesById[props.item.typeId]);
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
        <Turnip item={props.item} />
      </Match>
      <Match when={itemName() === "Yoshi's egg(thrown)"}>
        <YoshiEgg item={props.item} />
      </Match>
      <Match when={itemName() === "Shyguy (Heiho)"}>
        <FlyGuy item={props.item} />
      </Match>
    </Switch>
  );
}

function YoshiEgg(props: { item: ItemUpdate }) {
  // states: 0 = held, 1 = thrown, 2 = exploded
  const ownerState = createMemo(() => getOwner(props.item).state);
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
        fill="darkgray"
        opacity={props.item.state === 1 ? 1 : 0.5}
      />
    </>
  );
}

function Turnip(props: { item: ItemUpdate }) {
  // states: 0 = held, 1 = bouncing?, 2 = thrown
  const ownerState = createMemo(() => getOwner(props.item).state);
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
        fill="darkgray"
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
        fill="darkgray"
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
          hitboxOffsets.at(-1)! * props.item.facingDirection * rotations()[0]
        }
        y2={
          props.item.yPosition +
          hitboxOffsets.at(-1)! * props.item.facingDirection * rotations()[1]
        }
        stroke="red"
      ></line>
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
            fill="red"
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
        x2={props.item.xPosition + hitboxOffsets.at(-1)! * rotations()[0]}
        y2={props.item.yPosition + hitboxOffsets.at(-1)! * rotations()[1]}
        stroke="red"
      ></line>
      <For each={hitboxOffsets}>
        {(hitboxOffset) => (
          <circle
            cx={props.item.xPosition + hitboxOffset * rotations()[0]}
            cy={props.item.yPosition + hitboxOffset * rotations()[1]}
            r={hitboxSize}
            fill="red"
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
        fill="#aa0000"
      />
    </>
  );
}

function getOwner(item: ItemUpdate) {
  return state.replayData()!.frames[item.frameNumber].players[item.owner];
}
