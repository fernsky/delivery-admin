"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { FileUploader } from "@/components/shared/file-upload/custom-uploader";

export interface MediaFile {
  id: string;
  fileUrl?: string;
  url?: string;
  isPrimary?: boolean;
}

export interface CreateMediaSectionProps {
  uploadedFiles: MediaFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<MediaFile[]>>;
}

export function CreateMediaSection({
  uploadedFiles,
  setUploadedFiles,
}: CreateMediaSectionProps) {
  // Track media IDs that have already been processed to prevent duplicates
  const [processedMediaIds, setProcessedMediaIds] = useState(new Set<string>());

  // Upload media mutation
  const { mutate: addMedia } = api.common.media.upload.useMutation({
    onSuccess: (data) => {
      // Ensure we don't add duplicates
      if (!processedMediaIds.has(data.id)) {
        toast.success("मिडिया सफलतापूर्वक थपियो");

        // Add to processed IDs
        setProcessedMediaIds((prev) => new Set(prev).add(data.id));

        // Update uploaded files list
        setUploadedFiles((prev) => [
          ...prev,
          {
            id: data.id,
            fileUrl: data.fileUrl || "", // Ensure fileUrl is always a string
            isPrimary: uploadedFiles.length === 0, // First file is primary by default
          },
        ]);
      }
    },
    onError: (error: any) => {
      toast.error(`मिडिया थप्न असफल: ${error.message}`);
    },
  });

  const handleFileUploadComplete = (fileData: any) => {
    // Check if we've already processed this file ID
    if (fileData.id && processedMediaIds.has(fileData.id)) {
      return;
    }

    // Mark this file as processed
    if (fileData.id) {
      setProcessedMediaIds((prev) => new Set(prev).add(fileData.id));
    }

    // Let addMedia handle the state update through its onSuccess
    addMedia({
      fileKey: fileData.id || fileData.fileKey,
      fileUrl: fileData.fileUrl || fileData.url || "",
      fileName: fileData.fileName || fileData.id || fileData.fileKey,
      fileSize: fileData.fileSize || 0,
      mimeType: fileData.mimeType || "image/jpeg",
      // Don't include entityId/entityType since we don't have a locationId yet
      // Will associate later with setPrimaryMedia
      isPrimary: uploadedFiles.length === 0,
      fileContent: fileData.fileContent,
    });
  };

  const setFilePrimary = (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) => ({
        ...file,
        isPrimary: file.id === fileId,
      })),
    );
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">स्थानको फोटोहरू</div>
      <FileUploader
        maxFiles={10}
        uploadType="image"
        onUploadComplete={handleFileUploadComplete}
        onUploadError={(error) => toast.error(`अपलोड त्रुटि: ${error.message}`)}
      />

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className={`relative rounded-md overflow-hidden border ${
                file.isPrimary ? "border-primary border-2" : "border-border"
              }`}
            >
              <img
                src={file.fileUrl}
                alt="Uploaded file"
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                {!file.isPrimary && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setFilePrimary(file.id)}
                  >
                    प्राथमिक बनाउनुहोस्
                  </Button>
                )}
              </div>
              {file.isPrimary && (
                <div className="absolute top-2 right-2 bg-primary text-white text-xs py-1 px-2 rounded">
                  प्राथमिक
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
