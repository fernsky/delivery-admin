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
import { SEOFields } from "../../farms/edit/_components/seo-fields";
import { FishFarmLocationMap } from "../../create/_components/fish-farm-location-map";
import { BasicFishFarmDetails } from "../../create/_components/basic-fish-farm-details";
import { WaterBodyDetails } from "../../create/_components/water-body-details";
import { CultureAndManagementDetails } from "../../create/_components/culture-management-details";
import { InfrastructureDetails } from "../../create/_components/infrastructure-details";
import { ProductionDetails } from "../../create/_components/production-details";
import { EconomicsDetails } from "../../create/_components/economics-details";
import { SustainabilityDetails } from "../../create/_components/sustainability-details";

// Define the form schema based on the fish farm data structure
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Fish farm name is required"),
  description: z.string().optional(),
  farmType: z.string(),

  // Location details
  wardNumber: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  ownershipType: z.string().optional(),
  totalAreaInHectares: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  waterSurfaceAreaInHectares: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  operationalSince: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Water body characteristics
  totalPondCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  activePondCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  averagePondSizeInSquareMeters: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  averageWaterDepthInMeters: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  totalWaterVolumeInCubicMeters: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  waterSource: z.string().optional(),
  waterSourceDetails: z.string().optional(),
  waterAvailabilityIssues: z.string().optional(),
  hasWaterQualityMonitoring: z.boolean().optional(),
  waterQualityParameters: z.string().optional(),

  // Culture and management details
  cultureSystem: z.string().optional(),
  primaryFishSpecies: z.string().optional(),
  secondaryFishSpecies: z.string().optional(),
  seedSourceDetails: z.string().optional(),
  stockingDensityPerSquareMeter: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  growoutPeriodInMonths: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  feedingSystem: z.string().optional(),
  feedTypes: z.string().optional(),
  feedConversionRatio: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  annualFeedUsageInKg: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Water management
  waterManagementSystem: z.string().optional(),
  usesProbiotics: z.boolean().optional(),
  usesAeration: z.boolean().optional(),
  aerationType: z.string().optional(),
  waterExchangeFrequency: z.string().optional(),
  waterExchangePercentage: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  effluentManagementDetails: z.string().optional(),

  // Production details
  annualProductionInKg: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  averageYieldPerHectareInKg: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  survivalRatePercentage: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  averageFishSizeInGrams: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  recordedYearProduction: z.string().optional(),
  productionCycles: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Infrastructure and equipment
  hasFarmHouse: z.boolean().optional(),
  hasHatchery: z.boolean().optional(),
  hatcheryCapacity: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hasNursery: z.boolean().optional(),
  nurseryAreaInSquareMeters: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hasFeedStorage: z.boolean().optional(),
  hasEquipment: z.boolean().optional(),
  equipmentDetails: z.string().optional(),
  hasLaboratory: z.boolean().optional(),
  laboratoryPurpose: z.string().optional(),
  hasIceProduction: z.boolean().optional(),
  hasProcessingArea: z.boolean().optional(),
  hasElectricity: z.boolean().optional(),
  hasGenerator: z.boolean().optional(),
  hasFencing: z.boolean().optional(),
  hasSecuritySystem: z.boolean().optional(),

  // Personnel and management
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  managerName: z.string().optional(),
  managerContact: z.string().optional(),
  technicalStaffCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  regularStaffCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  seasonalLaborCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hasTrainedStaff: z.boolean().optional(),
  trainingDetails: z.string().optional(),

  // Economic aspects
  annualOperatingCostNPR: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  annualRevenueNPR: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  profitableOperation: z.boolean().optional(),
  marketAccessDetails: z.string().optional(),
  majorBuyerTypes: z.string().optional(),
  averageSellingPricePerKg: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Health management
  commonDiseases: z.string().optional(),
  diseasePreventionMethods: z.string().optional(),
  usesChemicals: z.boolean().optional(),
  chemicalUsageDetails: z.string().optional(),
  mortalityPercentage: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  healthMonitoringFrequency: z.string().optional(),

  // Sustainability aspects
  hasEnvironmentalImpactAssessment: z.boolean().optional(),
  usesRenewableEnergy: z.boolean().optional(),
  renewableEnergyDetails: z.string().optional(),
  wasteManagementPractices: z.string().optional(),
  hasCertifications: z.boolean().optional(),
  certificationDetails: z.string().optional(),

  // Challenges and support
  majorConstraints: z.string().optional(),
  disasterVulnerabilities: z.string().optional(),
  receivesGovernmentSupport: z.boolean().optional(),
  governmentSupportDetails: z.string().optional(),
  receivesNGOSupport: z.boolean().optional(),
  ngoSupportDetails: z.string().optional(),
  technicalSupportNeeds: z.string().optional(),

  // Future plans
  expansionPlans: z.string().optional(),
  diversificationPlans: z.string().optional(),
  technologyUpgradePlans: z.string().optional(),

  // Linked entities
  linkedProcessingCenters: z
    .array(z.object({ id: z.string(), name: z.string().optional() }))
    .optional(),
  linkedWaterBodies: z
    .array(z.object({ id: z.string(), name: z.string().optional() }))
    .optional(),

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
  farmBoundary: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),
  pondPolygons: z
    .object({
      type: z.literal("MultiPolygon"),
      coordinates: z.array(z.array(z.array(z.tuple([z.number(), z.number()])))),
    })
    .optional(),

  // Status
  isVerified: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FishFarmEditFormProps {
  fishFarm: any;
}

export function FishFarmEditForm({ fishFarm }: FishFarmEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with fish farm data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: fishFarm.id,
      name: fishFarm.name || "",
      description: fishFarm.description || "",
      farmType: fishFarm.farmType || "POND_CULTURE",

      // Location details
      wardNumber: fishFarm.wardNumber?.toString() || "",
      location: fishFarm.location || "",
      address: fishFarm.address || "",

      // Physical details
      ownershipType: fishFarm.ownershipType || undefined,
      totalAreaInHectares: fishFarm.totalAreaInHectares?.toString() || "",
      waterSurfaceAreaInHectares:
        fishFarm.waterSurfaceAreaInHectares?.toString() || "",
      operationalSince: fishFarm.operationalSince?.toString() || "",

      // Water body characteristics
      totalPondCount: fishFarm.totalPondCount?.toString() || "",
      activePondCount: fishFarm.activePondCount?.toString() || "",
      averagePondSizeInSquareMeters:
        fishFarm.averagePondSizeInSquareMeters?.toString() || "",
      averageWaterDepthInMeters:
        fishFarm.averageWaterDepthInMeters?.toString() || "",
      totalWaterVolumeInCubicMeters:
        fishFarm.totalWaterVolumeInCubicMeters?.toString() || "",
      waterSource: fishFarm.waterSource || undefined,
      waterSourceDetails: fishFarm.waterSourceDetails || "",
      waterAvailabilityIssues: fishFarm.waterAvailabilityIssues || "",
      hasWaterQualityMonitoring: fishFarm.hasWaterQualityMonitoring || false,
      waterQualityParameters: fishFarm.waterQualityParameters || "",

      // Culture and management details
      cultureSystem: fishFarm.cultureSystem || undefined,
      primaryFishSpecies: fishFarm.primaryFishSpecies || "",
      secondaryFishSpecies: fishFarm.secondaryFishSpecies || "",
      seedSourceDetails: fishFarm.seedSourceDetails || "",
      stockingDensityPerSquareMeter:
        fishFarm.stockingDensityPerSquareMeter?.toString() || "",
      growoutPeriodInMonths: fishFarm.growoutPeriodInMonths?.toString() || "",
      feedingSystem: fishFarm.feedingSystem || undefined,
      feedTypes: fishFarm.feedTypes || "",
      feedConversionRatio: fishFarm.feedConversionRatio?.toString() || "",
      annualFeedUsageInKg: fishFarm.annualFeedUsageInKg?.toString() || "",

      // Water management
      waterManagementSystem: fishFarm.waterManagementSystem || undefined,
      usesProbiotics: fishFarm.usesProbiotics || false,
      usesAeration: fishFarm.usesAeration || false,
      aerationType: fishFarm.aerationType || "",
      waterExchangeFrequency: fishFarm.waterExchangeFrequency || "",
      waterExchangePercentage:
        fishFarm.waterExchangePercentage?.toString() || "",
      effluentManagementDetails: fishFarm.effluentManagementDetails || "",

      // Production details
      annualProductionInKg: fishFarm.annualProductionInKg?.toString() || "",
      averageYieldPerHectareInKg:
        fishFarm.averageYieldPerHectareInKg?.toString() || "",
      survivalRatePercentage: fishFarm.survivalRatePercentage?.toString() || "",
      averageFishSizeInGrams: fishFarm.averageFishSizeInGrams?.toString() || "",
      recordedYearProduction: fishFarm.recordedYearProduction || "",
      productionCycles: fishFarm.productionCycles?.toString() || "",

      // Infrastructure and equipment
      hasFarmHouse: fishFarm.hasFarmHouse || false,
      hasHatchery: fishFarm.hasHatchery || false,
      hatcheryCapacity: fishFarm.hatcheryCapacity?.toString() || "",
      hasNursery: fishFarm.hasNursery || false,
      nurseryAreaInSquareMeters:
        fishFarm.nurseryAreaInSquareMeters?.toString() || "",
      hasFeedStorage: fishFarm.hasFeedStorage || false,
      hasEquipment: fishFarm.hasEquipment || false,
      equipmentDetails: fishFarm.equipmentDetails || "",
      hasLaboratory: fishFarm.hasLaboratory || false,
      laboratoryPurpose: fishFarm.laboratoryPurpose || "",
      hasIceProduction: fishFarm.hasIceProduction || false,
      hasProcessingArea: fishFarm.hasProcessingArea || false,
      hasElectricity: fishFarm.hasElectricity || false,
      hasGenerator: fishFarm.hasGenerator || false,
      hasFencing: fishFarm.hasFencing || false,
      hasSecuritySystem: fishFarm.hasSecuritySystem || false,

      // Personnel and management
      ownerName: fishFarm.ownerName || "",
      ownerContact: fishFarm.ownerContact || "",
      managerName: fishFarm.managerName || "",
      managerContact: fishFarm.managerContact || "",
      technicalStaffCount: fishFarm.technicalStaffCount?.toString() || "",
      regularStaffCount: fishFarm.regularStaffCount?.toString() || "",
      seasonalLaborCount: fishFarm.seasonalLaborCount?.toString() || "",
      hasTrainedStaff: fishFarm.hasTrainedStaff || false,
      trainingDetails: fishFarm.trainingDetails || "",

      // Economic aspects
      annualOperatingCostNPR: fishFarm.annualOperatingCostNPR?.toString() || "",
      annualRevenueNPR: fishFarm.annualRevenueNPR?.toString() || "",
      profitableOperation:
        fishFarm.profitableOperation !== undefined
          ? fishFarm.profitableOperation
          : true,
      marketAccessDetails: fishFarm.marketAccessDetails || "",
      majorBuyerTypes: fishFarm.majorBuyerTypes || "",
      averageSellingPricePerKg:
        fishFarm.averageSellingPricePerKg?.toString() || "",

      // Health management
      commonDiseases: fishFarm.commonDiseases || "",
      diseasePreventionMethods: fishFarm.diseasePreventionMethods || "",
      usesChemicals: fishFarm.usesChemicals || false,
      chemicalUsageDetails: fishFarm.chemicalUsageDetails || "",
      mortalityPercentage: fishFarm.mortalityPercentage?.toString() || "",
      healthMonitoringFrequency: fishFarm.healthMonitoringFrequency || "",

      // Sustainability aspects
      hasEnvironmentalImpactAssessment:
        fishFarm.hasEnvironmentalImpactAssessment || false,
      usesRenewableEnergy: fishFarm.usesRenewableEnergy || false,
      renewableEnergyDetails: fishFarm.renewableEnergyDetails || "",
      wasteManagementPractices: fishFarm.wasteManagementPractices || "",
      hasCertifications: fishFarm.hasCertifications || false,
      certificationDetails: fishFarm.certificationDetails || "",

      // Challenges and support
      majorConstraints: fishFarm.majorConstraints || "",
      disasterVulnerabilities: fishFarm.disasterVulnerabilities || "",
      receivesGovernmentSupport: fishFarm.receivesGovernmentSupport || false,
      governmentSupportDetails: fishFarm.governmentSupportDetails || "",
      receivesNGOSupport: fishFarm.receivesNGOSupport || false,
      ngoSupportDetails: fishFarm.ngoSupportDetails || "",
      technicalSupportNeeds: fishFarm.technicalSupportNeeds || "",

      // Future plans
      expansionPlans: fishFarm.expansionPlans || "",
      diversificationPlans: fishFarm.diversificationPlans || "",
      technologyUpgradePlans: fishFarm.technologyUpgradePlans || "",

      // Linked entities
      linkedProcessingCenters: fishFarm.linkedProcessingCenters || [],
      linkedWaterBodies: fishFarm.linkedWaterBodies || [],

      // SEO fields
      metaTitle: fishFarm.metaTitle || "",
      metaDescription: fishFarm.metaDescription || "",
      keywords: fishFarm.keywords || "",

      // Geometry fields
      locationPoint: fishFarm.locationPoint || undefined,
      farmBoundary: fishFarm.farmBoundary || undefined,
      pondPolygons: fishFarm.pondPolygons || undefined,

      // Status
      isVerified: fishFarm.isVerified || false,
    },
  });

  // Update fish farm mutation
  const { mutate: updateFishFarm, isLoading } =
    api.profile.agriculture.fishFarms.update.useMutation({
      onSuccess: () => {
        toast.success("Fish farm updated successfully");
        router.push(
          `/dashboard/digital-profile/institutions/agricultural/fish-farms/${fishFarm.id}`,
        );
      },
      onError: (error) => {
        toast.error(`Failed to update fish farm: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    updateFishFarm({
      ...values,
      // Convert string number fields to actual numbers where needed
      wardNumber: values.wardNumber ? Number(values.wardNumber) : undefined,
      totalAreaInHectares: values.totalAreaInHectares
        ? Number(values.totalAreaInHectares)
        : undefined,
      waterSurfaceAreaInHectares: values.waterSurfaceAreaInHectares
        ? Number(values.waterSurfaceAreaInHectares)
        : undefined,
      operationalSince: values.operationalSince
        ? Number(values.operationalSince)
        : undefined,
      totalPondCount: values.totalPondCount
        ? Number(values.totalPondCount)
        : undefined,
      activePondCount: values.activePondCount
        ? Number(values.activePondCount)
        : undefined,
      averagePondSizeInSquareMeters: values.averagePondSizeInSquareMeters
        ? Number(values.averagePondSizeInSquareMeters)
        : undefined,
      averageWaterDepthInMeters: values.averageWaterDepthInMeters
        ? Number(values.averageWaterDepthInMeters)
        : undefined,
      totalWaterVolumeInCubicMeters: values.totalWaterVolumeInCubicMeters
        ? Number(values.totalWaterVolumeInCubicMeters)
        : undefined,
      stockingDensityPerSquareMeter: values.stockingDensityPerSquareMeter
        ? Number(values.stockingDensityPerSquareMeter)
        : undefined,
      growoutPeriodInMonths: values.growoutPeriodInMonths
        ? Number(values.growoutPeriodInMonths)
        : undefined,
      feedConversionRatio: values.feedConversionRatio
        ? Number(values.feedConversionRatio)
        : undefined,
      annualFeedUsageInKg: values.annualFeedUsageInKg
        ? Number(values.annualFeedUsageInKg)
        : undefined,
      waterExchangePercentage: values.waterExchangePercentage
        ? Number(values.waterExchangePercentage)
        : undefined,
      annualProductionInKg: values.annualProductionInKg
        ? Number(values.annualProductionInKg)
        : undefined,
      averageYieldPerHectareInKg: values.averageYieldPerHectareInKg
        ? Number(values.averageYieldPerHectareInKg)
        : undefined,
      survivalRatePercentage: values.survivalRatePercentage
        ? Number(values.survivalRatePercentage)
        : undefined,
      averageFishSizeInGrams: values.averageFishSizeInGrams
        ? Number(values.averageFishSizeInGrams)
        : undefined,
      productionCycles: values.productionCycles
        ? Number(values.productionCycles)
        : undefined,
      hatcheryCapacity: values.hatcheryCapacity
        ? Number(values.hatcheryCapacity)
        : undefined,
      nurseryAreaInSquareMeters: values.nurseryAreaInSquareMeters
        ? Number(values.nurseryAreaInSquareMeters)
        : undefined,
      technicalStaffCount: values.technicalStaffCount
        ? Number(values.technicalStaffCount)
        : undefined,
      regularStaffCount: values.regularStaffCount
        ? Number(values.regularStaffCount)
        : undefined,
      seasonalLaborCount: values.seasonalLaborCount
        ? Number(values.seasonalLaborCount)
        : undefined,
      annualOperatingCostNPR: values.annualOperatingCostNPR
        ? Number(values.annualOperatingCostNPR)
        : undefined,
      annualRevenueNPR: values.annualRevenueNPR
        ? Number(values.annualRevenueNPR)
        : undefined,
      averageSellingPricePerKg: values.averageSellingPricePerKg
        ? Number(values.averageSellingPricePerKg)
        : undefined,
      mortalityPercentage: values.mortalityPercentage
        ? Number(values.mortalityPercentage)
        : undefined,
    });
  };

  // Handle geometry selection from map
  const handleGeometrySelect = (
    locationPoint?: { type: "Point"; coordinates: [number, number] },
    farmBoundary?: {
      type: "Polygon";
      coordinates: Array<Array<[number, number]>>;
    },
    pondPolygons?: {
      type: "MultiPolygon";
      coordinates: Array<Array<Array<[number, number]>>>;
    },
  ) => {
    if (locationPoint) {
      form.setValue("locationPoint", locationPoint);
    }
    if (farmBoundary) {
      form.setValue("farmBoundary", farmBoundary);
    }
    if (pondPolygons) {
      form.setValue("pondPolygons", pondPolygons);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6 gap-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="waterbody">Water Body</TabsTrigger>
          <TabsTrigger value="culture">Culture & Production</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicFishFarmDetails
                formData={{
                  name: form.watch("name"),
                  description: form.watch("description"),
                  farmType: form.watch("farmType"),
                  ownershipType: form.watch("ownershipType"),
                  operationalSince: form.watch("operationalSince")
                    ? Number(form.watch("operationalSince"))
                    : undefined,
                  metaTitle: form.watch("metaTitle"),
                  metaDescription: form.watch("metaDescription"),
                  keywords: form.watch("keywords"),
                  isVerified: form.watch("isVerified"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <SEOFields form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={() => setActiveTab("waterbody")}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="waterbody">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <WaterBodyDetails
                formData={{
                  totalAreaInHectares: form.watch("totalAreaInHectares")
                    ? Number(form.watch("totalAreaInHectares"))
                    : undefined,
                  waterSurfaceAreaInHectares: form.watch(
                    "waterSurfaceAreaInHectares",
                  )
                    ? Number(form.watch("waterSurfaceAreaInHectares"))
                    : undefined,
                  totalPondCount: form.watch("totalPondCount")
                    ? Number(form.watch("totalPondCount"))
                    : undefined,
                  activePondCount: form.watch("activePondCount")
                    ? Number(form.watch("activePondCount"))
                    : undefined,
                  averagePondSizeInSquareMeters: form.watch(
                    "averagePondSizeInSquareMeters",
                  )
                    ? Number(form.watch("averagePondSizeInSquareMeters"))
                    : undefined,
                  averageWaterDepthInMeters: form.watch(
                    "averageWaterDepthInMeters",
                  )
                    ? Number(form.watch("averageWaterDepthInMeters"))
                    : undefined,
                  totalWaterVolumeInCubicMeters: form.watch(
                    "totalWaterVolumeInCubicMeters",
                  )
                    ? Number(form.watch("totalWaterVolumeInCubicMeters"))
                    : undefined,
                  waterSource: form.watch("waterSource"),
                  waterSourceDetails: form.watch("waterSourceDetails"),
                  waterAvailabilityIssues: form.watch(
                    "waterAvailabilityIssues",
                  ),
                  hasWaterQualityMonitoring: form.watch(
                    "hasWaterQualityMonitoring",
                  ),
                  waterQualityParameters: form.watch("waterQualityParameters"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("basic")}
                >
                  Back
                </Button>
                <Button type="button" onClick={() => setActiveTab("culture")}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="culture">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CultureAndManagementDetails
                formData={{
                  cultureSystem: form.watch("cultureSystem"),
                  primaryFishSpecies: form.watch("primaryFishSpecies"),
                  secondaryFishSpecies: form.watch("secondaryFishSpecies"),
                  seedSourceDetails: form.watch("seedSourceDetails"),
                  stockingDensityPerSquareMeter: form.watch(
                    "stockingDensityPerSquareMeter",
                  )
                    ? Number(form.watch("stockingDensityPerSquareMeter"))
                    : undefined,
                  growoutPeriodInMonths: form.watch("growoutPeriodInMonths")
                    ? Number(form.watch("growoutPeriodInMonths"))
                    : undefined,
                  feedingSystem: form.watch("feedingSystem"),
                  feedTypes: form.watch("feedTypes"),
                  feedConversionRatio: form.watch("feedConversionRatio")
                    ? Number(form.watch("feedConversionRatio"))
                    : undefined,
                  annualFeedUsageInKg: form.watch("annualFeedUsageInKg")
                    ? Number(form.watch("annualFeedUsageInKg"))
                    : undefined,
                  waterManagementSystem: form.watch("waterManagementSystem"),
                  usesProbiotics: form.watch("usesProbiotics"),
                  usesAeration: form.watch("usesAeration"),
                  aerationType: form.watch("aerationType"),
                  waterExchangeFrequency: form.watch("waterExchangeFrequency"),
                  waterExchangePercentage: form.watch("waterExchangePercentage")
                    ? Number(form.watch("waterExchangePercentage"))
                    : undefined,
                  effluentManagementDetails: form.watch(
                    "effluentManagementDetails",
                  ),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <ProductionDetails
                formData={{
                  annualProductionInKg: form.watch("annualProductionInKg")
                    ? Number(form.watch("annualProductionInKg"))
                    : undefined,
                  averageYieldPerHectareInKg: form.watch(
                    "averageYieldPerHectareInKg",
                  )
                    ? Number(form.watch("averageYieldPerHectareInKg"))
                    : undefined,
                  survivalRatePercentage: form.watch("survivalRatePercentage")
                    ? Number(form.watch("survivalRatePercentage"))
                    : undefined,
                  averageFishSizeInGrams: form.watch("averageFishSizeInGrams")
                    ? Number(form.watch("averageFishSizeInGrams"))
                    : undefined,
                  recordedYearProduction: form.watch("recordedYearProduction"),
                  productionCycles: form.watch("productionCycles")
                    ? Number(form.watch("productionCycles"))
                    : undefined,
                  commonDiseases: form.watch("commonDiseases"),
                  diseasePreventionMethods: form.watch(
                    "diseasePreventionMethods",
                  ),
                  usesChemicals: form.watch("usesChemicals"),
                  chemicalUsageDetails: form.watch("chemicalUsageDetails"),
                  mortalityPercentage: form.watch("mortalityPercentage")
                    ? Number(form.watch("mortalityPercentage"))
                    : undefined,
                  healthMonitoringFrequency: form.watch(
                    "healthMonitoringFrequency",
                  ),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <InfrastructureDetails
                formData={{
                  hasFarmHouse: form.watch("hasFarmHouse"),
                  hasHatchery: form.watch("hasHatchery"),
                  hatcheryCapacity: form.watch("hatcheryCapacity")
                    ? Number(form.watch("hatcheryCapacity"))
                    : undefined,
                  hasNursery: form.watch("hasNursery"),
                  nurseryAreaInSquareMeters: form.watch(
                    "nurseryAreaInSquareMeters",
                  )
                    ? Number(form.watch("nurseryAreaInSquareMeters"))
                    : undefined,
                  hasFeedStorage: form.watch("hasFeedStorage"),
                  hasEquipment: form.watch("hasEquipment"),
                  equipmentDetails: form.watch("equipmentDetails"),
                  hasLaboratory: form.watch("hasLaboratory"),
                  laboratoryPurpose: form.watch("laboratoryPurpose"),
                  hasIceProduction: form.watch("hasIceProduction"),
                  hasProcessingArea: form.watch("hasProcessingArea"),
                  hasElectricity: form.watch("hasElectricity"),
                  hasGenerator: form.watch("hasGenerator"),
                  hasFencing: form.watch("hasFencing"),
                  hasSecuritySystem: form.watch("hasSecuritySystem"),
                  ownerName: form.watch("ownerName"),
                  ownerContact: form.watch("ownerContact"),
                  managerName: form.watch("managerName"),
                  managerContact: form.watch("managerContact"),
                  technicalStaffCount: form.watch("technicalStaffCount")
                    ? Number(form.watch("technicalStaffCount"))
                    : undefined,
                  regularStaffCount: form.watch("regularStaffCount")
                    ? Number(form.watch("regularStaffCount"))
                    : undefined,
                  seasonalLaborCount: form.watch("seasonalLaborCount")
                    ? Number(form.watch("seasonalLaborCount"))
                    : undefined,
                  hasTrainedStaff: form.watch("hasTrainedStaff"),
                  trainingDetails: form.watch("trainingDetails"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <EconomicsDetails
                formData={{
                  annualOperatingCostNPR: form.watch("annualOperatingCostNPR")
                    ? Number(form.watch("annualOperatingCostNPR"))
                    : undefined,
                  annualRevenueNPR: form.watch("annualRevenueNPR")
                    ? Number(form.watch("annualRevenueNPR"))
                    : undefined,
                  profitableOperation: form.watch("profitableOperation"),
                  marketAccessDetails: form.watch("marketAccessDetails"),
                  majorBuyerTypes: form.watch("majorBuyerTypes"),
                  averageSellingPricePerKg: form.watch(
                    "averageSellingPricePerKg",
                  )
                    ? Number(form.watch("averageSellingPricePerKg"))
                    : undefined,
                  linkedProcessingCenters: form.watch(
                    "linkedProcessingCenters",
                  ),
                  linkedWaterBodies: form.watch("linkedWaterBodies"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <SustainabilityDetails
                formData={{
                  hasEnvironmentalImpactAssessment: form.watch(
                    "hasEnvironmentalImpactAssessment",
                  ),
                  usesRenewableEnergy: form.watch("usesRenewableEnergy"),
                  renewableEnergyDetails: form.watch("renewableEnergyDetails"),
                  wasteManagementPractices: form.watch(
                    "wasteManagementPractices",
                  ),
                  hasCertifications: form.watch("hasCertifications"),
                  certificationDetails: form.watch("certificationDetails"),
                  majorConstraints: form.watch("majorConstraints"),
                  disasterVulnerabilities: form.watch(
                    "disasterVulnerabilities",
                  ),
                  receivesGovernmentSupport: form.watch(
                    "receivesGovernmentSupport",
                  ),
                  governmentSupportDetails: form.watch(
                    "governmentSupportDetails",
                  ),
                  receivesNGOSupport: form.watch("receivesNGOSupport"),
                  ngoSupportDetails: form.watch("ngoSupportDetails"),
                  technicalSupportNeeds: form.watch("technicalSupportNeeds"),
                  expansionPlans: form.watch("expansionPlans"),
                  diversificationPlans: form.watch("diversificationPlans"),
                  technologyUpgradePlans: form.watch("technologyUpgradePlans"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("waterbody")}
                >
                  Back
                </Button>
                <Button type="button" onClick={() => setActiveTab("location")}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="location">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="text-lg font-medium">Fish Farm Location</div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <FishFarmLocationMap
                      formData={{
                        wardNumber: form.watch("wardNumber")
                          ? Number(form.watch("wardNumber"))
                          : undefined,
                        location: form.watch("location"),
                        address: form.watch("address"),
                        locationPoint: form.watch("locationPoint"),
                        farmBoundary: form.watch("farmBoundary"),
                        pondPolygons: form.watch("pondPolygons"),
                      }}
                      updateFormData={(field, value) =>
                        form.setValue(field, value)
                      }
                      updateMapData={handleGeometrySelect}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("culture")}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
