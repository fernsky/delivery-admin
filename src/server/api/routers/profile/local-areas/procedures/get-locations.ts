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

// Filter schema for location queries with pagination
const locationFilterSchema = z.object({
  type: z.enum(locationEnum as [string, ...string[]]).optional(),
  name: z.string().optional(),
  isNewSettlement: z.boolean().optional(),
  isTownPlanned: z.boolean().optional(),
  parentId: z.string().optional(),
  // Pagination
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  // View type - determines how much data to fetch
  viewType: z.enum(["table", "grid", "map"]).default("table"),
  // Sorting
  sortBy: z.string().optional().default("name"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
});

// Get all locations with optional filtering and pagination
export const getAllLocations = publicProcedure
  .input(locationFilterSchema.optional())
  .query(async ({ ctx, input }) => {
    try {
      // Set UTF-8 encoding
      await ctx.db.execute(sql`SET client_encoding = 'UTF8'`);

      const {
        page = 1,
        pageSize = 10,
        viewType = "table",
        sortBy = "name",
        sortOrder = "asc",
      } = input || {};

      // Calculate offset for pagination
      const offset = (page - 1) * pageSize;

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

      // Determine which fields to select based on viewType
      let selectFields: any = {
        id: location.id,
        name: location.name,
        slug: location.slug,
        type: location.type,
        isNewSettlement: location.isNewSettlement,
        isTownPlanned: location.isTownPlanned,
      };

      // Add fields based on view type
      if (viewType === "table" || viewType === "grid") {
        selectFields = {
          ...selectFields,
          description: location.description,
          parentId: location.parentId,
          createdAt: location.createdAt,
          updatedAt: location.updatedAt,
        };
      }

      if (viewType === "map") {
        selectFields.pointGeometry = sql`CASE WHEN ${location.pointGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.pointGeometry}) ELSE NULL END`;
        selectFields.polygonGeometry = sql`CASE WHEN ${location.polygonGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.polygonGeometry}) ELSE NULL END`;
        selectFields.centroid = sql`CASE WHEN ${location.polygonGeometry} IS NOT NULL THEN ST_AsGeoJSON(ST_Centroid(${location.polygonGeometry})) 
                      WHEN ${location.pointGeometry} IS NOT NULL THEN ST_AsGeoJSON(${location.pointGeometry})
                      ELSE NULL END`;
      }

      // Get total count for pagination
      const totalCount = await ctx.db
        .select({ count: sql`count(*)` })
        .from(location)
        .where(conditions.length ? and(...conditions) : undefined)
        .then((result) => Number(result[0].count));

      // Query locations with selected fields
      const locations = await ctx.db
        .select({ location: selectFields })
        .from(location)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(
          sortOrder === "asc"
            ? sql`${sql.identifier(sortBy)} ASC`
            : sql`${sql.identifier(sortBy)} DESC`,
        )
        .limit(pageSize)
        .offset(offset);

      // Process results for GeoJSON if it's map view
      const processedLocations = locations.map((loc) => {
        const result: any = { ...loc.location };

        // Only process geometry for map view
        if (viewType === "map") {
          if (loc.location.pointGeometry) {
            result.pointGeometry = JSON.parse(
              loc.location.pointGeometry as string,
            );
          }
          if (loc.location.polygonGeometry) {
            result.polygonGeometry = JSON.parse(
              loc.location.polygonGeometry as string,
            );
          }
          if (loc.location.centroid) {
            result.centroid = JSON.parse(loc.location.centroid as string);
          }
        }
        return result;
      });

      // Get primary media for each location for grid and table views
      let locationsWithMedia = processedLocations;

      if (viewType === "table" || viewType === "grid") {
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
        locationsWithMedia = processedLocations.map((loc) => ({
          ...loc,
          primaryMedia: primaryMediaMap.get(loc.id) || null,
        }));
      }

      return {
        items: locationsWithMedia,
        pagination: {
          page,
          pageSize,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          hasNextPage: page * pageSize < totalCount,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve locations",
      });
    }
  });
