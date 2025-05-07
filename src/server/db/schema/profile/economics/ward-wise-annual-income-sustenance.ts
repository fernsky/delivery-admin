import { 
  pgTable, 
  varchar, 
  uuid, 
  integer, 
  text, 
  timestamp,
  pgEnum 
} from "drizzle-orm/pg-core";

// Enum for months sustained categories
export const monthsSustainedEnum = pgEnum("months_sustained", [
  "UPTO_THREE_MONTHS", // Up to 3 months of sustenance (३ महिना सम्म)
  "THREE_TO_SIX_MONTHS", // 3-6 months of sustenance (३ देखि ६ महिना)
  "SIX_TO_NINE_MONTHS", // 6-9 months of sustenance (६ देखि ९ महिना)
  "TWELVE_MONTHS", // Year-round sustenance (बर्षैभरी)
]);

export const wardWiseAnnualIncomeSustenance = pgTable("ward_wise_annual_income_sustenance", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardId: text("ward_id").notNull(),
  wardNumber: integer("ward_number"),
  monthsSustained: monthsSustainedEnum("months_sustained").notNull(),
  households: integer("households").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Fallback ACME table for legacy data
export const acmeWardWiseAnnualIncomeSustenance = pgTable("acme_ward_wise_annual_income_sustenance", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardNumber: integer("ward_number").notNull(),
  monthsSustained: monthsSustainedEnum("months_sustained").notNull(),
  households: integer("households").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type WardWiseAnnualIncomeSustenance = typeof wardWiseAnnualIncomeSustenance.$inferSelect;
export type NewWardWiseAnnualIncomeSustenance = typeof wardWiseAnnualIncomeSustenance.$inferInsert;
