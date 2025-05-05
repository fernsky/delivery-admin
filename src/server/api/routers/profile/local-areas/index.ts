import { createTRPCRouter } from "@/server/api/trpc";
import { locationRouter } from "./location.procedure";

export const localAreasRouter = createTRPCRouter({
  locations: locationRouter,
});
