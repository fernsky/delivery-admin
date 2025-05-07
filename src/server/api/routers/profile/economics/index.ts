import { createTRPCRouter } from "@/server/api/trpc";
import {wardAgeGenderWiseEconomicallyActivePopulationRouter} from "./ward-age-gender-wise-economically-active-population.procedure"
import { wardWiseMajorOccupationRouter } from "./ward-wise-major-occupation.procedure";
import { wardTimeWiseHouseholdChoresRouter } from "./ward-time-wise-household-chores.procedure";
import { wardWiseHouseholdIncomeSourceRouter } from "./ward-wise-household-income-source.procedure";
import { wardWiseRemittanceExpensesRouter } from "./ward-wise-remittance-expenses.procedure";
import { wardWiseAnnualIncomeSustenanceRouter } from "./ward-wise-annual-income-sustenance.procedure";
import { wardWiseHouseholdsOnLoanRouter } from "./ward-wise-households-on-loan.procedure";
import { wardWiseHouseholdsLoanUseRouter } from "./ward-wise-households-loan-use.procedure";

export const economicsRouter = createTRPCRouter({
  wardAgeGenderWiseEconomicallyActivePopulation: wardAgeGenderWiseEconomicallyActivePopulationRouter,
  wardWiseMajorOccupation: wardWiseMajorOccupationRouter,
  wardTimeWiseHouseholdChores: wardTimeWiseHouseholdChoresRouter,
  wardWiseHouseholdIncomeSource: wardWiseHouseholdIncomeSourceRouter,
  wardWiseRemittanceExpenses: wardWiseRemittanceExpensesRouter,
  wardWiseAnnualIncomeSustenance: wardWiseAnnualIncomeSustenanceRouter,
  wardWiseHouseholdsOnLoan: wardWiseHouseholdsOnLoanRouter,
  wardWiseHouseholdsLoanUse: wardWiseHouseholdsLoanUseRouter,
});

