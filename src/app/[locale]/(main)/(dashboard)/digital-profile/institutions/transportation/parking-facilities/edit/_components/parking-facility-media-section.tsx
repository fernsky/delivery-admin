"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ImagePlus,
  Trash2,
  X,
  Loader,
  Image as ImageIcon,
  Check,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FileUploader } from "@/components/shared/file-upload/custom-uploader";

interface ParkingFacilityMediaSectionProps {
  facilityId: string;
  existingMedia: {
    id: string;
    fileName?: string;
    url: string;
    title?: string;
    description?: string;
    isPrimary: boolean;
    mimeType?: string;
  }[];
  entityType: "PARKING_FACILITY";
}

export function ParkingFacilityMediaSection({
  facilityId,
  existingMedia,
  entityType,
}: ParkingFacilityMediaSectionProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Delete media mutation
  const { mutate: deleteMedia, isLoading: isDeleting } =
    api.common.media.delete.useMutation({
      onSuccess: () => {
        toast.success("मिडिया हटाइयो");
        router.refresh();
      },
      onError: (error) => {
        toast.error(`मिडिया हटाउन असफल: ${error.message}`);
      },
    });

  // Set primary media mutation
  const { mutate: setPrimaryMedia, isLoading: isSettingPrimary } =
    api.common.media.setPrimary.useMutation({
      onSuccess: () => {
        toast.success("प्राथमिक मिडिया अपडेट गरियो");
        router.refresh();
      },
      onError: (error) => {
        toast.error(`प्राथमिक मिडिया अपडेट गर्न असफल: ${error.message}`);
      },
    });

  // Media upload mutation
  const { mutate: uploadMedia } = api.common.media.uploadMedia.useMutation({
    onSuccess: () => {
      toast.success("मिडिया सफलतापूर्वक अपलोड गरियो");
      setIsUploading(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(`मिडिया अपलोड गर्न असफल: ${error.message}`);
      setIsUploading(false);
    },
  });

  // Handle delete
  const handleDelete = (mediaId: string) => {
    if (confirm("के तपाईं निश्चित हुनुहुन्छ?")) {
      deleteMedia({ id: mediaId });
    }
  };

  // Handle set primary media
  const handleSetPrimary = (mediaId: string) => {
    setPrimaryMedia({
      mediaId,
      entityId: facilityId,
      entityType,
    });
  };

  // Handle file upload using the FileUploader component
  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setIsUploading(true);

    uploadMedia({
      files,
      entityId: facilityId,
      entityType,
    });
  };

  // Render image lightbox
  const renderLightbox = () => {
    if (!selectedImage) return null;

    return (
      <div
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={() => setSelectedImage(null)}
      >
        <div className="relative max-w-4xl max-h-screen">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 text-white z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="h-6 w-6" />
          </Button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>पार्किङ सुविधाको फोटोहरू</CardTitle>
          <CardDescription>
            पार्किङ सुविधाको लागि फोटो वा कागजातहरू अपलोड गर्नुहोस्
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* File uploader component */}
          <div className="mb-8">
            <FileUploader
              accept="image/*"
              multiple
              maxFiles={10}
              maxSize={5 * 1024 * 1024} // 5MB
              onFilesSelected={handleFilesSelected}
              uploading={isUploading}
              text="पार्किङ सुविधाको फोटो अपलोड गर्नुहोस्"
              icon={<Upload className="h-5 w-5 mr-2" />}
              buttonText="फोटोहरू छान्नुहोस्"
              instruction="फोटोहरू यहाँ तान्नुहोस् वा फाइलहरू छान्नुहोस्"
              note="अधिकतम 10 फोटोहरू, प्रत्येक 5MB सम्म"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingMedia.map((item) => (
              <div
                key={item.id}
                className={`group relative border rounded-md overflow-hidden ${
                  item.isPrimary ? "ring-2 ring-primary ring-offset-1" : ""
                }`}
              >
                {item.mimeType?.startsWith("image/") ? (
                  <div
                    className="aspect-video cursor-pointer"
                    onClick={() => setSelectedImage(item.url)}
                  >
                    <img
                      src={item.url}
                      alt={item.title || "Image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-muted">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}

                <div className="p-2 flex flex-col gap-1">
                  <div className="text-xs truncate">{item.fileName}</div>
                  {item.title && (
                    <div className="text-xs font-medium truncate">
                      {item.title}
                    </div>
                  )}
                </div>

                {/* Hover actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Set as primary button */}
                {!item.isPrimary && (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleSetPrimary(item.id)}
                      disabled={isSettingPrimary}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      प्राथमिक बनाउनुहोस्
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lightbox */}
      {renderLightbox()}
    </>
  );
}
