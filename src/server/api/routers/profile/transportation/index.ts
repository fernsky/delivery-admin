import { createTRPCRouter } from "@/server/api/trpc";
import { roadRouter } from "./roads/road.router";
import { parkingFacilityRouter } from "./parkingFacilities/parkingFacility.router";

export const transportationRouter = createTRPCRouter({
  roads: roadRouter,
  parkingFacilities: parkingFacilityRouter,
  // Other transportation-related routers can be added here in the future
  // e.g. bridges, publicTransport, etc.
});

// Export for backward compatibility
export { roadRouter };
