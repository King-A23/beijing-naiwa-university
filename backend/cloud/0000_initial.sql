CREATE TABLE `rate_limits` (
	`bucket` text PRIMARY KEY NOT NULL,
	`hits` integer DEFAULT 1 NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rate_limits_expiry` ON `rate_limits` (`expires_at`);--> statement-breakpoint
CREATE TABLE `students` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`frog_id` text NOT NULL,
	`name` text NOT NULL,
	`avatar_id` text NOT NULL,
	`entry_year` integer DEFAULT 0 NOT NULL,
	`graduation_year` integer DEFAULT 4 NOT NULL,
	`enrolled_at` text NOT NULL,
	`request_id` text NOT NULL,
	CONSTRAINT "name_length" CHECK(length("students"."name") BETWEEN 1 AND 20),
	CONSTRAINT "canonical_frog_id" CHECK("students"."frog_id" = upper("students"."frog_id") AND length("students"."frog_id") BETWEEN 3 AND 20 AND "students"."frog_id" NOT GLOB '*[^A-Z0-9_-]*'),
	CONSTRAINT "avatar_choice" CHECK("students"."avatar_id" IN ('welcome','signal','study','graduate')),
	CONSTRAINT "fixed_entry_year" CHECK("students"."entry_year" = 0),
	CONSTRAINT "fixed_graduation_year" CHECK("students"."graduation_year" = 4)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `students_frog_id_unique` ON `students` (`frog_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `students_request_id_unique` ON `students` (`request_id`);