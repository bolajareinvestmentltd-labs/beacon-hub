CREATE TABLE "site_traffic" (
  "id" serial PRIMARY KEY NOT NULL,
  "visitor_id" varchar(64) NOT NULL,
  "visit_date" date NOT NULL,
  "visits" integer DEFAULT 1 NOT NULL,
  "first_path" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "site_traffic_visitor_date_idx" ON "site_traffic" USING btree ("visitor_id","visit_date");