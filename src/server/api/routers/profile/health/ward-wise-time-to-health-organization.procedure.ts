import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseTimeToHealthOrganization } from "@/server/db/schema/profile/health/ward-wise-time-to-health-organization";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseTimeToHealthOrganizationSchema,
  wardWiseTimeToHealthOrganizationFilterSchema,
  updateWardWiseTimeToHealthOrganizationSchema,
  TimeToHealthOrganizationTypeEnum,
} from "./ward-wise-time-to-health-organization.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise time to health organization data with optional filtering
export const getAllWardWiseTimeToHealthOrganization = publicProcedure
  .input(wardWiseTimeToHealthOrganizationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db
          .select()
          .from(wardWiseTimeToHealthOrganization);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(
            eq(wardWiseTimeToHealthOrganization.wardNumber, input.wardNumber),
          );
        }

        if (input?.timeToHealthOrganization) {
          conditions.push(
            eq(
              wardWiseTimeToHealthOrganization.timeToHealthOrganization,
              input.timeToHealthOrganization,
            ),
          );
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and time category
        data = await queryWithFilters.orderBy(
          wardWiseTimeToHealthOrganization.wardNumber,
          wardWiseTimeToHealthOrganization.timeToHealthOrganization,
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
            time_to_health_organization,
            households,
            updated_at,
            created_at
          FROM 
            acme_ward_wise_time_to_health_organization
          ORDER BY 
            ward_number, time_to_health_organization
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            timeToHealthOrganization: row.time_to_health_organization,
            households: parseInt(String(row.households || "0")),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.timeToHealthOrganization) {
            data = data.filter(
              (item) =>
                item.timeToHealthOrganization ===
                input.timeToHealthOrganization,
            );
          }
        }
      }

      return data;
    } catch (error) {
      console.error(
        "Error fetching ward-wise time to health organization data:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseTimeToHealthOrganizationByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseTimeToHealthOrganization)
      .where(eq(wardWiseTimeToHealthOrganization.wardNumber, input.wardNumber))
      .orderBy(wardWiseTimeToHealthOrganization.timeToHealthOrganization);

    return data;
  });

// Create a new ward-wise time to health organization entry
export const createWardWiseTimeToHealthOrganization = protectedProcedure
  .input(wardWiseTimeToHealthOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can create ward-wise time to health organization data",
      });
    }

    // Check if entry already exists for this ward and time category
    const existing = await ctx.db
      .select({ id: wardWiseTimeToHealthOrganization.id })
      .from(wardWiseTimeToHealthOrganization)
      .where(
        and(
          eq(wardWiseTimeToHealthOrganization.wardNumber, input.wardNumber),
          eq(
            wardWiseTimeToHealthOrganization.timeToHealthOrganization,
            input.timeToHealthOrganization,
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and time category ${input.timeToHealthOrganization} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseTimeToHealthOrganization).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      timeToHealthOrganization: input.timeToHealthOrganization,
      households: input.households,
    });

    return { success: true };
  });

// Update an existing ward-wise time to health organization entry
export const updateWardWiseTimeToHealthOrganization = protectedProcedure
  .input(updateWardWiseTimeToHealthOrganizationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can update ward-wise time to health organization data",
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
      .select({ id: wardWiseTimeToHealthOrganization.id })
      .from(wardWiseTimeToHealthOrganization)
      .where(eq(wardWiseTimeToHealthOrganization.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseTimeToHealthOrganization)
      .set({
        wardNumber: input.wardNumber,
        timeToHealthOrganization: input.timeToHealthOrganization,
        households: input.households,
      })
      .where(eq(wardWiseTimeToHealthOrganization.id, input.id));

    return { success: true };
  });

// Delete a ward-wise time to health organization entry
export const deleteWardWiseTimeToHealthOrganization = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message:
          "Only administrators can delete ward-wise time to health organization data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseTimeToHealthOrganization)
      .where(eq(wardWiseTimeToHealthOrganization.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseTimeToHealthOrganizationSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total counts by time category across all wards
      const summarySql = sql`
        SELECT 
          time_to_health_organization, 
          SUM(households) as total_households
        FROM 
          acme_ward_wise_time_to_health_organization
        GROUP BY 
          time_to_health_organization
        ORDER BY 
          time_to_health_organization
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error(
        "Error in getWardWiseTimeToHealthOrganizationSummary:",
        error,
      );
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Failed to retrieve ward-wise time to health organization summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseTimeToHealthOrganizationRouter = createTRPCRouter({
  getAll: getAllWardWiseTimeToHealthOrganization,
  getByWard: getWardWiseTimeToHealthOrganizationByWard,
  create: createWardWiseTimeToHealthOrganization,
  update: updateWardWiseTimeToHealthOrganization,
  delete: deleteWardWiseTimeToHealthOrganization,
  summary: getWardWiseTimeToHealthOrganizationSummary,
});
