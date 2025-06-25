import { pgTable, serial, varchar, integer, char, numeric, timestamp } from 'drizzle-orm/pg-core';

export const pins = pgTable('pins', {
  pinId: serial('pin_id').primaryKey(),
  pin: varchar('pin', { length: 10 }),
  role: varchar('role', { length: 10 }), // 'volunteer' or 'admin'
});

export const volunteers = pgTable('volunteers', {
  volunteerId: serial('volunteer_id').primaryKey(),
  pinId: integer('pin_id').references(() => pins.pinId),
  name: varchar('name', { length: 100 }),
  callsign: varchar('callsign', { length: 12 }),
  state: char('state', { length: 2 }),
});

export const activations = pgTable('activations', {
  activationId: serial('activation_id').primaryKey(),
  volunteerId: integer('volunteer_id').references(() => volunteers.volunteerId),
  frequencyMhz: numeric('frequency_mhz', { precision: 8, scale: 3 }),
  mode: varchar('mode', { length: 20 }),
  startedAt: timestamp('started_at').defaultNow(),
  endedAt: timestamp('ended_at'),
}); 