import { createTRPCRouter } from "@/server/api/trpc";
import { demographicsRouter } from "./demographics";
import { localAreasRouter } from "./local-areas";

export const profileRouter = createTRPCRouter({
  demographics: demographicsRouter,
  localAreas: localAreasRouter,
});
