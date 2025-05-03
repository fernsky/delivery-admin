import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseMotherTonguePopulation } from "@/server/db/schema/profile/demographics/ward-wise-mother-tongue-population";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseMotherTonguePopulationSchema,
  wardWiseMotherTonguePopulationFilterSchema,
  updateWardWiseMotherTonguePopulationSchema,
  LanguageTypeEnum,
} from "./ward-wise-mother-tongue-population.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise mother tongue population data with optional filtering
export const getAllWardWiseMotherTonguePopulation = publicProcedure
  .input(wardWiseMotherTonguePopulationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseMotherTonguePopulation);

        let conditions = [];

        if (input?.wardId) {
          conditions.push(
            eq(wardWiseMotherTonguePopulation.wardId, input.wardId),
          );
        }

        if (input?.languageType) {
          conditions.push(eq(wardWiseMotherTonguePopulation.languageType, input.languageType));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward ID and language type
        data = await queryWithFilters.orderBy(
          wardWiseMotherTonguePopulation.wardId,
          wardWiseMotherTonguePopulation.languageType,
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
            language_type,
            population
          FROM 
            acme_ward_wise_mother_tongue_population
          ORDER BY 
            ward_number, language_type
        `;
        const acmeResult = await ctx.db.execute(acmeSql);
        
        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map(row => ({
            id: row.id,
            wardId: row.ward_id,
            wardNumber: parseInt(String(row.ward_number)),
            languageType: row.language_type,
            population: parseInt(String(row.population || '0'))
          }));
          
          // Apply filters if needed
          if (input?.wardId) {
            data = data.filter(item => item.wardId === input.wardId);
          }
          
          if (input?.languageType) {
            data = data.filter(item => item.languageType === input.languageType);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise mother tongue population data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseMotherTonguePopulationByWard = publicProcedure
  .input(z.object({ wardId: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseMotherTonguePopulation)
      .where(eq(wardWiseMotherTonguePopulation.wardId, input.wardId))
      .orderBy(wardWiseMotherTonguePopulation.languageType);

    return data;
  });

// Create a new ward-wise mother tongue population entry
export const createWardWiseMotherTonguePopulation = protectedProcedure
  .input(wardWiseMotherTonguePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise mother tongue population data",
      });
    }

    // Check if entry already exists for this ward and language type
    const existing = await ctx.db
      .select({ id: wardWiseMotherTonguePopulation.id })
      .from(wardWiseMotherTonguePopulation)
      .where(
        and(
          eq(wardWiseMotherTonguePopulation.wardId, input.wardId),
          eq(wardWiseMotherTonguePopulation.languageType, input.languageType),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward ID ${input.wardId} and language ${input.languageType} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseMotherTonguePopulation).values({
      id: input.id || uuidv4(),
      wardId: input.wardId,
      languageType: input.languageType,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise mother tongue population entry
export const updateWardWiseMotherTonguePopulation = protectedProcedure
  .input(updateWardWiseMotherTonguePopulationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise mother tongue population data",
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
      .select({ id: wardWiseMotherTonguePopulation.id })
      .from(wardWiseMotherTonguePopulation)
      .where(eq(wardWiseMotherTonguePopulation.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseMotherTonguePopulation)
      .set({
        wardId: input.wardId,
        languageType: input.languageType,
        population: input.population,
      })
      .where(eq(wardWiseMotherTonguePopulation.id, input.id));

    return { success: true };
  });

// Delete a ward-wise mother tongue population entry
export const deleteWardWiseMotherTonguePopulation = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise mother tongue population data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseMotherTonguePopulation)
      .where(eq(wardWiseMotherTonguePopulation.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseMotherTonguePopulationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by language type across all wards
      const summarySql = sql`
        SELECT 
          language_type, 
          SUM(population) as total_population
        FROM 
          ward_wise_mother_tongue_population
        GROUP BY 
          language_type
        ORDER BY 
          language_type
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseMotherTonguePopulationSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise mother tongue population summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseMotherTonguePopulationRouter = createTRPCRouter({
  getAll: getAllWardWiseMotherTonguePopulation,
  getByWard: getWardWiseMotherTonguePopulationByWard,
  create: createWardWiseMotherTonguePopulation,
  update: updateWardWiseMotherTonguePopulation,
  delete: deleteWardWiseMotherTonguePopulation,
  summary: getWardWiseMotherTonguePopulationSummary,
});
