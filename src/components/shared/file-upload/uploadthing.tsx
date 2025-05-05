"use client";

import { useCallback, useState } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { api } from "@/lib/api"; // Your TRPC client
import { Button } from "@/components/ui/button";

interface UploadFileProps {
  entityId?: string;
  entityType?: string;
  isPrimary?: boolean;
  onUploadComplete?: (fileData: any) => void;
  onUploadError?: (error: Error) => void;
  maxFiles?: number;
  uploadType?: "image" | "video" | "pdf" | "all";
}

export function UploadFile({
  entityId,
  entityType,
  isPrimary = false,
  onUploadComplete,
  onUploadError,
  maxFiles = 1,
  uploadType = "image",
}: UploadFileProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, permittedFileInfo } = useUploadThing("mediaUploader", {
    onClientUploadComplete: async (res) => {
      // Now save this to our database via tRPC
      if (res && res[0]) {
        try {
          const result = await saveToDatabase(res[0]);
          onUploadComplete?.(result);
        } catch (error) {
          console.error("Failed to save file metadata:", error);
          onUploadError?.(error as Error);
        }
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      setIsUploading(false);
      onUploadError?.(error);
      console.error("Upload error:", error);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  // Save file metadata to database via tRPC
  const { mutateAsync: saveUploadedMedia } =
    api.media.uploadMultipart.useMutation();

  const saveToDatabase = async (fileData: any) => {
    return await saveUploadedMedia({
      fileKey: fileData.key,
      fileUrl: fileData.url,
      fileName: fileData.name,
      fileSize: fileData.size,
      mimeType: fileData.mime,
      entityId,
      entityType,
      isPrimary,
    });
  };

  // Get file type filters for dropzone
  const fileTypes =
    permittedFileInfo?.config?.[
      uploadType === "all" ? "mediaUploader" : uploadType
    ];
  const acceptedFileTypes = fileTypes
    ? generateClientDropzoneAccept(fileTypes)
    : undefined;

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      accept: acceptedFileTypes,
      maxFiles,
      maxSize: uploadType === "video" ? 64 * 1024 * 1024 : 16 * 1024 * 1024, // 16MB for images/docs, 64MB for videos
      onDropAccepted: (acceptedFiles) => {
        setIsUploading(true);
        startUpload(acceptedFiles);
      },
    });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer ${
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="text-center">
            <p>Uploading... {uploadProgress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        ) : isDragActive ? (
          <p className="text-center">Drop the files here ...</p>
        ) : (
          <div className="text-center">
            <p>Drag & drop files here, or click to select files</p>
            <p className="text-sm text-gray-500 mt-1">
              {uploadType === "image" && "Images (JPG, PNG, WebP)"}
              {uploadType === "video" && "Videos (MP4, WebM)"}
              {uploadType === "pdf" && "Documents (PDF)"}
              {uploadType === "all" && "Images, Videos, and Documents"}
            </p>
            <Button className="mt-4" variant="outline">
              Select File
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
