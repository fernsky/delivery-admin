import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { 
  wardWiseHouseholdLandPossessions,
  acmeWardWiseHouseholdLandPossessions 
} from "@/server/db/schema/profile/economics/ward-wise-household-land-possessions";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseHouseholdLandPossessionsBaseSchema,
  addWardWiseHouseholdLandPossessionsSchema,
  getWardWiseHouseholdLandPossessionsSchema,
  batchAddWardWiseHouseholdLandPossessionsSchema,
  updateWardWiseHouseholdLandPossessionsSchema,
  deleteWardWiseHouseholdLandPossessionsSchema,
} from "./ward-wise-household-land-possessions.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise household land possessions with optional filtering
export const getAllWardWiseHouseholdLandPossessions = publicProcedure
  .input(getWardWiseHouseholdLandPossessionsSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseHouseholdLandPossessions);

        let conditions = [];

        if (input?.wardId) {
          conditions.push(
            eq(wardWiseHouseholdLandPossessions.wardId, input.wardId),
          );
        }

        if (input?.wardNumber) {
          conditions.push(eq(wardWiseHouseholdLandPossessions.wardNumber, input.wardNumber));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward ID
        data = await queryWithFilters.orderBy(
          wardWiseHouseholdLandPossessions.wardId
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
            ward_number,
            households
          FROM 
            acme_ward_wise_household_land_possessions
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);
        
        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map(row => ({
            id: row.id,
            wardId: String(row.ward_number),
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
      console.error("Error fetching ward-wise household land possessions data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseHouseholdLandPossessionsByWard = publicProcedure
  .input(z.object({ wardId: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseHouseholdLandPossessions)
      .where(eq(wardWiseHouseholdLandPossessions.wardId, input.wardId));

    return data;
  });

// Create a new ward-wise household land possessions entry
export const createWardWiseHouseholdLandPossessions = protectedProcedure
  .input(addWardWiseHouseholdLandPossessionsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise household land possessions data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseHouseholdLandPossessions.id })
      .from(wardWiseHouseholdLandPossessions)
      .where(eq(wardWiseHouseholdLandPossessions.wardId, input.wardId))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward ID ${input.wardId} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseHouseholdLandPossessions).values({
      id: uuidv4(),
      wardId: input.wardId,
      wardNumber: input.wardNumber,
      households: input.households,
    });

    return { success: true };
  });

// Batch add ward-wise household land possessions entries
export const batchAddWardWiseHouseholdLandPossessions = protectedProcedure
  .input(batchAddWardWiseHouseholdLandPossessionsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can batch add ward-wise household land possessions data",
      });
    }

    try {
      // Insert all records in a batch
      for (const item of input.data) {
        // Creating a wardId from palika and ward number
        const wardId = `${input.palika}-${item.wardNumber}`;
        
        // Check if entry already exists for this ward
        const existing = await ctx.db
          .select({ id: wardWiseHouseholdLandPossessions.id })
          .from(wardWiseHouseholdLandPossessions)
          .where(eq(wardWiseHouseholdLandPossessions.wardId, wardId))
          .limit(1);

        if (existing.length > 0) {
          // Update existing record
          await ctx.db
            .update(wardWiseHouseholdLandPossessions)
            .set({ households: item.households })
            .where(eq(wardWiseHouseholdLandPossessions.wardId, wardId));
        } else {
          // Create new record
          await ctx.db.insert(wardWiseHouseholdLandPossessions).values({
            id: uuidv4(),
            wardId: wardId,
            wardNumber: item.wardNumber,
            households: item.households,
          });
        }
      }

      return { success: true, count: input.data.length };
    } catch (error) {
      console.error("Error in batch add:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to batch add ward-wise household land possessions data",
      });
    }
  });

// Update an existing ward-wise household land possessions entry
export const updateWardWiseHouseholdLandPossessions = protectedProcedure
  .input(updateWardWiseHouseholdLandPossessionsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise household land possessions data",
      });
    }

    // Check if the record exists
    const existing = await ctx.db
      .select({ id: wardWiseHouseholdLandPossessions.id })
      .from(wardWiseHouseholdLandPossessions)
      .where(eq(wardWiseHouseholdLandPossessions.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseHouseholdLandPossessions)
      .set({
        households: input.households,
      })
      .where(eq(wardWiseHouseholdLandPossessions.id, input.id));

    return { success: true };
  });

// Delete a ward-wise household land possessions entry
export const deleteWardWiseHouseholdLandPossessions = protectedProcedure
  .input(deleteWardWiseHouseholdLandPossessionsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise household land possessions data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseHouseholdLandPossessions)
      .where(eq(wardWiseHouseholdLandPossessions.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseHouseholdLandPossessionsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total households across all wards
      const summarySql = sql`
        SELECT 
          SUM(households) as total_households,
          COUNT(*) as total_wards
        FROM 
          ward_wise_household_land_possessions
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData[0] || { total_households: 0, total_wards: 0 };
    } catch (error) {
      console.error("Error in getWardWiseHouseholdLandPossessionsSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise household land possessions summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseHouseholdLandPossessionsRouter = createTRPCRouter({
  getAll: getAllWardWiseHouseholdLandPossessions,
  getByWard: getWardWiseHouseholdLandPossessionsByWard,
  create: createWardWiseHouseholdLandPossessions,
  batchAdd: batchAddWardWiseHouseholdLandPossessions,
  update: updateWardWiseHouseholdLandPossessions,
  delete: deleteWardWiseHouseholdLandPossessions,
  summary: getWardWiseHouseholdLandPossessionsSummary,
});
