import { ReplayType } from "~/common/model/types";

export function stageUrl(stageId: number) {
  return `/stages/${stageId}.png`;
}

export function characterUrl({
  externalCharacterId,
  costumeIndex,
}: {
  externalCharacterId: number;
  costumeIndex?: number;
}) {
  return `/stockicons/${externalCharacterId}/${costumeIndex ?? 0}.png`;
}

export function rankUrl(rank: string) {
  return `/ranks/${rank.replace(" ", "_")}.svg`;
}

export function replayTypeIcon(type: ReplayType): string {
  switch (type) {
    case "offline":
      return "i-tabler-home";
    case "old online":
      return "i-tabler-world";
    case "unranked":
      return "i-tabler-building-broadcast-tower";
    case "direct":
      return "i-tabler-route rotate-90";
    case "ranked":
      return "i-tabler-crown";
  }
}
