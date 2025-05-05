"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Loader, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  entityId?: string;
  entityType?: string;
  onUploadComplete?: (fileData: any) => void;
  onUploadError?: (error: Error) => void;
  maxFiles?: number;
  uploadType?: "image" | "video" | "pdf" | "all";
}

export function FileUploader({
  entityId,
  entityType,
  onUploadComplete,
  onUploadError,
  maxFiles = 1,
  uploadType = "image",
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  
  // TRPC mutation for saving file metadata to database
  const { mutateAsync: saveUploadedMedia } = api.media.uploadMultipart.useMutation();
  
  // This will run after UploadThing has successfully uploaded the file
  const handleClientUploadComplete = async (res: any[]) => {
    if (res && res[0]) {
      try {
        // Save file metadata to database through TRPC
        if (entityId && entityType) {
          const fileData = res[0];
          const result = await saveUploadedMedia({
            fileKey: fileData.fileKey,
            fileUrl: fileData.fileUrl,
            fileName: fileData.fileName,
            fileSize: fileData.fileSize,
            mimeType: fileData.mimeType,
            entityId,
            entityType,
            isPrimary: selectedFiles.length === 0, // First file is primary by default
          });
          onUploadComplete?.(result);
        } else {
          onUploadComplete?.(res[0]);
        }
        
        // Add to selected files
        setSelectedFiles(prev => [...prev, res[0]]);
      } catch (error) {
        console.error("Failed to save file metadata:", error);
        onUploadError?.(error as Error);
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      <UploadDropzone
        endpoint="mediaUploader"
        onClientUploadComplete={handleClientUploadComplete}
        onUploadError={(error) => {
          console.error("Upload error:", error);
          onUploadError?.(error);
        }}
        appearance={{
          button: "bg-primary text-primary-foreground hover:bg-primary/90",
          container: "border-2 border-dashed rounded-lg p-6",
          allowedContent: "text-sm text-muted-foreground",
        }}
        config={{
          mode: "auto",
        }}
      />

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">अपलोड गरिएका फाइलहरू</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.fileName || file.name}-${index}`}
                className="relative rounded-md overflow-hidden border"
              >
                {file.fileUrl && (
                  <img
                    src={file.fileUrl}
                    alt="Uploaded file"
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-2 text-xs truncate">{file.fileName || file.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
