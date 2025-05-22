import { createTRPCRouter } from "@/server/api/trpc";
import { immunizationIndicatorsRouter } from "./immunization-indicators.procedure";
import { safeMotherhoodIndicatorsRouter } from "./safe-motherhood-indicators.procedure";
import { wardWiseDeliveryPlacesRouter } from "./ward-wise-delivery-place.procedure";

export const fertilityRouter = createTRPCRouter({
  immunizationIndicators: immunizationIndicatorsRouter,
  safeMotherhoodIndicators: safeMotherhoodIndicatorsRouter,
  wardWiseDeliveryPlaces: wardWiseDeliveryPlacesRouter,
  // Add other fertility-related routers here in the future
});
