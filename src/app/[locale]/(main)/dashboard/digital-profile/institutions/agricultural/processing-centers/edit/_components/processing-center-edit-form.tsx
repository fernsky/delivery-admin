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
import { ProcessingCenterLocationMap } from "../../create/_components/processing-center-location-map";
import { BasicProcessingCenterDetails } from "../../create/_components/basic-processing-center-details";
import { ProcessingCenterFacilitiesDetails } from "../../create/_components/processing-center-facilities-details";
import { SEOFields } from "./seo-fields";

// Define enums for processing center form
const centerTypeEnum = [
  "COLLECTION_CENTER",
  "STORAGE_FACILITY",
  "PROCESSING_UNIT",
  "MULTIPURPOSE_CENTER",
  "MARKET_CENTER",
  "COLD_STORAGE",
  "WAREHOUSE",
  "OTHER",
];

const storageTypeEnum = [
  "AMBIENT",
  "COLD_STORAGE",
  "CONTROLLED_ATMOSPHERE",
  "SILO",
  "WAREHOUSE",
  "GRANARY",
  "MIXED",
  "OTHER",
];

const processingLevelEnum = [
  "PRIMARY_PROCESSING",
  "SECONDARY_PROCESSING",
  "TERTIARY_PROCESSING",
  "MINIMAL_PROCESSING",
  "COMPREHENSIVE_PROCESSING",
  "NOT_APPLICABLE",
];

const ownershipTypeEnum = [
  "GOVERNMENT",
  "PRIVATE",
  "COOPERATIVE",
  "COMMUNITY",
  "PUBLIC_PRIVATE_PARTNERSHIP",
  "NGO_MANAGED",
  "MIXED",
];

// Define the form schema
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "प्रशोधन केन्द्रको नाम आवश्यक छ"),
  description: z.string().optional(),
  centerType: z.enum(centerTypeEnum as [string, ...string[]]),

  // Location details
  wardNumber: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical properties
  areaInSquareMeters: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  buildingYearConstructed: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  isOperational: z.boolean().optional(),
  operationalStatus: z.string().optional(),
  operationStartYear: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Storage details
  hasStorageFacility: z.boolean().default(false),
  storageType: z.enum(storageTypeEnum as [string, ...string[]]).optional(),
  storageTotalCapacityMT: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  storageCurrentUsageMT: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  temperatureControlled: z.boolean().default(false),
  temperatureRangeMin: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  temperatureRangeMax: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  humidityControlled: z.boolean().default(false),

  // Processing capabilities
  hasProcessingUnit: z.boolean().default(false),
  processingLevel: z
    .enum(processingLevelEnum as [string, ...string[]])
    .optional(),
  processingCapacityMTPerDay: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  mainProcessingActivities: z.string().optional(),
  valueAdditionActivities: z.string().optional(),

  // Products and commodities
  primaryCommodities: z.string().optional(),
  secondaryCommodities: z.string().optional(),
  seasonalAvailability: z.string().optional(),

  // Quality control
  hasQualityControlLab: z.boolean().default(false),
  qualityStandards: z.string().optional(),
  certifications: z.string().optional(),

  // Management and ownership
  ownershipType: z.enum(ownershipTypeEnum as [string, ...string[]]).optional(),
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  managerName: z.string().optional(),
  managerContact: z.string().optional(),

  // Staffing
  totalStaffCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  technicalStaffCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Connectivity and services
  hasElectricity: z.boolean().default(true),
  hasWaterSupply: z.boolean().default(true),
  hasWasteManagementSystem: z.boolean().default(false),
  hasInternet: z.boolean().default(false),

  // Capacity and utilization
  annualThroughputMT: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  capacityUtilizationPercent: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  recordedYear: z.string().optional(),

  // Economic impact
  employmentGenerated: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  serviceAreaRadiusKM: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  farmersServedCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  womenFarmersPercent: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Financial aspects
  establishmentCostNPR: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  annualOperatingCostNPR: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  annualRevenueNPR: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  profitableOperation: z.boolean().default(true),

  // Challenges and needs
  majorConstraints: z.string().optional(),
  developmentNeeds: z.string().optional(),

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
  facilityFootprint: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProcessingCenterEditFormProps {
  processingCenter: any;
}

export function ProcessingCenterEditForm({
  processingCenter,
}: ProcessingCenterEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with processing center data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: processingCenter.id,
      name: processingCenter.name || "",
      description: processingCenter.description || "",
      centerType: processingCenter.centerType,

      // Location details
      wardNumber: processingCenter.wardNumber?.toString() || "",
      location: processingCenter.location || "",
      address: processingCenter.address || "",

      // Physical properties
      areaInSquareMeters: processingCenter.areaInSquareMeters?.toString() || "",
      buildingYearConstructed:
        processingCenter.buildingYearConstructed?.toString() || "",
      isOperational: processingCenter.isOperational ?? true,
      operationalStatus: processingCenter.operationalStatus || "",
      operationStartYear: processingCenter.operationStartYear?.toString() || "",

      // Storage details
      hasStorageFacility: processingCenter.hasStorageFacility || false,
      storageType: processingCenter.storageType || undefined,
      storageTotalCapacityMT:
        processingCenter.storageTotalCapacityMT?.toString() || "",
      storageCurrentUsageMT:
        processingCenter.storageCurrentUsageMT?.toString() || "",
      temperatureControlled: processingCenter.temperatureControlled || false,
      temperatureRangeMin:
        processingCenter.temperatureRangeMin?.toString() || "",
      temperatureRangeMax:
        processingCenter.temperatureRangeMax?.toString() || "",
      humidityControlled: processingCenter.humidityControlled || false,

      // Processing capabilities
      hasProcessingUnit: processingCenter.hasProcessingUnit || false,
      processingLevel: processingCenter.processingLevel || undefined,
      processingCapacityMTPerDay:
        processingCenter.processingCapacityMTPerDay?.toString() || "",
      mainProcessingActivities: processingCenter.mainProcessingActivities || "",
      valueAdditionActivities: processingCenter.valueAdditionActivities || "",

      // Products and commodities
      primaryCommodities: processingCenter.primaryCommodities || "",
      secondaryCommodities: processingCenter.secondaryCommodities || "",
      seasonalAvailability: processingCenter.seasonalAvailability || "",

      // Quality control
      hasQualityControlLab: processingCenter.hasQualityControlLab || false,
      qualityStandards: processingCenter.qualityStandards || "",
      certifications: processingCenter.certifications || "",

      // Management and ownership
      ownershipType: processingCenter.ownershipType || undefined,
      ownerName: processingCenter.ownerName || "",
      ownerContact: processingCenter.ownerContact || "",
      managerName: processingCenter.managerName || "",
      managerContact: processingCenter.managerContact || "",

      // Staffing
      totalStaffCount: processingCenter.totalStaffCount?.toString() || "",
      technicalStaffCount:
        processingCenter.technicalStaffCount?.toString() || "",

      // Connectivity and services
      hasElectricity: processingCenter.hasElectricity ?? true,
      hasWaterSupply: processingCenter.hasWaterSupply ?? true,
      hasWasteManagementSystem:
        processingCenter.hasWasteManagementSystem || false,
      hasInternet: processingCenter.hasInternet || false,

      // Capacity and utilization
      annualThroughputMT: processingCenter.annualThroughputMT?.toString() || "",
      capacityUtilizationPercent:
        processingCenter.capacityUtilizationPercent?.toString() || "",
      recordedYear: processingCenter.recordedYear || "",

      // Economic impact
      employmentGenerated:
        processingCenter.employmentGenerated?.toString() || "",
      serviceAreaRadiusKM:
        processingCenter.serviceAreaRadiusKM?.toString() || "",
      farmersServedCount: processingCenter.farmersServedCount?.toString() || "",
      womenFarmersPercent:
        processingCenter.womenFarmersPercent?.toString() || "",

      // Financial aspects
      establishmentCostNPR:
        processingCenter.establishmentCostNPR?.toString() || "",
      annualOperatingCostNPR:
        processingCenter.annualOperatingCostNPR?.toString() || "",
      annualRevenueNPR: processingCenter.annualRevenueNPR?.toString() || "",
      profitableOperation: processingCenter.profitableOperation ?? true,

      // Challenges and needs
      majorConstraints: processingCenter.majorConstraints || "",
      developmentNeeds: processingCenter.developmentNeeds || "",

      // SEO fields
      metaTitle: processingCenter.metaTitle || "",
      metaDescription: processingCenter.metaDescription || "",
      keywords: processingCenter.keywords || "",

      // Geometry fields
      locationPoint: processingCenter.locationPoint || undefined,
      facilityFootprint: processingCenter.facilityFootprint || undefined,
    },
  });

  // Update processing center mutation
  const { mutate: updateProcessingCenter, isLoading } =
    api.profile.processingCenters.update.useMutation({
      onSuccess: () => {
        toast.success("कृषि प्रशोधन केन्द्र सफलतापूर्वक अपडेट गरियो");
        router.push(
          `/dashboard/digital-profile/institutions/agricultural/processing-centers/${processingCenter.id}`,
        );
      },
      onError: (error) => {
        toast.error(`कृषि प्रशोधन केन्द्र अपडेट गर्न असफल: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    updateProcessingCenter({
      ...values,
      wardNumber: values.wardNumber ? Number(values.wardNumber) : undefined,
      areaInSquareMeters: values.areaInSquareMeters
        ? Number(values.areaInSquareMeters)
        : undefined,
      buildingYearConstructed: values.buildingYearConstructed
        ? Number(values.buildingYearConstructed)
        : undefined,
      operationStartYear: values.operationStartYear
        ? Number(values.operationStartYear)
        : undefined,
      storageTotalCapacityMT: values.storageTotalCapacityMT
        ? Number(values.storageTotalCapacityMT)
        : undefined,
      storageCurrentUsageMT: values.storageCurrentUsageMT
        ? Number(values.storageCurrentUsageMT)
        : undefined,
      temperatureRangeMin: values.temperatureRangeMin
        ? Number(values.temperatureRangeMin)
        : undefined,
      temperatureRangeMax: values.temperatureRangeMax
        ? Number(values.temperatureRangeMax)
        : undefined,
      processingCapacityMTPerDay: values.processingCapacityMTPerDay
        ? Number(values.processingCapacityMTPerDay)
        : undefined,
      totalStaffCount: values.totalStaffCount
        ? Number(values.totalStaffCount)
        : undefined,
      technicalStaffCount: values.technicalStaffCount
        ? Number(values.technicalStaffCount)
        : undefined,
      annualThroughputMT: values.annualThroughputMT
        ? Number(values.annualThroughputMT)
        : undefined,
      capacityUtilizationPercent: values.capacityUtilizationPercent
        ? Number(values.capacityUtilizationPercent)
        : undefined,
      employmentGenerated: values.employmentGenerated
        ? Number(values.employmentGenerated)
        : undefined,
      serviceAreaRadiusKM: values.serviceAreaRadiusKM
        ? Number(values.serviceAreaRadiusKM)
        : undefined,
      farmersServedCount: values.farmersServedCount
        ? Number(values.farmersServedCount)
        : undefined,
      womenFarmersPercent: values.womenFarmersPercent
        ? Number(values.womenFarmersPercent)
        : undefined,
      establishmentCostNPR: values.establishmentCostNPR
        ? Number(values.establishmentCostNPR)
        : undefined,
      annualOperatingCostNPR: values.annualOperatingCostNPR
        ? Number(values.annualOperatingCostNPR)
        : undefined,
      annualRevenueNPR: values.annualRevenueNPR
        ? Number(values.annualRevenueNPR)
        : undefined,
    });
  };

  // Handle geometry selection from map
  const handleGeometrySelect = (
    locationPoint?: { type: "Point"; coordinates: [number, number] },
    facilityFootprint?: {
      type: "Polygon";
      coordinates: [Array<[number, number]>];
    },
  ) => {
    if (locationPoint) {
      form.setValue("locationPoint", locationPoint);
    }
    if (facilityFootprint) {
      form.setValue("facilityFootprint", facilityFootprint as any);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">आधारभूत जानकारी</TabsTrigger>
          <TabsTrigger value="facilities">सुविधा विवरण</TabsTrigger>
          <TabsTrigger value="location">स्थान र नक्सा</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicProcessingCenterDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  रद्द गर्नुहोस्
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("facilities")}
                >
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="facilities">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ProcessingCenterFacilitiesDetails form={form} />
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
                  कृषि प्रशोधन केन्द्रको स्थान जानकारी
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <ProcessingCenterLocationMap
                      onGeometrySelect={handleGeometrySelect}
                      initialLocationPoint={form.watch("locationPoint")}
                      initialAreaPolygon={form.watch("facilityFootprint")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("facilities")}
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
