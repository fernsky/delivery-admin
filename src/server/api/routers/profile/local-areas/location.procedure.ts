import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { location } from "@/server/db/schema/profile/institutions/local-areas/location";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { eq, and, desc, sql, like, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/env";

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

// Define schema for location
const locationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(locationEnum as [string, ...string[]]),
  isNewSettlement: z.boolean().optional(),
  isTownPlanned: z.boolean().optional(),
  pointGeometry: pointGeometrySchema.optional(),
  polygonGeometry: polygonGeometrySchema.optional(),
  parentId: z.string().optional(),
});

// Filter schema
const locationFilterSchema = z.object({
  type: z.enum(locationEnum as [string, ...string[]]).optional(),
  name: z.string().optional(),
  isNewSettlement: z.boolean().optional(),
  isTownPlanned: z.boolean().optional(),
  parentId: z.string().optional(),
});

// Get all locations with optional filtering
export const getAllLocations = publicProcedure
  .input(locationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      // Build query with conditions
      const conditions = [];

      if (input?.type && input.type.trim() !== "") {
        conditions.push(eq(location.type, input.type as any));
      }

      if (input?.name) {
        conditions.push(like(location.name, `%${input.name}%`));
      }

      if (input?.isNewSettlement !== undefined) {
        conditions.push(eq(location.isNewSettlement, input.isNewSettlement));
      }

      if (input?.isTownPlanned !== undefined) {
        conditions.push(eq(location.isTownPlanned, input.isTownPlanned));
      }

      if (input?.parentId) {
        conditions.push(eq(location.parentId, input.parentId));
      }

      // Query locations with geometry converted to GeoJSON
      const locations = await ctx.db
        .select({
          location: {
            id: location.id,
            name: location.name,
            description: location.description,
            type: location.type,
            isNewSettlement: location.isNewSettlement,
            isTownPlanned: location.isTownPlanned,
            pointGeometry: sql`CASE WHEN ${location.pointGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.pointGeometry}) ELSE NULL END`,
            polygonGeometry: sql`CASE WHEN ${location.polygonGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.polygonGeometry}) ELSE NULL END`,
            centroid: sql`CASE WHEN ${location.polygonGeometry} IS NOT NULL THEN ST_AsGeoJSON(ST_Centroid(${location.polygonGeometry})) 
                          WHEN ${location.pointGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.pointGeometry})
                          ELSE NULL END`,
            parentId: location.parentId,
            isActive: location.isActive,
            createdAt: location.createdAt,
            updatedAt: location.updatedAt,
          },
        })
        .from(location)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(location.name);

      // Process results to parse GeoJSON strings to objects
      const processedLocations = locations.map((loc) => ({
        ...loc.location,
        pointGeometry: loc.location.pointGeometry
          ? JSON.parse(loc.location.pointGeometry as string)
          : null,
        polygonGeometry: loc.location.polygonGeometry
          ? JSON.parse(loc.location.polygonGeometry as string)
          : null,
        centroid: loc.location.centroid
          ? JSON.parse(loc.location.centroid as string)
          : null,
      }));

      // Get primary media for each location
      const locationIds = processedLocations.map((loc) => loc.id);

      // Only query media if we have locations
      let primaryMediaMap = new Map();
      if (locationIds.length > 0) {
        const primaryMedia = await ctx.db
          .select({
            entityId: entityMedia.entityId,
            mediaId: media.id,
            filePath: media.filePath,
          })
          .from(entityMedia)
          .innerJoin(media, eq(entityMedia.mediaId, media.id))
          .where(
            and(
              inArray(entityMedia.entityId, locationIds),
              eq(entityMedia.entityType, "LOCATION"),
              eq(entityMedia.isPrimary, true),
            ),
          );

        primaryMediaMap = new Map(
          primaryMedia.map((item) => [
            item.entityId,
            {
              mediaId: item.mediaId,
              url: `${env.MINIO_ENDPOINT}/${env.BUCKET_NAME}/${item.filePath}`,
            },
          ]),
        );
      }

      // Combine locations with their primary media
      return processedLocations.map((loc) => ({
        ...loc,
        primaryMedia: primaryMediaMap.get(loc.id) || null,
      }));
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve locations",
      });
    }
  });

// Get location by ID
export const getLocationById = publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    try {
      const locationData = await ctx.db
        .select({
          location: {
            id: location.id,
            name: location.name,
            description: location.description,
            type: location.type,
            isNewSettlement: location.isNewSettlement,
            isTownPlanned: location.isTownPlanned,
            pointGeometry: sql`CASE WHEN ${location.pointGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.pointGeometry}) ELSE NULL END`,
            polygonGeometry: sql`CASE WHEN ${location.polygonGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.polygonGeometry}) ELSE NULL END`,
            centroid: sql`CASE WHEN ${location.polygonGeometry} IS NOT NULL THEN ST_AsGeoJSON(ST_Centroid(${location.polygonGeometry})) 
                          WHEN ${location.pointGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.pointGeometry})
                          ELSE NULL END`,
            parentId: location.parentId,
            isActive: location.isActive,
            createdAt: location.createdAt,
            updatedAt: location.updatedAt,
          },
        })
        .from(location)
        .where(eq(location.id, input))
        .limit(1);

      if (!locationData.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Location not found",
        });
      }

      // Process the location data to parse GeoJSON strings
      const processedLocation = {
        ...locationData[0].location,
        pointGeometry: locationData[0].location.pointGeometry
          ? JSON.parse(locationData[0].location.pointGeometry as string)
          : null,
        polygonGeometry: locationData[0].location.polygonGeometry
          ? JSON.parse(locationData[0].location.polygonGeometry as string)
          : null,
        centroid: locationData[0].location.centroid
          ? JSON.parse(locationData[0].location.centroid as string)
          : null,
      };

      // Get all media for this location
      const mediaData = await ctx.db
        .select({
          id: media.id,
          fileName: media.fileName,
          filePath: media.filePath,
          title: media.title,
          description: media.description,
          mimeType: media.mimeType,
          isPrimary: entityMedia.isPrimary,
          displayOrder: entityMedia.displayOrder,
        })
        .from(entityMedia)
        .innerJoin(media, eq(entityMedia.mediaId, media.id))
        .where(
          and(
            eq(entityMedia.entityId, input),
            eq(entityMedia.entityType, "LOCATION"),
          ),
        )
        .orderBy(entityMedia.isPrimary, entityMedia.displayOrder);

      // Add URLs to each media item
      const mediaWithUrls = mediaData.map((item) => ({
        ...item,
        url: `${env.MINIO_ENDPOINT}/${env.BUCKET_NAME}/${item.filePath}`,
      }));

      return {
        ...processedLocation,
        media: mediaWithUrls,
      };
    } catch (error) {
      console.error("Error fetching location:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve location data",
      });
    }
  });

// Create a new location
export const createLocation = protectedProcedure
  .input(locationSchema)
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can create locations",
      });
    }

    const id = input.id || uuidv4();
    const now = new Date();

    try {
      // Process point geometry if provided
      let pointGeometryValue = null;
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
      let polygonGeometryValue = null;
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

      // Use a transaction for data consistency
      return await ctx.db.transaction(async (tx) => {
        // Insert the location
        const insertedLocation = await tx
          .insert(location)
          .values({
            id,
            name: input.name,
            description: input.description,
            type: input.type as any,
            isNewSettlement: input.isNewSettlement || false,
            isTownPlanned: input.isTownPlanned || false,
            pointGeometry: pointGeometryValue
              ? sql`${pointGeometryValue}`
              : null,
            polygonGeometry: polygonGeometryValue
              ? sql`${polygonGeometryValue}`
              : null,
            parentId: input.parentId,
            createdAt: now,
            updatedAt: now,
            createdBy: ctx.user.id,
            updatedBy: ctx.user.id,
          })
          .returning();

        return { id, success: true };
      });
    } catch (error) {
      console.error("Error creating location:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create location",
        cause: error,
      });
    }
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

    if (!input.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Location ID is required",
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

// Delete a location
export const deleteLocation = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete locations",
      });
    }

    try {
      // First check if location has child locations
      const children = await ctx.db
        .select({ id: location.id })
        .from(location)
        .where(eq(location.parentId, input));

      if (children.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete location with child locations",
        });
      }

      // Get all media associated with this location
      const mediaEntries = await ctx.db
        .select({
          mediaId: entityMedia.mediaId,
          filePath: media.filePath,
        })
        .from(entityMedia)
        .innerJoin(media, eq(entityMedia.mediaId, media.id))
        .where(
          and(
            eq(entityMedia.entityId, input),
            eq(entityMedia.entityType, "LOCATION"),
          ),
        );

      // Delete from MinIO
      if (mediaEntries.length > 0) {
        for (const entry of mediaEntries) {
          try {
            await ctx.minio.removeObject(env.BUCKET_NAME!, entry.filePath);
          } catch (err) {
            console.error(
              `Failed to delete file ${entry.filePath} from MinIO:`,
              err,
            );
          }

          // Delete entity-media relationship
          await ctx.db
            .delete(entityMedia)
            .where(eq(entityMedia.mediaId, entry.mediaId));

          // Delete media record
          await ctx.db.delete(media).where(eq(media.id, entry.mediaId));
        }
      }

      // Delete the location
      await ctx.db.delete(location).where(eq(location.id, input));

      return { success: true };
    } catch (error) {
      console.error("Error deleting location:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete location",
      });
    }
  });

// Create router with all procedures
export const locationRouter = createTRPCRouter({
  getAll: getAllLocations,
  getById: getLocationById,
  create: createLocation,
  update: updateLocation,
  delete: deleteLocation,
});
