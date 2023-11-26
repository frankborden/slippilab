import { As } from "@kobalte/core";
import { NavLink } from "@solidjs/router";

import { Button } from "~/client/components/ui/button";

export default function Home() {
  return (
    <div class="mt-40 flex justify-center items-center gap-20">
      <div>
        <h1 class="text-4xl font-medium">Explore your Melee games</h1>
        <div class="mt-6 text-foreground/70 max-w-[50ch]">
          Use Slippilab to dive deep into your Slippi replays and share your
          favorite moments with the community.
        </div>
        <div class="my-8 ml-2 text-foreground/80 flex flex-col gap-4 text-sm">
          {[
            "Replay filtering by matchup, stage, player",
            "Input display with frame details",
            "Upload replays and share with a link",
            "Automatic detection for edgeguards, ledge options, & more",
          ].map((text) => (
            <div class="flex gap-2 items-center">
              <div class="text-2xl text-indigo-500 i-tabler-circle-check-filled" />
              <div>{text}</div>
            </div>
          ))}
        </div>
        <div class="mt-6 flex gap-4">
          <Button asChild>
            <As component={NavLink} href="/personal">
              Open local files
            </As>
          </Button>
          <Button asChild variant={"ghost"} class="flex items-center gap-1">
            <As component={NavLink} href="/browse">
              <div>Browse uploads</div>
              <div class="i-tabler-arrow-right" />
            </As>
          </Button>
        </div>
      </div>
      <div class="border rounded-lg shadow dark:shadow-none dark:border-none">
        <img src="/characters.png" class="rounded-lg -scale-x-100" />
      </div>
    </div>
  );
}
