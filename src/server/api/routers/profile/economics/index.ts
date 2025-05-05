import { createTRPCRouter } from "@/server/api/trpc";
import {wardAgeGenderWiseEconomicallyActivePopulationRouter} from "./ward-age-gender-wise-economically-active-population.procedure"

export const economicsRouter = createTRPCRouter({
  wardAgeGenderWiseEconomicallyActivePopulation: wardAgeGenderWiseEconomicallyActivePopulationRouter,
});

