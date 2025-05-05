import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { location } from "@/server/db/schema/profile/institutions/local-areas/location";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { and, eq, like, sql, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { generateBatchPresignedUrls } from "@/server/utils/minio-helpers";

// Define enum for location types
const locationEnum = ["VILLAGE", "SETTLEMENT", "TOLE", "WARD", "SQUATTER_AREA"];

// Filter schema for location queries
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

        // Generate presigned URLs for primary media
        const mediaWithUrls = await generateBatchPresignedUrls(
          ctx.minio,
          primaryMedia.map((item) => ({
            id: item.mediaId,
            filePath: item.filePath,
          })),
        );

        // Create a map of entity ID to media data with presigned URL
        primaryMediaMap = new Map(
          primaryMedia.map((item, index) => [
            item.entityId,
            {
              mediaId: item.mediaId,
              url: mediaWithUrls[index].url,
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
