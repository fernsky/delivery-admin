import { createTRPCRouter } from "@/server/api/trpc";
import { demographicsRouter } from "./demographics";
import { localAreasRouter } from "./local-areas";
import { economicsRouter } from "./economics";
import { transportationRouter } from "./transportation";
import { agricZoneRouter } from "./agricultural/agricZones/agricZone.router";

export const profileRouter = createTRPCRouter({
  demographics: demographicsRouter,
  economics: economicsRouter,
  localAreas: localAreasRouter,
  transportation: transportationRouter,
  agricZones: agricZoneRouter,
  // Add other profile-related routers here in the future
});
