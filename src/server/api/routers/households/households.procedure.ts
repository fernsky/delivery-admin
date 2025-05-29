import { createTRPCRouter } from "@/server/api/trpc";
import { createHouseholdProcedure } from "./procedures/create";

export const householdRouter = createTRPCRouter({
    createHousehold: createHouseholdProcedure,
});
