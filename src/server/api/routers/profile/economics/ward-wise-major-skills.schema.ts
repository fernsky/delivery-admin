import { z } from "zod";

// Define the skill type enum to match the database enum
export const skillTypeEnum = z.enum([
  "TEACHING_RELATED",
  "PHOTOGRAPHY_RELATED",
  "HANDICRAFT_RELATED",
  "MUSIC_DRAMA_RELATED",
  "STONEWORK_WOODWORK",
  "CARPENTERY_RELATED",
  "PLUMBING",
  "HUMAN_HEALTH_RELATED",
  "ANIMAL_HEALTH_RELATED",
  "ELECTRICITY_INSTALLMENT_RELATED",
  "HOTEL_RESTAURANT_RELATED",
  "AGRICULTURE_RELATED",
  "PRINTING_RELATED",
  "DRIVING_RELATED",
  "MECHANICS_RELATED",
  "FURNITURE_RELATED",
  "SHOEMAKING_RELATED",
  "SEWING_RELATED",
  "JWELLERY_MAKING_RELATED",
  "BEUATICIAN_RELATED",
  "SELF_PROTECTION_RELATED",
  "LAND_SURVEY_RELATED",
  "COMPUTER_SCIENCE_RELATED",
  "ENGINEERING_DESIGN_RELATED",
  "RADIO_TELEVISION_ELECTRICAL_REPAIR",
  "LITERARY_CREATION_RELATED",
  "OTHER",
  "NONE",
]);

// Schema for ward-wise major skills data
export const wardWiseMajorSkillsSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int(),
  skill: skillTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise major skills data
export const wardWiseMajorSkillsFilterSchema = z.object({
  wardNumber: z.number().int().optional(),
  skill: skillTypeEnum.optional(),
});

export const updateWardWiseMajorSkillsSchema = wardWiseMajorSkillsSchema;

export type WardWiseMajorSkillsData = z.infer<typeof wardWiseMajorSkillsSchema>;
export type UpdateWardWiseMajorSkillsData = WardWiseMajorSkillsData;
export type WardWiseMajorSkillsFilter = z.infer<
  typeof wardWiseMajorSkillsFilterSchema
>;
