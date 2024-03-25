import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CounterClockwiseClockIcon,
  PauseIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
import { useEffect } from "react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Slider } from "~/components/ui/slider";
import { useReplayStore } from "~/stores/replayStore";

export function Controls() {
  const { replay, frame, setFrame, paused, setPaused, speed, setSpeed } =
    useReplayStore();

  let current = "0:00";
  let total = "0:00";
  if (replay) {
    const currentMinutes = Math.floor(frame / 60 / 60);
    const currentSeconds = Math.floor((frame % 3600) / 60);
    current = `${currentMinutes}:${String(currentSeconds).padStart(2, "0")}`;
    const totalMinutes = Math.floor(replay.frames.length / 60 / 60);
    const totalSeconds = Math.floor((replay.frames.length % 3600) / 60);
    total = `${totalMinutes}:${String(totalSeconds).padStart(2, "0")}`;
  }

  function handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
      case "j":
        setFrame(Math.max(frame - 120, 0));
        break;
      case "ArrowRight":
      case "l":
        setFrame(Math.min(frame + 120, (replay?.frames.length ?? 1) - 1));
        break;
      case " ":
      case "k":
        setPaused(!paused);
        break;
      case ",":
        setPaused(true);
        setFrame(Math.max(0, frame - 1));
        break;
      case ".":
        setPaused(true);
        setFrame(Math.min((replay?.frames.length ?? 1) - 1, frame + 1));
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        const num = parseInt(event.key);
        setFrame(Math.round((replay?.frames.length ?? 0) * (num / 10)));
        break;
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div>
      <Slider
        value={[frame]}
        min={0}
        max={replay?.frames.length ?? 10}
        onValueChange={(value) => setFrame(value[0])}
      />
      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm font-medium leading-none">
          {current} / {total}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="text-sm">
                {speed}x
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="grid grid-cols-[auto_auto]"
            >
              <DropdownMenuItem
                onSelect={() => setSpeed(0.5)}
                className="col-span-full grid grid-cols-subgrid"
              >
                <div>Slow</div>
                <div>0.5x</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setSpeed(1)}
                className="col-span-full grid grid-cols-subgrid"
              >
                <div>Normal</div>
                <div>1x</div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setSpeed(2)}
                className="col-span-full grid grid-cols-subgrid"
              >
                <div>Fast</div>
                <div>2x</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={() => {
              setFrame(Math.max(frame - 120, 0));
              setPaused(true);
            }}
          >
            <CounterClockwiseClockIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={() => {
              setFrame(Math.max(frame - 1, 0));
              setPaused(true);
            }}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={() => setPaused(!paused)}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={() => {
              setFrame(Math.min(frame + 1, (replay?.frames.length ?? 1) - 1));
              setPaused(true);
            }}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-6"
            onClick={() => {
              setFrame(Math.min(frame + 120, (replay?.frames.length ?? 1) - 1));
              setPaused(true);
            }}
          >
            <CounterClockwiseClockIcon className=" -scale-x-100" />
          </Button>
        </div>
      </div>
    </div>
  );
}
