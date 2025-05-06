"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicGrasslandDetails } from "./basic-grassland-details";
import { GrasslandFeaturesDetails } from "./grassland-features-details";
import { GrasslandLocationMap } from "./grassland-location-map";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "चरन क्षेत्रको नाम आवश्यक छ"),
  description: z.string().optional(),
  type: z.enum(
    [
      "NATURAL_MEADOW",
      "IMPROVED_PASTURE",
      "RANGELAND",
      "SILVOPASTURE",
      "WETLAND_GRAZING",
      "ALPINE_GRASSLAND",
      "COMMON_GRAZING_LAND",
      "OTHER",
    ],
    {
      required_error: "चरन क्षेत्रको प्रकार आवश्यक छ",
    },
  ),

  // Location details
  wardNumber: z
    .string()
    .transform((val) => Number(val) || undefined)
    .pipe(z.number().int().positive().optional()),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInHectares: z
    .string()
    .transform((val) => Number(val) || undefined)
    .pipe(z.number().positive().optional()),
  elevationInMeters: z
    .string()
    .transform((val) => Number(val) || undefined)
    .pipe(z.number().int().optional()),
  vegetationDensity: z
    .enum(["VERY_DENSE", "DENSE", "MODERATE", "SPARSE", "VERY_SPARSE"])
    .optional(),
  managementType: z
    .enum([
      "ROTATIONAL_GRAZING",
      "CONTINUOUS_GRAZING",
      "DEFERRED_GRAZING",
      "HAY_PRODUCTION",
      "CONSERVATION",
      "UNMANAGED",
      "MIXED",
    ])
    .optional(),

  // Grassland specific details
  dominantSpecies: z.string().optional(),
  carryingCapacity: z
    .string()
    .transform((val) => Number(val) || undefined)
    .pipe(z.number().int().positive().optional()),
  grazingPeriod: z.string().optional(),
  annualFodderYield: z
    .string()
    .transform((val) => Number(val) || undefined)
    .pipe(z.number().positive().optional()),
  yieldYear: z.string().optional(),

  // Management details
  isGovernmentOwned: z.boolean().default(false),
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  caretakerName: z.string().optional(),
  caretakerContact: z.string().optional(),

  // Additional information
  hasWaterSource: z.boolean().default(false),
  waterSourceType: z.string().optional(),
  isFenced: z.boolean().default(false),
  hasGrazingRights: z.boolean().default(false),

  // Conservation status
  hasProtectedStatus: z.boolean().default(false),
  protectionType: z.string().optional(),
  biodiversityValue: z.string().optional(),

  // Geometry fields
  locationPoint: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  areaPolygon: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateGrasslandForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      wardNumber: undefined,
      location: "",
      address: "",
      areaInHectares: undefined,
      elevationInMeters: undefined,
      vegetationDensity: undefined,
      managementType: undefined,
      dominantSpecies: "",
      carryingCapacity: undefined,
      grazingPeriod: "",
      annualFodderYield: undefined,
      yieldYear: "",
      isGovernmentOwned: false,
      ownerName: "",
      ownerContact: "",
      caretakerName: "",
      caretakerContact: "",
      hasWaterSource: false,
      waterSourceType: "",
      isFenced: false,
      hasGrazingRights: false,
      hasProtectedStatus: false,
      protectionType: "",
      biodiversityValue: "",
    },
  });

  // Create grassland mutation
  const { mutate: createGrassland, isLoading } =
    api.profile.grasslands.create.useMutation({
      onSuccess: (data) => {
        toast.success("चरन क्षेत्र सफलतापूर्वक सिर्जना गरियो");
        router.push(
          `/dashboard/digital-profile/institutions/agricultural/grasslands/${data.id}`,
        );
      },
      onError: (error) => {
        toast.error(`चरन क्षेत्र सिर्जना गर्न असफल: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    createGrassland({
      ...values,
      wardNumber: values.wardNumber ? Number(values.wardNumber) : undefined,
      areaInHectares: values.areaInHectares
        ? Number(values.areaInHectares)
        : undefined,
      elevationInMeters: values.elevationInMeters
        ? Number(values.elevationInMeters)
        : undefined,
      carryingCapacity: values.carryingCapacity
        ? Number(values.carryingCapacity)
        : undefined,
      annualFodderYield: values.annualFodderYield
        ? Number(values.annualFodderYield)
        : undefined,
    });
  };

  // Handle geometry selection from map
  const handleGeometrySelect = (
    locationPoint?: { type: "Point"; coordinates: [number, number] },
    areaPolygon?: { type: "Polygon"; coordinates: [Array<[number, number]>] },
  ) => {
    if (locationPoint) {
      form.setValue("locationPoint", locationPoint);
    }
    if (areaPolygon) {
      form.setValue("areaPolygon", areaPolygon as any);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">आधारभूत जानकारी</TabsTrigger>
          <TabsTrigger value="features">विशेषताहरू</TabsTrigger>
          <TabsTrigger value="location">स्थान र नक्सा</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicGrasslandDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  रद्द गर्नुहोस्
                </Button>
                <Button type="button" onClick={() => setActiveTab("features")}>
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="features">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <GrasslandFeaturesDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("basic")}
                >
                  पछिल्लो
                </Button>
                <Button type="button" onClick={() => setActiveTab("location")}>
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="location">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="text-lg font-medium">
                  चरन क्षेत्रको स्थान जानकारी
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <GrasslandLocationMap
                      onGeometrySelect={handleGeometrySelect}
                      initialLocationPoint={form.watch("locationPoint")}
                      initialAreaPolygon={form.watch("areaPolygon")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("features")}
                >
                  पछिल्लो
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  सुरक्षित गर्नुहोस्
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
