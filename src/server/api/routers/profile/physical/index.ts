import { createTRPCRouter } from "@/server/api/trpc";
import { wardWiseTimeToPublicTransportRouter } from "./ward-wise-time-to-public-transport.procedure";
import { wardWiseTimeToMarketCenterRouter } from "./ward-wise-time-to-market-center.procedure";
import { wardWiseCookingFuelRouter } from "./ward-wise-cooking-fuel.procedure";
import { wardWiseElectricitySourceRouter } from "./ward-wise-electricity-source.procedure";
import { wardWiseFacilitiesRouter } from "./ward-wise-facilities.procedure";

export const physicalRouter = createTRPCRouter({
  wardWiseTimeToPublicTransport: wardWiseTimeToPublicTransportRouter,
  wardWiseTimeToMarketCenter: wardWiseTimeToMarketCenterRouter,
  wardWiseCookingFuel: wardWiseCookingFuelRouter,
  wardWiseElectricitySource: wardWiseElectricitySourceRouter,
  wardWiseFacilities: wardWiseFacilitiesRouter,
  // Add other physical profile-related routers here in the future
});
