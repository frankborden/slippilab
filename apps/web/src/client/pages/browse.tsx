import { ReplayType } from "@slippilab/common";
import {
  type Params,
  RouteSectionProps,
  createAsync,
  useNavigate,
  useSearchParams,
} from "@solidjs/router";
import { Show } from "solid-js";

import { Filters, Replays } from "~/client/components/app/Replays";
import { BrowseData } from "~/client/pages/browse.data";

export default function Browse(props: RouteSectionProps) {
  const replays = createAsync(() =>
    BrowseData({ ...props, intent: "initial" }),
  );
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div class="w-full">
      <Show when={replays()}>
        {(replays) => (
          <Replays
            replays={replays().stubs}
            filters={queryToFilters(searchParams)}
            onFiltersChanged={(filters) =>
              navigate(`?${filtersToQuery(filters)}`)
            }
            pageIndex={replays().pageIndex}
            pageTotalCount={replays().pageTotalCount}
            onPageChange={(pageIndex) => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", String(pageIndex + 1));
              navigate(`?${params}`);
            }}
            connectCodes={replays()
              .stubs.flatMap((replay) =>
                replay.players.map((p) => p.connectCode),
              )
              .filter((c): c is string => !!c)}
            onSelect={(replay) =>
              navigate(
                `/watch/${
                  replays().stubs.find((stub) => stub === replay)!.slug
                }`,
              )
            }
          />
        )}
      </Show>
    </div>
  );
}

function filtersToQuery(filters: Filters) {
  const params = new URLSearchParams(window.location.search);
  params.delete("page");
  if (filters.replayTypes.length) {
    params.set("types", filters.replayTypes.join(","));
  } else {
    params.delete("types");
  }
  if (filters.stageIds.length) {
    params.set("stages", filters.stageIds.join(","));
  } else {
    params.delete("stages");
  }
  if (filters.characterIds.length) {
    params.set("characters", filters.characterIds.join(","));
  } else {
    params.delete("characters");
  }
  if (filters.connectCodes.length) {
    params.set("connectCodes", filters.connectCodes.join(","));
  } else {
    params.delete("connectCodes");
  }
  return params.toString();
}

function queryToFilters(query: Params): Filters {
  const replayTypes = (query["types"]?.split(",") ?? []).filter(
    (t): t is ReplayType => allReplayTypes.includes(t as ReplayType),
  );
  const stageIds = query["stages"]?.split(",").map(Number) ?? [];
  const characterIds = query["characters"]?.split(",").map(Number) ?? [];
  const connectCodes = query["connectCodes"]?.split(",") ?? [];
  return { replayTypes, stageIds, characterIds, connectCodes };
}

const allReplayTypes: ReplayType[] = [
  "direct",
  "offline",
  "old online",
  "ranked",
  "unranked",
];
