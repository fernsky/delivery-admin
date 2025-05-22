import { z } from "zod";

// Define the immunization indicator type enum to match the database enum
export const ImmunizationIndicatorTypeEnum = z.enum([
  "ROTA2_ONE_YEAR",
  "DPT_HEP_B_HIB3_UNDER_ONE",
  "DPT_HEP_B_HIB1_UNDER_ONE",
  "JE_12_23_MONTHS",
  "MR2_12_23_MONTHS",
  "FULLY_IMMUNIZED_NIP",
  "TCV",
  "MR1",
  "FIPV1_UNDER_ONE",
  "BCG_UNDER_ONE",
  "FIPV2_UNDER_ONE",
  "OPV1_UNDER_ONE",
  "OPV3_UNDER_ONE",
  "PCV1_UNDER_ONE",
  "PCV3_UNDER_ONE",
  "HYGIENE_PROMOTION",
  "PLANNED_IMMUNIZATION_SESSIONS",
  "TD_COMPLETE_PREGNANT",
  "TD2_PREGNANT",
  "TD2_PLUS_PREGNANT",
  "SERIOUS_AEFI",
  "ROTA1_UNDER_ONE",
  "PLANNED_CLINICS",
  "BCG_WASTAGE",
  "DPT_HEP_B_HIB_WASTAGE",
  "FIPV_WASTAGE",
  "JE_WASTAGE",
  "MR_WASTAGE",
  "OPV_WASTAGE",
  "ROTA_WASTAGE",
  "TCV_WASTAGE",
  "TD_WASTAGE",
  "AES_RATE",
  "DPT_HEP_B_HIB_DROPOUT_1_3",
  "DPT_HEP_B_HIB1_MR2_DROPOUT",
  "MEASLES_RATE",
  "MEASLES_RUBELLA_DROPOUT",
  "MOTHERS_HYGIENE_PARTICIPANTS",
  "PCV_DROPOUT_1_3",
  "ASSISTED_DELIVERIES",
  "BIRTHS_BY_SBA",
  "BIRTHS_BY_SKILLED_PERSONNEL",
  "BIRTHS_OTHER",
  "HOME_MISOPROSTAL_DELIVERIES",
  "DELIVERIES_UNDER_20",
  "CAESAREAN_DELIVERIES",
  "INSTITUTIONAL_DELIVERIES",
  "MOTHERS_TWO_PNC_VISITS",
  "NEONATAL_MORTALITY_FACILITY",
  "NEONATES_FOUR_CHECKUPS",
  "NEONATES_BIRTH_ASPHYXIA",
  "NEONATES_CONGENITAL_ANOMALIES",
  "NEWBORNS_CHX_APPLIED",
  "NEWBORNS_24HR_CHECKUP",
  "NEWBORNS_LOW_BIRTH_WEIGHT",
  "NORMAL_VAGINAL_DELIVERIES",
  "POSTPARTUM_45DAYS_IFA",
  "POSTPARTUM_VITAMIN_A",
  "POSTPARTUM_CS_INFECTION",
  "INDUCED_PREGNANCIES",
  "PREGNANT_EIGHT_ANC_VISITS",
  "FOUR_ANC_VISITS",
  "PREGNANT_ANTHELMINTHICS",
  "FIRST_ANC_CHECKUP",
  "AT_LEAST_ONE_ANC",
  "PRETERM_BIRTHS",
  "STILL_BIRTHS",
  "OBSTETRIC_COMPLICATION_REFERRALS",
  "FIRST_ANC",
  "FOUR_PNC_PROTOCOL",
  "PNC_24_HOURS",
  "CALCIUM_180_TABLETS",
  "CONTRACEPTION_AFTER_ABORTION",
  "BLOOD_COMPLICATIONS",
  "ABORTION_COMPLICATIONS",
  "EMERGENCY_OBSTETRIC_NEED",
  "MATERNAL_DEATHS",
  "ABORTION_COMPLICATIONS_TREATED",
  "PPH_TREATED",
  "HEMORRHAGE_TREATED",
  "APH_TREATED",
  "ECLAMPSIA_TREATED",
  "ECTOPIC_PREGNANCY_TREATED",
  "PREECLAMPSIA_TREATED",
  "PUERPERAL_SEPSIS_TREATED",
  "OBSTRUCTED_LABOR_TREATED",
  "RETAINED_PLACENTA_TREATED",
  "RUPTURED_UTERUS_TREATED",
]);
export type ImmunizationIndicatorType = z.infer<
  typeof ImmunizationIndicatorTypeEnum
>;

// Schema for immunization indicator data
export const immunizationIndicatorSchema = z.object({
  id: z.string().optional(),
  indicator: ImmunizationIndicatorTypeEnum,
  year: z.number().int().min(2000).max(2100), // Reasonable year range
  value: z.number().nonnegative(),
});

// Schema for filtering immunization indicators data
export const immunizationIndicatorFilterSchema = z.object({
  indicator: ImmunizationIndicatorTypeEnum.optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
});

export const updateImmunizationIndicatorSchema = immunizationIndicatorSchema;

export type ImmunizationIndicatorData = z.infer<
  typeof immunizationIndicatorSchema
>;
export type UpdateImmunizationIndicatorData = ImmunizationIndicatorData;
export type ImmunizationIndicatorFilter = z.infer<
  typeof immunizationIndicatorFilterSchema
>;

// Group indicators by category for easier UI display
export const indicatorCategories = [
  {
    category: "Child Immunization",
    indicators: [
      { value: "BCG_UNDER_ONE", label: "BCG (children under one year)" },
      {
        value: "DPT_HEP_B_HIB1_UNDER_ONE",
        label: "DPT-HepB-Hib1 (children under one year)",
      },
      {
        value: "DPT_HEP_B_HIB3_UNDER_ONE",
        label: "DPT-HepB-Hib3 (children under one year)",
      },
      { value: "FIPV1_UNDER_ONE", label: "FIPV 1 (children under one year)" },
      { value: "FIPV2_UNDER_ONE", label: "FIPV 2 (children under one year)" },
      { value: "FULLY_IMMUNIZED_NIP", label: "Fully immunized (NIP schedule)" },
      { value: "JE_12_23_MONTHS", label: "JE (children 12-23 months)" },
      { value: "MR1", label: "MR1 immunization" },
      { value: "MR2_12_23_MONTHS", label: "MR2 (children 12-23 months)" },
      { value: "OPV1_UNDER_ONE", label: "OPV 1 (children under one year)" },
      { value: "OPV3_UNDER_ONE", label: "OPV 3 (children under one year)" },
      { value: "PCV1_UNDER_ONE", label: "PCV 1 (children under one year)" },
      { value: "PCV3_UNDER_ONE", label: "PCV 3 (children under one year)" },
      { value: "ROTA1_UNDER_ONE", label: "Rota 1 (children under one year)" },
      { value: "ROTA2_ONE_YEAR", label: "Rota 2 (children one year)" },
      { value: "TCV", label: "TCV immunization" },
    ],
  },
  {
    category: "Vaccine Management",
    indicators: [
      {
        value: "HYGIENE_PROMOTION",
        label: "Hygiene promotion sessions conducted",
      },
      {
        value: "PLANNED_CLINICS",
        label: "Planned immunization clinics conducted",
      },
      {
        value: "PLANNED_IMMUNIZATION_SESSIONS",
        label: "Planned immunization sessions conducted",
      },
      {
        value: "SERIOUS_AEFI",
        label: "Serious AEFI among reported AEFI cases",
      },
      { value: "BCG_WASTAGE", label: "BCG vaccine wastage rate" },
      {
        value: "DPT_HEP_B_HIB_WASTAGE",
        label: "DPT/HepB/Hib vaccine wastage rate",
      },
      { value: "FIPV_WASTAGE", label: "FIPV vaccine wastage rate" },
      { value: "JE_WASTAGE", label: "JE vaccine wastage rate" },
      { value: "MR_WASTAGE", label: "MR vaccine wastage rate" },
      { value: "OPV_WASTAGE", label: "OPV vaccine wastage rate" },
      { value: "ROTA_WASTAGE", label: "Rota vaccine wastage rate" },
      { value: "TCV_WASTAGE", label: "TCV vaccine wastage rate" },
      { value: "TD_WASTAGE", label: "TD vaccine wastage rate" },
    ],
  },
  {
    category: "Health Metrics",
    indicators: [
      { value: "AES_RATE", label: "AES rate per 100,000" },
      {
        value: "DPT_HEP_B_HIB_DROPOUT_1_3",
        label: "DPT-HepB-Hib dropout rate (1 vs 3)",
      },
      {
        value: "DPT_HEP_B_HIB1_MR2_DROPOUT",
        label: "DPT-HepB-Hib1 vs MR2 dropout rate",
      },
      { value: "MEASLES_RATE", label: "Measles incidence rate per 100,000" },
      {
        value: "MEASLES_RUBELLA_DROPOUT",
        label: "Measles/Rubella dropout rate",
      },
      {
        value: "MOTHERS_HYGIENE_PARTICIPANTS",
        label: "Mothers/guardians in hygiene programs",
      },
      { value: "PCV_DROPOUT_1_3", label: "PCV dropout rate (PCV1 vs PCV3)" },
    ],
  },
  {
    category: "Maternal Health",
    indicators: [
      {
        value: "ASSISTED_DELIVERIES",
        label: "Assisted (vacuum/forceps) deliveries",
      },
      { value: "BIRTHS_BY_SBA", label: "Births attended by SBA" },
      {
        value: "BIRTHS_BY_SKILLED_PERSONNEL",
        label: "Births by skilled health personnel",
      },
      { value: "BIRTHS_OTHER", label: "Births by other than SBA and SHP" },
      { value: "CAESAREAN_DELIVERIES", label: "Caesarean section deliveries" },
      {
        value: "DELIVERIES_UNDER_20",
        label: "Deliveries below 20 years of age",
      },
      {
        value: "HOME_MISOPROSTAL_DELIVERIES",
        label: "Home deliveries with misoprostal",
      },
      { value: "INSTITUTIONAL_DELIVERIES", label: "Institutional deliveries" },
      {
        value: "NORMAL_VAGINAL_DELIVERIES",
        label: "Normal vaginal deliveries",
      },
      { value: "PRETERM_BIRTHS", label: "Preterm births" },
      { value: "STILL_BIRTHS", label: "Still births" },
      { value: "TD2_PREGNANT", label: "Pregnant women who received TD2" },
      { value: "TD2_PLUS_PREGNANT", label: "Pregnant women who received TD2+" },
      {
        value: "TD_COMPLETE_PREGNANT",
        label: "Pregnant women with complete TD dose",
      },
    ],
  },
  {
    category: "Neonatal Care",
    indicators: [
      {
        value: "NEONATAL_MORTALITY_FACILITY",
        label: "Neonatal mortality (health facility)",
      },
      {
        value: "NEONATES_BIRTH_ASPHYXIA",
        label: "Neonates with birth asphyxia",
      },
      {
        value: "NEONATES_CONGENITAL_ANOMALIES",
        label: "Neonates with congenital anomalies",
      },
      {
        value: "NEONATES_FOUR_CHECKUPS",
        label: "Neonates who received four checkups",
      },
      {
        value: "NEWBORNS_24HR_CHECKUP",
        label: "Newborns with check-up at 24 hours",
      },
      {
        value: "NEWBORNS_CHX_APPLIED",
        label: "Newborns with CHX applied after birth",
      },
      {
        value: "NEWBORNS_LOW_BIRTH_WEIGHT",
        label: "Newborns with low birth weight (<2.5KG)",
      },
    ],
  },
  {
    category: "Postpartum Care",
    indicators: [
      {
        value: "MOTHERS_TWO_PNC_VISITS",
        label: "Mothers receiving two PNC home visits",
      },
      {
        value: "POSTPARTUM_45DAYS_IFA",
        label: "Postpartum mother who received 45 days IFA",
      },
      {
        value: "POSTPARTUM_CS_INFECTION",
        label: "Postpartum mothers with C/S wound infection",
      },
      {
        value: "POSTPARTUM_VITAMIN_A",
        label: "Postpartum mother who received vitamin A",
      },
      {
        value: "FOUR_PNC_PROTOCOL",
        label: "Women who had 4 PNC as per protocol",
      },
      { value: "PNC_24_HOURS", label: "Women who had PNC within 24 hours" },
    ],
  },
  {
    category: "Antenatal Care",
    indicators: [
      {
        value: "AT_LEAST_ONE_ANC",
        label: "Pregnant women with at least one ANC",
      },
      {
        value: "CALCIUM_180_TABLETS",
        label: "Women who received 180 calcium tablets",
      },
      { value: "FIRST_ANC", label: "Women who had 1st ANC" },
      {
        value: "FIRST_ANC_CHECKUP",
        label: "Pregnant women with First ANC check up",
      },
      {
        value: "FOUR_ANC_VISITS",
        label: "Pregnant women with four ANC checkups",
      },
      {
        value: "PREGNANT_ANTHELMINTHICS",
        label: "Pregnant women who received anthelminthics",
      },
      {
        value: "PREGNANT_EIGHT_ANC_VISITS",
        label: "Pregnant women with eight ANC visits",
      },
    ],
  },
  {
    category: "Complications & Treatments",
    indicators: [
      {
        value: "ABORTION_COMPLICATIONS",
        label: "Women with complications from abortion",
      },
      {
        value: "ABORTION_COMPLICATIONS_TREATED",
        label: "Women treated for abortion complications",
      },
      { value: "APH_TREATED", label: "Women treated for hemorrhage (APH)" },
      {
        value: "BLOOD_COMPLICATIONS",
        label: "Women with complication who received blood",
      },
      {
        value: "CONTRACEPTION_AFTER_ABORTION",
        label: "Women with contraception after abortion",
      },
      { value: "ECLAMPSIA_TREATED", label: "Women treated for Eclampsia" },
      {
        value: "ECTOPIC_PREGNANCY_TREATED",
        label: "Women treated for Ectopic Pregnancy",
      },
      {
        value: "EMERGENCY_OBSTETRIC_NEED",
        label: "Met need for emergency obstetric care",
      },
      { value: "HEMORRHAGE_TREATED", label: "Women treated for hemorrhage" },
      {
        value: "INDUCED_PREGNANCIES",
        label: "Pregnancies terminated by induced procedure",
      },
      { value: "MATERNAL_DEATHS", label: "Number of reported maternal deaths" },
      {
        value: "OBSTRUCTED_LABOR_TREATED",
        label: "Women treated for prolonged/obstructed labor",
      },
      {
        value: "OBSTETRIC_COMPLICATION_REFERRALS",
        label: "Women referred for obstetric complications",
      },
      { value: "PPH_TREATED", label: "Women treated for PPH" },
      {
        value: "PREECLAMPSIA_TREATED",
        label: "Women treated for Pre-eclampsia",
      },
      {
        value: "PUERPERAL_SEPSIS_TREATED",
        label: "Women treated for Puerperal Sepsis",
      },
      {
        value: "RETAINED_PLACENTA_TREATED",
        label: "Women treated for retained Placenta",
      },
      {
        value: "RUPTURED_UTERUS_TREATED",
        label: "Women treated for ruptured uterus",
      },
    ],
  },
];

// Flatten categories into a single options array for simple dropdowns
export const indicatorOptions = indicatorCategories.flatMap(
  (category) => category.indicators,
);
