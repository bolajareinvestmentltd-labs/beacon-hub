CREATE TABLE "push_subscriptions" (
  "endpoint" text PRIMARY KEY NOT NULL,
  "reader_id" varchar(64) NOT NULL,
  "email" varchar(255) NOT NULL,
  "p256dh" text NOT NULL,
  "auth" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);