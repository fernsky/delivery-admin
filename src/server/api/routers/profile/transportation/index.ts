import { createTRPCRouter } from "@/server/api/trpc";
import { roadRouter } from "./roads/road.router";
import { parkingFacilityRouter } from "./parkingFacilities/parkingFacility.router";
import { publicTransportRouter } from "./publicTransport/publicTransport.router";

export const transportationRouter = createTRPCRouter({
  roads: roadRouter,
  parkingFacilities: parkingFacilityRouter,
  publicTransports: publicTransportRouter,
  // Other transportation-related routers can be added here in the future
});

// Export for backward compatibility
export { roadRouter };
