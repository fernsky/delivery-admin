import { pgTable } from "../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const wardWiseCastePopulation = pgTable("ward_wise_caste_population", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward identification
  wardNumber: integer("ward_number").notNull(),

  // Caste or ethnic group
  casteType: varchar("caste_type", { length: 100 }).notNull(),

  // Population count for this caste in the ward
  population: integer("population"),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseCastePopulation = typeof wardWiseCastePopulation.$inferSelect;
export type NewWardWiseCastePopulation = typeof wardWiseCastePopulation.$inferInsert;
