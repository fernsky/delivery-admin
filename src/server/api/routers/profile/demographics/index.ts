import { createTRPCRouter } from "@/server/api/trpc";
import { demographicSummaryRouter } from "./demographic-summary.procedure";
import { wardTimeSeriesRouter } from "./ward-time-series.procedure";

export const demographicsRouter = createTRPCRouter({
  summary: demographicSummaryRouter,
  wardTimeSeries: wardTimeSeriesRouter,
  // Add other demographic-related routers here in the future
});
