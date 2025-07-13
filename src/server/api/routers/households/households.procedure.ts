import { createTRPCRouter } from "@/server/api/trpc";
import { createHouseholdProcedure } from "./procedures/create";
import { 
    getHouseholdsProcedure,
    getHouseholdByIdProcedure,
    downloadHouseholdsProcedure
} from "./procedures/query";
import { updateHouseholdProcedure } from "./procedures/update";
import { 
    requestHouseholdEditProcedure,
    getHouseholdEditRequestsProcedure
} from "./procedures/edit";
import {
    getHouseholdLocationProcedure,
    getHouseholdsLocationsProcedure
} from "./procedures/location";

export const householdRouter = createTRPCRouter({
    createHousehold: createHouseholdProcedure,
    getHouseholds: getHouseholdsProcedure,
    getHouseholdById: getHouseholdByIdProcedure,
    downloadHouseholds: downloadHouseholdsProcedure,
    updateHousehold: updateHouseholdProcedure,
    requestHouseholdEdit: requestHouseholdEditProcedure,
    getHouseholdEditRequests: getHouseholdEditRequestsProcedure,
    getHouseholdLocation: getHouseholdLocationProcedure,
    getHouseholdsLocations: getHouseholdsLocationsProcedure
});
