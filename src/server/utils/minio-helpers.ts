import { Client as MinioClient } from "minio";
import { env } from "@/env";

/**
 * Generate a presigned URL for a file in MinIO storage
 * @param minio MinIO client instance
 * @param filePath Path to the file in MinIO storage
 * @param expirySeconds Time in seconds until the URL expires
 * @returns A presigned URL for the specified file
 */
export async function generatePresignedUrl(
  minio: MinioClient,
  filePath: string,
  expirySeconds: number = 24 * 60 * 60, // Default: 24 hours
): Promise<string | null> {
  try {
    if (!env.BUCKET_NAME) {
      throw new Error("Bucket name not configured");
    }

    // Remove leading slash if present
    const cleanFilePath = filePath.startsWith("/")
      ? filePath.substring(1)
      : filePath;

    return await minio.presignedGetObject(
      env.BUCKET_NAME,
      cleanFilePath,
      expirySeconds,
    );
  } catch (error) {
    console.error(`Failed to generate presigned URL for ${filePath}:`, error);
    return null;
  }
}

/**
 * Generate presigned URLs for multiple files in batch
 * @param minio MinIO client instance
 * @param files Array of file objects containing id and filePath
 * @param expirySeconds Time in seconds until the URL expires
 * @returns Array of objects with id, url and filename
 */
export async function generateBatchPresignedUrls<
  T extends { id: string; filePath: string; fileName?: string },
>(
  minio: MinioClient,
  files: T[],
  expirySeconds: number = 24 * 60 * 60, // Default: 24 hours
): Promise<Array<{ id: string; url: string | null; fileName?: string }>> {
  return await Promise.all(
    files.map(async (file) => {
      const url = await generatePresignedUrl(
        minio,
        file.filePath,
        expirySeconds,
      );
      return {
        id: file.id,
        url,
        fileName: file.fileName,
      };
    }),
  );
}
