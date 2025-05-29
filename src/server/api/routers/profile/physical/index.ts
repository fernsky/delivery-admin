import { createTRPCRouter } from "@/server/api/trpc";
import { wardWiseTimeToPublicTransportRouter } from "./ward-wise-time-to-public-transport.procedure";
import { wardWiseTimeToMarketCenterRouter } from "./ward-wise-time-to-market-center.procedure";
import { wardWiseCookingFuelRouter } from "./ward-wise-cooking-fuel.procedure";
import { wardWiseElectricitySourceRouter } from "./ward-wise-electricity-source.procedure";
import { wardWiseFacilitiesRouter } from "./ward-wise-facilities.procedure";
import { wardWiseHouseMapPassedRouter } from "./ward-wise-house-map-passed.procedure";
import { wardWiseHouseholdBaseRouter } from "./ward-wise-household-base.procedure";
import { wardWiseHouseholdFloorRouter } from "./ward-wise-household-floor.procedure";
import { wardWiseHouseholdOuterWallRouter } from "./ward-wise-household-outer-wall.procedure";
import { wardWiseHouseholdRoofRouter } from "./ward-wise-household-roof.procedure";
import { wardWiseRoadStatusRouter } from "./ward-wise-road-status.procedure";
import { wardWiseTimeToActiveRoadRouter } from "./ward-wise-time-to-active-road.procedure";
import { wardWiseTimeToFinancialOrganizationRouter } from "./ward-wise-time-to-financial-organization.procedure";
import { wardWiseTimeToHealthOrganizationRouter } from "./ward-wise-time-to-health-organization.procedure";

export const physicalRouter = createTRPCRouter({
  wardWiseTimeToPublicTransport: wardWiseTimeToPublicTransportRouter,
  wardWiseTimeToMarketCenter: wardWiseTimeToMarketCenterRouter,
  wardWiseCookingFuel: wardWiseCookingFuelRouter,
  wardWiseElectricitySource: wardWiseElectricitySourceRouter,
  wardWiseFacilities: wardWiseFacilitiesRouter,
  wardWiseHouseMapPassed: wardWiseHouseMapPassedRouter,
  wardWiseHouseholdBase: wardWiseHouseholdBaseRouter,
  wardWiseHouseholdFloor: wardWiseHouseholdFloorRouter,
  wardWiseHouseholdOuterWall: wardWiseHouseholdOuterWallRouter,
  wardWiseHouseholdRoof: wardWiseHouseholdRoofRouter,
  wardWiseRoadStatus: wardWiseRoadStatusRouter,
  wardWiseTimeToActiveRoad: wardWiseTimeToActiveRoadRouter,
  wardWiseTimeToFinancialOrganization:
    wardWiseTimeToFinancialOrganizationRouter,
  wardWiseTimeToHealthOrganization: wardWiseTimeToHealthOrganizationRouter,
  // Add other physical profile-related routers here in the future
});
