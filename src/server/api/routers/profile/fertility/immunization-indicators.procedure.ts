import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { immunizationIndicators } from "@/server/db/schema/profile/fertility/immunization-indicators";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import {
  immunizationIndicatorSchema,
  immunizationIndicatorFilterSchema,
  updateImmunizationIndicatorSchema,
  ImmunizationIndicatorTypeEnum,
} from "./immunization-indicators.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all immunization indicators with optional filtering
export const getAllImmunizationIndicators = publicProcedure
  .input(immunizationIndicatorFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(immunizationIndicators);

        let conditions = [];

        if (input?.indicator) {
          conditions.push(
            eq(immunizationIndicators.indicator, input.indicator),
          );
        }

        if (input?.year) {
          conditions.push(eq(immunizationIndicators.year, input.year));
        }

        if (input?.minValue !== undefined) {
          conditions.push(gte(immunizationIndicators.value, input.minValue));
        }

        if (input?.maxValue !== undefined) {
          conditions.push(lte(immunizationIndicators.value, input.maxValue));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by year (desc) and indicator
        data = await queryWithFilters.orderBy(
          desc(immunizationIndicators.year),
          immunizationIndicators.indicator,
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
            indicator,
            year,
            value,
            updated_at,
            created_at
          FROM 
            acme_immunization_indicators
          ORDER BY 
            year DESC, indicator
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            indicator: row.indicator,
            year: parseInt(String(row.year)),
            value: parseFloat(String(row.value)),
            updatedAt: row.updated_at,
            createdAt: row.created_at,
          }));

          // Apply filters if needed
          if (input?.indicator) {
            data = data.filter((item) => item.indicator === input.indicator);
          }

          if (input?.year) {
            data = data.filter((item) => item.year === input.year);
          }

          //   if (input?.minValue !== undefined) {
          //     data = data.filter((item) => item.value >= input.minValue);
          //   }

          //   if (input?.maxValue !== undefined) {
          //     data = data.filter((item) => item.value <= input.maxValue);
          //   }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching immunization indicators data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get immunization indicator by ID
export const getImmunizationIndicatorById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(immunizationIndicators)
      .where(eq(immunizationIndicators.id, input.id))
      .limit(1);

    if (data.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Immunization indicator with ID ${input.id} not found`,
      });
    }

    return data[0];
  });

// Get immunization indicators by year
export const getImmunizationIndicatorsByYear = publicProcedure
  .input(z.object({ year: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(immunizationIndicators)
      .where(eq(immunizationIndicators.year, input.year))
      .orderBy(immunizationIndicators.indicator);

    return data;
  });

// Get immunization indicators by indicator type
export const getImmunizationIndicatorsByType = publicProcedure
  .input(z.object({ indicator: ImmunizationIndicatorTypeEnum }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(immunizationIndicators)
      .where(eq(immunizationIndicators.indicator, input.indicator))
      .orderBy(desc(immunizationIndicators.year));

    return data;
  });

// Create a new immunization indicator entry
export const createImmunizationIndicator = protectedProcedure
  .input(immunizationIndicatorSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create immunization indicator data",
      });
    }

    // Check if entry already exists for this indicator and year
    const existing = await ctx.db
      .select({ id: immunizationIndicators.id })
      .from(immunizationIndicators)
      .where(
        and(
          eq(immunizationIndicators.indicator, input.indicator),
          eq(immunizationIndicators.year, input.year),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for indicator ${input.indicator} and year ${input.year} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(immunizationIndicators).values({
      id: input.id || uuidv4(),
      indicator: input.indicator,
      year: input.year,
      value: input.value,
    });

    return { success: true };
  });

// Update an existing immunization indicator entry
export const updateImmunizationIndicator = protectedProcedure
  .input(updateImmunizationIndicatorSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update immunization indicator data",
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
      .select({ id: immunizationIndicators.id })
      .from(immunizationIndicators)
      .where(eq(immunizationIndicators.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Check if updating would create a duplicate for indicator and year
    if (input.indicator || input.year) {
      const duplicateCheck = await ctx.db
        .select({ id: immunizationIndicators.id })
        .from(immunizationIndicators)
        .where(
          and(
            eq(immunizationIndicators.indicator, input.indicator || ""),
            eq(immunizationIndicators.year, input.year || 0),
            sql`id != ${input.id}`,
          ),
        )
        .limit(1);

      if (duplicateCheck.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Another record with indicator ${input.indicator} and year ${input.year} already exists`,
        });
      }
    }

    // Update the record
    await ctx.db
      .update(immunizationIndicators)
      .set({
        indicator: input.indicator,
        year: input.year,
        value: input.value,
      })
      .where(eq(immunizationIndicators.id, input.id));

    return { success: true };
  });

// Delete an immunization indicator entry
export const deleteImmunizationIndicator = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete immunization indicator data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(immunizationIndicators)
      .where(eq(immunizationIndicators.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getImmunizationIndicatorsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get the most recent year for which we have data
      const latestYearQuery = sql`
        SELECT MAX(year) as latest_year
        FROM immunization_indicators
      `;

      const latestYearResult = await ctx.db.execute(latestYearQuery);
      let latestYear = new Date().getFullYear(); // Default to current year

      if (
        latestYearResult &&
        latestYearResult.length > 0 &&
        latestYearResult[0].latest_year
      ) {
        latestYear = parseInt(String(latestYearResult[0].latest_year));
      }

      // Get key immunization coverage indicators for the latest year
      const keyIndicatorsSql = sql`
        SELECT 
          indicator, 
          value
        FROM 
          immunization_indicators
        WHERE 
          year = ${latestYear}
          AND indicator IN (
            'FULLY_IMMUNIZED_NIP',
            'BCG_UNDER_ONE',
            'DPT_HEP_B_HIB3_UNDER_ONE',
            'OPV3_UNDER_ONE',
            'MR1',
            'INSTITUTIONAL_DELIVERIES',
            'FOUR_ANC_VISITS'
          )
        ORDER BY 
          indicator
      `;

      const keyIndicatorsData = await ctx.db.execute(keyIndicatorsSql);

      // Get trend data for key indicators over the last 5 years
      const trendSql = sql`
        SELECT 
          indicator, 
          year, 
          value
        FROM 
          immunization_indicators
        WHERE 
          year >= ${latestYear - 4}
          AND indicator IN (
            'FULLY_IMMUNIZED_NIP',
            'BCG_UNDER_ONE',
            'INSTITUTIONAL_DELIVERIES'
          )
        ORDER BY 
          indicator, year
      `;

      const trendData = await ctx.db.execute(trendSql);

      return {
        latestYear,
        keyIndicators: keyIndicatorsData,
        trends: trendData,
      };
    } catch (error) {
      console.error("Error in getImmunizationIndicatorsSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve immunization indicators summary",
      });
    }
  },
);

// Export the router with all procedures
export const immunizationIndicatorsRouter = createTRPCRouter({
  getAll: getAllImmunizationIndicators,
  getById: getImmunizationIndicatorById,
  getByYear: getImmunizationIndicatorsByYear,
  getByType: getImmunizationIndicatorsByType,
  create: createImmunizationIndicator,
  update: updateImmunizationIndicator,
  delete: deleteImmunizationIndicator,
  summary: getImmunizationIndicatorsSummary,
});
