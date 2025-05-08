import { z } from "zod";

// Schema for ward-wise trained population data
export const wardWiseTrainedPopulationSchema = z.object({
  id: z.string().optional(),
  wardId: z.string(),
  wardNumber: z.number().int().optional(),
  trainedPopulation: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise trained population data
export const wardWiseTrainedPopulationFilterSchema = z.object({
  wardId: z.string().optional(),
  wardNumber: z.number().int().optional(),
});

export const updateWardWiseTrainedPopulationSchema = wardWiseTrainedPopulationSchema;

export type WardWiseTrainedPopulationData = z.infer<typeof wardWiseTrainedPopulationSchema>;
export type UpdateWardWiseTrainedPopulationData = WardWiseTrainedPopulationData;
export type WardWiseTrainedPopulationFilter = z.infer<typeof wardWiseTrainedPopulationFilterSchema>;
