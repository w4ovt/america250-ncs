import { relations } from "drizzle-orm/relations";
import { volunteers, activations, adiSubmissions } from "./schema";

export const activationsRelations = relations(activations, ({one}) => ({
	volunteer: one(volunteers, {
		fields: [activations.volunteerId],
		references: [volunteers.volunteerId]
	}),
}));

export const volunteersRelations = relations(volunteers, ({many}) => ({
	activations: many(activations),
	adiSubmissions: many(adiSubmissions),
}));

export const adiSubmissionsRelations = relations(adiSubmissions, ({one}) => ({
	volunteer: one(volunteers, {
		fields: [adiSubmissions.volunteerId],
		references: [volunteers.volunteerId]
	}),
}));