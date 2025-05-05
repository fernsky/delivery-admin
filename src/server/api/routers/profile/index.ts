import { createTRPCRouter } from "@/server/api/trpc";
import { demographicsRouter } from "./demographics";
import { localAreasRouter } from "./local-areas";
import { economicsRouter } from "./economics";

export const profileRouter = createTRPCRouter({
  demographics: demographicsRouter,
  economics: economicsRouter,
  // Add other profile-related routers here in the future
  
import { localAreasRouter } from "./local-areas";

export const profileRouter = createTRPCRouter({
  demographics: demographicsRouter,
  localAreas: localAreasRouter,
});
