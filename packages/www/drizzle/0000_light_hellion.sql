CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `players` (
	`replay_id` text NOT NULL,
	`player_index` integer NOT NULL,
	`external_character_id` integer NOT NULL,
	`costume_index` integer NOT NULL,
	`display_name` text,
	`connect_code` text,
	`nametag` text,
	`team` text,
	PRIMARY KEY(`player_index`, `replay_id`),
	FOREIGN KEY (`replay_id`) REFERENCES `replays`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `replays` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`event_id` text,
	`stage_id` integer NOT NULL,
	`type` text NOT NULL,
	`start_timestamp` text NOT NULL,
	`upload_timestamp` text NOT NULL,
	`match_id` text,
	`game_number` integer,
	`tiebreaker_number` integer,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE no action
);
