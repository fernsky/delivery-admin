import { z } from "zod";

// Define the safe motherhood indicator type enum to match the database enum
export const SafeMotherhoodIndicatorTypeEnum = z.enum([
  "KMC_HYPOTHERMIA",
  "KMC_PRETERM",
  "PACKAGE_ABC",
  "LAMA_ABSCONDED",
  "CONGENITAL_ANOMALIES",
  "ASPHYXIA",
  "HYPERBILIRUBINEMIA",
  "HYPOTHERMIA",
  "LOW_BIRTH_WEIGHT",
  "OTHER_CONDITIONS",
  "PRETERM",
  "SEIZURE",
  "SEPSIS",
  "TOTAL_SICK_ADMITTED",
  "ADMITTED_PLH",
  "KMC_PLH",
  "OUTREACH_KMC_LBW",
  "OUTREACH_PACKAGE_A",
  "OUTREACH_PACKAGE_AB",
  "OUTREACH_PACKAGE_B",
  "OUTREACH_DEATH",
  "OUTREACH_IMPROVED",
  "OUTREACH_REFERRED",
  "OUTREACH_DAYS_STAY",
  "NUTRITION_OEDEMA_1PLUS",
  "NUTRITION_OEDEMA_3PLUS",
  "NUTRITION_NO_OEDEMA",
  "NUTRITION_WEIGHT_HEIGHT_2SD",
  "NUTRITION_WEIGHT_HEIGHT_3SD",
  "NUTRITION_WEIGHT_HEIGHT_4SD",
  "NUTRITION_NEW_24_59_MONTHS",
  "NUTRITION_NEW_6_23_MONTHS",
  "NUTRITION_NEW_UNDER_6_MONTHS",
  "NUTRITION_NEW_OVER_59_MONTHS",
  "NUTRITION_ADMIT_OEDEMA_1PLUS",
  "NUTRITION_ADMIT_OEDEMA_3PLUS",
  "NUTRITION_ADMIT_NO_OEDEMA",
  "NUTRITION_REFERRED_24_59_MONTHS",
  "NUTRITION_REFERRED_6_23_MONTHS",
  "NUTRITION_REFERRED_UNDER_6_MONTHS",
  "NUTRITION_REFERRED_OVER_59_MONTHS",
  "NUTRITION_ADMIT_WEIGHT_2SD",
  "NUTRITION_ADMIT_WEIGHT_3SD",
  "NUTRITION_ADMIT_WEIGHT_4SD",
  "NUTRITION_AVG_IPD_DAYS",
  "NUTRITION_AVG_TOTAL_ADMISSIONS",
  "NUTRITION_BED_DAYS_AVAILABLE",
  "NUTRITION_BED_DAYS_CARE",
  "NUTRITION_DISCHARGE_NO_OEDEMA",
  "NUTRITION_DISCHARGE_WEIGHT_2SD",
  "NUTRITION_DISCHARGE_WEIGHT_3SD",
  "NUTRITION_DISCHARGE_WEIGHT_4SD",
  "NUTRITION_DEATH_UNDER_6_MONTHS",
  "NUTRITION_DISCHARGED_24_59_MONTHS",
  "NUTRITION_DISCHARGED_6_23_MONTHS",
  "NUTRITION_DISCHARGED_UNDER_6_MONTHS",
  "NUTRITION_DISCHARGED_OVER_59_MONTHS",
  "NUTRITION_LAMA_24_59_MONTHS",
  "NUTRITION_LAMA_6_23_MONTHS",
  "NUTRITION_DISCHARGE_OEDEMA",
  "NUTRITION_DISCHARGE_LAMA_WEIGHT_2SD",
  "NUTRITION_DISCHARGE_LAMA_WEIGHT_3SD",
  "NUTRITION_DISCHARGE_OEDEMA_2PLUS",
  "NUTRITION_DISCHARGE_REFERRAL_24_59",
  "NUTRITION_DISCHARGE_REFERRAL_6_23",
  "NUTRITION_DISCHARGE_REFERRAL_UNDER_6",
  "NUTRITION_DISCHARGE_REFERRAL_OVER_59",
  "NUTRITION_DISCHARGE_WEIGHT_HEIGHT_2SD",
  "NUTRITION_DISCHARGE_WEIGHT_HEIGHT_3SD",
  "NUTRITION_DISCHARGE_WEIGHT_HEIGHT_4SD",
  "OCMC_VIOLENCE_CHHAUPADI",
  "OCMC_VIOLENCE_CHILD_LABOR",
  "OCMC_VIOLENCE_CHILD_MARRIAGE",
  "OCMC_VIOLENCE_DOWRY",
  "OCMC_VIOLENCE_TRAFFICKING",
  "OCMC_VIOLENCE_OTHER",
  "OCMC_VIOLENCE_POLYGAMY",
  "OCMC_VIOLENCE_DISCRIMINATION",
  "OCMC_DISABILITY_AUTISM",
  "OCMC_DISABILITY_INTELLECTUAL",
  "OCMC_DISABILITY_MENTAL",
  "OCMC_DISABILITY_MULTIPLE",
  "OCMC_DISABILITY_PHYSICAL",
  "OCMC_DISABILITY_SPEECH",
  "OCMC_NEW_CASES_ETHNICITY",
  "OCMC_PERPETRATOR",
  "OCMC_PERPETRATOR_NON_RELATIVE",
  "OCMC_PERPETRATOR_RELATIVE",
  "OCMC_SERVICE_CONTRACEPTIVE",
  "OCMC_SERVICE_HTC",
  "OCMC_SERVICE_INJURY",
  "OCMC_SERVICE_MEDICO_LEGAL",
  "OCMC_SERVICE_PHYSICAL_EXAM",
  "OCMC_SERVICE_COUNSELING",
  "OCMC_SERVICE_ABORTION",
  "OCMC_VIOLENCE_RESOURCE_DENIAL",
  "OCMC_VIOLENCE_EMOTIONAL",
  "OCMC_VIOLENCE_PHYSICAL",
  "OCMC_VIOLENCE_RAPE",
  "OCMC_VIOLENCE_SEXUAL_ASSAULT",
  "OCMC_VISIT_FOLLOWUP",
  "OCMC_VISIT_NEW",
  "SSU_AMOUNT_EXEMPTED",
  "SSU_AMOUNT_EXPENSES",
  "SSU_VISIT_FOLLOWUP",
  "SSU_VISIT_NEW",
  "SSU_VISIT_EMERGENCY",
  "SSU_VISIT_INDOOR",
  "SSU_VISIT_OUTDOOR",
  "SSU_VISIT_ETHNICITY",
  "SSU_VISIT_HI_ENROLLED",
  "SSU_VISIT_HI_NOT_ENROLLED",
  "LOW_WEIGHT_FEEDING_29_59_DAYS",
  "LOW_WEIGHT_FEEDING_UNDER_28_DAYS",
  "CBIMCI_GENTAMYCIN_COMPLETE",
  "CBIMCI_UNDER_2M_JAUNDICE",
  "CBIMCI_UNDER_2M_LBI",
  "CBIMCI_UNDER_2M_PSBI",
  "CBIMCI_UNDER_2M_FOLLOWUP",
  "CBIMCI_UNDER_2M_REFERRAL",
  "CBIMCI_UNDER_2M_TOTAL",
  "CBIMCI_UNDER_2M_AMOXICILLIN",
  "CBIMCI_UNDER_2M_AMPICILLIN",
  "CBIMCI_UNDER_2M_GENTAMYCIN_FIRST",
  "CBIMCI_2_59M_NO_PNEUMONIA",
  "CBIMCI_2_59M_PNEUMONIA",
  "CBIMCI_2_59M_SEVERE_PNEUMONIA",
  "CBIMCI_2_59M_ANEMIA",
  "CBIMCI_2_59M_DYSENTERY",
  "CBIMCI_2_59M_DEHYDRATION",
  "CBIMCI_2_59M_EAR_INFECTION",
  "CBIMCI_2_59M_MEASLES",
  "CBIMCI_2_59M_OTHER_FEVER",
  "CBIMCI_2_59M_SEVERE_MALNUTRITION",
  "CBIMCI_2_59M_NO_DEHYDRATION",
  "CBIMCI_2_59M_FOLLOWUP",
  "CBIMCI_2_59M_OTHER",
  "CBIMCI_2_59M_REFER_ARI",
  "CBIMCI_2_59M_REFER_DIARRHEA",
  "CBIMCI_2_59M_REFER_OTHER",
  "CBIMCI_2_59M_TOTAL_SICK",
  "CBIMCI_2_59M_AMOXICILLIN",
  "CBIMCI_2_59M_ANTHELMINTICS",
  "CBIMCI_2_59M_IV_FLUIDS",
  "CBIMCI_2_59M_ORS_ZINC",
  "CBIMCI_2_59M_VITAMIN_A",
  "CBIMCI_2_59M_SERIOUS_FEVER",
  "CBIMCI_2_59M_PROLONGED_DIARRHEA",
  "CBIMCI_2_59M_OTHER_ANTIBIOTICS",
  "CBIMCI_UNDER_2M_OTHER_ANTIBIOTICS",
  "CBIMCI_UNDER_2M_ORC_GENTAMYCIN",
  "IMCI_TOTAL_FEMALE",
  "IMCI_TOTAL_MALE",
  "IMNCI_2_59M_DEATH_12_59",
  "IMNCI_2_59M_DEATH_2_11",
  "IMNCI_2_59M_MILD_MALNUTRITION",
  "IMNCI_UNDER_2M_BF_29_59",
  "IMNCI_UNDER_2M_BF_28",
  "IMNCI_UNDER_2M_DEATH_0_7",
  "IMNCI_UNDER_2M_DEATH_8_28",
  "IMNCI_UNDER_2M_PNEUMONIA_29_59",
  "IMNCI_UNDER_2M_PNEUMONIA_8_28",
  "HEALTH_EDUCATION_SESSIONS",
  "IMAM_UNDER_6M_END_MONTH",
  "IYCF_FORTIFIED_FLOUR_PREGNANT",
  "IYCF_COMPLEMENTARY_FEEDING",
  "IYCF_EXCLUSIVE_BREASTFEEDING",
  "IYCF_FORTIFIED_FLOUR_CHILDREN",
  "NP_UNDER_5_DEWORMING",
  "NP_UNDER_5_VITA_12_59",
  "NP_UNDER_5_VITA_6_11",
  "NP_GM_NEW_0_11M_MODERATE",
  "NP_GM_NEW_0_11M_NORMAL",
  "NP_GM_NEW_0_11M_SEVERE",
  "NP_GM_NEW_12_23M_MODERATE",
  "NP_GM_NEW_12_23M_NORMAL",
  "NP_GM_NEW_12_23M_SEVERE",
  "NP_GM_REVISIT_0_11M_MODERATE",
  "NP_GM_REVISIT_0_11M_NORMAL",
  "NP_GM_REVISIT_0_11M_SEVERE",
  "NP_GM_REVISIT_12_23M_MODERATE",
  "NP_GM_REVISIT_12_23M_NORMAL",
  "NP_GM_REVISIT_12_23M_SEVERE",
  "NP_POSTPARTUM_45_IRON",
  "NP_POSTPARTUM_VITAMIN_A",
  "NP_PREGNANT_180_IRON",
  "NP_PREGNANT_DEWORMING",
  "NP_PREGNANT_FIRST_IRON",
  "NP_STUDENTS_DEWORMING_BOYS",
  "NP_STUDENTS_DEWORMING_GIRLS",
  "NP_CALCIUM_TABLETS",
  "NP_GM_23_MONTHS",
  "NP_GM_WEIGHTED",
  "OP_MORBIDITY_ANEMIA",
  "OP_MORBIDITY_VITAMIN_DEFICIENCY",
  "OP_MORBIDITY_DIABETES",
  "OP_MORBIDITY_GOITRE",
  "OP_MORBIDITY_MALNUTRITION",
  "OP_MORBIDITY_OBESITY",
  "OP_MORBIDITY_POLYNEURITIS",
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
    category: "Newborn Care",
    indicators: [
      { value: "KMC_HYPOTHERMIA", label: "Managed with KMC - Hypothermia" },
      { value: "KMC_PRETERM", label: "Managed with KMC - Preterm" },
      { value: "PACKAGE_ABC", label: "Managed - Package A+B+C" },
      { value: "LAMA_ABSCONDED", label: "Outcome - LAMA/Absconded" },
      {
        value: "CONGENITAL_ANOMALIES",
        label: "Sick admitted - Congenital anomalies",
      },
      { value: "ASPHYXIA", label: "Sick babies admitted - Asphyxia" },
      {
        value: "HYPERBILIRUBINEMIA",
        label: "Sick babies admitted - Hyperbilirubinemia",
      },
      { value: "HYPOTHERMIA", label: "Sick babies admitted - Hypothermia" },
      { value: "LOW_BIRTH_WEIGHT", label: "Sick babies admitted - LBW" },
      { value: "OTHER_CONDITIONS", label: "Sick babies admitted - Others" },
      { value: "PRETERM", label: "Sick babies admitted - Preterm" },
      { value: "SEIZURE", label: "Sick babies admitted - Seizure" },
      { value: "SEPSIS", label: "Sick babies admitted - Sepsis" },
      { value: "TOTAL_SICK_ADMITTED", label: "Sick babies admitted - Total" },
      { value: "ADMITTED_PLH", label: "Admitted - Preterm/LBW/Hypothermia" },
      { value: "KMC_PLH", label: "With KMC - Preterm/LBW/Hypothermia" },
    ],
  },
  {
    category: "Outreach Clinic",
    indicators: [
      { value: "OUTREACH_KMC_LBW", label: "Managed with KMC - LBW" },
      { value: "OUTREACH_PACKAGE_A", label: "Managed - Package A" },
      { value: "OUTREACH_PACKAGE_AB", label: "Managed - Package A+B" },
      { value: "OUTREACH_PACKAGE_B", label: "Managed - Package B" },
      { value: "OUTREACH_DEATH", label: "Outcome - Death" },
      { value: "OUTREACH_IMPROVED", label: "Outcome - Improved" },
      { value: "OUTREACH_REFERRED", label: "Outcome - Referred" },
      { value: "OUTREACH_DAYS_STAY", label: "Total days of stay" },
    ],
  },
  {
    category: "Nutrition Rehabilitation",
    indicators: [
      {
        value: "NUTRITION_OEDEMA_1PLUS",
        label: "Admission (referred in) - Oedema Present 1+",
      },
      {
        value: "NUTRITION_OEDEMA_3PLUS",
        label: "Admission (referred in) - Oedema Present 3+",
      },
      {
        value: "NUTRITION_NO_OEDEMA",
        label: "Admission (referred in) - Oedema not Present",
      },
      {
        value: "NUTRITION_WEIGHT_HEIGHT_2SD",
        label: "Admission (referred in) - Weight/Height < -2SD",
      },
      {
        value: "NUTRITION_WEIGHT_HEIGHT_3SD",
        label: "Admission (referred in) - Weight/Height < -3SD",
      },
      {
        value: "NUTRITION_WEIGHT_HEIGHT_4SD",
        label: "Admission (referred in) - Weight/Height < -4SD",
      },
      {
        value: "NUTRITION_NEW_24_59_MONTHS",
        label: "New Admission - 24-59 Months",
      },
      {
        value: "NUTRITION_NEW_6_23_MONTHS",
        label: "New Admission - 6-23 Months",
      },
      {
        value: "NUTRITION_NEW_UNDER_6_MONTHS",
        label: "New Admission - Under 6 months",
      },
      {
        value: "NUTRITION_NEW_OVER_59_MONTHS",
        label: "New Admission - 59+ Months",
      },
      {
        value: "NUTRITION_ADMIT_OEDEMA_1PLUS",
        label: "Admission - Oedema Present 1+",
      },
      {
        value: "NUTRITION_ADMIT_OEDEMA_3PLUS",
        label: "Admission - Oedema Present 3+",
      },
      {
        value: "NUTRITION_ADMIT_NO_OEDEMA",
        label: "Admission - No Oedema Present",
      },
      {
        value: "NUTRITION_REFERRED_24_59_MONTHS",
        label: "Referred In - 24-59 Months",
      },
      {
        value: "NUTRITION_REFERRED_6_23_MONTHS",
        label: "Referred In - 6-23 Months",
      },
      {
        value: "NUTRITION_REFERRED_UNDER_6_MONTHS",
        label: "Referred In - Under 6 months",
      },
      {
        value: "NUTRITION_REFERRED_OVER_59_MONTHS",
        label: "Referred In - 59+ Months",
      },
      {
        value: "NUTRITION_ADMIT_WEIGHT_2SD",
        label: "Admission - Weight for Height < -2SD",
      },
      {
        value: "NUTRITION_ADMIT_WEIGHT_3SD",
        label: "Admission - Weight for Height < -3SD",
      },
      {
        value: "NUTRITION_ADMIT_WEIGHT_4SD",
        label: "Admission - Weight for Height < -4SD",
      },
      {
        value: "NUTRITION_AVG_IPD_DAYS",
        label: "Average Length of Stay - IPD days",
      },
      {
        value: "NUTRITION_AVG_TOTAL_ADMISSIONS",
        label: "Average Length of Stay - Total Admissions",
      },
      {
        value: "NUTRITION_BED_DAYS_AVAILABLE",
        label: "Bed Occupancy - Available Bed Days",
      },
      {
        value: "NUTRITION_BED_DAYS_CARE",
        label: "Bed Occupancy - IPD Days of Care",
      },
      {
        value: "NUTRITION_DISCHARGE_NO_OEDEMA",
        label: "Discharge (Referred Out) - No Oedema",
      },
      {
        value: "NUTRITION_DISCHARGE_WEIGHT_2SD",
        label: "Discharge (Referred Out) - Weight/Height < -2SD",
      },
      {
        value: "NUTRITION_DISCHARGE_WEIGHT_3SD",
        label: "Discharge (Referred Out) - Weight/Height < -3SD",
      },
      {
        value: "NUTRITION_DISCHARGE_WEIGHT_4SD",
        label: "Discharge (Referred Out) - Weight/Height < -4SD",
      },
      {
        value: "NUTRITION_DEATH_UNDER_6_MONTHS",
        label: "Discharge - Death Under 6 months",
      },
      {
        value: "NUTRITION_DISCHARGED_24_59_MONTHS",
        label: "Discharge - 24-59 Months",
      },
      {
        value: "NUTRITION_DISCHARGED_6_23_MONTHS",
        label: "Discharge - 6-23 Months",
      },
      {
        value: "NUTRITION_DISCHARGED_UNDER_6_MONTHS",
        label: "Discharge - Under 6 months",
      },
      {
        value: "NUTRITION_DISCHARGED_OVER_59_MONTHS",
        label: "Discharge - 59+ Months",
      },
      { value: "NUTRITION_LAMA_24_59_MONTHS", label: "LAMA - 24-59 Months" },
      { value: "NUTRITION_LAMA_6_23_MONTHS", label: "LAMA - 6-23 Months" },
      {
        value: "NUTRITION_DISCHARGE_OEDEMA",
        label: "Discharge - Oedema Present None",
      },
      {
        value: "NUTRITION_DISCHARGE_LAMA_WEIGHT_2SD",
        label: "Discharge - LAMA - Weight/Height < -2SD",
      },
      {
        value: "NUTRITION_DISCHARGE_LAMA_WEIGHT_3SD",
        label: "Discharge - LAMA - Weight/Height < -3SD",
      },
      {
        value: "NUTRITION_DISCHARGE_OEDEMA_2PLUS",
        label: "Discharge - Oedema Present 2+",
      },
      {
        value: "NUTRITION_DISCHARGE_REFERRAL_24_59",
        label: "Discharge - Referred Out - 24-59 Months",
      },
      {
        value: "NUTRITION_DISCHARGE_REFERRAL_6_23",
        label: "Discharge - Referred Out - 6-23 Months",
      },
      {
        value: "NUTRITION_DISCHARGE_REFERRAL_UNDER_6",
        label: "Discharge - Referred Out - Under 6 months",
      },
      {
        value: "NUTRITION_DISCHARGE_REFERRAL_OVER_59",
        label: "Discharge - Referred Out - 59+ Months",
      },
      {
        value: "NUTRITION_DISCHARGE_WEIGHT_HEIGHT_2SD",
        label: "Discharge - Weight for Height < -2SD",
      },
      {
        value: "NUTRITION_DISCHARGE_WEIGHT_HEIGHT_3SD",
        label: "Discharge - Weight for Height < -3SD",
      },
      {
        value: "NUTRITION_DISCHARGE_WEIGHT_HEIGHT_4SD",
        label: "Discharge - Weight for Height < -4SD",
      },
    ],
  },
  {
    category: "One-Stop Crisis Management Center (OCMC)",
    indicators: [
      {
        value: "OCMC_VIOLENCE_CHHAUPADI",
        label: "Cause of violence - Chhaupadi",
      },
      {
        value: "OCMC_VIOLENCE_CHILD_LABOR",
        label: "Cause of violence - Child labor",
      },
      {
        value: "OCMC_VIOLENCE_CHILD_MARRIAGE",
        label: "Cause of violence - Child marriage",
      },
      { value: "OCMC_VIOLENCE_DOWRY", label: "Cause of violence - Dowry" },
      {
        value: "OCMC_VIOLENCE_TRAFFICKING",
        label: "Cause of violence - Human Trafficking",
      },
      { value: "OCMC_VIOLENCE_OTHER", label: "Cause of violence - Other" },
      {
        value: "OCMC_VIOLENCE_POLYGAMY",
        label: "Cause of violence - Polygamy",
      },
      {
        value: "OCMC_VIOLENCE_DISCRIMINATION",
        label: "Cause of violence - Social discrimination",
      },
      { value: "OCMC_DISABILITY_AUTISM", label: "Disability - Autism" },
      {
        value: "OCMC_DISABILITY_INTELLECTUAL",
        label: "Disability - Intellectual",
      },
      {
        value: "OCMC_DISABILITY_MENTAL",
        label: "Disability - Mental & psychological",
      },
      { value: "OCMC_DISABILITY_MULTIPLE", label: "Disability - Multiple" },
      { value: "OCMC_DISABILITY_PHYSICAL", label: "Disability - Physical" },
      {
        value: "OCMC_DISABILITY_SPEECH",
        label: "Disability - Speech/language",
      },
      { value: "OCMC_NEW_CASES_ETHNICITY", label: "New Cases by Ethnicity" },
      { value: "OCMC_PERPETRATOR", label: "Perpetrator" },
      {
        value: "OCMC_PERPETRATOR_NON_RELATIVE",
        label: "Relation of perpetrator - Other than relatives",
      },
      {
        value: "OCMC_PERPETRATOR_RELATIVE",
        label: "Relation of perpetrator - Within relatives",
      },
      {
        value: "OCMC_SERVICE_CONTRACEPTIVE",
        label: "Service - Emergency Contraceptive",
      },
      { value: "OCMC_SERVICE_HTC", label: "Service - HTC" },
      { value: "OCMC_SERVICE_INJURY", label: "Service - Injury" },
      { value: "OCMC_SERVICE_MEDICO_LEGAL", label: "Service - Medico-legal" },
      {
        value: "OCMC_SERVICE_PHYSICAL_EXAM",
        label: "Service - Physical examination",
      },
      {
        value: "OCMC_SERVICE_COUNSELING",
        label: "Service - Psychological counseling",
      },
      { value: "OCMC_SERVICE_ABORTION", label: "Service - Safe abortion" },
      {
        value: "OCMC_VIOLENCE_RESOURCE_DENIAL",
        label: "Type of violence - Denial of resources",
      },
      {
        value: "OCMC_VIOLENCE_EMOTIONAL",
        label: "Type of violence - Emotional",
      },
      { value: "OCMC_VIOLENCE_PHYSICAL", label: "Type of violence - Physical" },
      { value: "OCMC_VIOLENCE_RAPE", label: "Type of violence - Rape" },
      {
        value: "OCMC_VIOLENCE_SEXUAL_ASSAULT",
        label: "Type of violence - Sexual assault",
      },
      { value: "OCMC_VISIT_FOLLOWUP", label: "Visit type - Follow up" },
      { value: "OCMC_VISIT_NEW", label: "Visit type - New" },
    ],
  },
  {
    category: "Social Service Unit (SSU)",
    indicators: [
      { value: "SSU_AMOUNT_EXEMPTED", label: "Amount exempted" },
      { value: "SSU_AMOUNT_EXPENSES", label: "Amount of expenses" },
      { value: "SSU_VISIT_FOLLOWUP", label: "Visit type - Follow up" },
      { value: "SSU_VISIT_NEW", label: "Visit type - New" },
      {
        value: "SSU_VISIT_EMERGENCY",
        label: "Visit by department - Emergency",
      },
      { value: "SSU_VISIT_INDOOR", label: "Visit by department - Indoor" },
      { value: "SSU_VISIT_OUTDOOR", label: "Visit by department - Outdoor" },
      { value: "SSU_VISIT_ETHNICITY", label: "Visit by ethnicity" },
      {
        value: "SSU_VISIT_HI_ENROLLED",
        label: "Visit by health insurance enrolled",
      },
      {
        value: "SSU_VISIT_HI_NOT_ENROLLED",
        label: "Visit by health insurance not enrolled",
      },
    ],
  },
  {
    category: "CBIMCI (Community-Based IMCI)",
    indicators: [
      {
        value: "LOW_WEIGHT_FEEDING_29_59_DAYS",
        label: "Low Weight/Feeding Problem 29-59 days",
      },
      {
        value: "LOW_WEIGHT_FEEDING_UNDER_28_DAYS",
        label: "Low Weight/Feeding Problem <= 28 days",
      },
      {
        value: "CBIMCI_GENTAMYCIN_COMPLETE",
        label: "Treatment-Gentamycin Complete dose",
      },
      {
        value: "CBIMCI_UNDER_2M_JAUNDICE",
        label: "Classification-Jaundice Cases (<2M)",
      },
      { value: "CBIMCI_UNDER_2M_LBI", label: "Classification-LBI Cases (<2M)" },
      {
        value: "CBIMCI_UNDER_2M_PSBI",
        label: "Classification-PSBI Cases (<2M)",
      },
      { value: "CBIMCI_UNDER_2M_FOLLOWUP", label: "Follow-Up (<2M)" },
      { value: "CBIMCI_UNDER_2M_REFERRAL", label: "Refer Cases (<2M)" },
      { value: "CBIMCI_UNDER_2M_TOTAL", label: "Total Cases (<2M)" },
      {
        value: "CBIMCI_UNDER_2M_AMOXICILLIN",
        label: "Treatment-Amoxicillin (<2M)",
      },
      {
        value: "CBIMCI_UNDER_2M_AMPICILLIN",
        label: "Treatment-Ampicillin (<2M)",
      },
      {
        value: "CBIMCI_UNDER_2M_GENTAMYCIN_FIRST",
        label: "Treatment-Gentamycin 1st Dose (<2M)",
      },
      {
        value: "CBIMCI_UNDER_2M_OTHER_ANTIBIOTICS",
        label: "Treatment-Other Antibiotics (<2M)",
      },
      {
        value: "CBIMCI_UNDER_2M_ORC_GENTAMYCIN",
        label: "ORC-Treatment-Gentamycin Complete Dose (<2M)",
      },
      {
        value: "CBIMCI_2_59M_NO_PNEUMONIA",
        label: "Classification-ARI-No Pneumonia (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_PNEUMONIA",
        label: "Classification-ARI-Pneumonia (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_SEVERE_PNEUMONIA",
        label: "Classification-ARI-Severe Pneumonia (2-59M)",
      },
      { value: "CBIMCI_2_59M_ANEMIA", label: "Classification-Anaemia (2-59M)" },
      {
        value: "CBIMCI_2_59M_DYSENTERY",
        label: "Classification-Diarrhoea-Dysentery (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_DEHYDRATION",
        label: "Classification-Diarrhoea-Some Dehydration (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_NO_DEHYDRATION",
        label: "Classification-Diarrhea-No Dehydration (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_PROLONGED_DIARRHEA",
        label: "Classification-Diarrhea-Prolonged (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_EAR_INFECTION",
        label: "Classification-Ear Infection (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_MEASLES",
        label: "Classification-Measles (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_OTHER_FEVER",
        label: "Classification-Other Fever (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_SEVERE_MALNUTRITION",
        label: "Classification-Severe Malnutrition (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_SERIOUS_FEVER",
        label: "Very Serious Febrile Disease (2-59M)",
      },
      { value: "CBIMCI_2_59M_FOLLOWUP", label: "Follow-Up Cases (2-59M)" },
      { value: "CBIMCI_2_59M_OTHER", label: "Other Cases (2-59M)" },
      { value: "CBIMCI_2_59M_REFER_ARI", label: "Referred ARI Cases (2-59M)" },
      {
        value: "CBIMCI_2_59M_REFER_DIARRHEA",
        label: "Referred Diarrhea Cases (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_REFER_OTHER",
        label: "Referred Other Cases (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_TOTAL_SICK",
        label: "Total Sick Children (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_AMOXICILLIN",
        label: "Treatment with Amoxicillin (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_ANTHELMINTICS",
        label: "Treatment with Anthelmintics (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_IV_FLUIDS",
        label: "Treatment with IV Fluids (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_ORS_ZINC",
        label: "Treatment with ORS and Zinc (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_VITAMIN_A",
        label: "Treatment with Vitamin A (2-59M)",
      },
      {
        value: "CBIMCI_2_59M_OTHER_ANTIBIOTICS",
        label: "Treatment with Other Antibiotics (2-59M)",
      },
    ],
  },
  {
    category: "IMCI/IMNCI Health and Nutrition",
    indicators: [
      {
        value: "IMCI_TOTAL_FEMALE",
        label: "Total Sick Children 2-59 Months Female",
      },
      {
        value: "IMCI_TOTAL_MALE",
        label: "Total Sick Children 2-59 Months Male",
      },
      { value: "IMNCI_2_59M_DEATH_12_59", label: "Death (12-59 months)" },
      { value: "IMNCI_2_59M_DEATH_2_11", label: "Death (2-11 months)" },
      {
        value: "IMNCI_2_59M_MILD_MALNUTRITION",
        label: "Mild Malnutrition (2-59M)",
      },
      {
        value: "IMNCI_UNDER_2M_BF_29_59",
        label: "Breast Feed Problems 29-59 days (<2M)",
      },
      {
        value: "IMNCI_UNDER_2M_BF_28",
        label: "Breast Feed Problems <=28 days (<2M)",
      },
      { value: "IMNCI_UNDER_2M_DEATH_0_7", label: "Death 0-7 days (<2M)" },
      { value: "IMNCI_UNDER_2M_DEATH_8_28", label: "Death 8-28 days (<2M)" },
      {
        value: "IMNCI_UNDER_2M_PNEUMONIA_29_59",
        label: "Pneumonia 29-59 days (<2M)",
      },
      {
        value: "IMNCI_UNDER_2M_PNEUMONIA_8_28",
        label: "Pneumonia 8-28 days (<2M)",
      },
      {
        value: "HEALTH_EDUCATION_SESSIONS",
        label: "Health Education Sessions Conducted",
      },
      {
        value: "IMAM_UNDER_6M_END_MONTH",
        label: "Under 6 Months Children at End of Month (IMAM)",
      },
    ],
  },
  {
    category: "Infant and Young Child Feeding (IYCF)",
    indicators: [
      {
        value: "IYCF_EXCLUSIVE_BREASTFEEDING",
        label: "Exclusive Breast Feeding",
      },
      { value: "IYCF_COMPLEMENTARY_FEEDING", label: "Complementary Feeding" },
      {
        value: "IYCF_FORTIFIED_FLOUR_CHILDREN",
        label: "Fortified Flour Distribution to Children",
      },
      {
        value: "IYCF_FORTIFIED_FLOUR_PREGNANT",
        label: "Fortified Flour Distribution to Pregnant Women",
      },
    ],
  },
  {
    category: "Nutrition Programs",
    indicators: [
      {
        value: "NP_UNDER_5_DEWORMING",
        label: "Under 5 Year Children Receiving Deworming Tablets",
      },
      {
        value: "NP_UNDER_5_VITA_12_59",
        label: "Children Receiving Vitamin A 12-59 Months",
      },
      {
        value: "NP_UNDER_5_VITA_6_11",
        label: "Children Receiving Vitamin A 6-11 Months",
      },
      {
        value: "NP_GM_NEW_0_11M_MODERATE",
        label: "Growth Monitoring New Visit 0-11M Moderate",
      },
      {
        value: "NP_GM_NEW_0_11M_NORMAL",
        label: "Growth Monitoring New Visit 0-11M Normal",
      },
      {
        value: "NP_GM_NEW_0_11M_SEVERE",
        label: "Growth Monitoring New Visit 0-11M Severe",
      },
      {
        value: "NP_GM_NEW_12_23M_MODERATE",
        label: "Growth Monitoring New Visit 12-23M Moderate",
      },
      {
        value: "NP_GM_NEW_12_23M_NORMAL",
        label: "Growth Monitoring New Visit 12-23M Normal",
      },
      {
        value: "NP_GM_NEW_12_23M_SEVERE",
        label: "Growth Monitoring New Visit 12-23M Severe",
      },
      {
        value: "NP_GM_REVISIT_0_11M_MODERATE",
        label: "Growth Monitoring Revisit 0-11M Moderate",
      },
      {
        value: "NP_GM_REVISIT_0_11M_NORMAL",
        label: "Growth Monitoring Revisit 0-11M Normal",
      },
      {
        value: "NP_GM_REVISIT_0_11M_SEVERE",
        label: "Growth Monitoring Revisit 0-11M Severe",
      },
      {
        value: "NP_GM_REVISIT_12_23M_MODERATE",
        label: "Growth Monitoring Revisit 12-23M Moderate",
      },
      {
        value: "NP_GM_REVISIT_12_23M_NORMAL",
        label: "Growth Monitoring Revisit 12-23M Normal",
      },
      {
        value: "NP_GM_REVISIT_12_23M_SEVERE",
        label: "Growth Monitoring Revisit 12-23M Severe",
      },
      {
        value: "NP_POSTPARTUM_45_IRON",
        label: "Postpartum Mother Receiving 45 Iron Tablets",
      },
      {
        value: "NP_POSTPARTUM_VITAMIN_A",
        label: "Postpartum Mother Receiving Vitamin A",
      },
      {
        value: "NP_PREGNANT_180_IRON",
        label: "Pregnant Women Receiving 180 Iron Tablets",
      },
      {
        value: "NP_PREGNANT_DEWORMING",
        label: "Pregnant Women Receiving Deworming Tablets",
      },
      {
        value: "NP_PREGNANT_FIRST_IRON",
        label: "Pregnant Women Receiving Iron Tablets First Time",
      },
      {
        value: "NP_STUDENTS_DEWORMING_BOYS",
        label: "Students Receiving Deworming Tablets - Boys",
      },
      {
        value: "NP_STUDENTS_DEWORMING_GIRLS",
        label: "Students Receiving Deworming Tablets - Girls",
      },
      { value: "NP_CALCIUM_TABLETS", label: "Calcium Tablets Received" },
      {
        value: "NP_GM_23_MONTHS",
        label: "Growth Monitoring 23 Months Completed",
      },
      { value: "NP_GM_WEIGHTED", label: "Growth Monitoring Weighted" },
    ],
  },
  {
    category: "Outpatient Morbidity",
    indicators: [
      { value: "OP_MORBIDITY_ANEMIA", label: "Anemia/Polyneuropathy" },
      {
        value: "OP_MORBIDITY_VITAMIN_DEFICIENCY",
        label: "Avitaminoses & Other Nutrient Deficiency",
      },
      { value: "OP_MORBIDITY_DIABETES", label: "Diabetes Mellitus" },
      { value: "OP_MORBIDITY_GOITRE", label: "Goitre, Cretinism" },
      { value: "OP_MORBIDITY_MALNUTRITION", label: "Malnutrition" },
      { value: "OP_MORBIDITY_OBESITY", label: "Obesity" },
      { value: "OP_MORBIDITY_POLYNEURITIS", label: "Polyneuritis" },
    ],
  },
];

// Flatten categories into a single options array for simple dropdowns
export const indicatorOptions = indicatorCategories.flatMap(
  (category) => category.indicators,
);
