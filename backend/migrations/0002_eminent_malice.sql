CREATE TABLE "user_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"phone" varchar(30),
	"line1" varchar(255) NOT NULL,
	"line2" varchar(255),
	"city" varchar(120) NOT NULL,
	"state" varchar(120),
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(2) DEFAULT 'US' NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "idx_user_addresses_user" ON "user_addresses" USING btree ("user_id");