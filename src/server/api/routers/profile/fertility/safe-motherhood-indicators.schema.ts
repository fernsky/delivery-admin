import { z } from "zod";

// Define the safe motherhood indicator type enum to match the database enum
export const SafeMotherhoodIndicatorTypeEnum = z.enum([
  "POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS",         // 1.18 - % of postpartum mother receiving two PNC home visits
  "PREGNANT_WOMEN_AT_LEAST_ONE_ANC_CHECKUP",        // 1.1 - % of pregnant women who had at least one ANC checkup
  "PREGNANT_WOMEN_RECEIVED_ANTHELMINTHICS",         // 1.4 - Percentage of pregnant women who received anthelminthics
  "POSTPARTUM_WOMEN_REFERRED_OBSTETRIC_COMPLICATIONS", // 1.31 - % of postpartum women referred out due to obstetric complications
  "NORMAL_VAGINAL_DELIVERIES",                      // 1.11 - % of normal vaginal deliveries among reported deliveries
  "NEWBORNS_CHX_APPLIED_AFTER_BIRTH",               // 1.39 - % of newborns who had CHX applied immediately after birth
  "POSTPARTUM_MOTHERS_45DAYS_IRON_FOLIC_ACID",      // 1.19 - % of postpartum mother who received 45 days supply of iron folic acid suppliment
  "POSTPARTUM_MOTHERS_VITAMIN_A",                   // 1.20 - % of postpartum mother who received vitamin A suppliment
  "WOMEN_CONTRACEPTIVES_AFTER_ABORTION",            // 1.45 - % of women who received contraceptives after abortion
  "WOMEN_180DAYS_IRON_FOLIC_ACID_PREGNANCY",        // 1.3 - Percentage of women who received a 180 day supply of Iron Folic Acid during pregnancy
  "PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL",      // Percentage of pregnant women who had four ANC checkups as per protocol
  "WOMEN_FIRST_ANC_CHECKUP_PROTOCOL",               // 1.47 Percentage of women who had first ANC checkup as per protocol
  "WOMEN_180_CALCIUM_TABLETS_PREGNANCY",            // 1.5 - Percentage of women who received 180 calcium tablets during pregnancy
  "INSTITUTIONAL_DELIVERIES",                       // 1.6 - % of institutional deliveries
  "BIRTHS_ATTENDED_SBA_TRAINED_ANMS",               // 1.8 - % of births attended by a skilled birth attendant (SBA trained ANMs)
  "WOMEN_PNC_WITHIN_24HRS_DELIVERY",                // 1.16 - % of women who received a PNC within 24 hours of delivery
  "NEWBORNS_CHECKUP_24HRS_BIRTH",                   // 1.40 - % of newborns who received a check-up at 24 hours of birth
  "WOMEN_FOUR_POSTNATAL_CHECKUPS_PROTOCOL",         // 1.17 - % of women who had four postnatal check-ups as per protocol
  "NEONATES_FOUR_CHECKUPS_PNC_PROTOCOL",            // 1.41 - % of neonates who received four checkups as per PNC protocol
  "PREGNANT_WOMEN_EIGHT_ANC_VISITS_PROTOCOL",       // 1.2 - Percentage of pregnant women who had at least eight ANC visits as per protocol
  "PREGNANCIES_TERMINATED_INDUCED_PROCEDURE",       // 1.44 - % of pregnancies terminated by induced procedure at health facility
  "NEWBORNS_LOW_BIRTH_WEIGHT",                      // 1.35 - % of newborns with low birth weight (<2.5KG)
  "DELIVERIES_BELOW_20_YEARS_INSTITUTIONAL",        // 1.7 - % of deliveries below 20 years of age among total institutional deliveries
  "NEONATES_BIRTH_ASPHYXIA",                        // 1.37 - % of neonates with birth asphyxia
  "PRETERM_BIRTH",                                  // 1.36 - % of preterm birth
  "STILL_BIRTHS",                                   // 1.42 - % of still births
  "BIRTHS_ATTENDED_NON_SBA_SHP",                    // 1.10 - % of births attended by a health worker other than SBA and SHP
  "NEONATES_CONGENITAL_ANOMALIES",                  // 1.38 - % of neonates with conginital anomalies
  "NEONATAL_MORTALITY_HEALTH_FACILITY",             // 1.43 - % of neonatal mortality (health facility)
  "ASSISTED_VACUUM_FORCEPS_DELIVERIES",             // 1.12 - % of assisted (vaccum or forceps) deliveries
  "DELIVERIES_CAESAREAN_SECTION_REPORTED",          // 1.13 - % of deliveries by caesarean section among reported deliveries
  "DELIVERY_BY_CAESAREAN_SECTION",                  // 1.14 - % of delivery by caesarean section
  "PREGNANT_WOMEN_HOME_BIRTH_MISOPROSTAL",          // 1.15 - % of pregnant women who gave birth at home and used misoprostal
  "WOMEN_TREATED_HAEMORRHAGE",                      // 1.22 - Number of women treated for haemorrhage
  "WOMEN_TREATED_ANTEPARTUM_HAEMORRHAGE",           // 1.22.1 Number of women treated for Antepartum Haemorrhage (APH)
  "WOMEN_TREATED_POSTPARTUM_HAEMORRHAGE",           // 1.22.2 Number of women treated for Postpartum Haemorrhage (PPH)
  "WOMEN_TREATED_ECTOPIC_PREGNANCY",                // 1.23 - Number of women treated for Ectopic pregnancy
  "WOMEN_TREATED_RUPTURED_UTERUS",                  // 1.25 - Number of women treated for ruptured uterus
  "WOMEN_TREATED_PREECLAMPSIA",                     // 1.26 - Number of women treated for Pre-eclampsia
  "WOMEN_TREATED_ECLAMPSIA",                        // 1.27 - Number of women treated for Eclampsia
  "WOMEN_TREATED_RETAINED_PLACENTA",                // 1.28 - Number of women treated for retained Placenta
  "WOMEN_TREATED_PUERPERAL_SEPSIS",                 // 1.29 - Number of women treated for Puerperal Sepsis
  "WOMEN_TREATED_ABORTION_COMPLICATIONS",           // 1.30 - Number of women treated for abortion complications
  "WOMEN_OBSTETRIC_COMPLICATIONS_BLOOD_TRANSFUSION", // 1.32 - % of women with obstetric complication who received a blood transfusion for haemorrage
  "REPORTED_MATERNAL_DEATHS_HEALTH_FACILITY",       // 1.34 - Number of reported maternal deaths at health facility
  "WOMEN_COMPLICATIONS_INDUCED_ABORTION",           // 1.46 - % of women with complications from induced abortion
  "BIRTHS_ATTENDED_SKILLED_HEALTH_PERSONNEL",       // 1.9 - % of births attended by a skilled health personnel (SHP)
  "PREGNANT_WOMEN_FIRST_ANC_CHECKUP_PROTOCOL",      // Percentage of pregnant women who had First ANC checkup as protocal
  "MET_NEED_EMERGENCY_OBSTETRIC_CARE",              // 1.21 - Met need for emergency obstetric care
  "WOMEN_TREATED_PROLONGED_OBSTRUCTED_LABOR",       // 1.24 - Number of women treated for prolonged/ obstructed labor
  "POSTPARTUM_MOTHERS_CS_WOUND_INFECTION"           // 1.33 - % of postpartum mothers with C/S wound infection
]);

export type SafeMotherhoodIndicatorType = z.infer<
  typeof SafeMotherhoodIndicatorTypeEnum
>;

// Schema for safe motherhood indicator data
export const safeMotherhoodIndicatorSchema = z.object({
  id: z.string().optional(),
  indicator: SafeMotherhoodIndicatorTypeEnum,
  year: z.number().int().min(2000).max(2100), // Reasonable year range
  value: z.number().nonnegative(),
});

// Schema for filtering safe motherhood indicators data
export const safeMotherhoodIndicatorFilterSchema = z.object({
  indicator: SafeMotherhoodIndicatorTypeEnum.optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
});

export const updateSafeMotherhoodIndicatorSchema =
  safeMotherhoodIndicatorSchema;

export type SafeMotherhoodIndicatorData = z.infer<
  typeof safeMotherhoodIndicatorSchema
>;
export type UpdateSafeMotherhoodIndicatorData = SafeMotherhoodIndicatorData;
export type SafeMotherhoodIndicatorFilter = z.infer<
  typeof safeMotherhoodIndicatorFilterSchema
>;

// Group indicators by category for easier UI display
export const indicatorCategories = [
  {
    category: "Antenatal Care",
    indicators: [
      { value: "PREGNANT_WOMEN_AT_LEAST_ONE_ANC_CHECKUP", label: "% of pregnant women who had at least one ANC checkup" },
      { value: "PREGNANT_WOMEN_FIRST_ANC_CHECKUP_PROTOCOL", label: "% of women who had first ANC checkup as per protocol" },
      { value: "PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL", label: "% of pregnant women who had four ANC checkups as per protocol" },
      { value: "PREGNANT_WOMEN_EIGHT_ANC_VISITS_PROTOCOL", label: "% of pregnant women who had at least eight ANC visits as per protocol" },
      { value: "PREGNANT_WOMEN_RECEIVED_ANTHELMINTHICS", label: "% of pregnant women who received anthelminthics" },
      { value: "WOMEN_180DAYS_IRON_FOLIC_ACID_PREGNANCY", label: "% of women who received a 180 day supply of Iron Folic Acid during pregnancy" },
      { value: "WOMEN_180_CALCIUM_TABLETS_PREGNANCY", label: "% of women who received 180 calcium tablets during pregnancy" },
      { value: "WOMEN_FIRST_ANC_CHECKUP_PROTOCOL", label: "% of women who had first ANC checkup as per protocol" }
    ]
  },
  {
    category: "Delivery Care",
    indicators: [
      { value: "INSTITUTIONAL_DELIVERIES", label: "% of institutional deliveries" },
      { value: "NORMAL_VAGINAL_DELIVERIES", label: "% of normal vaginal deliveries among reported deliveries" },
      { value: "BIRTHS_ATTENDED_SBA_TRAINED_ANMS", label: "% of births attended by a skilled birth attendant (SBA trained ANMs)" },
      { value: "BIRTHS_ATTENDED_SKILLED_HEALTH_PERSONNEL", label: "% of births attended by a skilled health personnel (SHP)" },
      { value: "BIRTHS_ATTENDED_NON_SBA_SHP", label: "% of births attended by a health worker other than SBA and SHP" },
      { value: "ASSISTED_VACUUM_FORCEPS_DELIVERIES", label: "% of assisted (vacuum or forceps) deliveries" },
      { value: "DELIVERIES_CAESAREAN_SECTION_REPORTED", label: "% of deliveries by caesarean section among reported deliveries" },
      { value: "DELIVERY_BY_CAESAREAN_SECTION", label: "% of delivery by caesarean section" },
      { value: "PREGNANT_WOMEN_HOME_BIRTH_MISOPROSTAL", label: "% of pregnant women who gave birth at home and used misoprostal" },
      { value: "DELIVERIES_BELOW_20_YEARS_INSTITUTIONAL", label: "% of deliveries below 20 years of age among total institutional deliveries" }
    ]
  },
  {
    category: "Postnatal Care",
    indicators: [
      { value: "WOMEN_PNC_WITHIN_24HRS_DELIVERY", label: "% of women who received a PNC within 24 hours of delivery" },
      { value: "WOMEN_FOUR_POSTNATAL_CHECKUPS_PROTOCOL", label: "% of women who had four postnatal check-ups as per protocol" },
      { value: "POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS", label: "% of postpartum mother receiving two PNC home visits" },
      { value: "POSTPARTUM_MOTHERS_45DAYS_IRON_FOLIC_ACID", label: "% of postpartum mother who received 45 days supply of iron folic acid supplement" },
      { value: "POSTPARTUM_MOTHERS_VITAMIN_A", label: "% of postpartum mother who received vitamin A supplement" },
      { value: "POSTPARTUM_WOMEN_REFERRED_OBSTETRIC_COMPLICATIONS", label: "% of postpartum women referred out due to obstetric complications" },
      { value: "POSTPARTUM_MOTHERS_CS_WOUND_INFECTION", label: "% of postpartum mothers with C/S wound infection" }
    ]
  },
  {
    category: "Newborn Care",
    indicators: [
      { value: "NEWBORNS_CHX_APPLIED_AFTER_BIRTH", label: "% of newborns who had CHX applied immediately after birth" },
      { value: "NEWBORNS_CHECKUP_24HRS_BIRTH", label: "% of newborns who received a check-up at 24 hours of birth" },
      { value: "NEONATES_FOUR_CHECKUPS_PNC_PROTOCOL", label: "% of neonates who received four checkups as per PNC protocol" },
      { value: "NEWBORNS_LOW_BIRTH_WEIGHT", label: "% of newborns with low birth weight (<2.5KG)" },
      { value: "NEONATES_BIRTH_ASPHYXIA", label: "% of neonates with birth asphyxia" },
      { value: "PRETERM_BIRTH", label: "% of preterm birth" },
      { value: "NEONATES_CONGENITAL_ANOMALIES", label: "% of neonates with congenital anomalies" },
      { value: "NEONATAL_MORTALITY_HEALTH_FACILITY", label: "% of neonatal mortality (health facility)" },
      { value: "STILL_BIRTHS", label: "% of still births" }
    ]
  },
  {
    category: "Abortion",
    indicators: [
      { value: "PREGNANCIES_TERMINATED_INDUCED_PROCEDURE", label: "% of pregnancies terminated by induced procedure at health facility" },
      { value: "WOMEN_CONTRACEPTIVES_AFTER_ABORTION", label: "% of women who received contraceptives after abortion" },
      { value: "WOMEN_COMPLICATIONS_INDUCED_ABORTION", label: "% of women with complications from induced abortion" },
      { value: "WOMEN_TREATED_ABORTION_COMPLICATIONS", label: "Number of women treated for abortion complications" }
    ]
  },
  {
    category: "Obstetric Complications",
    indicators: [
      { value: "WOMEN_TREATED_HAEMORRHAGE", label: "Number of women treated for haemorrhage" },
      { value: "WOMEN_TREATED_ANTEPARTUM_HAEMORRHAGE", label: "Number of women treated for Antepartum Haemorrhage (APH)" },
      { value: "WOMEN_TREATED_POSTPARTUM_HAEMORRHAGE", label: "Number of women treated for Postpartum Haemorrhage (PPH)" },
      { value: "WOMEN_TREATED_ECTOPIC_PREGNANCY", label: "Number of women treated for Ectopic pregnancy" },
      { value: "WOMEN_TREATED_RUPTURED_UTERUS", label: "Number of women treated for ruptured uterus" },
      { value: "WOMEN_TREATED_PREECLAMPSIA", label: "Number of women treated for Pre-eclampsia" },
      { value: "WOMEN_TREATED_ECLAMPSIA", label: "Number of women treated for Eclampsia" },
      { value: "WOMEN_TREATED_RETAINED_PLACENTA", label: "Number of women treated for retained Placenta" },
      { value: "WOMEN_TREATED_PUERPERAL_SEPSIS", label: "Number of women treated for Puerperal Sepsis" },
      { value: "WOMEN_TREATED_PROLONGED_OBSTRUCTED_LABOR", label: "Number of women treated for prolonged/obstructed labor" },
      { value: "WOMEN_OBSTETRIC_COMPLICATIONS_BLOOD_TRANSFUSION", label: "% of women with obstetric complication who received a blood transfusion for haemorrhage" },
      { value: "MET_NEED_EMERGENCY_OBSTETRIC_CARE", label: "Met need for emergency obstetric care" },
      { value: "REPORTED_MATERNAL_DEATHS_HEALTH_FACILITY", label: "Number of reported maternal deaths at health facility" }
    ]
  }
];

// Flatten categories into a single options array for simple dropdowns
export const indicatorOptions = indicatorCategories.flatMap(
  (category) => category.indicators,
);
