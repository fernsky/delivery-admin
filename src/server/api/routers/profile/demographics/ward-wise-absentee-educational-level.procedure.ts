import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseAbsenteeEducationalLevel } from "@/server/db/schema/profile/demographics/ward-wise-absentee-educational-level";
import { wardWiseDemographicSummary } from "@/server/db/schema/profile/demographics/ward-wise-demographic-summary";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import {
  wardWiseAbsenteeEducationalLevelSchema,
  wardWiseAbsenteeEducationalLevelFilterSchema,
  updateWardWiseAbsenteeEducationalLevelSchema,
  bulkWardWiseAbsenteeEducationalLevelSchema,
} from "./ward-wise-absentee-educational-level.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise absentee educational level data with optional filtering
export const getAllWardWiseAbsenteeEducationalLevel = publicProcedure
  .input(wardWiseAbsenteeEducationalLevelFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const baseQuery = ctx.db
        .select({
          id: wardWiseAbsenteeEducationalLevel.id,
          wardId: wardWiseAbsenteeEducationalLevel.wardId,
          wardNumber: wardWiseDemographicSummary.wardNumber,
          educationalLevel: wardWiseAbsenteeEducationalLevel.educationalLevel,
          population: wardWiseAbsenteeEducationalLevel.population,
          createdAt: wardWiseAbsenteeEducationalLevel.createdAt,
          updatedAt: wardWiseAbsenteeEducationalLevel.updatedAt,
        })
        .from(wardWiseAbsenteeEducationalLevel)
        .leftJoin(
          wardWiseDemographicSummary, 
          eq(wardWiseAbsenteeEducationalLevel.wardId, wardWiseDemographicSummary.id)
        );

      let conditions = [];

      if (input?.wardId) {
        conditions.push(
          eq(wardWiseAbsenteeEducationalLevel.wardId, input.wardId),
        );
      }

      if (input?.educationalLevel) {
        conditions.push(
          eq(wardWiseAbsenteeEducationalLevel.educationalLevel, input.educationalLevel),
        );
      }

      const queryWithFilters = conditions.length
        ? baseQuery.where(and(...conditions))
        : baseQuery;

      // Sort by educational level
      const data = await queryWithFilters.orderBy(
        wardWiseAbsenteeEducationalLevel.educationalLevel,
      );

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise absentee educational level data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get ward-wise absentee educational level data for a specific ward
export const getWardWiseAbsenteeEducationalLevelByWard = publicProcedure
  .input(z.object({ wardId: z.string() }))
  .query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db
        .select()
        .from(wardWiseAbsenteeEducationalLevel)
        .where(eq(wardWiseAbsenteeEducationalLevel.wardId, input.wardId))
        .orderBy(wardWiseAbsenteeEducationalLevel.educationalLevel);

      return data;
    } catch (error) {
      console.error("Error fetching ward absentee educational level data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward absentee educational level data",
      });
    }
  });

// Create a new ward-wise absentee educational level entry
export const createWardWiseAbsenteeEducationalLevel = protectedProcedure
  .input(wardWiseAbsenteeEducationalLevelSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward absentee educational level data",
      });
    }

    // Check if the ward exists
    const ward = await ctx.db
      .select({ id: wardWiseDemographicSummary.id })
      .from(wardWiseDemographicSummary)
      .where(eq(wardWiseDemographicSummary.id, input.wardId))
      .limit(1);

    if (ward.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Referenced ward does not exist",
      });
    }

    // Check if entry for this ward and educational level already exists
    const existing = await ctx.db
      .select({ id: wardWiseAbsenteeEducationalLevel.id })
      .from(wardWiseAbsenteeEducationalLevel)
      .where(and(
        eq(wardWiseAbsenteeEducationalLevel.wardId, input.wardId),
        eq(wardWiseAbsenteeEducationalLevel.educationalLevel, input.educationalLevel)
      ))
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for this ward and educational level already exists`,
      });
    }

    const recordToInsert = {
      id: input.id || uuidv4(),
      wardId: input.wardId,
      educationalLevel: input.educationalLevel,
      population: input.population,
    };

    // Create new record
    await ctx.db.insert(wardWiseAbsenteeEducationalLevel).values(recordToInsert);

    return { success: true, id: recordToInsert.id };
  });

// Bulk create ward-wise absentee educational level entries
export const bulkCreateWardWiseAbsenteeEducationalLevel = protectedProcedure
  .input(bulkWardWiseAbsenteeEducationalLevelSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward absentee educational level data",
      });
    }

    // Check if the ward exists
    const ward = await ctx.db
      .select({ id: wardWiseDemographicSummary.id })
      .from(wardWiseDemographicSummary)
      .where(eq(wardWiseDemographicSummary.id, input.wardId))
      .limit(1);

    if (ward.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Referenced ward does not exist",
      });
    }

    // Extract educational levels from input
    const educationalLevels = input.educationalLevels.map(
      (item) => item.educationalLevel
    );

    // Check if any entries for this ward and educational levels already exist
    const existing = await ctx.db
      .select({ educationalLevel: wardWiseAbsenteeEducationalLevel.educationalLevel })
      .from(wardWiseAbsenteeEducationalLevel)
      .where(and(
        eq(wardWiseAbsenteeEducationalLevel.wardId, input.wardId),
        inArray(wardWiseAbsenteeEducationalLevel.educationalLevel, educationalLevels)
      ));

    // If duplicates found, prevent the operation
    if (existing.length > 0) {
      const duplicates = existing.map(e => e.educationalLevel).join(', ');
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data already exists for these educational levels: ${duplicates}`,
      });
    }

    // Prepare records for bulk insertion
    const recordsToInsert = input.educationalLevels.map((item) => ({
      id: uuidv4(),
      wardId: input.wardId,
      educationalLevel: item.educationalLevel,
      population: item.population,
    }));

    // Insert all records
    await ctx.db.insert(wardWiseAbsenteeEducationalLevel).values(recordsToInsert);

    return { success: true, count: recordsToInsert.length };
  });

// Update an existing ward-wise absentee educational level entry
export const updateWardWiseAbsenteeEducationalLevel = protectedProcedure
  .input(updateWardWiseAbsenteeEducationalLevelSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward absentee educational level data",
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
      .select({ id: wardWiseAbsenteeEducationalLevel.id })
      .from(wardWiseAbsenteeEducationalLevel)
      .where(eq(wardWiseAbsenteeEducationalLevel.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Check if educational level is being changed and if it would create a duplicate
    if (input.educationalLevel) {
      const potentialDuplicate = await ctx.db
        .select({ id: wardWiseAbsenteeEducationalLevel.id })
        .from(wardWiseAbsenteeEducationalLevel)
        .where(and(
          eq(wardWiseAbsenteeEducationalLevel.wardId, input.wardId),
          eq(wardWiseAbsenteeEducationalLevel.educationalLevel, input.educationalLevel),
          sql`${wardWiseAbsenteeEducationalLevel.id} != ${input.id}`
        ))
        .limit(1);

      if (potentialDuplicate.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This educational level already exists for this ward",
        });
      }
    }

    // Prepare update data
    const updateData = {
      wardId: input.wardId,
      educationalLevel: input.educationalLevel,
      population: input.population,
    };

    // Update the record
    await ctx.db
      .update(wardWiseAbsenteeEducationalLevel)
      .set(updateData)
      .where(eq(wardWiseAbsenteeEducationalLevel.id, input.id));

    return { success: true };
  });

// Delete a ward-wise absentee educational level entry
export const deleteWardWiseAbsenteeEducationalLevel = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward absentee educational level data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseAbsenteeEducationalLevel)
      .where(eq(wardWiseAbsenteeEducationalLevel.id, input.id));

    return { success: true };
  });

// Export the router with all procedures
export const wardWiseAbsenteeEducationalLevelRouter = createTRPCRouter({
  getAll: getAllWardWiseAbsenteeEducationalLevel,
  getByWard: getWardWiseAbsenteeEducationalLevelByWard,
  create: createWardWiseAbsenteeEducationalLevel,
  bulkCreate: bulkCreateWardWiseAbsenteeEducationalLevel,
  update: updateWardWiseAbsenteeEducationalLevel,
  delete: deleteWardWiseAbsenteeEducationalLevel,
});
