import { pgTable, serial, varchar, integer, timestamp, decimal, text } from 'drizzle-orm/pg-core';

export const volunteers = pgTable('volunteers', {
  volunteerId: serial('volunteer_id').primaryKey(),
  name: varchar('name', { length: 64 }).notNull(),
  callsign: varchar('callsign', { length: 12 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  pin: varchar('pin', { length: 4 }).notNull().unique(), // Integrated PIN
  role: varchar('role', { length: 16 }).notNull().default('volunteer'), // Integrated role
  createdAt: timestamp('created_at').defaultNow(),
});

export const activations = pgTable('activations', {
  activationId: serial('activation_id').primaryKey(),
  volunteerId: integer('volunteer_id').references(() => volunteers.volunteerId),
  frequencyMhz: decimal('frequency_mhz', { precision: 6, scale: 3 }).notNull(),
  mode: varchar('mode', { length: 16 }).notNull(),
  startedAt: timestamp('started_at').defaultNow(),
  endedAt: timestamp('ended_at'),
});

export const logSubmissions = pgTable('log_submissions', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 128 }),
  callsign: varchar('callsign', { length: 12 }),
  name: varchar('name', { length: 64 }),
  result: varchar('result', { length: 16 }), // 'success' or 'failure'
  recordCount: integer('record_count'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const adiSubmissions = pgTable('adi_submissions', {
  id: serial('id').primaryKey(),
  volunteerId: integer('volunteer_id').references(() => volunteers.volunteerId).notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  filename: varchar('filename', { length: 255 }).notNull(),
  fileContent: text('file_content').notNull(),
  recordCount: integer('record_count').notNull(), // attempted records
  processedCount: integer('processed_count').notNull(), // successfully processed records
  status: varchar('status', { length: 16 }).notNull(), // 'success' or 'rejected'
}); 