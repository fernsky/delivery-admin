import { createTRPCRouter } from "@/server/api/trpc";
import { demographicSummaryRouter } from "./demographic-summary.procedure";

export const demographicsRouter = createTRPCRouter({
  summary: demographicSummaryRouter,
  // Add other demographic-related routers here in the future
});
