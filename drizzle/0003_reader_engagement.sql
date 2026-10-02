CREATE TABLE "reader_verification_codes" (
  "email" varchar(255) PRIMARY KEY NOT NULL,
  "code_hash" varchar(64) NOT NULL,
  "expires_at" timestamp NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_interactions" (
  "id" serial PRIMARY KEY NOT NULL,
  "article_id" integer NOT NULL REFERENCES "articles"("id") ON DELETE CASCADE,
  "email" varchar(255) NOT NULL,
  "reaction" varchar(8),
  "rating" smallint,
  "comment" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "article_interactions_article_email_idx" ON "article_interactions" USING btree ("article_id", "email");