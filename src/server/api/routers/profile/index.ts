import { createTRPCRouter } from "@/server/api/trpc";
import { demographicsRouter } from "./demographics";
import { localAreasRouter } from "./local-areas";
import { economicsRouter } from "./economics";
import { transportationRouter } from "./transportation";

export const profileRouter = createTRPCRouter({
  demographics: demographicsRouter,
  economics: economicsRouter,
  localAreas: localAreasRouter,
  transportation: transportationRouter,
  // Add other profile-related routers here in the future
});
