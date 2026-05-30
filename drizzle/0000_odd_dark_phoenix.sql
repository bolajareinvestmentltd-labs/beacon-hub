CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'editor',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"category" varchar(100) NOT NULL,
	"author" varchar(255) DEFAULT 'Beacon-Hub Intelligence',
	"source" varchar(255),
	"cover_image" text,
	"is_breaking" boolean DEFAULT false,
	"is_sponsored" boolean DEFAULT false,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"vendor_name" varchar(255) NOT NULL,
	"price" integer,
	"platform_fee" integer DEFAULT 50,
	"category" varchar(100),
	"image_url" text,
	"video_url" text,
	"has_watermark" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "horoscopes" (
	"id" serial PRIMARY KEY NOT NULL,
	"sign" varchar(50) NOT NULL,
	"reading" text NOT NULL,
	"publish_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
