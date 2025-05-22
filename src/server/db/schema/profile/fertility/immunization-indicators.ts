import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum, real } from "drizzle-orm/pg-core";

// Define immunization indicator type enum
export const immunizationIndicatorTypeEnum = pgEnum(
  "immunization_indicator_type",
  [
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
  ],
);

export const immunizationIndicators = pgTable("immunization_indicators", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Type of immunization indicator
  indicator: immunizationIndicatorTypeEnum("indicator").notNull(),

  // Year of measurement
  year: integer("year").notNull(),

  // Value of the indicator (percentage or numerical value)
  value: real("value").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ImmunizationIndicator = typeof immunizationIndicators.$inferSelect;
export type NewImmunizationIndicator =
  typeof immunizationIndicators.$inferInsert;
