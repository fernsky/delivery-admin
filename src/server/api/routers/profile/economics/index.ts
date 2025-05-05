import { createTRPCRouter } from "@/server/api/trpc";
import {wardAgeGenderWiseEconomicallyActivePopulationRouter} from "./ward-age-gender-wise-economically-active-population.procedure"
import { wardWiseMajorOccupationRouter } from "./ward-wise-major-occupation.procedure";

export const economicsRouter = createTRPCRouter({
  wardAgeGenderWiseEconomicallyActivePopulation: wardAgeGenderWiseEconomicallyActivePopulationRouter,
  wardWiseMajorOccupation: wardWiseMajorOccupationRouter,
});

