"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import { FileUploader } from "@/components/shared/file-upload/custom-uploader";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface MediaFile {
  url: string | null;
  id: string;
  fileName: string;
  filePath: string;
  title: string | null;
  description: string | null;
  mimeType: string | null;
  isPrimary: boolean | null;
  displayOrder: number | null;
}

interface ParkingFacilityMediaSectionProps {
  facilityId: string;
  existingMedia: MediaFile[];
  entityType: "PARKING_FACILITY";
}

export function ParkingFacilityMediaSection({
  facilityId,
  existingMedia,
  entityType,
}: ParkingFacilityMediaSectionProps) {
  const router = useRouter();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  // Track media IDs that have already been processed to prevent duplicates
  const [processedMediaIds, setProcessedMediaIds] = useState(new Set<string>());

  // Get presigned URLs for existing media
  const { data: presignedUrls, isLoading: loadingUrls } =
    api.common.media.getPresignedUrls.useQuery(
      {
        mediaIds: existingMedia.map((media) => media.id),
      },
      {
        enabled: existingMedia.length > 0,
      },
    );

  useEffect(() => {
    if (existingMedia && presignedUrls) {
      // Create a set of processed media IDs
      const mediaIds = new Set(existingMedia.map((media) => media.id));
      setProcessedMediaIds(mediaIds);

      // Combine initial media with presigned URLs
      const mediaWithUrls = existingMedia.map((media) => {
        const presignedUrl = presignedUrls.find((item) => item.id === media.id);
        return {
          ...media,
          fileUrl: presignedUrl?.url || media.url,
          isPrimary: media.isPrimary,
        };
      });
      setMediaFiles(mediaWithUrls);
    } else if (existingMedia) {
      // Use available URLs if presigned URLs are not available yet
      setProcessedMediaIds(new Set(existingMedia.map((media) => media.id)));
      setMediaFiles(
        existingMedia.map((media) => ({
          ...media,
          fileUrl: media.url,
        })),
      );
    }
  }, [existingMedia, presignedUrls]);

  // Upload media mutation with enhanced direct file upload support
  const { mutate: addMedia } = api.common.media.upload.useMutation({
    onSuccess: (data) => {
      // Check if this media already exists in our state to prevent duplicates
      if (!processedMediaIds.has(data.id)) {
        toast.success("मिडिया सफलतापूर्वक थपियो");

        // Add to processed media IDs
        setProcessedMediaIds((prev) => new Set(prev).add(data.id));

        // Add new file to the local list with full data including id
        setMediaFiles((prev) => [
          ...prev,
          {
            id: data.id,
            fileName: data.fileName || "",
            filePath: data.filePath || "",
            url: null,
            title: data.title || null,
            description: data.description || null,
            mimeType: data.mimeType || null,
            isPrimary: prev.length === 0, // first file is primary
            displayOrder: prev.length, // auto-increment order
          },
        ]);
      }
    },
    onError: (error: any) => {
      toast.error(`मिडिया थप्न असफल: ${error.message}`);
    },
  });

  // Set media as primary mutation
  const { mutate: setPrimaryMedia } = api.common.media.setPrimary.useMutation({
    onSuccess: () => {
      toast.success("प्राथमिक मिडिया अपडेट गरियो");
    },
    onError: (error) => {
      toast.error(`प्राथमिक मिडिया अपडेट गर्न असफल: ${error.message}`);
    },
  });

  // Delete media mutation
  const { mutate: deleteMedia } = api.common.media.delete.useMutation({
    onSuccess: (data) => {
      toast.success("मिडिया हटाइयो");
    },
    onError: (error) => {
      toast.error(`मिडिया हटाउन असफल: ${error.message}`);
    },
  });

  const handleFileUploadComplete = (fileData: any) => {
    // If this media is already in our list, don't add it again
    if (processedMediaIds.has(fileData.id)) {
      return;
    }

    // The file is already uploaded through the FileUploader component
    addMedia({
      fileKey: fileData.id || fileData.fileKey,
      fileUrl: fileData.fileUrl || fileData.url || "",
      fileName: fileData.id || fileData.fileKey || fileData.fileName,
      fileSize: fileData.fileSize || 0,
      mimeType: fileData.mimeType || "image/jpeg",
      entityId: facilityId,
      entityType: entityType,
      isPrimary: mediaFiles.length === 0,
      fileContent: fileData.fileContent,
    });
  };

  const handleDeleteFile = (fileId: string) => {
    // Remove from state for UI responsiveness
    setMediaFiles((prev) => prev.filter((file) => file.id !== fileId));

    // Remove from processed IDs
    const newProcessedIds = new Set(processedMediaIds);
    newProcessedIds.delete(fileId);
    setProcessedMediaIds(newProcessedIds);

    // Delete from server
    deleteMedia({ id: fileId });
  };

  const handleSetFilePrimary = (fileId: string) => {
    // Update state for UI responsiveness
    setMediaFiles((prev) =>
      prev.map((file) => ({
        ...file,
        isPrimary: file.id === fileId,
      })),
    );

    // Update on server
    setPrimaryMedia({
      mediaId: fileId,
      entityId: facilityId,
      entityType: entityType,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium">पार्किङ सुविधाको फोटोहरू</div>

      <FileUploader
        maxFiles={10}
        uploadType="image"
        entityId={facilityId}
        entityType={entityType}
        onUploadComplete={handleFileUploadComplete}
        onUploadError={(error) => toast.error(`अपलोड त्रुटि: ${error.message}`)}
      />

      {loadingUrls && (
        <p className="text-sm text-muted-foreground">फोटोहरू लोड हुँदैछ...</p>
      )}

      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {mediaFiles.map((file) => (
            <div
              key={file.id}
              className={`relative rounded-md overflow-hidden border ${
                file.isPrimary ? "border-primary border-2" : "border-border"
              }`}
            >
              {file.url ? (
                <img
                  src={file.url}
                  alt="Media file"
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 flex items-center justify-center bg-muted">
                  Loading...
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                <div className="flex gap-2">
                  {!file.isPrimary && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSetFilePrimary(file.id)}
                    >
                      प्राथमिक
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {file.isPrimary && (
                <Badge className="absolute top-2 right-2" variant="secondary">
                  प्राथमिक
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
