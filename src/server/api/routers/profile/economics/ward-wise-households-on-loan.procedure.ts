import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { 
  wardWiseHouseholdsOnLoan,
  acmeWardWiseHouseholdsOnLoan 
} from "@/server/db/schema/profile/economics/ward-wise-households-on-loan";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  addWardWiseHouseholdsOnLoanSchema,
  getWardWiseHouseholdsOnLoanSchema,
  batchAddWardWiseHouseholdsOnLoanSchema,
} from "./ward-wise-households-on-loan.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward wise households on loan data with optional filtering
export const getAllWardWiseHouseholdsOnLoan = publicProcedure
  .input(getWardWiseHouseholdsOnLoanSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseholdsOnLoan);

        let conditions = [];

        if (input?.wardId) {
          conditions.push(
            eq(wardWiseHouseholdsOnLoan.wardId, input.wardId),
          );
        }

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseHouseholdsOnLoan.wardNumber, input.wardNumber),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward ID
        data = await queryWithFilters.orderBy(
          wardWiseHouseholdsOnLoan.wardId
        );
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            ward_number::text as ward_id,
            ward_number,
            households
          FROM 
            acme_ward_wise_households_on_loan
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);
        
        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map(row => ({
            id: row.id,
            wardId: row.ward_id,
            wardNumber: parseInt(String(row.ward_number)),
            households: parseInt(String(row.households || '0'))
          }));
          
          // Apply filters if needed
          if (input?.wardId) {
            data = data.filter(item => item.wardId === input.wardId);
          }
          
          if (input?.wardNumber) {
            data = data.filter(item => item.wardNumber === input.wardNumber);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward wise households on loan data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseholdsOnLoanByWard = publicProcedure
  .input(z.object({ wardId: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseholdsOnLoan)
      .where(eq(wardWiseHouseholdsOnLoan.wardId, input.wardId));

    return data;
  });

// Add ward wise households on loan data
export const addWardWiseHouseholdsOnLoan = protectedProcedure
  .input(addWardWiseHouseholdsOnLoanSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can add ward wise households on loan data",
      });
    }

    // Delete existing data for the ward before adding new data
    await ctx.db
      .delete(wardWiseHouseholdsOnLoan)
      .where(eq(wardWiseHouseholdsOnLoan.wardId, input.wardId));

    // Insert new data
    await ctx.db.insert(wardWiseHouseholdsOnLoan).values({
      id: uuidv4(),
      wardId: input.wardId,
      wardNumber: input.wardNumber,
      households: input.households,
    });

    return { success: true };
  });

// Batch add ward wise households on loan data for multiple wards
export const batchAddWardWiseHouseholdsOnLoan = protectedProcedure
  .input(batchAddWardWiseHouseholdsOnLoanSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can batch add ward wise households on loan data",
      });
    }

    // Process each ward data entry
    for (const item of input.data) {
      // Generate a ward ID based on palika and ward number
      const wardId = `${input.palika}-${item.wardNumber}`;

      // Delete existing data for this ward
      await ctx.db
        .delete(wardWiseHouseholdsOnLoan)
        .where(eq(wardWiseHouseholdsOnLoan.wardId, wardId));

      // Insert new data
      await ctx.db.insert(wardWiseHouseholdsOnLoan).values({
        id: uuidv4(),
        wardId: wardId,
        wardNumber: item.wardNumber,
        households: item.households,
      });
    }

    return { success: true };
  });

// Delete ward wise households on loan data for a specific ward
export const deleteWardWiseHouseholdsOnLoan = protectedProcedure
  .input(z.object({ wardId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward wise households on loan data",
      });
    }

    // Delete all data for the ward
    await ctx.db
      .delete(wardWiseHouseholdsOnLoan)
      .where(eq(wardWiseHouseholdsOnLoan.wardId, input.wardId));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseholdsOnLoanSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total count of households on loan across all wards
      const summarySql = sql`
        SELECT 
          SUM(households) as total_households_on_loan
        FROM 
          ward_wise_households_on_loan
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData[0] || { total_households_on_loan: 0 };
    } catch (error) {
      console.error("Error in getWardWiseHouseholdsOnLoanSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward wise households on loan summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseholdsOnLoanRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseholdsOnLoan,
  getByWard: getWardWiseHouseholdsOnLoanByWard,
  add: addWardWiseHouseholdsOnLoan,
  batchAdd: batchAddWardWiseHouseholdsOnLoan,
  delete: deleteWardWiseHouseholdsOnLoan,
  summary: getWardWiseHouseholdsOnLoanSummary,
});
