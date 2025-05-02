import { z } from "zod";

// Define the age group enum values
export const AgeGroupEnum = z.enum([
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

// Using the existing Gender enum from ward-wise-househead-gender schema
import { GenderEnum } from "./ward-wise-househead-gender.schema";

// Schema for ward age-wise population data
export const wardAgeWisePopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().min(1).max(20),
  ageGroup: AgeGroupEnum,
  gender: GenderEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward age-wise population data
export const wardAgeWisePopulationFilterSchema = z.object({
  wardNumber: z.number().int().min(1).max(20).optional(),
  ageGroup: AgeGroupEnum.optional(),
  gender: GenderEnum.optional(),
});

export const updateWardAgeWisePopulationSchema = wardAgeWisePopulationSchema;

export type WardAgeWisePopulationData = z.infer<
  typeof wardAgeWisePopulationSchema
>;
export type UpdateWardAgeWisePopulationData = WardAgeWisePopulationData;
export type WardAgeWisePopulationFilter = z.infer<
  typeof wardAgeWisePopulationFilterSchema
>;
export type AgeGroup = z.infer<typeof AgeGroupEnum>;
