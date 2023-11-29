import { relations } from "drizzle-orm";
import {
  blob,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  // other user attributes
});

export const session = sqliteTable("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  activeExpires: blob("active_expires", { mode: "bigint" }).notNull(),
  idleExpires: blob("idle_expires", { mode: "bigint" }).notNull(),
});

export const key = sqliteTable("user_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  hashedPassword: text("hashed_password"),
});

export const replays = sqliteTable("replays", {
  id: text("id").primaryKey(),
  owner: text("owner")
    .notNull()
    .references(() => user.id),
  type: text("type").notNull(),
  slug: text("slug").notNull().unique(),
  matchId: text("match_id"),
  gameNumber: integer("game_number"),
  tiebreakerNumber: integer("tiebreaker_number"),
  startTimestamp: text("start_timestamp").notNull(),
  stageId: integer("stage_id").notNull(),
});

export const replayRelations = relations(replays, ({ many }) => ({
  replayPlayers: many(replayPlayers),
}));

export const replayPlayers = sqliteTable(
  "replay_players",
  {
    replayId: text("replay_id").references(() => replays.id),
    playerIndex: integer("player_index").notNull(),
    connectCode: text("connect_code"),
    displayName: text("display_name"),
    nametag: text("nametag"),
    teamId: integer("team_id"),
    externalCharacterId: integer("external_character_id").notNull(),
    costumeIndex: integer("costume_index").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.replayId, table.playerIndex] }),
  }),
);

export const replayPlayerRelations = relations(replayPlayers, ({ one }) => ({
  replay: one(replays, {
    fields: [replayPlayers.replayId],
    references: [replays.id],
  }),
}));
