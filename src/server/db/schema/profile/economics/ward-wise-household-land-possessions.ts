import { 
  pgTable, 
  varchar, 
  uuid, 
  integer, 
  text, 
  timestamp 
} from "drizzle-orm/pg-core";

export const wardWiseHouseholdLandPossessions = pgTable("ward_wise_household_land_possessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardId: text("ward_id").notNull(),
  wardNumber: integer("ward_number"),
  households: integer("households").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fallback ACME table for legacy data
export const acmeWardWiseHouseholdLandPossessions = pgTable("acme_ward_wise_household_land_possessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardNumber: integer("ward_number").notNull(),
  households: integer("households").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type WardWiseHouseholdLandPossessions = typeof wardWiseHouseholdLandPossessions.$inferSelect;
export type NewWardWiseHouseholdLandPossessions = typeof wardWiseHouseholdLandPossessions.$inferInsert;
