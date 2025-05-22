import { z } from "zod";

// Define the solid waste management type enum to match the database enum
export const SolidWasteManagementTypeEnum = z.enum([
  "HOME_COLLECTION",
  "WASTE_COLLECTING_PLACE",
  "BURNING",
  "DIGGING",
  "RIVER",
  "ROAD_OR_PUBLIC_PLACE",
  "COMPOST_MANURE",
  "OTHER",
]);
export type SolidWasteManagementType = z.infer<
  typeof SolidWasteManagementTypeEnum
>;

// Schema for ward-wise solid waste management data
export const wardWiseSolidWasteManagementSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  solidWasteManagement: SolidWasteManagementTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise solid waste management data
export const wardWiseSolidWasteManagementFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  solidWasteManagement: SolidWasteManagementTypeEnum.optional(),
});

export const updateWardWiseSolidWasteManagementSchema =
  wardWiseSolidWasteManagementSchema;

export type WardWiseSolidWasteManagementData = z.infer<
  typeof wardWiseSolidWasteManagementSchema
>;
export type UpdateWardWiseSolidWasteManagementData =
  WardWiseSolidWasteManagementData;
export type WardWiseSolidWasteManagementFilter = z.infer<
  typeof wardWiseSolidWasteManagementFilterSchema
>;

// Export the solid waste management options for use in UI components
export const solidWasteManagementOptions = [
  {
    value: "HOME_COLLECTION",
    label: "Home collection service (घरमा नै लिन आउँछ)",
  },
  {
    value: "WASTE_COLLECTING_PLACE",
    label:
      "Disposal at waste collection point/bin (फोहर थुपार्ने ठाउँमा/क्यानमा)",
  },
  {
    value: "BURNING",
    label: "Burning within compound (आफ्नै घर कम्पाउण्ड भित्र (बाल्ने))",
  },
  {
    value: "DIGGING",
    label:
      "Burying/stockpiling within compound (आफ्नै घर कम्पाउण्ड भित्र (गाड्ने/थुपार्ने))",
  },
  {
    value: "RIVER",
    label: "Disposal in river/stream (नदी वा खोल्सामा)",
  },
  {
    value: "ROAD_OR_PUBLIC_PLACE",
    label: "Disposal on road/public place (सडक/सार्वजनिक स्थलमा)",
  },
  {
    value: "COMPOST_MANURE",
    label: "Composting (कम्पोष्ट मल बनाउने)",
  },
  {
    value: "OTHER",
    label: "Other methods (अन्य)",
  },
];
