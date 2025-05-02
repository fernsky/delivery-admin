import { z } from "zod";

// Schema for ward-wise caste population data
export const wardWiseCastePopulationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().min(1).max(20),
  casteType: z.string(),
  population: z.number().int().nonnegative().optional(),
});

// Schema for filtering ward-wise caste population data
export const wardWiseCastePopulationFilterSchema = z.object({
  wardNumber: z.number().int().min(1).max(20).optional(),
  casteType: z.string().optional(),
});

export const updateWardWiseCastePopulationSchema = wardWiseCastePopulationSchema;

export type WardWiseCastePopulationData = z.infer<
  typeof wardWiseCastePopulationSchema
>;
export type UpdateWardWiseCastePopulationData = WardWiseCastePopulationData;
export type WardWiseCastePopulationFilter = z.infer<typeof wardWiseCastePopulationFilterSchema>;
