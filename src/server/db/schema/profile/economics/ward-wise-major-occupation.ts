import { 
  pgTable, 
  varchar, 
  uuid, 
  integer, 
  text, 
  timestamp 
} from "drizzle-orm/pg-core";

export const wardWiseMajorOccupation = pgTable("ward_wise_major_occupation", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardId: text("ward_id").notNull(),
  wardNumber: integer("ward_number"),
  occupation: text("occupation").notNull(),
  population: integer("population").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fallback ACME table for legacy data
export const acmeWardWiseMajorOccupation = pgTable("acme_ward_wise_major_occupation", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardNumber: integer("ward_number").notNull(),
  occupation: text("occupation").notNull(),
  population: integer("population").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type WardWiseMajorOccupation = typeof wardWiseMajorOccupation.$inferSelect;
export type NewWardWiseMajorOccupation = typeof wardWiseMajorOccupation.$inferInsert;
