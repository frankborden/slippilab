import { useState } from "react";

import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { useReplayStore } from "~/stores/replayStore";

export function Highlights() {
  const { highlights, setFrame } = useReplayStore();
  const [selectedQuery, setSelectedQuery] = useState<string>(
    Object.keys(highlights)[0],
  );

  return (
    <>
      <Select value={selectedQuery} onValueChange={setSelectedQuery}>
        <SelectTrigger className="gap-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            {Object.keys(highlights).map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="mt-2 grid grid-cols-[repeat(2,auto)] justify-center gap-x-4">
        {highlights[selectedQuery].map((highlight, i) => (
          <button
            key={i}
            className="col-span-full grid grid-cols-subgrid items-center rounded px-4 py-1 hover:bg-foreground/10"
            onClick={() => setFrame(Math.max(highlight.startFrame - 30, 0))}
          >
            <Badge
              variant="outline"
              className={cn(
                [
                  "bg-red-400/10 text-red-400",
                  "bg-blue-400/10 text-blue-400",
                  "bg-yellow-400/10 text-yellow-400",
                  "bg-green-400/10 text-green-400",
                ][highlight.playerIndex],
              )}
            >
              Player {highlight.playerIndex + 1}
            </Badge>
            <div>
              {Math.floor(highlight.startFrame / 60 / 60)}:
              {String(
                Math.floor(Math.floor(highlight.startFrame % 3600) / 60),
              ).padStart(2, "0")}
            </div>
          </button>
        ))}
        <div className="col-span-full hidden text-center text-sm only:block">
          No highlights
        </div>
      </div>
    </>
  );
}
