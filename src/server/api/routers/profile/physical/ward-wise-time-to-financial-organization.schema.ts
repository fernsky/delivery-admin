import { z } from "zod";

// Define the time to financial organization type enum to match the database enum
export const TimeToFinancialOrganizationTypeEnum = z.enum([
  "UNDER_15_MIN",
  "UNDER_30_MIN",
  "UNDER_1_HOUR",
  "1_HOUR_OR_MORE",
]);
export type TimeToFinancialOrganizationType = z.infer<
  typeof TimeToFinancialOrganizationTypeEnum
>;

// Schema for ward-wise time to financial organization data
export const wardWiseTimeToFinancialOrganizationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  timeToFinancialOrganization: TimeToFinancialOrganizationTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise time to financial organization data
export const wardWiseTimeToFinancialOrganizationFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  timeToFinancialOrganization: TimeToFinancialOrganizationTypeEnum.optional(),
});

export const updateWardWiseTimeToFinancialOrganizationSchema =
  wardWiseTimeToFinancialOrganizationSchema;

export type WardWiseTimeToFinancialOrganizationData = z.infer<
  typeof wardWiseTimeToFinancialOrganizationSchema
>;
export type UpdateWardWiseTimeToFinancialOrganizationData =
  WardWiseTimeToFinancialOrganizationData;
export type WardWiseTimeToFinancialOrganizationFilter = z.infer<
  typeof wardWiseTimeToFinancialOrganizationFilterSchema
>;

// Export the time category options for use in UI components
export const timeToFinancialOrganizationOptions = [
  { value: "UNDER_15_MIN", label: "Under 15 minutes (१५ मिनेटभित्र)" },
  { value: "UNDER_30_MIN", label: "Under 30 minutes (३० मिनेटभित्र)" },
  { value: "UNDER_1_HOUR", label: "Under 1 hour (१ घण्टाभित्र)" },
  { value: "1_HOUR_OR_MORE", label: "1 hour or more (१ घण्टाभन्दा बढी)" },
];
