import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { media, mediaTypeEnum } from "@/server/db/schema/common/media";
import {
  entityMedia,
  entityTypeEnum,
} from "@/server/db/schema/common/entity-media";
import { eq, and } from "drizzle-orm";
import * as z from "zod";
import { env } from "@/env";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Helper function to validate and convert base64 to buffer
const parseBase64Image = (base64String: string) => {
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid base64 string format",
    });
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");

  return { mimeType, buffer };
};

// Helper to determine media type from MIME type
const getMediaTypeFromMimeType = (
  mimeType: string,
): (typeof mediaTypeEnum.enumValues)[keyof typeof mediaTypeEnum.enumValues] => {
  if (mimeType.startsWith("image/")) return "IMAGE";
  if (mimeType.startsWith("video/")) return "VIDEO";
  if (
    mimeType.startsWith("application/pdf") ||
    mimeType.startsWith("application/msword") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("document")
  )
    return "DOCUMENT";
  return "OTHER";
};

export const mediaUploadProcedures = {
  // Upload media file (photo, document, etc.)
  uploadMedia: protectedProcedure
    .input(
      z.object({
        base64Data: z.string().regex(/^data:[a-zA-Z0-9/+]+;base64,/),
        fileName: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        entityId: z.string().optional(),
        entityType: z
          .enum(Object.keys(entityTypeEnum.enumValues) as [string, ...string[]])
          .optional(),
        isPrimary: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!env.BUCKET_NAME) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Storage bucket not configured",
        });
      }

      // Parse the base64 data
      const { mimeType, buffer } = parseBase64Image(input.base64Data);

      // Generate a unique file name
      const fileId = uuidv4();
      const fileExt = mimeType.split("/")[1] || "bin";
      const fileName = input.fileName
        ? `${path.parse(input.fileName).name}-${fileId}.${fileExt}`
        : `${fileId}.${fileExt}`;

      try {
        // Get MinIO client

        // Upload to MinIO
        const objectKey = `media/${fileName}`;
        await ctx.minio.putObject(
          env.BUCKET_NAME,
          objectKey,
          buffer,
          buffer.length,
          { "Content-Type": mimeType },
        );

        // Determine media type
        const mediaType = getMediaTypeFromMimeType(mimeType);

        // Save media record to database
        const mediaId = uuidv4();
        const mediaRecord = {
          id: mediaId,
          fileName,
          filePath: objectKey,
          fileSize: buffer.length,
          mimeType,
          type: mediaType as any,
          title: input.title || fileName,
          description: input.description,
          createdBy: ctx.user.id,
          updatedBy: ctx.user.id,
        };

        await ctx.db.insert(media).values(mediaRecord);

        // If entityId and entityType are provided, create the relationship
        if (input.entityId && input.entityType) {
          // If setting as primary, first unset any existing primaries
          if (input.isPrimary) {
            await ctx.db
              .update(entityMedia)
              .set({ isPrimary: false })
              .where(
                and(
                  eq(entityMedia.entityId, input.entityId),
                  eq(entityMedia.entityType, input.entityType as any),
                ),
              );
          }

          // Create the entity-media relationship
          await ctx.db.insert(entityMedia).values({
            id: uuidv4(),
            entityId: input.entityId,
            entityType: input.entityType as any,
            mediaId,
            isPrimary: input.isPrimary || false,
            createdBy: ctx.user.id,
            updatedBy: ctx.user.id,
          });
        }

        return {
          id: mediaId,
          fileName,
          filePath: objectKey,
          url: `${env.MINIO_ENDPOINT}/${env.BUCKET_NAME}/${objectKey}`,
        };
      } catch (error) {
        console.error("Error uploading media:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload media",
        });
      }
    }),

  // Get media by entity
  getMediaByEntity: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.enum(
          Object.keys(entityTypeEnum.enumValues) as [string, ...string[]],
        ),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        // Join the entityMedia and media tables to get all media for the entity
        const result = await ctx.db
          .select({
            id: media.id,
            fileName: media.fileName,
            filePath: media.filePath,
            title: media.title,
            description: media.description,
            mimeType: media.mimeType,
            type: media.type,
            isPrimary: entityMedia.isPrimary,
            displayOrder: entityMedia.displayOrder,
          })
          .from(entityMedia)
          .innerJoin(media, eq(entityMedia.mediaId, media.id))
          .where(
            and(
              eq(entityMedia.entityId, input.entityId),
              eq(entityMedia.entityType, input.entityType as any),
            ),
          )
          .orderBy(entityMedia.isPrimary, entityMedia.displayOrder);

        // Add URLs to each result
        return result.map((item) => ({
          ...item,
          url: `${env.MINIO_ENDPOINT}/${env.BUCKET_NAME}/${item.filePath}`,
        }));
      } catch (error) {
        console.error("Error fetching media:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch media",
        });
      }
    }),

  // Delete media
  deleteMedia: protectedProcedure
    .input(
      z.object({
        mediaId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get the media record to find the file path
        const mediaRecord = await ctx.db
          .select({ filePath: media.filePath })
          .from(media)
          .where(eq(media.id, input.mediaId))
          .limit(1);

        if (mediaRecord.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Media not found",
          });
        }

        // Delete from MinIO
        await ctx.minio.removeObject(env.BUCKET_NAME!, mediaRecord[0].filePath);

        // Delete entity-media relationships
        await ctx.db
          .delete(entityMedia)
          .where(eq(entityMedia.mediaId, input.mediaId));

        // Delete media record
        await ctx.db.delete(media).where(eq(media.id, input.mediaId));

        return { success: true };
      } catch (error) {
        console.error("Error deleting media:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete media",
        });
      }
    }),

  // Set primary media
  setPrimaryMedia: protectedProcedure
    .input(
      z.object({
        entityId: z.string(),
        entityType: z.enum(
          Object.keys(entityTypeEnum.enumValues) as [string, ...string[]],
        ),
        mediaId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // First unset any existing primary media
        await ctx.db
          .update(entityMedia)
          .set({ isPrimary: false })
          .where(
            and(
              eq(entityMedia.entityId, input.entityId),
              eq(entityMedia.entityType, input.entityType as any),
            ),
          );

        // Set the selected media as primary
        await ctx.db
          .update(entityMedia)
          .set({ isPrimary: true })
          .where(
            and(
              eq(entityMedia.entityId, input.entityId),
              eq(entityMedia.entityType, input.entityType as any),
              eq(entityMedia.mediaId, input.mediaId),
            ),
          );

        return { success: true };
      } catch (error) {
        console.error("Error setting primary media:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set primary media",
        });
      }
    }),
};
