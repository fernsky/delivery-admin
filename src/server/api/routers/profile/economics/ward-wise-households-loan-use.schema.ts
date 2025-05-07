import { z } from "zod";

// Define loan use categories
export const LoanUseEnum = z.enum([
  "agriculture",
  "business",
  "householdExpenses",
  "foreignEmployment",
  "education",
  "healthTreatment",
  "housingConstruction",
  "vehiclePurchase",
  "landPurchase",
  "interestPayment",
  "marriageCeremony",
  "other"
]);

// Labels for loan use categories
export const loanUseLabels: Record<string, string> = {
  agriculture: "कृषि",
  business: "व्यापार / व्यवसाय",
  householdExpenses: "घरायसी खर्च",
  foreignEmployment: "वैदेशिक रोजगारी",
  education: "शिक्षा",
  healthTreatment: "स्वास्थ्य उपचार",
  housingConstruction: "घर निर्माण",
  vehiclePurchase: "सवारी साधन खरिद",
  landPurchase: "जग्गा खरिद",
  interestPayment: "ब्याज भुक्तानी",
  marriageCeremony: "बिहे / विवाह",
  other: "अन्य"
};

// Base schema for ward wise households loan use
export const wardWiseHouseholdsLoanUseBaseSchema = z.object({
  loanUse: LoanUseEnum,
  households: z.number(),
});

// Schema for adding ward wise households loan use
export const addWardWiseHouseholdsLoanUseSchema = z.object({
  wardId: z.string(),
  wardNumber: z.number().optional(),
  data: z.array(
    z.object({
      loanUse: LoanUseEnum,
      households: z.number(),
    })
  ),
});

// Schema for getting ward wise households loan use
export const getWardWiseHouseholdsLoanUseSchema = z.object({
  wardId: z.string().optional(),
  wardNumber: z.number().optional(),
});

// Schema for batch adding ward wise households loan use
export const batchAddWardWiseHouseholdsLoanUseSchema = z.object({
  palika: z.string(),
  data: z.array(
    z.object({
      wardNumber: z.number(),
      loanUses: z.array(
        z.object({
          loanUse: LoanUseEnum,
          households: z.number()
        })
      ),
    })
  ),
});
