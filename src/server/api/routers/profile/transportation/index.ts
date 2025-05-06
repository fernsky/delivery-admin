import { createTRPCRouter } from "@/server/api/trpc";
import { roadRouter } from "./roads/road.router";

export const transportationRouter = createTRPCRouter({
  roads: roadRouter,
  // Other transportation-related routers can be added here in the future
  // e.g. bridges, publicTransport, etc.
});

// Export for backward compatibility
export { roadRouter };
