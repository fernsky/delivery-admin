import { createTRPCRouter } from "@/server/api/trpc";
import { wardWiseDrinkingWaterSourceRouter } from "./ward-wise-drinking-water-source.procedure";
import { wardWiseWaterPurificationRouter } from "./ward-wise-water-purification.procedure";
import { wardWiseToiletTypeRouter } from "./ward-wise-toilet-type.procedure";
import { wardWiseSolidWasteManagementRouter } from "./ward-wise-solid-waste-management.procedure";
import { wardAgeGenderWiseFirstMarriageAgeRouter } from "./ward-age-gender-wise-first-marriage-age.procedure";
import { wardWiseDisabledPopulationRouter } from "./ward-wise-disabled-population.procedure";
import { wardWiseOldAgePopulationAndSingleWomenRouter } from "./ward-wise-old-age-population-and-single-women.procedure";

export const socialRouter = createTRPCRouter({
  wardWiseDrinkingWaterSource: wardWiseDrinkingWaterSourceRouter,
  wardWiseWaterPurification: wardWiseWaterPurificationRouter,
  wardWiseToiletType: wardWiseToiletTypeRouter,
  wardWiseSolidWasteManagement: wardWiseSolidWasteManagementRouter,
  wardAgeGenderWiseFirstMarriageAge: wardAgeGenderWiseFirstMarriageAgeRouter,
  wardWiseDisabledPopulation: wardWiseDisabledPopulationRouter,
  wardWiseOldAgePopulationAndSingleWomen:
    wardWiseOldAgePopulationAndSingleWomenRouter,
  // Add other social profile-related routers here in the future
});
