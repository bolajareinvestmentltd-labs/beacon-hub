ALTER TABLE "subscribers" ADD COLUMN "news_updates" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN "horoscope_updates" boolean DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE "subscribers" ADD COLUMN "zodiac_sign" varchar(20);