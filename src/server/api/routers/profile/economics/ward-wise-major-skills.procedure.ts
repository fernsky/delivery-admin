import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { wardWiseMajorSkills } from "@/server/db/schema/profile/economics/ward-wise-major-skills";
import { eq, and, desc, sql } from "drizzle-orm";
import {
  wardWiseMajorSkillsSchema,
  wardWiseMajorSkillsFilterSchema,
  updateWardWiseMajorSkillsSchema,
  skillTypeEnum,
} from "./ward-wise-major-skills.schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Get all ward-wise major skills data with optional filtering
export const getAllWardWiseMajorSkills = publicProcedure
  .input(wardWiseMajorSkillsFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding explicitly before running query
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // First try querying the main schema table
      let data: any[];
      try {
        // Build query with conditions
        const baseQuery = ctx.db.select().from(wardWiseMajorSkills);

        let conditions = [];

        if (input?.wardNumber) {
          conditions.push(eq(wardWiseMajorSkills.wardNumber, input.wardNumber));
        }

        if (input?.skill) {
          conditions.push(eq(wardWiseMajorSkills.skill, input.skill));
        }

        const queryWithFilters = conditions.length
          ? baseQuery.where(and(...conditions))
          : baseQuery;

        // Sort by ward number and skill
        data = await queryWithFilters.orderBy(
          wardWiseMajorSkills.wardNumber,
          wardWiseMajorSkills.skill,
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
            skill,
            population
          FROM 
            acme_ward_wise_major_skills
          ORDER BY 
            ward_number, skill
        `;
        const acmeResult = await ctx.db.execute(acmeSql);

        if (acmeResult && Array.isArray(acmeResult) && acmeResult.length > 0) {
          // Transform ACME data to match expected schema
          data = acmeResult.map((row) => ({
            id: row.id,
            wardNumber: parseInt(String(row.ward_number)),
            skill: row.skill,
            population: parseInt(String(row.population || "0")),
          }));

          // Apply filters if needed
          if (input?.wardNumber) {
            data = data.filter((item) => item.wardNumber === input.wardNumber);
          }

          if (input?.skill) {
            data = data.filter((item) => item.skill === input.skill);
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error fetching ward-wise major skills data:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve data",
      });
    }
  });

// Get data for a specific ward
export const getWardWiseMajorSkillsByWard = publicProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const data = await ctx.db
      .select()
      .from(wardWiseMajorSkills)
      .where(eq(wardWiseMajorSkills.wardNumber, input.wardNumber));

    return data;
  });

// Create a new ward-wise major skills entry
export const createWardWiseMajorSkills = protectedProcedure
  .input(wardWiseMajorSkillsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create ward-wise major skills data",
      });
    }

    // Check if entry already exists for this ward and skill
    const existing = await ctx.db
      .select({ id: wardWiseMajorSkills.id })
      .from(wardWiseMajorSkills)
      .where(
        and(
          eq(wardWiseMajorSkills.wardNumber, input.wardNumber),
          eq(wardWiseMajorSkills.skill, input.skill),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Data for Ward Number ${input.wardNumber} and skill ${input.skill} already exists`,
      });
    }

    // Create new record
    await ctx.db.insert(wardWiseMajorSkills).values({
      id: input.id || uuidv4(),
      wardNumber: input.wardNumber,
      skill: input.skill,
      population: input.population,
    });

    return { success: true };
  });

// Update an existing ward-wise major skills entry
export const updateWardWiseMajorSkills = protectedProcedure
  .input(updateWardWiseMajorSkillsSchema)
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update ward-wise major skills data",
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
      .select({ id: wardWiseMajorSkills.id })
      .from(wardWiseMajorSkills)
      .where(eq(wardWiseMajorSkills.id, input.id))
      .limit(1);

    if (existing.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Record with ID ${input.id} not found`,
      });
    }

    // Update the record
    await ctx.db
      .update(wardWiseMajorSkills)
      .set({
        wardNumber: input.wardNumber,
        skill: input.skill,
        population: input.population,
      })
      .where(eq(wardWiseMajorSkills.id, input.id));

    return { success: true };
  });

// Delete a ward-wise major skills entry
export const deleteWardWiseMajorSkills = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    // Check if user has appropriate permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete ward-wise major skills data",
      });
    }

    // Delete the record
    await ctx.db
      .delete(wardWiseMajorSkills)
      .where(eq(wardWiseMajorSkills.id, input.id));

    return { success: true };
  });

// Get summary statistics
export const getWardWiseMajorSkillsSummary = publicProcedure.query(
  async ({ ctx }) => {
    try {
      // Get total population by skill across all wards
      const summarySql = sql`
        SELECT 
          skill,
          SUM(population) as total_population
        FROM 
          acme_ward_wise_major_skills
        GROUP BY
          skill
        ORDER BY
          total_population DESC
      `;

      const summaryData = await ctx.db.execute(summarySql);

      return summaryData;
    } catch (error) {
      console.error("Error in getWardWiseMajorSkillsSummary:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve ward-wise major skills summary",
      });
    }
  },
);

// Export the router with all procedures
export const wardWiseMajorSkillsRouter = createTRPCRouter({
  getAll: getAllWardWiseMajorSkills,
  getByWard: getWardWiseMajorSkillsByWard,
  create: createWardWiseMajorSkills,
  update: updateWardWiseMajorSkills,
  delete: deleteWardWiseMajorSkills,
  summary: getWardWiseMajorSkillsSummary,
});
