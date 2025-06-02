import { createTRPCRouter } from "@/server/api/trpc";
import { wardWiseChronicDiseasesRouter } from "./ward-wise-chronic-diseases.procedure";
import { wardWiseHealthInsuredHouseholdsRouter } from "./ward-wise-health-insured-households.procedure";
import {wardWiseTimeToHealthOrganizationRouter} from "./ward-wise-time-to-health-organization.procedure";

export const healthRouter = createTRPCRouter({
  wardWiseChronicDiseases: wardWiseChronicDiseasesRouter,
  wardWiseHealthInsuredHouseholds: wardWiseHealthInsuredHouseholdsRouter,
  wardWiseTimeToHealthOrganization: wardWiseTimeToHealthOrganizationRouter,
  // Add other health profile-related routers here in the future
});
