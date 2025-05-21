import { z } from "zod";

// Define the skill type enum to match the database enum
export const skillTypeEnum = z.enum([
  "TEACHING_RELATED",
  "PHOTOGRAPHY_RELATED",
  "HANDICRAFT_RELATED",
  "MUSIC_DRAMA_RELATED",
  "STONEWORK_WOODWORK",
  "CARPENTERY_RELATED",
  "PLUMBING",
  "HUMAN_HEALTH_RELATED",
  "ANIMAL_HEALTH_RELATED",
  "ELECTRICITY_INSTALLMENT_RELATED",
  "HOTEL_RESTAURANT_RELATED",
  "AGRICULTURE_RELATED",
  "PRINTING_RELATED",
  "DRIVING_RELATED",
  "MECHANICS_RELATED",
  "FURNITURE_RELATED",
  "SHOEMAKING_RELATED",
  "SEWING_RELATED",
  "JWELLERY_MAKING_RELATED",
  "BEUATICIAN_RELATED",
  "SELF_PROTECTION_RELATED",
  "LAND_SURVEY_RELATED",
  "COMPUTER_SCIENCE_RELATED",
  "ENGINEERING_DESIGN_RELATED",
  "RADIO_TELEVISION_ELECTRICAL_REPAIR",
  "LITERARY_CREATION_RELATED",
  "OTHER",
  "NONE",
]);

export type SkillType = z.infer<typeof skillTypeEnum>;

// Define Nepali skill names for display
export const skillLabels: Record<string, string> = {
  TEACHING_RELATED: "शिक्षण सम्बन्धी",
  PHOTOGRAPHY_RELATED: "फोटोग्राफी सम्बन्धी",
  HANDICRAFT_RELATED: "हस्तकला सम्बन्धी",
  MUSIC_DRAMA_RELATED: "संगीत र नाटक",
  STONEWORK_WOODWORK: "ढुंगा र काठ कार्य",
  CARPENTERY_RELATED: "सिकर्मी सम्बन्धी",
  PLUMBING: "प्लम्बिङ",
  HUMAN_HEALTH_RELATED: "मानव स्वास्थ्य सम्बन्धी",
  ANIMAL_HEALTH_RELATED: "पशु स्वास्थ्य सम्बन्धी",
  ELECTRICITY_INSTALLMENT_RELATED: "विद्युतिय जडान सम्बन्धी",
  HOTEL_RESTAURANT_RELATED: "होटल र रेस्टुरेन्ट",
  AGRICULTURE_RELATED: "कृषि सम्बन्धी",
  PRINTING_RELATED: "छपाई सम्बन्धी",
  DRIVING_RELATED: "सवारी चालक सम्बन्धी",
  MECHANICS_RELATED: "मेकानिक्स सम्बन्धी",
  FURNITURE_RELATED: "फर्निचर सम्बन्धी",
  SHOEMAKING_RELATED: "जुत्ता बनाउने सम्बन्धी",
  SEWING_RELATED: "सिलाई सम्बन्धी",
  JWELLERY_MAKING_RELATED: "गहना निर्माण सम्बन्धी",
  BEUATICIAN_RELATED: "ब्यूटिसियन सम्बन्धी",
  SELF_PROTECTION_RELATED: "आत्मरक्षा सम्बन्धी",
  LAND_SURVEY_RELATED: "भूमि सर्वेक्षण सम्बन्धी",
  COMPUTER_SCIENCE_RELATED: "कम्प्युटर विज्ञान सम्बन्धी",
  ENGINEERING_DESIGN_RELATED: "इन्जिनियरिङ डिजाइन सम्बन्धी",
  RADIO_TELEVISION_ELECTRICAL_REPAIR: "रेडियो, टेलिभिजन र विद्युतिय मर्मत",
  LITERARY_CREATION_RELATED: "साहित्यिक सृजना सम्बन्धी",
  OTHER: "अन्य",
  NONE: "कुनै पनि छैन",
};

// Schema for ward-wise major skills data
export const wardWiseMajorSkillsSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int(),
  skill: skillTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise major skills data
export const wardWiseMajorSkillsFilterSchema = z.object({
  wardNumber: z.number().int().optional(),
  skill: skillTypeEnum.optional(),
});

export const updateWardWiseMajorSkillsSchema = wardWiseMajorSkillsSchema;

export type WardWiseMajorSkillsData = z.infer<typeof wardWiseMajorSkillsSchema>;
export type UpdateWardWiseMajorSkillsData = WardWiseMajorSkillsData;
export type WardWiseMajorSkillsFilter = z.infer<
  typeof wardWiseMajorSkillsFilterSchema
>;
