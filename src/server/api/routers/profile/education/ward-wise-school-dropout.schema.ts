import { z } from "zod";

// Define the school dropout cause type enum to match the database enum
export const SchoolDropoutCauseTypeEnum = z.enum([
  "BUSINESS",
  "PRIVATE_JOB",
  "GOVERNMENTAL_JOB",
  "STUDY",
  "WORK",
  "DEPENDENT",
  "CONFLICT",
  "OTHER",
  "UNKNOWN",
]);
export type SchoolDropoutCauseType = z.infer<typeof SchoolDropoutCauseTypeEnum>;

// Schema for ward-wise school dropout data
export const wardWiseSchoolDropoutSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  cause: SchoolDropoutCauseTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise school dropout data
export const wardWiseSchoolDropoutFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  cause: SchoolDropoutCauseTypeEnum.optional(),
});

export const updateWardWiseSchoolDropoutSchema = wardWiseSchoolDropoutSchema;

export type WardWiseSchoolDropoutData = z.infer<
  typeof wardWiseSchoolDropoutSchema
>;
export type UpdateWardWiseSchoolDropoutData = WardWiseSchoolDropoutData;
export type WardWiseSchoolDropoutFilter = z.infer<
  typeof wardWiseSchoolDropoutFilterSchema
>;

// Export the dropout cause options for use in UI components
export const schoolDropoutCauseOptions = [
  {
    value: "BUSINESS",
    label: "Business or entrepreneurship (व्यापार/व्यवसाय)",
  },
  { value: "PRIVATE_JOB", label: "Private sector employment (निजी नोकरी)" },
  { value: "GOVERNMENTAL_JOB", label: "Government employment (सरकारी जागिर)" },
  { value: "STUDY", label: "Focus on different studies (अध्ययन/तालिम)" },
  { value: "WORK", label: "Seeking employment (काम/जागिरको खोजी)" },
  { value: "DEPENDENT", label: "Dependent on others (आश्रित)" },
  { value: "CONFLICT", label: "Conflict-related reasons (द्वन्द्व)" },
  { value: "OTHER", label: "Other reasons (अन्य)" },
  { value: "UNKNOWN", label: "Unknown reason (थाहा छैन)" },
];
