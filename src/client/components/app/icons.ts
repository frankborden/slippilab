import { type Session } from "~/common/model/types";

export const replayTypeIcons: Record<Session["type"], string> = {
  offline: "i-tabler-home",
  "old online": "i-tabler-world",
  unranked: "i-tabler-building-broadcast-tower",
  direct: "i-tabler-route rotate-90",
  ranked: "i-tabler-crown",
};
