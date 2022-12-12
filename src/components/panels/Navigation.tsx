import {
  CloudIcon,
  ControllerIcon,
  FilmSlateIcon,
  GitHubIcon,
  TwitterIcon,
  VideoLibraryIcon,
} from "~/components/common/icons";
import { SettingsDialog } from "~/components/panels/SettingsDialog";
import { currentSidebar, setSidebar } from "~/state/navigationStore";

export function Navigation() {
  return (
    <div class="hidden border-r p-4 lg:block">
      <div class="flex h-full flex-col items-center justify-between">
        <div class="flex flex-col items-center gap-8">
          <img class="w-16" title="logo" src="logo.png" />
          <div class="flex w-10 flex-col">
            <CloudIcon
              title="Cloud Replays"
              classList={{
                "py-4 cursor-pointer -mx-7 px-7": true,
                "bg-slippi-50": currentSidebar() === "cloud replays",
              }}
              onClick={() => setSidebar("cloud replays")}
            />
            <VideoLibraryIcon
              title="Local Replays"
              classList={{
                "py-4 cursor-pointer -mx-7 px-7": true,
                "bg-slippi-50": currentSidebar() === "local replays",
              }}
              onClick={() => setSidebar("local replays")}
            />
            <FilmSlateIcon
              title="Clips"
              classList={{
                "py-4 cursor-pointer -mx-7 px-7": true,
                "bg-slippi-50": currentSidebar() === "clips",
              }}
              onClick={() => setSidebar("clips")}
            />
            <ControllerIcon
              title="Inputs"
              classList={{
                "py-4 cursor-pointer -mx-7 px-7": true,
                "bg-slippi-50": currentSidebar() === "inputs",
              }}
              onClick={() => setSidebar("inputs")}
            />
          </div>
        </div>
        <div class="flex flex-col items-center gap-2">
          <SettingsDialog />
          <a
            href="https://www.github.com/frankborden/slippilab"
            target="_blank"
          >
            <GitHubIcon class="w-10" title="GitHub" />
          </a>
          <a href="https://www.twitter.com/slippilab" target="_blank">
            <TwitterIcon class="w-8" title="Twitter" />
          </a>
        </div>
      </div>
    </div>
  );
}
