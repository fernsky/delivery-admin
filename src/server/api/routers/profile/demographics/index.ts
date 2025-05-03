import { createTRPCRouter } from "@/server/api/trpc";
import { demographicSummaryRouter } from "./demographic-summary.procedure";
import { wardTimeSeriesRouter } from "./ward-time-series.procedure";
import { wardWiseDemographicSummaryRouter } from "./ward-wise-demographic-summary.procedure";
import { wardWiseCastePopulationRouter } from "./ward-wise-caste-population.procedure";
import { wardAgeWisePopulationRouter } from "./ward-age-wise-population.procedure";
import { wardWiseHouseHeadGenderRouter } from "./ward-wise-househead-gender.procedure";
import { wardWiseHouseHeadGender } from "@/server/db/schema/profile/demographics/ward-wise-househead-gender";

export const demographicsRouter = createTRPCRouter({
  summary: demographicSummaryRouter,
  wardTimeSeries: wardTimeSeriesRouter,
  wardWiseDemographicSummary: wardWiseDemographicSummaryRouter,
  wardAgeWisePopulation: wardAgeWisePopulationRouter,
  wardWiseCastePopulation: wardWiseCastePopulationRouter,
  wardWiseHouseHeadGender: wardWiseHouseHeadGenderRouter,
});
