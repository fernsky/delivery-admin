import { createTRPCRouter } from "@/server/api/trpc";
import {wardAgeGenderWiseEconomicallyActivePopulationRouter} from "./ward-age-gender-wise-economically-active-population.procedure"
import { wardWiseMajorOccupationRouter } from "./ward-wise-major-occupation.procedure";
import { wardTimeWiseHouseholdChoresRouter } from "./ward-time-wise-household-chores.procedure";

export const economicsRouter = createTRPCRouter({
  wardAgeGenderWiseEconomicallyActivePopulation: wardAgeGenderWiseEconomicallyActivePopulationRouter,
  wardWiseMajorOccupation: wardWiseMajorOccupationRouter,
  wardTimeWiseHouseholdChores: wardTimeWiseHouseholdChoresRouter,
});

