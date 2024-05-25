import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const replays = sqliteTable("replays", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  eventId: text("event_id").references(() => events.id),
  stageId: integer("stage_id").notNull(),
  type: text("type").notNull(),
  startTimestamp: text("start_timestamp").notNull(),
  uploadTimestamp: text("upload_timestamp").notNull(),
  matchId: text("match_id"),
  gameNumber: integer("game_number"),
  tiebreakerNumber: integer("tiebreaker_number"),
});

export const players = sqliteTable(
  "players",
  {
    replayId: text("replay_id")
      .notNull()
      .references(() => replays.id),
    playerIndex: integer("player_index").notNull(),
    externalCharacterId: integer("external_character_id").notNull(),
    costumeIndex: integer("costume_index").notNull(),
    displayName: text("display_name"),
    connectCode: text("connect_code"),
    nametag: text("nametag"),
    teamId: text("team"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.replayId, table.playerIndex] }),
  }),
);

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});
