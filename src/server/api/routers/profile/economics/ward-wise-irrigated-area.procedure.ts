import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseIrrigatedArea } from "@/server/db/schema/profile/economics/ward-wise-irrigated-area";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseIrrigatedAreaSchema,
  wardWiseIrrigatedAreaFilterSchema,
  updateWardWiseIrrigatedAreaSchema,
} from "./ward-wise-irrigated-area.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise irrigated area data with optional filtering
export const getAllWardWiseIrrigatedArea = publicProcedure
  .input(wardWiseIrrigatedAreaFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseIrrigatedArea);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(eq(wardWiseIrrigatedArea.wardNumber, input.wardNumber));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number
        data = await queryWithFilters.orderBy(wardWiseIrrigatedArea.wardNumber);
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
            irrigated_area_hectares,
            unirrigated_area_hectares,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_irrigated_area
          ORDER BY 
            ward_number
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            irrigatedAreaHectares: parseFloat(String(row.irrigated_area_hectares || "0")),
            unirrigatedAreaHectares: parseFloat(String(row.unirrigated_area_hectares || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise irrigated area data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseIrrigatedAreaByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseIrrigatedArea)
      .where(eq(wardWiseIrrigatedArea.wardNumber, input.wardNumber));

    return data;
  });

// Create a new ward-wise irrigated area entry
export const createWardWiseIrrigatedArea = protectedProcedure
  .input(wardWiseIrrigatedAreaSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise irrigated area data",
      });
    }

    // Check if entry already exists for this ward
    const existing = await ctx.db
      .select({ id: wardWiseIrrigatedArea.id })
      .from(wardWiseIrrigatedArea)
      .where(eq(wardWiseIrrigatedArea.wardNumber, input.wardNumber))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseIrrigatedArea).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      irrigatedAreaHectares: input.irrigatedAreaHectares.toString(),
      unirrigatedAreaHectares: input.unirrigatedAreaHectares.toString(),
    });

    return { success: true };
  });

// Update an existing ward-wise irrigated area entry
export const updateWardWiseIrrigatedArea = protectedProcedure
  .input(updateWardWiseIrrigatedAreaSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise irrigated area data",
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
      .select({ id: wardWiseIrrigatedArea.id })
      .from(wardWiseIrrigatedArea)
      .where(eq(wardWiseIrrigatedArea.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseIrrigatedArea)
      .set({
        wardNumber: input.wardNumber,
        irrigatedAreaHectares: input.irrigatedAreaHectares.toString(),
        unirrigatedAreaHectares: input.unirrigatedAreaHectares.toString(),
      })
      .where(eq(wardWiseIrrigatedArea.id, input.id));

    return { success: true };
  });

// Delete a ward-wise irrigated area entry
export const deleteWardWiseIrrigatedArea = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise irrigated area data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseIrrigatedArea)
      .where(eq(wardWiseIrrigatedArea.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseIrrigatedAreaSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total irrigated and unirrigated area across all wards
      const summarySql = sql`
        SELECT 
          SUM(irrigated_area_hectares) as total_irrigated_area,
          SUM(unirrigated_area_hectares) as total_unirrigated_area,
          SUM(irrigated_area_hectares + unirrigated_area_hectares) as total_area
        FROM 
          acme_ward_wise_irrigated_area
        WHERE
          ward_number < 9
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData[0];
    } catch (error) {
      console.error("Error in getWardWiseIrrigatedAreaSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise irrigated area summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseIrrigatedAreaRouter = createTRPCRouter({
  getAll: getAllWardWiseIrrigatedArea,
  getByWard: getWardWiseIrrigatedAreaByWard,
  create: createWardWiseIrrigatedArea,
  update: updateWardWiseIrrigatedArea,
  delete: deleteWardWiseIrrigatedArea,
  summary: getWardWiseIrrigatedAreaSummary,
});
