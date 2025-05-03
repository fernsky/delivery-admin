import { pgTable } from "../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { wardWiseDemographicSummary } from "./ward-wise-demographic-summary";

// Define religion type enum based on the provided religion values
export const religionTypeEnum = pgEnum("religion_type", [
  "HINDU",
  "BUDDHIST",
  "KIRANT",
  "CHRISTIAN", 
  "ISLAM",
  "NATURE",
  "BON",
  "JAIN",
  "BAHAI",
  "SIKH",
  "OTHER",
]);

export const wardWiseReligionPopulation = pgTable("ward_wise_religion_population", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Reference to the ward entity through the demographic summary
  wardId: varchar("ward_id", { length: 36 })
    .notNull()
    .references(() => wardWiseDemographicSummary.id),
  
  // Religion category 
  religionType: religionTypeEnum("religion_type").notNull(),
  
  // Number of people practicing the specified religion in the ward
  population: integer("population").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseReligionPopulation = typeof wardWiseReligionPopulation.$inferSelect;
export type NewWardWiseReligionPopulation = typeof wardWiseReligionPopulation.$inferInsert;
