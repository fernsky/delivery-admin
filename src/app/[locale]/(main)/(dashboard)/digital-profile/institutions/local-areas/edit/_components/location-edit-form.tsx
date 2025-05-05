"use client";

import { useEffect } from "react";
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
import { Loader } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { LocationMapSection } from "./location-map-section";
import { MediaSection } from "./media-section";

// Define the form schema
const formSchema = z.object({
  id: z.string(),
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

export type FormValues = z.infer<typeof formSchema>;

interface LocationEditFormProps {
  initialData: any;
  locationId: string;
}

export function LocationEditForm({
  initialData,
  locationId,
}: LocationEditFormProps) {
  const router = useRouter();

  // Get all existing locations for parent selection
  const { data: existingLocations, isLoading: isLocationsLoading } =
    api.profile.localAreas.locations.getAll.useQuery(undefined, {
      staleTime: 5000,
    });

  // Set up the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: locationId,
      name: "",
      description: "",
      type: undefined,
      isNewSettlement: false,
      isTownPlanned: false,
    },
  });

  // Update form when location data is loaded
  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        name: initialData.name || "",
        description: initialData.description || "",
        type: initialData.type as any,
        isNewSettlement: initialData.isNewSettlement || false,
        isTownPlanned: initialData.isTownPlanned || false,
        pointGeometry: initialData.pointGeometry || undefined,
        polygonGeometry: initialData.polygonGeometry || undefined,
        parentId: initialData.parentId || undefined,
      });
    }
  }, [initialData, form]);

  // TRPC mutations
  const { mutate: updateLocation, isLoading: isUpdating } =
    api.profile.localAreas.locations.update.useMutation({
      onSuccess: () => {
        toast.success("स्थान सफलतापूर्वक अपडेट गरियो");
        router.push("/digital-profile/institutions/local-areas");
      },
      onError: (error) => {
        toast.error(`स्थान अपडेट गर्न असफल: ${error.message}`);
      },
    });

  // Location types
  const locationTypes = [
    { value: "VILLAGE", label: "गाउँ" },
    { value: "SETTLEMENT", label: "बस्ती" },
    { value: "TOLE", label: "टोल" },
    { value: "WARD", label: "वडा" },
    { value: "SQUATTER_AREA", label: "सुकुम्बासी क्षेत्र" },
  ];

  const onSubmit = (values: FormValues) => {
    updateLocation(values);
  };

  return (
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
                    <Input placeholder="स्थानको नाम लेख्नुहोस्" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="अभिभावक स्थान छान्नुहोस् (वैकल्पिक)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">कुनै छैन</SelectItem>
                      {isLocationsLoading ? (
                        <SelectItem value="_loading" disabled>
                          लोड हुँदैछ...
                        </SelectItem>
                      ) : existingLocations &&
                        existingLocations.filter((loc) => loc.id !== locationId)
                          .length > 0 ? (
                        existingLocations
                          .filter((loc) => loc.id !== locationId) // Filter out current location
                          .map((location) => (
                            <SelectItem key={location.id} value={location.id}>
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
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-4">
            <div className="text-lg font-medium">स्थान प्रकार विशेषताहरू</div>
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

          <LocationMapSection
            pointGeometry={form.watch("pointGeometry")}
            polygonGeometry={form.watch("polygonGeometry")}
            onGeometryChange={(point: any, polygon: any) => {
              if (point) form.setValue("pointGeometry", point);
              if (polygon) form.setValue("polygonGeometry", polygon);
            }}
          />

          <MediaSection
            locationId={locationId}
            initialMedia={initialData?.media || []}
          />

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              रद्द गर्नुहोस्
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              अपडेट गर्नुहोस्
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
