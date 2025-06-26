CREATE TABLE "activations" (
	"activation_id" serial PRIMARY KEY NOT NULL,
	"volunteer_id" integer,
	"frequency_mhz" numeric(6, 3) NOT NULL,
	"mode" varchar(16) NOT NULL,
	"started_at" timestamp DEFAULT now(),
	"ended_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "log_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" varchar(128),
	"callsign" varchar(12),
	"name" varchar(64),
	"result" varchar(16),
	"record_count" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pins" (
	"pin_id" serial PRIMARY KEY NOT NULL,
	"pin" varchar(4) NOT NULL,
	"role" varchar(16) DEFAULT 'volunteer' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pins_pin_unique" UNIQUE("pin")
);
--> statement-breakpoint
CREATE TABLE "volunteers" (
	"volunteer_id" serial PRIMARY KEY NOT NULL,
	"pin_id" integer,
	"name" varchar(64) NOT NULL,
	"callsign" varchar(12) NOT NULL,
	"state" varchar(2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "activations" ADD CONSTRAINT "activations_volunteer_id_volunteers_volunteer_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteers"("volunteer_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_pin_id_pins_pin_id_fk" FOREIGN KEY ("pin_id") REFERENCES "public"."pins"("pin_id") ON DELETE no action ON UPDATE no action;