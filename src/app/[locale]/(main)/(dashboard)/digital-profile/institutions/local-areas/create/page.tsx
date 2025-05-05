"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { FileUploader } from "@/components/shared/file-upload/custom-uploader";
import { LocationMapInput } from "./_components/location-map-input";
import dynamic from "next/dynamic";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "नाम आवश्यक छ"),
  description: z.string().optional(),
  type: z.enum(["VILLAGE", "SETTLEMENT", "TOLE", "WARD", "SQUATTER_AREA"], {
    required_error: "प्रकार आवश्यक छ",
  }),
  isNewSettlement: z.boolean().default(false),
  isTownPlanned: z.boolean().default(false),
  pointGeometry: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  polygonGeometry: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),
  parentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateLocalAreaPage() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ id: string; fileUrl: string; isPrimary?: boolean }>
  >([]);
  const [processedMediaIds, setProcessedMediaIds] = useState(new Set<string>());

  // Set up the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      isNewSettlement: false,
      isTownPlanned: false,
    },
  });

  const { mutate: createLocation, isLoading } =
    api.profile.localAreas.locations.create.useMutation({
      onSuccess: (data) => {
        toast.success("स्थान सफलतापूर्वक सिर्जना गरियो");

        // If files were uploaded, associate them with the new location
        if (uploadedFiles.length > 0) {
          // Abstract the setPrimary mutations using mutateAsync for better control
          associateUploadedFiles(uploadedFiles, data.id)
            .then(() => {
              router.push("/digital-profile/institutions/local-areas");
            })
            .catch((error) => {
              console.error("Error associating media:", error);
              toast.error("फाइल जोड्न समस्या भयो, तर स्थान सिर्जना भएको छ");
              setTimeout(() => {
                router.push("/digital-profile/institutions/local-areas");
              }, 2000);
            });
        } else {
          // Redirect immediately if no files to process
          router.push("/digital-profile/institutions/local-areas");
        }
      },
      onError: (error) => {
        toast.error(`स्थान सिर्जना गर्न असफल: ${error.message}`);
      },
    });

  // Get the mutateAsync function for setPrimary
  const { mutateAsync: setPrimaryMediaAsync } =
    api.common.media.setPrimary.useMutation();

  // Function to associate uploaded files with a location
  const associateUploadedFiles = async (
    files: Array<{ id: string; fileUrl: string; isPrimary?: boolean }>,
    locationId: string,
  ) => {
    // Process files sequentially to ensure correct primary status
    for (const file of files) {
      try {
        await setPrimaryMediaAsync({
          mediaId: file.id,
          entityId: locationId,
          entityType: "LOCATION",
        });
      } catch (error) {
        console.error(`Error associating file ${file.id}:`, error);
        // Continue with other files even if one fails
      }
    }
  };

  const locationTypes = [
    { value: "VILLAGE", label: "गाउँ" },
    { value: "SETTLEMENT", label: "बस्ती" },
    { value: "TOLE", label: "टोल" },
    { value: "WARD", label: "वडा" },
    { value: "SQUATTER_AREA", label: "सुकुम्बासी क्षेत्र" },
  ];

  // Get all existing locations for parent selection
  const { data: existingLocations, isLoading: isLocationsLoading } =
    api.profile.localAreas.locations.getAll.useQuery(undefined, {
      staleTime: 5000,
    });

  const onSubmit = (values: FormValues) => {
    createLocation(values);
  };

  const handleLocationSelect = (
    pointGeometry?: { type: "Point"; coordinates: [number, number] },
    polygonGeometry?: { type: "Polygon"; coordinates: [number, number][][] },
  ) => {
    if (pointGeometry) {
      form.setValue("pointGeometry", pointGeometry);
    }

    if (polygonGeometry) {
      form.setValue("polygonGeometry", polygonGeometry);
    }
  };

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
    <ContentLayout
      title="नयाँ स्थान थप्नुहोस्"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push("/digital-profile/institutions/local-areas")
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>स्थानको नाम</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="स्थानको नाम लेख्नुहोस्"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>स्थानको प्रकार</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="स्थानको प्रकार छान्नुहोस्" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>अभिभावक स्थान</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="अभिभावक स्थान छान्नुहोस् (वैकल्पिक)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLocationsLoading ? (
                            <SelectItem value="_loading" disabled>
                              लोड हुँदैछ...
                            </SelectItem>
                          ) : existingLocations &&
                            existingLocations.length > 0 ? (
                            existingLocations.map((location) => (
                              <SelectItem
                                key={location.id}
                                value={location.id || "_empty"}
                              >
                                {location.name} (
                                {
                                  locationTypes.find(
                                    (t) => t.value === location.type,
                                  )?.label
                                }
                                )
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="_no_locations" disabled>
                              कुनै स्थान उपलब्ध छैन
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        यो स्थान कुनै अर्को स्थान अन्तर्गत छ भने छान्नुहोस्
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>विवरण</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="स्थानको विवरण लेख्नुहोस्"
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-4">
                <div className="text-lg font-medium">
                  स्थान प्रकार विशेषताहरू
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="isNewSettlement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>नयाँ बस्ती</FormLabel>
                          <FormDescription>
                            यो स्थान नयाँ बस्ती हो भने यो विकल्प छान्नुहोस्
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isTownPlanned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>नियोजित शहरी क्षेत्र</FormLabel>
                          <FormDescription>
                            यो स्थान नियोजित शहरी क्षेत्र हो भने यो विकल्प
                            छान्नुहोस्
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-lg font-medium">स्थान भौगोलिक जानकारी</div>
                <div className="grid grid-cols-1 gap-6">
                  {/* Location coordinates display, shown when we have coordinates */}
                  {(form.watch("pointGeometry") ||
                    form.watch("polygonGeometry")) && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {form.watch("pointGeometry") && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-primary" />
                            <span>
                              बिन्दु स्थान:{" "}
                              {form
                                .watch("pointGeometry")
                                ?.coordinates[1].toFixed(6)}
                              ,
                              {form
                                .watch("pointGeometry")
                                ?.coordinates[0].toFixed(6)}
                            </span>
                          </div>
                        )}

                        {form.watch("polygonGeometry") && (
                          <div className="flex items-center mt-1">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-4 w-4 mr-1 text-primary"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 7L9 4L15 7L21 4V17L15 20L9 17L3 20V7Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>
                              बहुभुज क्षेत्र:{" "}
                              {form.watch("polygonGeometry")?.coordinates[0]
                                ?.length || 0}{" "}
                              बिन्दुहरू
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Always show the map in a larger container */}
                  <div className="border rounded-lg overflow-hidden">
                    <LocationMapInput
                      onLocationSelect={handleLocationSelect}
                      initialPoint={form.watch("pointGeometry")}
                      initialPolygon={form.watch("polygonGeometry")}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-lg font-medium">स्थानको फोटोहरू</div>
                <FileUploader
                  maxFiles={10}
                  uploadType="image"
                  onUploadComplete={handleFileUploadComplete}
                  onUploadError={(error) =>
                    toast.error(`अपलोड त्रुटि: ${error.message}`)
                  }
                />

                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`relative rounded-md overflow-hidden border ${
                          file.isPrimary
                            ? "border-primary border-2"
                            : "border-border"
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

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  रद्द गर्नुहोस्
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  सुरक्षित गर्नुहोस्
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </ContentLayout>
  );
}
