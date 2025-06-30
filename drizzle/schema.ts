import { pgTable, serial, varchar, integer, timestamp, foreignKey, numeric, unique, text } from "drizzle-orm/pg-core"



export const logSubmissions = pgTable("log_submissions", {
	id: serial().primaryKey().notNull(),
	filename: varchar({ length: 128 }),
	callsign: varchar({ length: 12 }),
	name: varchar({ length: 64 }),
	result: varchar({ length: 16 }),
	recordCount: integer("record_count"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const activations = pgTable("activations", {
	activationId: serial("activation_id").primaryKey().notNull(),
	volunteerId: integer("volunteer_id"),
	frequencyMhz: numeric("frequency_mhz", { precision: 6, scale:  3 }).notNull(),
	mode: varchar({ length: 16 }).notNull(),
	startedAt: timestamp("started_at", { mode: 'string' }).defaultNow(),
	endedAt: timestamp("ended_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.volunteerId],
			foreignColumns: [volunteers.volunteerId],
			name: "activations_volunteer_id_volunteers_volunteer_id_fk"
		}),
]);

export const volunteers = pgTable("volunteers", {
	volunteerId: serial("volunteer_id").primaryKey().notNull(),
	name: varchar({ length: 64 }).notNull(),
	callsign: varchar({ length: 12 }).notNull(),
	state: varchar({ length: 2 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	pin: varchar({ length: 4 }).notNull(),
	role: varchar({ length: 16 }).default('volunteer').notNull(),
}, (table) => [
	unique("volunteers_pin_key").on(table.pin),
]);

export const adiSubmissions = pgTable("adi_submissions", {
	id: serial().primaryKey().notNull(),
	volunteerId: integer("volunteer_id").notNull(),
	submittedAt: timestamp("submitted_at", { mode: 'string' }).defaultNow().notNull(),
	filename: varchar({ length: 255 }).notNull(),
	fileContent: text("file_content").notNull(),
	recordCount: integer("record_count").notNull(),
	processedCount: integer("processed_count").notNull(),
	status: varchar({ length: 16 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.volunteerId],
			foreignColumns: [volunteers.volunteerId],
			name: "adi_submissions_volunteer_id_volunteers_volunteer_id_fk"
		}),
]);
