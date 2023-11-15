import {
  type Params,
  useNavigate,
  useRouteData,
  useSearchParams,
} from "@solidjs/router";
import { Show } from "solid-js";

import { Filters, Replays } from "~/client/components/app/Replays";
import BrowseData from "~/client/pages/browse.data";
import { ReplayType } from "~/common/model/types";

export default function Browse() {
  const query = useRouteData<typeof BrowseData>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <div class="w-full">
      <h1 class="text-lg font-medium text-foreground/80">
        Browse Public Replays
      </h1>
      <Show when={query.data}>
        {(data) => (
          <Replays
            replays={data().stubs}
            filters={queryToFilters(searchParams)}
            onFiltersChanged={(filters) =>
              navigate(`?${filtersToQuery(filters)}`)
            }
            pageIndex={data().pageIndex}
            pageTotalCount={data().pageTotalCount}
            onPageChange={(pageIndex) => {
              const params = new URLSearchParams(window.location.search);
              params.set("page", String(pageIndex + 1));
              navigate(`?${params}`);
            }}
            connectCodes={data()
              .stubs.flatMap((replay) =>
                replay.players.map((p) => p.connectCode),
              )
              .filter((c): c is string => !!c)}
            onSelect={(replay) =>
              navigate(
                `/watch/${data().stubs.find((stub) => stub === replay)!.slug}`,
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
