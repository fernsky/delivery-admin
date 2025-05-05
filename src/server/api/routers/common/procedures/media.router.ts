import { createTRPCRouter } from "@/server/api/trpc";
import { mediaUploadProcedures } from "./media";

export const mediaRouter = createTRPCRouter({
  upload: mediaUploadProcedures.uploadMedia,
  getByEntity: mediaUploadProcedures.getMediaByEntity,
  delete: mediaUploadProcedures.deleteMedia,
  setPrimary: mediaUploadProcedures.setPrimaryMedia,
});
