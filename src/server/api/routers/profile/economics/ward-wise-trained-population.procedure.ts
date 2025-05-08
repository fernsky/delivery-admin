import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { 
  wardWiseTrainedPopulation,
  acmeWardWiseTrainedPopulation 
} from "@/server/db/schema/profile/economics/ward-wise-trained-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseTrainedPopulationSchema,
  wardWiseTrainedPopulationFilterSchema,
  updateWardWiseTrainedPopulationSchema,
} from "./ward-wise-trained-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise trained population data with optional filtering
export const getAllWardWiseTrainedPopulation = publicProcedure
  .input(wardWiseTrainedPopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseTrainedPopulation);

        let conditions = [];

        if (input?.wardId) {
          conditions.push(
            eq(wardWiseTrainedPopulation.wardId, input.wardId),
          );
        }

        if (input?.wardNumber) {
          conditions.push(eq(wardWiseTrainedPopulation.wardNumber, input.wardNumber));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward ID
        data = await queryWithFilters.orderBy(
          wardWiseTrainedPopulation.wardId
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
            trained_population
          FROM 
            acme_ward_wise_trained_population
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
            trainedPopulation: parseInt(String(row.trained_population || '0'))
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
      console.error("Error fetching ward-wise trained population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseTrainedPopulationByWard = publicProcedure
  .input(z.object({ wardId: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseTrainedPopulation)
      .where(eq(wardWiseTrainedPopulation.wardId, input.wardId));

    return data;
  });

// Create a new ward-wise trained population entry
export const createWardWiseTrainedPopulation = protectedProcedure
  .input(wardWiseTrainedPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise trained population data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseTrainedPopulation.id })
      .from(wardWiseTrainedPopulation)
      .where(
        eq(wardWiseTrainedPopulation.wardId, input.wardId)
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward ID ${input.wardId} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseTrainedPopulation).values({
      id: input.id || uuidv4(),
      wardId: input.wardId,
      wardNumber: input.wardNumber,
      trainedPopulation: input.trainedPopulation,
    });

    return { success: true };
  });

// Update an existing ward-wise trained population entry
export const updateWardWiseTrainedPopulation = protectedProcedure
  .input(updateWardWiseTrainedPopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise trained population data",
      });
    }

    if (!input.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "ID is required for update",
      });
    }

    // Check if the record exists
    const existing = await ctx.db
      .select({ id: wardWiseTrainedPopulation.id })
      .from(wardWiseTrainedPopulation)
      .where(eq(wardWiseTrainedPopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseTrainedPopulation)
      .set({
        wardId: input.wardId,
        wardNumber: input.wardNumber,
        trainedPopulation: input.trainedPopulation,
      })
      .where(eq(wardWiseTrainedPopulation.id, input.id));

    return { success: true };
  });

// Delete a ward-wise trained population entry
export const deleteWardWiseTrainedPopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise trained population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseTrainedPopulation)
      .where(eq(wardWiseTrainedPopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseTrainedPopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total trained population across all wards
      const summarySql = sql`
        SELECT 
          SUM(trained_population) as total_trained_population
        FROM 
          ward_wise_trained_population
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseTrainedPopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise trained population summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseTrainedPopulationRouter = createTRPCRouter({
  getAll: getAllWardWiseTrainedPopulation,
  getByWard: getWardWiseTrainedPopulationByWard,
  create: createWardWiseTrainedPopulation,
  update: updateWardWiseTrainedPopulation,
  delete: deleteWardWiseTrainedPopulation,
  summary: getWardWiseTrainedPopulationSummary,
});
