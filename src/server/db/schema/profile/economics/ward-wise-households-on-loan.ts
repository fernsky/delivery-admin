import { 
  pgTable, 
  uuid, 
  integer, 
  text, 
  timestamp 
} from "drizzle-orm/pg-core";

export const wardWiseHouseholdsOnLoan = pgTable("ward_wise_households_on_loan", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardId: text("ward_id").notNull(),
  wardNumber: integer("ward_number"),
  households: integer("households").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fallback ACME table for legacy data
export const acmeWardWiseHouseholdsOnLoan = pgTable("acme_ward_wise_households_on_loan", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardNumber: integer("ward_number").notNull(),
  households: integer("households").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type WardWiseHouseholdsOnLoan = typeof wardWiseHouseholdsOnLoan.$inferSelect;
export type NewWardWiseHouseholdsOnLoan = typeof wardWiseHouseholdsOnLoan.$inferInsert;
