import { pgTable } from "../../../schema/basic";
import { integer, varchar, pgEnum, timestamp } from "drizzle-orm/pg-core";

// Define the age group enum
export const ageGroupEnum = pgEnum("age_group", [
  "AGE_0_4",
  "AGE_5_9",
  "AGE_10_14",
  "AGE_15_19",
  "AGE_20_24",
  "AGE_25_29",
  "AGE_30_34",
  "AGE_35_39",
  "AGE_40_44",
  "AGE_45_49",
  "AGE_50_54",
  "AGE_55_59",
  "AGE_60_64",
  "AGE_65_69",
  "AGE_70_74",
  "AGE_75_AND_ABOVE",
]);

// Use the existing gender enum from ward-wise-househead-gender
import { genderEnum } from "./ward-wise-househead-gender";

// Define the ward age wise population table
export const wardAgeWisePopulation = pgTable("ward_age_wise_population", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward information
  wardNumber: integer("ward_number").notNull(),

  // Age group and gender
  ageGroup: ageGroupEnum("age_group").notNull(),
  gender: genderEnum("gender").notNull(),

  // Population count
  population: integer("population").notNull().default(0),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardAgeWisePopulation = typeof wardAgeWisePopulation.$inferSelect;
export type NewWardAgeWisePopulation =
  typeof wardAgeWisePopulation.$inferInsert;
