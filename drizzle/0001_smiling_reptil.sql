CREATE TABLE "adi_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"volunteer_id" integer NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"file_content" text NOT NULL,
	"record_count" integer NOT NULL,
	"processed_count" integer NOT NULL,
	"status" varchar(16) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "adi_submissions" ADD CONSTRAINT "adi_submissions_volunteer_id_volunteers_volunteer_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteers"("volunteer_id") ON DELETE no action ON UPDATE no action;