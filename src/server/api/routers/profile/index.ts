import { createTRPCRouter } from "@/server/api/trpc";
import { demographicsRouter } from "./demographics";

export const profileRouter = createTRPCRouter({
  demographics: demographicsRouter,
  // Add other profile-related routers here in the future
});
