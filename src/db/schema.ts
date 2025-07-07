import { pgTable, serial, varchar, integer, timestamp, decimal, text, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';

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

// Poll system tables
export const pollTypeEnum = pgEnum('poll_type', ['visitor', 'volunteer']);

export const polls = pgTable('polls', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  pollType: pollTypeEnum('poll_type').notNull(),
  question: text('question').notNull(),
  options: jsonb('options').notNull(), // ["Option 1", "Option 2", "Option 3"]
  allowMultiple: boolean('allow_multiple').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  createdBy: integer('created_by').references(() => volunteers.volunteerId), // NULL for visitor polls
  displayOrder: integer('display_order').default(0),
});

export const pollResponses = pgTable('poll_responses', {
  id: serial('id').primaryKey(),
  pollId: integer('poll_id').references(() => polls.id, { onDelete: 'cascade' }).notNull(),
  volunteerId: integer('volunteer_id').references(() => volunteers.volunteerId), // NULL for visitor responses
  responseData: jsonb('response_data').notNull(), // {"selected_options": [0, 2], "text_response": "..."}
  ipAddress: varchar('ip_address', { length: 45 }), // For visitor responses (anonymized)
  userAgent: text('user_agent'), // For visitor responses
  createdAt: timestamp('created_at').defaultNow(),
}); 