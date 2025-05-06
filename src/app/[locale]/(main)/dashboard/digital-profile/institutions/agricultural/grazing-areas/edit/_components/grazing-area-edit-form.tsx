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
import { GrazingAreaLocationMap } from "../../create/_components/grazing-area-location-map";
import { BasicGrazingAreaDetails } from "../../create/_components/basic-grazing-area-details";
import { GrazingAreaFeaturesDetails } from "../../create/_components/grazing-area-features-details";
import { SEOFields } from "./seo-fields";

// Define the form schema
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "चरन खर्क क्षेत्रको नाम आवश्यक छ"),
  description: z.string().optional(),
  type: z.enum([
    "OPEN_RANGE",
    "ALPINE_MEADOW",
    "COMMUNITY_PASTURE",
    "FOREST_UNDERSTORY",
    "FLOODPLAIN",
    "SEASONAL_PASTURE",
    "DRY_SEASON_RESERVE",
    "ROTATIONAL_PADDOCK",
    "MIXED",
    "OTHER",
  ]),

  // Location details
  wardNumber: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInHectares: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  elevationInMeters: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  terrain: z
    .enum([
      "FLAT",
      "ROLLING",
      "HILLY",
      "MOUNTAINOUS",
      "VALLEY",
      "RIVERINE",
      "MIXED",
    ])
    .optional(),
  groundCover: z
    .enum([
      "PRIMARILY_GRASSES",
      "SHRUB_DOMINANT",
      "MIXED_VEGETATION",
      "FORBS_DOMINANT",
      "TREE_SCATTERED",
      "DEGRADED",
    ])
    .optional(),
  accessibility: z
    .enum([
      "EASILY_ACCESSIBLE",
      "MODERATELY_ACCESSIBLE",
      "DIFFICULT_ACCESS",
      "SEASONAL_ACCESS",
      "REMOTE",
    ])
    .optional(),

  // Grazing specific details
  livestockCapacity: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  primaryLivestockType: z.string().optional(),
  grazingSeasons: z.string().optional(),
  grazingDuration: z.string().optional(),
  rotationalSystem: z.boolean().default(false),
  restPeriod: z.string().optional(),
  utilizationLevel: z
    .enum([
      "UNDERUTILIZED",
      "OPTIMAL_USE",
      "OVERUTILIZED",
      "SEVERELY_DEGRADED",
      "PROTECTED",
    ])
    .optional(),

  // Water resources
  hasWaterSource: z.boolean().default(false),
  waterSourceTypes: z.string().optional(),
  waterAvailability: z.string().optional(),
  waterSourceDistance: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Management details
  isGovernmentOwned: z.boolean().default(false),
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  caretakerName: z.string().optional(),
  caretakerContact: z.string().optional(),
  permitRequired: z.boolean().default(false),
  permitInfo: z.string().optional(),

  // Infrastructure
  hasFencing: z.boolean().default(false),
  hasWindbreaks: z.boolean().default(false),
  hasShelters: z.boolean().default(false),
  infrastructureNotes: z.string().optional(),

  // Health and sustainability
  invasiveSpecies: z.string().optional(),
  erosionIssues: z.boolean().default(false),
  conservationStatus: z.string().optional(),
  restorationEfforts: z.string().optional(),

  // Cultural significance
  traditionalUse: z.string().optional(),
  culturalSignificance: z.string().optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),

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

interface GrazingAreaEditFormProps {
  grazingArea: any;
}

export function GrazingAreaEditForm({ grazingArea }: GrazingAreaEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with grazing area data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: grazingArea.id,
      name: grazingArea.name || "",
      description: grazingArea.description || "",
      type: grazingArea.type,

      // Location details
      wardNumber: grazingArea.wardNumber?.toString() || "",
      location: grazingArea.location || "",
      address: grazingArea.address || "",

      // Physical details
      areaInHectares: grazingArea.areaInHectares?.toString() || "",
      elevationInMeters: grazingArea.elevationInMeters?.toString() || "",
      terrain: grazingArea.terrain || undefined,
      groundCover: grazingArea.groundCover || undefined,
      accessibility: grazingArea.accessibility || undefined,

      // Grazing specific details
      livestockCapacity: grazingArea.livestockCapacity?.toString() || "",
      primaryLivestockType: grazingArea.primaryLivestockType || "",
      grazingSeasons: grazingArea.grazingSeasons || "",
      grazingDuration: grazingArea.grazingDuration || "",
      rotationalSystem: grazingArea.rotationalSystem || false,
      restPeriod: grazingArea.restPeriod || "",
      utilizationLevel: grazingArea.utilizationLevel || undefined,

      // Water resources
      hasWaterSource: grazingArea.hasWaterSource || false,
      waterSourceTypes: grazingArea.waterSourceTypes || "",
      waterAvailability: grazingArea.waterAvailability || "",
      waterSourceDistance: grazingArea.waterSourceDistance?.toString() || "",

      // Management details
      isGovernmentOwned: grazingArea.isGovernmentOwned || false,
      ownerName: grazingArea.ownerName || "",
      ownerContact: grazingArea.ownerContact || "",
      caretakerName: grazingArea.caretakerName || "",
      caretakerContact: grazingArea.caretakerContact || "",
      permitRequired: grazingArea.permitRequired || false,
      permitInfo: grazingArea.permitInfo || "",

      // Infrastructure
      hasFencing: grazingArea.hasFencing || false,
      hasWindbreaks: grazingArea.hasWindbreaks || false,
      hasShelters: grazingArea.hasShelters || false,
      infrastructureNotes: grazingArea.infrastructureNotes || "",

      // Health and sustainability
      invasiveSpecies: grazingArea.invasiveSpecies || "",
      erosionIssues: grazingArea.erosionIssues || false,
      conservationStatus: grazingArea.conservationStatus || "",
      restorationEfforts: grazingArea.restorationEfforts || "",

      // Cultural significance
      traditionalUse: grazingArea.traditionalUse || "",
      culturalSignificance: grazingArea.culturalSignificance || "",

      // SEO fields
      metaTitle: grazingArea.metaTitle || "",
      metaDescription: grazingArea.metaDescription || "",
      keywords: grazingArea.keywords || "",

      // Geometry fields
      locationPoint: grazingArea.locationPoint,
      areaPolygon: grazingArea.areaPolygon,
    },
  });

  // Update grazing area mutation
  const { mutate: updateGrazingArea, isLoading } =
    api.grazingArea.update.useMutation({
      onSuccess: () => {
        toast.success("चरन खर्क क्षेत्र सफलतापूर्वक अपडेट गरियो");
        router.push(
          `/dashboard/digital-profile/institutions/agricultural/grazing-areas/${grazingArea.id}`,
        );
      },
      onError: (error) => {
        toast.error(`चरन खर्क क्षेत्र अपडेट गर्न असफल: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    updateGrazingArea({
      ...values,
      wardNumber: values.wardNumber ? Number(values.wardNumber) : undefined,
      areaInHectares: values.areaInHectares
        ? Number(values.areaInHectares)
        : undefined,
      elevationInMeters: values.elevationInMeters
        ? Number(values.elevationInMeters)
        : undefined,
      livestockCapacity: values.livestockCapacity
        ? Number(values.livestockCapacity)
        : undefined,
      waterSourceDistance: values.waterSourceDistance
        ? Number(values.waterSourceDistance)
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
              <BasicGrazingAreaDetails form={form} />

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
              <GrazingAreaFeaturesDetails form={form} />
              <SEOFields form={form} />

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
                  चरन खर्क क्षेत्रको स्थान जानकारी
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <GrazingAreaLocationMap
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
                <Button type="submit" disabled={isLoading}>
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
