import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { agricZone } from "@/server/db/schema/profile/institutions/agricultural/agricZones";
import { entityMedia } from "@/server/db/schema/common/entity-media";
import { media } from "@/server/db/schema/common/media";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { env } from "@/env";

// Delete an agricultural zone
export const deleteAgricZone = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    // Check permissions
    if (ctx.user.role !== "superadmin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only administrators can delete agricultural zones",
      });
    }

    try {
      // Get all media associated with this agricultural zone
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
            eq(entityMedia.entityType, "AGRIC_ZONE" as any),
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

      // Delete the agricultural zone
      await ctx.db.delete(agricZone).where(eq(agricZone.id, input));

      return { success: true };
    } catch (error) {
      console.error("Error deleting agricultural zone:", error);
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete agricultural zone",
      });
    }
  });
