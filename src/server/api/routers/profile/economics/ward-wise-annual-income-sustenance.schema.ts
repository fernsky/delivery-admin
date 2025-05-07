import { z } from "zod";

// Months sustained enum values matching the database
export const MonthsSustainedEnum = z.enum([
  "UPTO_THREE_MONTHS",
  "THREE_TO_SIX_MONTHS",
  "SIX_TO_NINE_MONTHS",
  "TWELVE_MONTHS",
]);

export const monthsSustainedLabels = {
  UPTO_THREE_MONTHS: "Up to 3 months",
  THREE_TO_SIX_MONTHS: "3-6 months",
  SIX_TO_NINE_MONTHS: "6-9 months",
  TWELVE_MONTHS: "Year-round",
};

// Base schema for ward wise annual income sustenance
export const wardWiseAnnualIncomeSustenanceBaseSchema = z.object({
  monthsSustained: MonthsSustainedEnum,
  households: z.number(),
});

// Schema for adding ward wise annual income sustenance
export const addWardWiseAnnualIncomeSustenanceSchema = z.object({
  wardId: z.string(),
  wardNumber: z.number().optional(),
  data: z.array(wardWiseAnnualIncomeSustenanceBaseSchema),
});

// Schema for getting ward wise annual income sustenance
export const getWardWiseAnnualIncomeSustenanceSchema = z.object({
  wardId: z.string().optional(),
  wardNumber: z.number().optional(),
});

// Schema for batch adding ward wise annual income sustenance
export const batchAddWardWiseAnnualIncomeSustenanceSchema = z.object({
  palika: z.string(),
  data: z.array(
    z.object({
      wardNumber: z.number(),
      monthsSustained: MonthsSustainedEnum,
      households: z.number(),
    })
  ),
});
