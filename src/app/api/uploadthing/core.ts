import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerAuthSession } from "@/lib/auth";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Define file router with permissions and file types
export const uploadRouter = {
  // Define "media" route with various file type uploads
  mediaUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 4 },
    video: { maxFileSize: "64MB", maxFileCount: 1 },
    pdf: { maxFileSize: "16MB", maxFileCount: 2 },
    "application/msword": { maxFileSize: "16MB", maxFileCount: 2 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "16MB",
      maxFileCount: 2,
    },
  })
    .middleware(async ({ req }) => {
      // Verify user is authenticated using our getServerAuthSession function
      const { user } = await getServerAuthSession();

      if (!user) {
        throw new UploadThingError("Unauthorized - authentication required");
      }

      // Return user info to be used in onUploadComplete
      return { userId: user.id, role: user.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This is triggered when upload completes
      console.log("Upload completed by user:", metadata.userId);
      console.log("File URL:", file.url);

      return {
        uploadedBy: metadata.userId,
        fileKey: file.key,
        fileName: file.name,
        fileUrl: file.url,
        fileSize: file.size,
        mimeType: file.mime,
      };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
