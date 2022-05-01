import { adjust, jump, pause, play, tick, tickBack } from "../state";
import { Button } from "@hope-ui/solid";

export function Controls() {
  return (
    <foreignObject
      transform="scale(1 -1)"
      x="-50%"
      y="-50%"
      width="100%"
      height="100%"
    >
      <Button onClick={() => play()}>Play</Button>
      <Button onClick={() => pause()}>Pause</Button>
      <Button onClick={() => tick()}>Tick</Button>
      <Button onClick={() => tickBack()}>Tick Back</Button>
      <Button onClick={() => jump(0)}>Reset</Button>
      <Button onClick={() => adjust(-120)}>Rewind 2s</Button>
      <Button onClick={() => adjust(120)}>Ahead 2s</Button>
    </foreignObject>
  );
}
