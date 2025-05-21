import { createTRPCRouter } from "@/server/api/trpc";
import { demographicsRouter } from "./demographics";
import { localAreasRouter } from "./local-areas";
import { economicsRouter } from "./economics";
import { transportationRouter } from "./transportation";
import { agriculturalRouter } from "./agricultural";
import { educationRouter } from "./education";
import { physicalRouter } from "./physical";

export const profileRouter = createTRPCRouter({
  demographics: demographicsRouter,
  economics: economicsRouter,
  localAreas: localAreasRouter,
  transportation: transportationRouter,
  agriculture: agriculturalRouter,
  education: educationRouter,
  physical: physicalRouter,
  // Add other profile-related routers here in the future
});
