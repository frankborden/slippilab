import { useEffect } from "react";
import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import { twMerge as cn } from "tailwind-merge";

import { store } from "~/store";

export function Controls() {
  const { replay, frame, setFrame, paused, setPaused, speed, setSpeed } =
    store();

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
    <Slider
      aria-label="Frame"
      value={frame}
      minValue={0}
      maxValue={replay?.frames.length ?? 10}
      onChange={(f) => setFrame(f)}
    >
      <div className="flex items-center gap-2">
        <SliderTrack className="relative h-4 w-full">
          {({ state }) => (
            <>
              <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/40" />
              <div
                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-white"
                style={{ width: `${state.getThumbPercent(0) * 100}%` }}
              />
              <SliderThumb className="top-1/2 h-4 w-4 rounded-full border border-zinc-900 bg-white ring-black transition" />
            </>
          )}
        </SliderTrack>
        <div className="flex items-center gap-1">
          <button
            className={cn(
              "text-2xl",
              speed === 2
                ? "i-tabler-multiplier-2x"
                : speed === 1
                  ? "i-tabler-multiplier-1x"
                  : "i-tabler-multiplier-0-5x",
            )}
            onClick={() => setSpeed(speed === 2 ? 0.5 : speed === 1 ? 2 : 1)}
          />
          <button
            className="i-tabler-chevrons-left text-xl"
            onClick={() => setFrame(Math.max(frame - 120, 0))}
          />
          <button
            className="i-tabler-chevron-left text-xl"
            onClick={() => setFrame(Math.max(0, frame - 1))}
          />
          <button
            className={paused ? "i-tabler-play" : "i-tabler-pause"}
            onClick={() => setPaused(!paused)}
          />
          <button
            className="i-tabler-chevron-right text-xl"
            onClick={() =>
              setFrame(Math.min((replay?.frames.length ?? 1) - 1, frame + 1))
            }
          />
          <button
            className="i-tabler-chevrons-right text-xl"
            onClick={() =>
              setFrame(Math.min(frame + 120, (replay?.frames.length ?? 1) - 1))
            }
          />
        </div>
      </div>
    </Slider>
  );
}
