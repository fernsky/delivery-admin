import { z } from "zod";

// Define the remittance expense type enum for validation
export const RemittanceExpenseTypeEnum = z.enum([
  "EDUCATION",
  "HEALTH",
  "HOUSEHOLD_USE",
  "FESTIVALS",
  "LOAN_PAYMENT",
  "LOANED_OTHERS",
  "SAVING",
  "HOUSE_CONSTRUCTION",
  "LAND_OWNERSHIP",
  "JEWELRY_PURCHASE",
  "GOODS_PURCHASE",
  "BUSINESS_INVESTMENT",
  "OTHER",
  "UNKNOWN"
]);
export type RemittanceExpenseType = z.infer<typeof RemittanceExpenseTypeEnum>;

// Schema for ward-wise remittance expense data
export const wardWiseRemittanceExpensesSchema = z.object({
  id: z.string().optional(),
  wardId: z.string(),
  remittanceExpense: RemittanceExpenseTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise remittance expense data
export const wardWiseRemittanceExpensesFilterSchema = z.object({
  wardId: z.string().optional(),
  remittanceExpense: RemittanceExpenseTypeEnum.optional(),
});

export const updateWardWiseRemittanceExpensesSchema = wardWiseRemittanceExpensesSchema;

export type WardWiseRemittanceExpensesData = z.infer<typeof wardWiseRemittanceExpensesSchema>;
export type UpdateWardWiseRemittanceExpensesData = WardWiseRemittanceExpensesData;
export type WardWiseRemittanceExpensesFilter = z.infer<typeof wardWiseRemittanceExpensesFilterSchema>;
