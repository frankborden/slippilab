CREATE TABLE `replay_players` (
	`replay_id` text,
	`player_index` integer NOT NULL,
	`connect_code` text,
	`display_name` text,
	`nametag` text,
	`team_id` integer,
	`external_character_id` integer NOT NULL,
	`costume_index` integer NOT NULL,
	PRIMARY KEY(`player_index`, `replay_id`),
	FOREIGN KEY (`replay_id`) REFERENCES `replays`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `replays` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`slug` text NOT NULL,
	`match_id` text,
	`game_number` integer,
	`tiebreaker_number` integer,
	`start_timestamp` text NOT NULL,
	`stage_id` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `replays_slug_unique` ON `replays` (`slug`);