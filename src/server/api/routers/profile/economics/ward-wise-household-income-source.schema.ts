import { z } from "zod";

// Income source enum values matching the database
export const IncomeSourceEnum = z.enum([
  "JOB",
  "AGRICULTURE",
  "BUSINESS",
  "INDUSTRY",
  "FOREIGN_EMPLOYMENT",
  "LABOUR",
  "OTHER",
]);

export const incomeSourceLabels = {
  JOB: "Job/Service",
  AGRICULTURE: "Agriculture",
  BUSINESS: "Business",
  INDUSTRY: "Industry",
  FOREIGN_EMPLOYMENT: "Foreign Employment",
  LABOUR: "Daily Labour",
  OTHER: "Other",
};

// Base schema for ward wise household income source
export const wardWiseHouseholdIncomeSourceBaseSchema = z.object({
  incomeSource: IncomeSourceEnum,
  households: z.number(),
});

// Schema for adding ward wise household income source
export const addWardWiseHouseholdIncomeSourceSchema = z.object({
  wardId: z.string(),
  wardNumber: z.number().optional(),
  data: z.array(wardWiseHouseholdIncomeSourceBaseSchema),
});

// Schema for getting ward wise household income source
export const getWardWiseHouseholdIncomeSourceSchema = z.object({
  wardId: z.string().optional(),
  wardNumber: z.number().optional(),
});

// Schema for batch adding ward wise household income source
export const batchAddWardWiseHouseholdIncomeSourceSchema = z.object({
  palika: z.string(),
  data: z.array(
    z.object({
      wardNumber: z.number(),
      incomeSource: IncomeSourceEnum,
      households: z.number(),
    })
  ),
});
