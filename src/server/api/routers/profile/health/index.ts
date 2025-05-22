import { createTRPCRouter } from "@/server/api/trpc";
import { wardWiseChronicDiseasesRouter } from "./ward-wise-chronic-diseases.procedure";
import { wardWiseHealthInsuredHouseholdsRouter } from "./ward-wise-health-insured-households.procedure";

export const healthRouter = createTRPCRouter({
  wardWiseChronicDiseases: wardWiseChronicDiseasesRouter,
  wardWiseHealthInsuredHouseholds: wardWiseHealthInsuredHouseholdsRouter,
  // Add other health profile-related routers here in the future
});
