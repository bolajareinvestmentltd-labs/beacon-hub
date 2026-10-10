ALTER TABLE "article_interactions" ADD COLUMN "reader_id" varchar(64);
--> statement-breakpoint
UPDATE "article_interactions"
SET "reader_id" = md5("email" || random()::text || clock_timestamp()::text)
WHERE "reader_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "article_interactions" ALTER COLUMN "reader_id" SET NOT NULL;
--> statement-breakpoint
DROP INDEX "article_interactions_article_email_idx";
--> statement-breakpoint
CREATE UNIQUE INDEX "article_interactions_article_reader_idx" ON "article_interactions" USING btree ("article_id", "reader_id");
--> statement-breakpoint
DROP TABLE "reader_verification_codes";