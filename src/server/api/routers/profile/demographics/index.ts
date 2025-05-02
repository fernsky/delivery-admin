import { createTRPCRouter } from "@/server/api/trpc";
import { demographicSummaryRouter } from "./demographic-summary.procedure";
import { wardTimeSeriesRouter } from "./ward-time-series.procedure";
import { wardWiseDemographicSummaryRouter } from "./ward-wise-demographic-summary.procedure";
import { wardAgeWisePopulationRouter } from "./ward-age-wise-population.procedure";

export const demographicsRouter = createTRPCRouter({
  summary: demographicSummaryRouter,
  wardTimeSeries: wardTimeSeriesRouter,
  wardWiseDemographicSummary: wardWiseDemographicSummaryRouter,
  wardAgeWisePopulation: wardAgeWisePopulationRouter,
});
