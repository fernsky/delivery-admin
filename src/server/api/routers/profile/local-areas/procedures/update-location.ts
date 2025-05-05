import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { location } from "@/server/db/schema/profile/institutions/local-areas/location";
import { eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

// Define enum for location types
const locationEnum = ["VILLAGE", "SETTLEMENT", "TOLE", "WARD", "SQUATTER_AREA"];

// Define schema for geometry input
const pointGeometrySchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
});

const polygonGeometrySchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
});

// Define schema for location update
const locationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(locationEnum as [string, ...string[]]),
  isNewSettlement: z.boolean().optional(),
  isTownPlanned: z.boolean().optional(),
  pointGeometry: pointGeometrySchema.optional(),
  polygonGeometry: polygonGeometrySchema.optional(),
  parentId: z.string().optional(),
});

// Update a location
export const updateLocation = protectedProcedure
  .input(locationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can update locations",
      });
    }

    try {
      // Check if location exists
      const existing = await ctx.db
        .select({ id: location.id })
        .from(location)
        .where(eq(location.id, input.id));

      if (existing.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Location not found",
        });
      }

      // Process point geometry if provided
      let pointGeometryValue = undefined;
      if (input.pointGeometry) {
        const pointGeoJson = JSON.stringify(input.pointGeometry);
        try {
          JSON.parse(pointGeoJson); // Validate JSON
          pointGeometryValue = sql`ST_GeomFromGeoJSON(${pointGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid point geometry GeoJSON",
          });
        }
      }

      // Process polygon geometry if provided
      let polygonGeometryValue = undefined;
      if (input.polygonGeometry) {
        const polygonGeoJson = JSON.stringify(input.polygonGeometry);
        try {
          JSON.parse(polygonGeoJson); // Validate JSON
          polygonGeometryValue = sql`ST_GeomFromGeoJSON(${polygonGeoJson})`;
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid polygon geometry GeoJSON",
          });
        }
      }

      const updateData: any = {
        name: input.name,
        description: input.description,
        type: input.type as any,
        isNewSettlement: input.isNewSettlement,
        isTownPlanned: input.isTownPlanned,
        parentId: input.parentId,
        updatedBy: ctx.user.id,
        updatedAt: new Date(),
      };

      // Only add geometry fields if they were provided
      if (pointGeometryValue !== undefined) {
        updateData.pointGeometry = pointGeometryValue;
      }

      if (polygonGeometryValue !== undefined) {
        updateData.polygonGeometry = polygonGeometryValue;
      }

      await ctx.db
        .update(location)
        .set(updateData)
        .where(eq(location.id, input.id));

      return { success: true };
    } catch (error) {
      console.error("Error updating location:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update location",
      });
    }
  });
