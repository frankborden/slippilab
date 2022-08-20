// import { groupBy } from "rambda";
import { createMemo, Show, useContext } from "solid-js";
// import { characterNameByExternalId } from "~/common/ids";
// import { PlayerSettings } from "~/common/types";
import { ReplayStoreContext } from "~/state/replayStore";
import { SelectionStoreContext } from "~/state/selectionStore";

export function NowPlaying() {
  const [selectionState] = useContext(SelectionStoreContext);
  const [replayState] = useContext(ReplayStoreContext);
  // function player(p: PlayerSettings): string {
  //   return p.displayName?.length > 0 && p.connectCode?.length > 0
  //     ? `${p.displayName}(${p.connectCode})`
  //     : `P${p.port}(${characterNameByExternalId[p.externalCharacterId]})`;
  // }
  const info = createMemo(() => {
    return replayState.replayData === undefined ||
      selectionState.selectedFileAndSettings === undefined
      ? {}
      : {
          name: selectionState.selectedFileAndSettings[0].name,
          date: new Date(
            replayState.replayData.settings.startTimestamp
          ).toLocaleString(),
          // platform: replayState.replayData.settings.platform,
          // console: replayState.replayData.settings.consoleNickname,
          // players: Object.values(
          //   groupBy(
          //     (p) => String(p.teamId),
          //     replayState.replayData.settings.playerSettings.filter((p) => p)
          //   )
          // )
          //   .map((players) => players.map(player).join(", "))
          //   .join("\n"),
        };
  });
  return (
    <>
      <div class="flex items-center gap-4">
        <div class="text-xl">{info().name}</div>
        <Show when={info().date}>
          <div class="text-xl">{info().date}</div>
        </Show>
      </div>
    </>
  );
}
