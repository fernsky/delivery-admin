import { z } from "zod";

// Define the educational level type enum to match the database enum
export const EducationalLevelTypeEnum = z.enum([
  "CHILD_DEVELOPMENT_CENTER",
  "NURSERY",
  "GRADE_1",
  "GRADE_2",
  "GRADE_3",
  "GRADE_4",
  "GRADE_5",
  "GRADE_6",
  "GRADE_7",
  "GRADE_8",
  "GRADE_9",
  "GRADE_10",
  "SLC_LEVEL",
  "CLASS_12_LEVEL",
  "BACHELOR_LEVEL",
  "MASTERS_LEVEL",
  "PHD_LEVEL",
  "INFORMAL_EDUCATION",
  "OTHER",
  "EDUCATED",
  "UNKNOWN",
]);
export type EducationalLevelType = z.infer<typeof EducationalLevelTypeEnum>;

// Schema for ward-wise educational level data
export const wardWiseEducationalLevelSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  educationalLevelType: EducationalLevelTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise educational level data
export const wardWiseEducationalLevelFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  educationalLevelType: EducationalLevelTypeEnum.optional(),
});

export const updateWardWiseEducationalLevelSchema =
  wardWiseEducationalLevelSchema;

export type WardWiseEducationalLevelData = z.infer<
  typeof wardWiseEducationalLevelSchema
>;
export type UpdateWardWiseEducationalLevelData = WardWiseEducationalLevelData;
export type WardWiseEducationalLevelFilter = z.infer<
  typeof wardWiseEducationalLevelFilterSchema
>;

// Export the educational level types for use in UI components
export const educationalLevelOptions = [
  {
    value: "CHILD_DEVELOPMENT_CENTER",
    label: "Early childhood center/Montessori (बालविकास केन्द्र / मंटेस्वोरी)",
  },
  { value: "NURSERY", label: "Nursery/Kindergarten (नर्सरी/केजी)" },
  { value: "GRADE_1", label: "Class 1 (कक्षा १)" },
  { value: "GRADE_2", label: "Class 2 (कक्षा २)" },
  { value: "GRADE_3", label: "Class 3 (कक्षा ३)" },
  { value: "GRADE_4", label: "Class 4 (कक्षा ४)" },
  { value: "GRADE_5", label: "Class 5 (कक्षा ५)" },
  { value: "GRADE_6", label: "Class 6 (कक्षा ६)" },
  { value: "GRADE_7", label: "Class 7 (कक्षा ७)" },
  { value: "GRADE_8", label: "Class 8 (कक्षा ८)" },
  { value: "GRADE_9", label: "Class 9 (कक्षा ९)" },
  { value: "GRADE_10", label: "Class 10 (कक्षा १०)" },
  { value: "SLC_LEVEL", label: "SLC/SEE level (एसईई/एसएलसी/सो सरह)" },
  {
    value: "CLASS_12_LEVEL",
    label: "Class 12 or PCL level (कक्षा १२ वा PCL वा सो सरह)",
  },
  { value: "BACHELOR_LEVEL", label: "Bachelor's degree (स्नातक वा सो सरह)" },
  { value: "MASTERS_LEVEL", label: "Master's degree (स्नातकोत्तर वा सो सरह)" },
  { value: "PHD_LEVEL", label: "Doctorate (पीएचडी वा सो सरह)" },
  {
    value: "INFORMAL_EDUCATION",
    label: "Informal education (अनौपचारिक शिक्षा)",
  },
  { value: "OTHER", label: "Other educational qualifications (अन्य)" },
  { value: "EDUCATED", label: "Generally literate (साक्षर)" },
  { value: "UNKNOWN", label: "Unknown education level (थाहा नभएको)" },
];
