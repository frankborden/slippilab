import { IconButton } from "@hope-ui/solid";
import { groupBy } from "rambda";
import { createMemo, Show } from "solid-js";
import { characterNameByExternalId } from "../common/ids";
import { PlayerSettings } from "../common/types";
import { nextFile, previousFile, store } from "../state";

export function NowPlaying() {
  function player(p: PlayerSettings): string {
    return p.displayName !== "" && p.connectCode !== ""
      ? `${p.displayName}(${p.connectCode})`
      : `P${p.port}(${characterNameByExternalId[p.externalCharacterId]})`;
  }
  const info = createMemo(() => {
    return store.replayData === undefined
      ? {}
      : {
          name: store.files[store.currentFile].name,
          date: new Date(
            store.replayData.settings.startTimestamp
          ).toLocaleString(),
          platform: store.replayData.settings.platform,
          console: store.replayData.settings.consoleNickname,
          players: Object.values(
            groupBy(
              (p) => String(p.teamId),
              store.replayData.settings.playerSettings.filter((p) => p)
            )
          )
            .map((players) => players.map(player).join(", "))
            .join("\n"),
        };
  });
  return (
    <div class="flex w-full items-center justify-between gap-2">
      <IconButton
        aria-label="Previous File"
        onClick={previousFile}
        variant="subtle"
        icon={
          <div
            class="material-icons text-4xl cursor-pointer"
            aria-label="Open previous replay"
          >
            navigate_before
          </div>
        }
      />
      <div class="flex flex-col items-start">
        <div>{info().name}</div>
        <Show when={info().date}>
          <div>{info().date}</div>
        </Show>
        <Show when={info().platform}>
          <div>{info().platform}</div>
        </Show>
        <Show when={info().console}>
          <div>Console: {info().console}</div>
        </Show>
        <Show when={info().players !== ""}>
          <div class="whitespace-pre-line">{info().players}</div>
        </Show>
      </div>
      <IconButton
        aria-label="Next File"
        onClick={nextFile}
        variant="subtle"
        icon={
          <div
            class="material-icons text-4xl cursor-pointer"
            aria-label="Open next replay"
          >
            navigate_next
          </div>
        }
      />
    </div>
  );
}
