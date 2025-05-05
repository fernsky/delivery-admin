import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { media } from "@/server/db/schema/common/media";
import { v4 as uuidv4 } from "uuid";
import { eq, sql } from "drizzle-orm";

// Define common input validation schemas
const baseMediaInputSchema = z.object({
  fileName: z.string(),
  entityId: z.string().optional(),
  entityType: z.string().optional(),
  isPrimary: z.boolean().optional().default(false),
});

// Media upload using base64
const uploadInputSchema = baseMediaInputSchema.extend({
  base64Data: z.string(),
  fileKey: z.string(),
  fileUrl: z.string(),
});

// Multipart file upload (placeholder for future implementation)
const uploadMultipartInputSchema = baseMediaInputSchema.extend({
  file: z.any(), // This would be FormData in a real implementation
  fileKey: z.string().optional(),
  fileUrl: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
});

// Base procedure for uploading media files using base64 encoding
export const upload = protectedProcedure
  .input(uploadInputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const fileId = input.fileKey || uuidv4();

      // Extract file metadata from base64 if not provided
      const base64Parts = input.base64Data.split(";base64,");
      const mimeType =
        base64Parts[0].split(":")[1] || "application/octet-stream";
      const base64Data = base64Parts[1];

      // Calculate file size
      const fileSize = Math.ceil((base64Data.length * 3) / 4);

      // Generate a file URL if not provided
      const fileUrl =
        input.fileUrl || `${process.env.NEXT_PUBLIC_APP_URL}/media/${fileId}`;

      // Insert media record into database
      const mediaRecord = await ctx.db
        .insert(media)
        .values({
          id: fileId,
          fileName: input.fileName,
          fileKey: fileId,
          fileUrl: fileUrl,
          mimeType: mimeType,
          fileSize: fileSize,
          uploadedById: ctx.user?.id || "",
          entityId: input.entityId,
          entityType: input.entityType,
          isPrimary: input.isPrimary,
        })
        .returning();

      return mediaRecord[0];
    } catch (error) {
      console.error("Media upload error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload media",
        cause: error,
      });
    }
  });

// Upload procedure for multipart file uploads
export const uploadMultipart = protectedProcedure
  .input(uploadMultipartInputSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const fileId = input.fileKey || uuidv4();

      // Insert media record into database
      const mediaRecord = await ctx.db
        .insert(media)
        .values({
          id: fileId,
          fileName: input.fileName,
          fileKey: fileId,
          fileUrl:
            input.fileUrl ||
            `${process.env.NEXT_PUBLIC_APP_URL}/media/${fileId}`,
          mimeType: input.mimeType || "application/octet-stream",
          fileSize: input.fileSize || 0,
          uploadedById: ctx.user?.id || "",
          entityId: input.entityId,
          entityType: input.entityType,
          isPrimary: input.isPrimary,
        })
        .returning();

      return mediaRecord[0];
    } catch (error) {
      console.error("Multipart media upload error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to upload media",
        cause: error,
      });
    }
  });

// Get media by entity ID and type
export const getByEntity = publicProcedure
  .input(
    z.object({
      entityId: z.string(),
      entityType: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      const result = await ctx.db
        .select()
        .from(media)
        .where(
          sql`${media.entityId} = ${input.entityId} AND ${media.entityType} = ${input.entityType}`,
        );

      return result;
    } catch (error) {
      console.error("Failed to get media by entity:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch media",
        cause: error,
      });
    }
  });

// Get media by ID
export const getById = publicProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ ctx, input }) => {
    try {
      const result = await ctx.db
        .select()
        .from(media)
        .where(eq(media.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media not found",
        });
      }

      return result[0];
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      console.error("Failed to get media by ID:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch media",
        cause: error,
      });
    }
  });

// Update media entity association
export const updateEntityAssociation = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      entityId: z.string(),
      entityType: z.string(),
      isPrimary: z.boolean().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { id, entityId, entityType, isPrimary } = input;

      // Update media record
      const result = await ctx.db
        .update(media)
        .set({
          entityId,
          entityType,
          ...(isPrimary !== undefined ? { isPrimary } : {}),
          updatedAt: new Date(),
        })
        .where(eq(media.id, id))
        .returning();

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media not found",
        });
      }

      return result[0];
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      console.error("Failed to update media entity association:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update media",
        cause: error,
      });
    }
  });

// Delete media by ID
export const deleteMedia = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const result = await ctx.db
        .delete(media)
        .where(eq(media.id, input.id))
        .returning();

      if (result.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Media not found",
        });
      }

      return { success: true, id: input.id };
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      console.error("Failed to delete media:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete media",
        cause: error,
      });
    }
  });

// Export all TRPC procedures in the router
export const mediaRouter = createTRPCRouter({
  upload,
  uploadMultipart,
  getByEntity,
  getById,
  updateEntityAssociation,
  delete: deleteMedia,
});
