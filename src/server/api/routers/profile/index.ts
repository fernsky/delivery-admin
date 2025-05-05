import { createTRPCRouter } from "@/server/api/trpc";
import { demographicsRouter } from "./demographics";
import { economicsRouter } from "./economics";

export const profileRouter = createTRPCRouter({
  demographics: demographicsRouter,
  economics: economicsRouter,
  // Add other profile-related routers here in the future
});
