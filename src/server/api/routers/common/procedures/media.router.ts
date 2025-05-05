import { createTRPCRouter } from "@/server/api/trpc";
import { mediaUploadProcedures, uploadRouter } from "./media";

export const mediaRouter = createTRPCRouter({
  upload: mediaUploadProcedures.uploadMedia,
  uploadMultipart: mediaUploadProcedures.uploadMediaMultipart,
  getByEntity: mediaUploadProcedures.getMediaByEntity,
  delete: mediaUploadProcedures.deleteMedia,
  setPrimary: mediaUploadProcedures.setPrimaryMedia,
});

// Export the upload router for use with uploadthing
export { uploadRouter };
