CREATE TABLE "content_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"article_id" integer NOT NULL,
	"views" integer DEFAULT 0,
	"unique_visitors" integer DEFAULT 0,
	"engagement_score" integer DEFAULT 0,
	"avg_read_duration" integer DEFAULT 0,
	"bounce_rate" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_article_id" integer NOT NULL,
	"related_article_id" integer NOT NULL,
	"relationship_type" varchar(50) DEFAULT 'keyword_match',
	"relevance_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "editorial_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text DEFAULT '',
	"display_order" integer DEFAULT 0,
	"accent_color" varchar(7) DEFAULT '#E2725B',
	"icon" varchar(255) DEFAULT '',
	"slug" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "editorial_sections_name_unique" UNIQUE("name"),
	CONSTRAINT "editorial_sections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "word_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "reading_time_minutes" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "editor_notes" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "is_premium_content" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "seo_keywords" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "related_article_ids" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "author_perspective" varchar(255) DEFAULT 'Editorial Board';--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "meta_description" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "horoscopes" ADD COLUMN "lunar_phase" varchar(50) DEFAULT '';--> statement-breakpoint
ALTER TABLE "horoscopes" ADD COLUMN "fortune_level" smallint DEFAULT 3;--> statement-breakpoint
ALTER TABLE "horoscopes" ADD COLUMN "lucky_color" varchar(50) DEFAULT '';--> statement-breakpoint
ALTER TABLE "horoscopes" ADD COLUMN "lucky_number" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "horoscopes" ADD COLUMN "compatible_signs" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "horoscopes" ADD COLUMN "career_forecast" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "horoscopes" ADD COLUMN "love_forecast" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "horoscopes" ADD COLUMN "financial_tip" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "horoscopes" ADD COLUMN "power_affirmation" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "horoscopes" ADD COLUMN "zodiac_icon" varchar(255) DEFAULT '';