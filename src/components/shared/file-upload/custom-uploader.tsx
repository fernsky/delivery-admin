"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Loader, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // TRPC mutation for multipart file upload
  const { mutateAsync: uploadMultipart } = api.media.uploadMultipart.useMutation({
    onSuccess: (data) => {
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onUploadComplete?.(data);
        setSelectedFiles([]);
      }, 500);
    },
    onError: (error) => {
      setIsUploading(false);
      setUploadProgress(0);
      onUploadError?.(error);
      toast.error(`अपलोड त्रुटि: ${error.message}`);
    }
  });

  // Accept mime types based on uploadType
  const getAcceptedFileTypes = () => {
    switch (uploadType) {
      case "image":
        return {
          "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        };
      case "video":
        return {
          "video/*": [".mp4", ".webm", ".avi", ".mov"],
        };
      case "pdf":
        return {
          "application/pdf": [".pdf"],
        };
      case "all":
        return {
          "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
          "video/*": [".mp4", ".webm", ".avi", ".mov"],
          "application/pdf": [".pdf"],
        };
      default: {
        return {
          "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        };
    }
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Upload a file
  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      // Show progress animation
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          if (progress >= 90) {
            clearInterval(interval);
          }
          setUploadProgress(progress);
        }, 200);
        return interval;
      };

      const progressInterval = simulateProgress();

      // Convert file to base64
      const base64Data = await fileToBase64(file);

      // Generate a unique file key
      const fileKey = uuidv4();

      // Create a temporary file URL for preview
      const fileUrl = URL.createObjectURL(file);

      // Upload via TRPC with fileKey and fileUrl
      const result = await uploadMultipart({
        base64Data,
        fileName: file.name,
        fileKey,
        fileUrl,
        entityId,
        entityType,
        isPrimary: selectedFiles.length === 0, // First file is primary
      });

      clearInterval(progressInterval);

      return { fileKey, fileUrl, fileName: file.name };
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      onUploadError?.(error as Error);
      console.error("फाइल अपलोड त्रुटि:", error);
      throw error;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: getAcceptedFileTypes(),
    maxFiles,
    maxSize: uploadType === "video" ? 64 * 1024 * 1024 : 16 * 1024 * 1024, // 16MB for images/docs, 64MB for videos
    disabled: isUploading,
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
    },
  });

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    try {
      // Upload first file
      await uploadFile(selectedFiles[0]);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }, [selectedFiles]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const cancelUpload = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
  }, []);

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer ${
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
        } ${isUploading ? "opacity-60 pointer-events-none" : "opacity-100"}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium">
            फाइलहरू छान्न यहाँ क्लिक गर्नुहोस् वा तान्नुहोस्
          </p>
          <p className="text-sm text-muted-foreground">
            {uploadType === "image" && "छविहरू (JPG, PNG, WebP)"}
            {uploadType === "video" && "भिडियोहरू (MP4, WebM)"}
            {uploadType === "pdf" && "कागजातहरू (PDF)"}
            {uploadType === "all" && "छविहरू, भिडियोहरू, र कागजातहरू"}
          </p>
          <p className="text-xs text-muted-foreground">
            अधिकतम {maxFiles} फाइलहरू •{" "}
            {uploadType === "video" ? "64MB" : "16MB"} सम्म
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && !isUploading && (
        <div className="space-y-2">
          <div className="text-sm font-medium">चयन गरिएका फाइलहरू</div>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center space-x-2 truncate">
                  <div className="truncate">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">अपलोड हुँदै...</div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={cancelUpload}
            >
              रद्द गर्नुहोस्
            </Button>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          <div className="text-xs text-right">{uploadProgress}%</div>
        </div>
      )}

      {selectedFiles.length > 0 && !isUploading && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectedFiles([])}
            className="mr-2"
          >
            सबै हटाउनुहोस्
          </Button>
          <Button onClick={handleUpload}>अपलोड गर्नुहोस्</Button>
        </div>
      )}
    </div>
  );
}
