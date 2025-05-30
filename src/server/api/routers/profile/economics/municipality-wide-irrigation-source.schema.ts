import { z } from "zod";

// Define the irrigation source type enum to match the database enum
export const IrrigationSourceEnum = z.enum([
  "LAKE_OR_RESERVOIR",
  "IRRIGATION_CANAL",
  "RAINWATER_COLLECTION",
  "ELECTRIC_LIFT_IRRIGATION",
  "CANAL",
  "PUMPING_SET",
  "UNDERGROUND_IRRIGATION",
  "OTHER",
]);
export type IrrigationSourceType = z.infer<typeof IrrigationSourceEnum>;

// Schema for municipality-wide irrigation source data
export const municipalityWideIrrigationSourceSchema = z.object({
  id: z.string().optional(),
  irrigationSource: IrrigationSourceEnum,
  coverageInHectares: z.number().nonnegative(),
  percentage: z.number().nonnegative().optional(),
});

// Schema for filtering irrigation source data
export const municipalityWideIrrigationSourceFilterSchema = z.object({
  irrigationSource: IrrigationSourceEnum.optional(),
});

export const updateMunicipalityWideIrrigationSourceSchema = municipalityWideIrrigationSourceSchema;

export type MunicipalityWideIrrigationSourceData = z.infer<
  typeof municipalityWideIrrigationSourceSchema
>;
export type UpdateMunicipalityWideIrrigationSourceData = MunicipalityWideIrrigationSourceData;
export type MunicipalityWideIrrigationSourceFilter = z.infer<
  typeof municipalityWideIrrigationSourceFilterSchema
>;

// Export the irrigation source options for use in UI components
export const irrigationSourceOptions = [
  { value: "LAKE_OR_RESERVOIR", label: "पोखरी/रिजरभ्वायर" },
  { value: "IRRIGATION_CANAL", label: "सिंचाई कुलो" },
  { value: "RAINWATER_COLLECTION", label: "आकाशे पानी सङ्कलन" },
  { value: "ELECTRIC_LIFT_IRRIGATION", label: "विद्युतिय लिफ्ट सिंचाई" },
  { value: "CANAL", label: "नहर" },
  { value: "PUMPING_SET", label: "पम्पिङ सेट/मोटर" },
  { value: "UNDERGROUND_IRRIGATION", label: "भूमिगत सिंचाई (स्यालो ट्युबवेल, डिप ट्युबवेल)" },
  { value: "OTHER", label: "अन्य" },
];
