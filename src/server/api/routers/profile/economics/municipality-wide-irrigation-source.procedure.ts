import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { municipalityWideIrrigationSource } from "@/server/db/schema/profile/economics/municipality-wide-irrigation-source";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  municipalityWideIrrigationSourceSchema,
  municipalityWideIrrigationSourceFilterSchema,
  updateMunicipalityWideIrrigationSourceSchema,
  IrrigationSourceEnum,
} from "./municipality-wide-irrigation-source.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all municipality-wide irrigation source data with optional filtering
export const getAllMunicipalityWideIrrigationSource = publicProcedure
  .input(municipalityWideIrrigationSourceFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(municipalityWideIrrigationSource);

        let conditions = [];

        if (input?.irrigationSource) {
          conditions.push(
            eq(municipalityWideIrrigationSource.irrigationSource, input.irrigationSource),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by coverage area (descending)
        data = await queryWithFilters.orderBy(desc(municipalityWideIrrigationSource.coverageInHectares));
      } catch (err) {
        console.log("Failed to query main schema, trying ACME table:", err);
        data = [];
      }

      // If no data from main schema, try the ACME table
      if (!data || data.length === 0) {
        const acmeSql = sql`
          SELECT 
            id,
            irrigation_source,
            coverage_in_hectares,
            percentage,
            updated_at,
            created_at
          FROM 
            acme_municipality_wide_irrigation_source
          ORDER BY 
            CASE 
              WHEN irrigation_source = 'TOTAL' THEN 1
              ELSE 0
            END,
            coverage_in_hectares DESC
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            irrigationSource: row.irrigation_source,
            coverageInHectares: parseFloat(String(row.coverage_in_hectares || "0")),
            percentage: parseFloat(String(row.percentage || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.irrigationSource) {
            data = data.filter((item) => item.irrigationSource === input.irrigationSource);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching municipality-wide irrigation source data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Create a new municipality-wide irrigation source entry
export const createMunicipalityWideIrrigationSource = protectedProcedure
  .input(municipalityWideIrrigationSourceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create municipality-wide irrigation source data",
      });
    }

    // Check if entry already exists for this irrigation source
    const existing = await ctx.db
      .select({ id: municipalityWideIrrigationSource.id })
      .from(municipalityWideIrrigationSource)
      .where(eq(municipalityWideIrrigationSource.irrigationSource, input.irrigationSource))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for irrigation source ${input.irrigationSource} already exists`,
      });
    }

    // Calculate percentage if not provided
    let percentage = input.percentage || 0;
    
    if (!input.percentage) {
      // Get the total irrigation coverage to calculate percentage
      const totalQuery = await ctx.db
        .select({
          total: municipalityWideIrrigationSource.coverageInHectares,
        })
        .from(municipalityWideIrrigationSource)
        .where(eq(municipalityWideIrrigationSource.irrigationSource, "TOTAL"))
        .limit(1);

      if (totalQuery.length > 0) {
        const totalCoverage = parseFloat(String(totalQuery[0].total || "0"));
        if (totalCoverage > 0) {
          percentage = (input.coverageInHectares / totalCoverage) * 100;
        }
      }
    }

    // Create new record
    await ctx.db.insert(municipalityWideIrrigationSource).values({
      id: input.id || uuidv4(),
      irrigationSource: input.irrigationSource,
      coverageInHectares: input.coverageInHectares.toString(),
      percentage: percentage.toString(),
    });

    return { success: true };
  });

// Update an existing municipality-wide irrigation source entry
export const updateMunicipalityWideIrrigationSource = protectedProcedure
  .input(updateMunicipalityWideIrrigationSourceSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update municipality-wide irrigation source data",
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
      .select({ id: municipalityWideIrrigationSource.id })
      .from(municipalityWideIrrigationSource)
      .where(eq(municipalityWideIrrigationSource.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Calculate percentage if not provided
    let percentage = input.percentage || 0;
    
    if (!input.percentage) {
      // Get the total irrigation coverage to calculate percentage
      const totalQuery = await ctx.db
        .select({
          total: municipalityWideIrrigationSource.coverageInHectares,
        })
        .from(municipalityWideIrrigationSource)
        .where(eq(municipalityWideIrrigationSource.irrigationSource, "TOTAL"))
        .limit(1);

      if (totalQuery.length > 0) {
        const totalCoverage = parseFloat(String(totalQuery[0].total || "0"));
        if (totalCoverage > 0) {
          percentage = (input.coverageInHectares / totalCoverage) * 100;
        }
      }
    }

    // Update the record
    await ctx.db
      .update(municipalityWideIrrigationSource)
      .set({
        irrigationSource: input.irrigationSource,
        coverageInHectares: input.coverageInHectares.toString(),
        percentage: percentage.toString(),
      })
      .where(eq(municipalityWideIrrigationSource.id, input.id));

    return { success: true };
  });

// Delete a municipality-wide irrigation source entry
export const deleteMunicipalityWideIrrigationSource = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete municipality-wide irrigation source data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(municipalityWideIrrigationSource)
      .where(eq(municipalityWideIrrigationSource.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getMunicipalityWideIrrigationSourceSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get summary data - total irrigated area by source
      const summarySql = sql`
        SELECT 
          SUM(coverage_in_hectares) as total_irrigated_area
        FROM 
          acme_municipality_wide_irrigation_source
        WHERE 
          irrigation_source != 'TOTAL'
      `;

      const summaryData = await ctx.db.execute(summarySql);

      // Get percentage distribution data
      const distributionSql = sql`
        SELECT 
          irrigation_source, 
          coverage_in_hectares,
          percentage
        FROM 
          acme_municipality_wide_irrigation_source
        ORDER BY
          CASE 
            WHEN irrigation_source = 'TOTAL' THEN 1
            ELSE 0
          END,
          coverage_in_hectares DESC
      `;

      const distributionData = await ctx.db.execute(distributionSql);

      return {
        summary: summaryData[0],
        distribution: distributionData,
      };
    } catch (error) {
      console.error("Error in getMunicipalityWideIrrigationSourceSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve municipality-wide irrigation source summary",
      });
    }
  },
);

// Export the router with all procedures
export const municipalityWideIrrigationSourceRouter = createTRPCRouter({
  getAll: getAllMunicipalityWideIrrigationSource,
  create: createMunicipalityWideIrrigationSource,
  update: updateMunicipalityWideIrrigationSource,
  delete: deleteMunicipalityWideIrrigationSource,
  summary: getMunicipalityWideIrrigationSourceSummary,
});
