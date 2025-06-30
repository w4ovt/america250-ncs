-- Migration: Unified volunteers table
-- Drop foreign key constraints first
ALTER TABLE "volunteers" DROP CONSTRAINT IF EXISTS "volunteers_pin_id_pins_pin_id_fk";
ALTER TABLE "activations" DROP CONSTRAINT IF EXISTS "activations_volunteer_id_volunteers_volunteer_id_fk";
ALTER TABLE "adi_submissions" DROP CONSTRAINT IF EXISTS "adi_submissions_volunteer_id_volunteers_volunteer_id_fk";

-- Add new columns to volunteers table
ALTER TABLE "volunteers" ADD COLUMN "pin" varchar(4);
ALTER TABLE "volunteers" ADD COLUMN "role" varchar(16) DEFAULT 'volunteer';

-- Drop the pins table
DROP TABLE IF EXISTS "pins";

-- Add constraints to new columns
ALTER TABLE "volunteers" ALTER COLUMN "pin" SET NOT NULL;
ALTER TABLE "volunteers" ADD CONSTRAINT "volunteers_pin_unique" UNIQUE ("pin");

-- Re-add foreign key constraints
ALTER TABLE "activations" ADD CONSTRAINT "activations_volunteer_id_volunteers_volunteer_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "volunteers"("volunteer_id");
ALTER TABLE "adi_submissions" ADD CONSTRAINT "adi_submissions_volunteer_id_volunteers_volunteer_id_fk" FOREIGN KEY ("volunteer_id") REFERENCES "volunteers"("volunteer_id"); 