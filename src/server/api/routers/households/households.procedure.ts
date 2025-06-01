import { createTRPCRouter } from "@/server/api/trpc";
import { createHouseholdProcedure } from "./procedures/create";
import { 
    getHouseholdsProcedure,
    getHouseholdByIdProcedure
} from "./procedures/query";
import { updateHouseholdProcedure } from "./procedures/update";
import { 
    requestHouseholdEditProcedure,
    getHouseholdEditRequestsProcedure
} from "./procedures/edit";

export const householdRouter = createTRPCRouter({
    createHousehold: createHouseholdProcedure,
    getHouseholds: getHouseholdsProcedure,
    getHouseholdById: getHouseholdByIdProcedure,
    updateHousehold: updateHouseholdProcedure,
    requestHouseholdEdit: requestHouseholdEditProcedure,
    getHouseholdEditRequests: getHouseholdEditRequestsProcedure
});
