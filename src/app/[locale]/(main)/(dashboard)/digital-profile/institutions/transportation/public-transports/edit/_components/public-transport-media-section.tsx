"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Image,
  X,
  FileText,
  Video,
  FileImage,
  Bus,
  Upload,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface PublicTransportMediaSectionProps {
  transportId: string;
  media: any[];
}

export function PublicTransportMediaSection({
  transportId,
  media,
}: PublicTransportMediaSectionProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const { mutate: setPrimaryMedia } = api.common.media.setPrimary.useMutation({
    onSuccess: () => {
      toast.success("प्राथमिक मिडिया अपडेट गरियो");
      router.refresh();
    },
    onError: (error) => {
      toast.error(`प्राथमिक मिडिया अपडेट गर्न असफल: ${error.message}`);
    },
  });

  // Upload media mutation
  const { mutate: getPresignedUrl } = api.common.media.getUploadUrl.useMutation(
    {
      onSuccess: async (data) => {
        if (fileInputRef.current?.files?.length) {
          await uploadFileToPresignedUrl(
            fileInputRef.current.files[0],
            data.uploadUrl,
            data.mediaId,
          );
        }
      },
      onError: (error) => {
        setUploading(false);
        toast.error(`अपलोड असफल: ${error.message}`);
      },
    },
  );

  // Link uploaded media to entity mutation
  const { mutate: linkMediaToEntity } =
    api.common.media.linkMediaToEntity.useMutation({
      onSuccess: () => {
        setUploading(false);
        setUploadProgress(0);
        toast.success("मिडिया सफलतापूर्वक अपलोड गरियो");
        router.refresh();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      onError: (error) => {
        setUploading(false);
        toast.error(`मिडिया लिंक गर्न असफल: ${error.message}`);
      },
    });

  // Handle media upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("फाइल अति ठूलो छ। अधिकतम आकार 5MB हो।");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "अमान्य फाइल प्रकार। केवल JPEG, PNG, WEBP, GIF र SVG फाइलहरू अनुमति छन्।",
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setUploading(true);
      setUploadProgress(5);

      // Get a presigned URL for upload
      getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
        title: file.name,
      });
    }
  };

  // Upload file to presigned URL
  const uploadFileToPresignedUrl = async (
    file: File,
    presignedUrl: string,
    mediaId: string,
  ) => {
    try {
      setUploadProgress(20);

      // Upload to MinIO with presigned URL
      const response = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      setUploadProgress(80);

      // Link the uploaded media to the public transport entity
      linkMediaToEntity({
        mediaId,
        entityId: transportId,
        entityType: "PUBLIC_TRANSPORT",
        isPrimary: media.length === 0, // Make primary if it's the first image
        displayOrder: media.length,
      });

      setUploadProgress(100);
    } catch (error) {
      setUploading(false);
      toast.error(`फाइल अपलोड असफल: ${error}`);
    }
  };

  // Handle media delete
  const handleDelete = (mediaId: string) => {
    if (confirm("के तपाईं निश्चित हुनुहुन्छ?")) {
      deleteMedia({ id: mediaId });
    }
  };

  // Handle set primary media
  const handleSetPrimary = (mediaId: string) => {
    setPrimaryMedia({
      mediaId,
      entityId: transportId,
      entityType: "PUBLIC_TRANSPORT",
    });
  };

  // Get media icon based on type
  const getMediaIcon = (mimeType: string) => {
    if (mimeType?.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (mimeType?.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (mimeType?.startsWith("application/pdf"))
      return <FileText className="h-4 w-4" />;
    return <FileImage className="h-4 w-4" />;
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
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5 text-muted-foreground" />
            सार्वजनिक यातायातको फोटोहरू
          </CardTitle>
          <CardDescription>
            यातायातको फोटोहरू अपलोड वा व्यवस्थापन गर्नुहोस्
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-dashed border-2 rounded-md p-6 text-center mb-6 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="file"
              id="media-upload"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <label htmlFor="media-upload" className="cursor-pointer block">
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-1">
                  फोटो अपलोड गर्नुहोस्
                </h3>
                <p className="text-sm text-muted-foreground mb-1">
                  यहाँ फाइलहरू तान्नुहोस् वा क्लिक गर्नुहोस्
                </p>
                <p className="text-xs text-muted-foreground">
                  अधिकतम 5MB, PNG, JPEG, WEBP, GIF फाइलहरू समर्थित
                </p>
              </div>
            </label>

            {uploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  अपलोड गरिँदै... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          {media.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bus className="h-20 w-20 mx-auto opacity-10 mb-4" />
              <p>कुनै फोटो फेला परेन</p>
              <p className="text-sm mt-2">
                कृपया माथिको अपलोड बटन प्रयोग गरेर फोटोहरू थप्नुहोस्
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "group relative border rounded-md overflow-hidden",
                    item.isPrimary && "ring-2 ring-primary ring-offset-1",
                  )}
                >
                  {item.mimeType?.startsWith("image/") ? (
                    <div
                      className="aspect-video cursor-pointer"
                      onClick={() => setSelectedImage(item.url)}
                    >
                      <img
                        src={item.url}
                        alt={item.fileName || "Image"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-muted">
                      {getMediaIcon(item.mimeType)}
                    </div>
                  )}

                  <div className="p-2 flex flex-col gap-1">
                    <div className="text-xs truncate">{item.fileName}</div>
                    <div className="flex gap-1 justify-between items-center">
                      {item.isPrimary && (
                        <Badge variant="secondary" className="text-xs">
                          प्राथमिक
                        </Badge>
                      )}
                      {!item.isPrimary && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-6 px-2"
                          onClick={() => handleSetPrimary(item.id)}
                        >
                          प्राथमिक बनाउनुहोस्
                        </Button>
                      )}
                    </div>
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
                      {isDeleting ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            तपाईंले अपलोड गर्नुभएको फोटोहरू सार्वजनिक रूपमा देखिन्छन् भन्ने कुरा
            सुनिश्चित गर्नुहोस्
          </p>
        </CardFooter>
      </Card>

      {/* Lightbox */}
      {renderLightbox()}
    </>
  );
}
