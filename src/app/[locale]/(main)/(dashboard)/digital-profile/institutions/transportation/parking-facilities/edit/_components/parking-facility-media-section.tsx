"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileTitle, setFileTitle] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Media upload mutation
  const { mutate: uploadMedia } = api.common.media.uploadMedia.useMutation({
    onSuccess: () => {
      toast.success("मिडिया सफलतापूर्वक अपलोड गरियो");
      setSelectedFiles([]);
      setFileTitle("");
      setFileDescription("");
      setIsUploadDialogOpen(false);
      setIsUploading(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(`मिडिया अपलोड गर्न असफल: ${error.message}`);
      setIsUploading(false);
    },
  });

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

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filesArray = Array.from(event.target.files).slice(0, 10); // Limit to 10 files
      setSelectedFiles(filesArray);
      setIsUploadDialogOpen(true);
    }
  };

  // Handle file upload
  const handleUpload = () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress (in a real app, you might get this from an upload event)
    const simulateProgress = () => {
      setUploadProgress((prev) => {
        if (prev < 90) {
          const next = prev + Math.random() * 10;
          setTimeout(simulateProgress, 300);
          return next;
        }
        return prev;
      });
    };

    simulateProgress();

    // Handle file upload
    uploadMedia({
      files: selectedFiles,
      entityId: facilityId,
      entityType,
      title: fileTitle,
      description: fileDescription,
    });
  };

  // Handle delete
  const handleDelete = (mediaId: string) => {
    if (confirm("के तपाईं निश्चित हुनुहुन्छ?")) {
      deleteMedia({ id: mediaId });
    }
  };

  // Handle set primary
  const handleSetPrimary = (mediaId: string) => {
    setPrimaryMedia({
      mediaId,
      entityId: facilityId,
      entityType,
    });
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

            <div
              className="border border-dashed rounded-md flex items-center justify-center aspect-video cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={triggerFileInput}
            >
              <div className="text-center p-4">
                <ImagePlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  फोटो अपलोड गर्नुहोस्
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={triggerFileInput}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            फोटोहरू थप्नुहोस्
          </Button>
        </CardFooter>
      </Card>

      {/* Upload dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>फोटो अपलोड गर्नुहोस्</DialogTitle>
            <DialogDescription>
              {selectedFiles.length} फाइल(हरू) अपलोड गर्न तयार
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fileTitle">शीर्षक</Label>
              <Input
                id="fileTitle"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                placeholder="यी फोटोहरूको शीर्षक दिनुहोस्"
              />
            </div>

            <div>
              <Label htmlFor="fileDescription">विवरण</Label>
              <Textarea
                id="fileDescription"
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="यी फोटोहरूको विवरण दिनुहोस्"
              />
            </div>

            <div className="space-y-2">
              <Label>चयन गरिएका फाइलहरू</Label>
              <div className="max-h-40 overflow-y-auto">
                <ul className="space-y-1">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="text-sm border rounded-md p-2 flex justify-between"
                    >
                      <span className="truncate max-w-[80%]">
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => {
                          const newFiles = [...selectedFiles];
                          newFiles.splice(index, 1);
                          setSelectedFiles(newFiles);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>अपलोड गर्दै...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
              disabled={isUploading}
            >
              रद्द गर्नुहोस्
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
              अपलोड गर्नुहोस्
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {renderLightbox()}
    </>
  );
}
