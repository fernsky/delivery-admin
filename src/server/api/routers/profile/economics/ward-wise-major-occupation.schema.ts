import { z } from "zod";

// Define the occupation type enum for validation
export const OccupationTypeEnum = z.enum([
  "GOVERNMENTAL_JOB",
  "NON_GOVERNMENTAL_JOB",
  "LABOUR",
  "FOREIGN_EMPLOYMENT",
  "BUSINESS",
  "OTHER_EMPLOYMENT",
  "STUDENT",
  "HOUSEHOLDER",
  "OTHER_UNEMPLOYMENT",
  "INDUSTRY",
  "ANIMAL_HUSBANDRY",
  "OTHER_SELF_EMPLOYMENT"
]);
export type OccupationType = z.infer<typeof OccupationTypeEnum>;

// Schema for ward-wise major occupation data
export const wardWiseMajorOccupationSchema = z.object({
  id: z.string().optional(),
  wardId: z.string(),
  occupation: OccupationTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise major occupation data
export const wardWiseMajorOccupationFilterSchema = z.object({
  wardId: z.string().optional(),
  occupation: OccupationTypeEnum.optional(),
});

export const updateWardWiseMajorOccupationSchema = wardWiseMajorOccupationSchema;

export type WardWiseMajorOccupationData = z.infer<typeof wardWiseMajorOccupationSchema>;
export type UpdateWardWiseMajorOccupationData = WardWiseMajorOccupationData;
export type WardWiseMajorOccupationFilter = z.infer<typeof wardWiseMajorOccupationFilterSchema>;
