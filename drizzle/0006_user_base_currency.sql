ALTER TABLE `users` ADD `base_currency` text NOT NULL DEFAULT 'UAH';
--> statement-breakpoint
UPDATE `users` SET `base_currency` = `currency`;
