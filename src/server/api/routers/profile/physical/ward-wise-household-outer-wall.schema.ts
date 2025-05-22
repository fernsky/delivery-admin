import { z } from "zod";

// Define the outer wall type enum to match the database enum
export const OuterWallTypeEnum = z.enum([
  "CEMENT_JOINED",
  "UNBAKED_BRICK",
  "MUD_JOINED",
  "TIN",
  "BAMBOO",
  "WOOD",
  "PREFAB",
  "OTHER",
]);
export type OuterWallType = z.infer<typeof OuterWallTypeEnum>;

// Schema for ward-wise household outer wall data
export const wardWiseHouseholdOuterWallSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  wallType: OuterWallTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise household outer wall data
export const wardWiseHouseholdOuterWallFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  wallType: OuterWallTypeEnum.optional(),
});

export const updateWardWiseHouseholdOuterWallSchema =
  wardWiseHouseholdOuterWallSchema;

export type WardWiseHouseholdOuterWallData = z.infer<
  typeof wardWiseHouseholdOuterWallSchema
>;
export type UpdateWardWiseHouseholdOuterWallData =
  WardWiseHouseholdOuterWallData;
export type WardWiseHouseholdOuterWallFilter = z.infer<
  typeof wardWiseHouseholdOuterWallFilterSchema
>;

// Export the outer wall type options for use in UI components
export const outerWallOptions = [
  {
    value: "CEMENT_JOINED",
    label: "Cement-bonded brick/stone (सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा)",
  },
  { value: "UNBAKED_BRICK", label: "Unbaked brick (काँचो इँटा)" },
  {
    value: "MUD_JOINED",
    label: "Mud-bonded brick/stone (माटोको जोडाइ भएको इँटा/ढुङ्गा)",
  },
  { value: "TIN", label: "Tin/Metal sheet (जस्ता/टिन/च्यादर)" },
  { value: "BAMBOO", label: "Bamboo materials (बाँसजन्य सामग्री)" },
  { value: "WOOD", label: "Wood/Plank (काठ/फल्याक)" },
  { value: "PREFAB", label: "Prefabricated (प्रि फ्याब)" },
  { value: "OTHER", label: "Other materials (अन्य)" },
];
