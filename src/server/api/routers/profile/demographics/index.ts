import { createTRPCRouter } from "@/server/api/trpc";
import { demographicSummaryRouter } from "./demographic-summary.procedure";
import { wardTimeSeriesRouter } from "./ward-time-series.procedure";
import { wardWiseHouseHeadGenderRouter } from "./ward-wise-househead-gender.procedure";
import { wardAgeWisePopulationRouter } from "./ward-age-wise-population.procedure";

export const demographicsRouter = createTRPCRouter({
  summary: demographicSummaryRouter,
  wardTimeSeries: wardTimeSeriesRouter,
  wardWiseHouseHeadGender: wardWiseHouseHeadGenderRouter,
  wardAgeWisePopulation: wardAgeWisePopulationRouter,
  // Add other demographic-related routers here in the future
});
