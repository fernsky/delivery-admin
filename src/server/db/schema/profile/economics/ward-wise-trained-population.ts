import { 
  pgTable, 
  uuid, 
  integer, 
  text, 
  timestamp 
} from "drizzle-orm/pg-core";

export const wardWiseTrainedPopulation = pgTable("ward_wise_trained_population", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardId: text("ward_id").notNull(),
  wardNumber: integer("ward_number"),
  trainedPopulation: integer("trained_population").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fallback ACME table for legacy data
export const acmeWardWiseTrainedPopulation = pgTable("acme_ward_wise_trained_population", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardNumber: integer("ward_number").notNull(),
  trainedPopulation: integer("trained_population").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type WardWiseTrainedPopulation = typeof wardWiseTrainedPopulation.$inferSelect;
export type NewWardWiseTrainedPopulation = typeof wardWiseTrainedPopulation.$inferInsert;
