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
import { FarmLocationMap } from "../../create/_components/farm-location-map";
import { BasicFarmDetails } from "../../create/_components/basic-farm-details";
import { CropsAndLivestockDetails } from "../../create/_components/crops-livestock-details";
import { FarmInfrastructureDetails } from "../../create/_components/farm-infrastructure-details";
import { FarmerDetails } from "../../create/_components/farmer-details";
import { ManagementPractices } from "../../create/_components/management-practices";
import { EconomicsDetails } from "../../create/_components/economics-details";
import { SEOFields } from "./seo-fields";

// Define the form schema based on the farm data structure
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Farm name is required"),
  description: z.string().optional(),
  farmType: z.string(),
  farmingSystem: z.string().optional(),

  // Location details
  wardNumber: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Land details
  totalAreaInHectares: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  cultivatedAreaInHectares: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  landOwnership: z.string().optional(),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
  irrigationSourceDetails: z.string().optional(),
  irrigatedAreaInHectares: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Crops
  mainCrops: z.string().optional(),
  secondaryCrops: z.string().optional(),
  cropRotation: z.boolean().optional(),
  cropRotationDetails: z.string().optional(),
  intercropping: z.boolean().optional(),
  croppingSeasons: z.string().optional(),
  annualCropYieldMT: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  recordedYearCrops: z.string().optional(),

  // Livestock
  hasLivestock: z.boolean().optional(),
  livestockTypes: z.string().optional(),
  cattleCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  buffaloCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  goatCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  sheepCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  pigCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  poultryCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  otherLivestockCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  otherLivestockDetails: z.string().optional(),
  livestockHousingType: z.string().optional(),
  livestockManagementDetails: z.string().optional(),
  annualMilkProductionLiters: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  annualEggProduction: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  annualMeatProductionKg: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  recordedYearLivestock: z.string().optional(),

  // Farmer details
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  farmerType: z.string().optional(),
  farmerEducation: z.string().optional(),
  farmerExperienceYears: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hasCooperativeMembership: z.boolean().optional(),
  cooperativeName: z.string().optional(),

  // Labor and economics
  familyLaborCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hiredLaborCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  annualInvestmentNPR: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  annualIncomeNPR: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  profitableOperation: z.boolean().optional(),
  marketAccessDetails: z.string().optional(),
  majorBuyerTypes: z.string().optional(),

  // Infrastructure
  hasFarmHouse: z.boolean().optional(),
  hasStorage: z.boolean().optional(),
  storageCapacityMT: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hasFarmEquipment: z.boolean().optional(),
  equipmentDetails: z.string().optional(),
  hasElectricity: z.boolean().optional(),
  hasRoadAccess: z.boolean().optional(),
  roadAccessType: z.string().optional(),

  // Sustainability and practices
  usesChemicalFertilizer: z.boolean().optional(),
  usesPesticides: z.boolean().optional(),
  usesOrganicMethods: z.boolean().optional(),
  composting: z.boolean().optional(),
  soilConservationPractices: z.string().optional(),
  rainwaterHarvesting: z.boolean().optional(),
  manureManagement: z.string().optional(),
  hasCertifications: z.boolean().optional(),
  certificationDetails: z.string().optional(),

  // Technical support and training
  receivesExtensionServices: z.boolean().optional(),
  extensionServiceProvider: z.string().optional(),
  trainingReceived: z.string().optional(),
  technicalSupportNeeds: z.string().optional(),

  // Challenges and opportunities
  majorChallenges: z.string().optional(),
  disasterVulnerabilities: z.string().optional(),
  growthOpportunities: z.string().optional(),
  futureExpansionPlans: z.string().optional(),

  // Linked entities
  linkedGrazingAreas: z
    .array(z.object({ id: z.string(), name: z.string().optional() }))
    .optional(),
  linkedProcessingCenters: z
    .array(z.object({ id: z.string(), name: z.string().optional() }))
    .optional(),
  linkedAgricZones: z
    .array(z.object({ id: z.string(), name: z.string().optional() }))
    .optional(),
  linkedGrasslands: z
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

  // Status
  isVerified: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FarmEditFormProps {
  farm: any;
}

export function FarmEditForm({ farm }: FarmEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with farm data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: farm.id,
      name: farm.name || "",
      description: farm.description || "",
      farmType: farm.farmType || "MIXED_FARM",
      farmingSystem: farm.farmingSystem || undefined,

      // Location details
      wardNumber: farm.wardNumber?.toString() || "",
      location: farm.location || "",
      address: farm.address || "",

      // Land details
      totalAreaInHectares: farm.totalAreaInHectares?.toString() || "",
      cultivatedAreaInHectares: farm.cultivatedAreaInHectares?.toString() || "",
      landOwnership: farm.landOwnership || undefined,
      soilType: farm.soilType || undefined,
      irrigationType: farm.irrigationType || undefined,
      irrigationSourceDetails: farm.irrigationSourceDetails || "",
      irrigatedAreaInHectares: farm.irrigatedAreaInHectares?.toString() || "",

      // Crops
      mainCrops: farm.mainCrops || "",
      secondaryCrops: farm.secondaryCrops || "",
      cropRotation: farm.cropRotation || false,
      cropRotationDetails: farm.cropRotationDetails || "",
      intercropping: farm.intercropping || false,
      croppingSeasons: farm.croppingSeasons || "",
      annualCropYieldMT: farm.annualCropYieldMT?.toString() || "",
      recordedYearCrops: farm.recordedYearCrops || "",

      // Livestock
      hasLivestock: farm.hasLivestock || false,
      livestockTypes: farm.livestockTypes || "",
      cattleCount: farm.cattleCount?.toString() || "",
      buffaloCount: farm.buffaloCount?.toString() || "",
      goatCount: farm.goatCount?.toString() || "",
      sheepCount: farm.sheepCount?.toString() || "",
      pigCount: farm.pigCount?.toString() || "",
      poultryCount: farm.poultryCount?.toString() || "",
      otherLivestockCount: farm.otherLivestockCount?.toString() || "",
      otherLivestockDetails: farm.otherLivestockDetails || "",
      livestockHousingType: farm.livestockHousingType || undefined,
      livestockManagementDetails: farm.livestockManagementDetails || "",
      annualMilkProductionLiters:
        farm.annualMilkProductionLiters?.toString() || "",
      annualEggProduction: farm.annualEggProduction?.toString() || "",
      annualMeatProductionKg: farm.annualMeatProductionKg?.toString() || "",
      recordedYearLivestock: farm.recordedYearLivestock || "",

      // Farmer details
      ownerName: farm.ownerName || "",
      ownerContact: farm.ownerContact || "",
      farmerType: farm.farmerType || "",
      farmerEducation: farm.farmerEducation || undefined,
      farmerExperienceYears: farm.farmerExperienceYears?.toString() || "",
      hasCooperativeMembership: farm.hasCooperativeMembership || false,
      cooperativeName: farm.cooperativeName || "",

      // Labor and economics
      familyLaborCount: farm.familyLaborCount?.toString() || "",
      hiredLaborCount: farm.hiredLaborCount?.toString() || "",
      annualInvestmentNPR: farm.annualInvestmentNPR?.toString() || "",
      annualIncomeNPR: farm.annualIncomeNPR?.toString() || "",
      profitableOperation: farm.profitableOperation || false,
      marketAccessDetails: farm.marketAccessDetails || "",
      majorBuyerTypes: farm.majorBuyerTypes || "",

      // Infrastructure
      hasFarmHouse: farm.hasFarmHouse || false,
      hasStorage: farm.hasStorage || false,
      storageCapacityMT: farm.storageCapacityMT?.toString() || "",
      hasFarmEquipment: farm.hasFarmEquipment || false,
      equipmentDetails: farm.equipmentDetails || "",
      hasElectricity: farm.hasElectricity || false,
      hasRoadAccess: farm.hasRoadAccess || false,
      roadAccessType: farm.roadAccessType || "",

      // Sustainability and practices
      usesChemicalFertilizer: farm.usesChemicalFertilizer || false,
      usesPesticides: farm.usesPesticides || false,
      usesOrganicMethods: farm.usesOrganicMethods || false,
      composting: farm.composting || false,
      soilConservationPractices: farm.soilConservationPractices || "",
      rainwaterHarvesting: farm.rainwaterHarvesting || false,
      manureManagement: farm.manureManagement || "",
      hasCertifications: farm.hasCertifications || false,
      certificationDetails: farm.certificationDetails || "",

      // Technical support and training
      receivesExtensionServices: farm.receivesExtensionServices || false,
      extensionServiceProvider: farm.extensionServiceProvider || "",
      trainingReceived: farm.trainingReceived || "",
      technicalSupportNeeds: farm.technicalSupportNeeds || "",

      // Challenges and opportunities
      majorChallenges: farm.majorChallenges || "",
      disasterVulnerabilities: farm.disasterVulnerabilities || "",
      growthOpportunities: farm.growthOpportunities || "",
      futureExpansionPlans: farm.futureExpansionPlans || "",

      // Linked entities
      linkedGrazingAreas: farm.linkedGrazingAreas || [],
      linkedProcessingCenters: farm.linkedProcessingCenters || [],
      linkedAgricZones: farm.linkedAgricZones || [],
      linkedGrasslands: farm.linkedGrasslands || [],

      // SEO fields
      metaTitle: farm.metaTitle || "",
      metaDescription: farm.metaDescription || "",
      keywords: farm.keywords || "",

      // Geometry fields
      locationPoint: farm.locationPoint || undefined,
      farmBoundary: farm.farmBoundary || undefined,

      // Status
      isVerified: farm.isVerified || false,
    },
  });

  // Update farm mutation
  const { mutate: updateFarm, isLoading } = api.farm.update.useMutation({
    onSuccess: () => {
      toast.success("Farm updated successfully");
      router.push(
        `/dashboard/digital-profile/institutions/agricultural/farms/${farm.id}`,
      );
    },
    onError: (error) => {
      toast.error(`Failed to update farm: ${error.message}`);
    },
  });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    updateFarm({
      ...values,
      // Convert string number fields to actual numbers
      wardNumber: values.wardNumber ? Number(values.wardNumber) : undefined,
      totalAreaInHectares: values.totalAreaInHectares
        ? Number(values.totalAreaInHectares)
        : undefined,
      cultivatedAreaInHectares: values.cultivatedAreaInHectares
        ? Number(values.cultivatedAreaInHectares)
        : undefined,
      irrigatedAreaInHectares: values.irrigatedAreaInHectares
        ? Number(values.irrigatedAreaInHectares)
        : undefined,
      annualCropYieldMT: values.annualCropYieldMT
        ? Number(values.annualCropYieldMT)
        : undefined,
      cattleCount: values.cattleCount ? Number(values.cattleCount) : undefined,
      buffaloCount: values.buffaloCount
        ? Number(values.buffaloCount)
        : undefined,
      goatCount: values.goatCount ? Number(values.goatCount) : undefined,
      sheepCount: values.sheepCount ? Number(values.sheepCount) : undefined,
      pigCount: values.pigCount ? Number(values.pigCount) : undefined,
      poultryCount: values.poultryCount
        ? Number(values.poultryCount)
        : undefined,
      otherLivestockCount: values.otherLivestockCount
        ? Number(values.otherLivestockCount)
        : undefined,
      annualMilkProductionLiters: values.annualMilkProductionLiters
        ? Number(values.annualMilkProductionLiters)
        : undefined,
      annualEggProduction: values.annualEggProduction
        ? Number(values.annualEggProduction)
        : undefined,
      annualMeatProductionKg: values.annualMeatProductionKg
        ? Number(values.annualMeatProductionKg)
        : undefined,
      farmerExperienceYears: values.farmerExperienceYears
        ? Number(values.farmerExperienceYears)
        : undefined,
      familyLaborCount: values.familyLaborCount
        ? Number(values.familyLaborCount)
        : undefined,
      hiredLaborCount: values.hiredLaborCount
        ? Number(values.hiredLaborCount)
        : undefined,
      annualInvestmentNPR: values.annualInvestmentNPR
        ? Number(values.annualInvestmentNPR)
        : undefined,
      annualIncomeNPR: values.annualIncomeNPR
        ? Number(values.annualIncomeNPR)
        : undefined,
      storageCapacityMT: values.storageCapacityMT
        ? Number(values.storageCapacityMT)
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
  ) => {
    if (locationPoint) {
      form.setValue("locationPoint", locationPoint);
    }
    if (farmBoundary) {
      form.setValue("farmBoundary", farmBoundary);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="crops">Crops & Livestock</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicFarmDetails
                formData={{
                  name: form.watch("name"),
                  description: form.watch("description"),
                  farmType: form.watch("farmType"),
                  farmingSystem: form.watch("farmingSystem"),
                  metaTitle: form.watch("metaTitle"),
                  metaDescription: form.watch("metaDescription"),
                  keywords: form.watch("keywords"),
                  isVerified: form.watch("isVerified"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <FarmerDetails
                formData={{
                  ownerName: form.watch("ownerName"),
                  ownerContact: form.watch("ownerContact"),
                  farmerType: form.watch("farmerType"),
                  farmerEducation: form.watch("farmerEducation"),
                  farmerExperienceYears: form.watch("farmerExperienceYears")
                    ? Number(form.watch("farmerExperienceYears"))
                    : undefined,
                  hasCooperativeMembership: form.watch(
                    "hasCooperativeMembership",
                  ),
                  cooperativeName: form.watch("cooperativeName"),
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
                <Button type="button" onClick={() => setActiveTab("crops")}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="crops">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CropsAndLivestockDetails
                formData={{
                  soilType: form.watch("soilType"),
                  irrigationType: form.watch("irrigationType"),
                  irrigationSourceDetails: form.watch(
                    "irrigationSourceDetails",
                  ),
                  irrigatedAreaInHectares: form.watch("irrigatedAreaInHectares")
                    ? Number(form.watch("irrigatedAreaInHectares"))
                    : undefined,
                  mainCrops: form.watch("mainCrops"),
                  secondaryCrops: form.watch("secondaryCrops"),
                  cropRotation: form.watch("cropRotation"),
                  cropRotationDetails: form.watch("cropRotationDetails"),
                  intercropping: form.watch("intercropping"),
                  croppingSeasons: form.watch("croppingSeasons"),
                  annualCropYieldMT: form.watch("annualCropYieldMT")
                    ? Number(form.watch("annualCropYieldMT"))
                    : undefined,
                  recordedYearCrops: form.watch("recordedYearCrops"),
                  hasLivestock: form.watch("hasLivestock"),
                  livestockTypes: form.watch("livestockTypes"),
                  cattleCount: form.watch("cattleCount")
                    ? Number(form.watch("cattleCount"))
                    : undefined,
                  buffaloCount: form.watch("buffaloCount")
                    ? Number(form.watch("buffaloCount"))
                    : undefined,
                  goatCount: form.watch("goatCount")
                    ? Number(form.watch("goatCount"))
                    : undefined,
                  sheepCount: form.watch("sheepCount")
                    ? Number(form.watch("sheepCount"))
                    : undefined,
                  pigCount: form.watch("pigCount")
                    ? Number(form.watch("pigCount"))
                    : undefined,
                  poultryCount: form.watch("poultryCount")
                    ? Number(form.watch("poultryCount"))
                    : undefined,
                  otherLivestockCount: form.watch("otherLivestockCount")
                    ? Number(form.watch("otherLivestockCount"))
                    : undefined,
                  otherLivestockDetails: form.watch("otherLivestockDetails"),
                  livestockHousingType: form.watch("livestockHousingType"),
                  livestockManagementDetails: form.watch(
                    "livestockManagementDetails",
                  ),
                  annualMilkProductionLiters: form.watch(
                    "annualMilkProductionLiters",
                  )
                    ? Number(form.watch("annualMilkProductionLiters"))
                    : undefined,
                  annualEggProduction: form.watch("annualEggProduction")
                    ? Number(form.watch("annualEggProduction"))
                    : undefined,
                  annualMeatProductionKg: form.watch("annualMeatProductionKg")
                    ? Number(form.watch("annualMeatProductionKg"))
                    : undefined,
                  recordedYearLivestock: form.watch("recordedYearLivestock"),
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
                <Button
                  type="button"
                  onClick={() => setActiveTab("infrastructure")}
                >
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="infrastructure">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FarmInfrastructureDetails
                formData={{
                  totalAreaInHectares: form.watch("totalAreaInHectares")
                    ? Number(form.watch("totalAreaInHectares"))
                    : undefined,
                  cultivatedAreaInHectares: form.watch(
                    "cultivatedAreaInHectares",
                  )
                    ? Number(form.watch("cultivatedAreaInHectares"))
                    : undefined,
                  landOwnership: form.watch("landOwnership"),
                  hasFarmHouse: form.watch("hasFarmHouse"),
                  hasStorage: form.watch("hasStorage"),
                  storageCapacityMT: form.watch("storageCapacityMT")
                    ? Number(form.watch("storageCapacityMT"))
                    : undefined,
                  hasFarmEquipment: form.watch("hasFarmEquipment"),
                  equipmentDetails: form.watch("equipmentDetails"),
                  hasElectricity: form.watch("hasElectricity"),
                  hasRoadAccess: form.watch("hasRoadAccess"),
                  roadAccessType: form.watch("roadAccessType"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <ManagementPractices
                formData={{
                  usesChemicalFertilizer: form.watch("usesChemicalFertilizer"),
                  usesPesticides: form.watch("usesPesticides"),
                  usesOrganicMethods: form.watch("usesOrganicMethods"),
                  composting: form.watch("composting"),
                  soilConservationPractices: form.watch(
                    "soilConservationPractices",
                  ),
                  rainwaterHarvesting: form.watch("rainwaterHarvesting"),
                  manureManagement: form.watch("manureManagement"),
                  hasCertifications: form.watch("hasCertifications"),
                  certificationDetails: form.watch("certificationDetails"),
                  receivesExtensionServices: form.watch(
                    "receivesExtensionServices",
                  ),
                  extensionServiceProvider: form.watch(
                    "extensionServiceProvider",
                  ),
                  trainingReceived: form.watch("trainingReceived"),
                  technicalSupportNeeds: form.watch("technicalSupportNeeds"),
                  majorChallenges: form.watch("majorChallenges"),
                  disasterVulnerabilities: form.watch(
                    "disasterVulnerabilities",
                  ),
                  growthOpportunities: form.watch("growthOpportunities"),
                  futureExpansionPlans: form.watch("futureExpansionPlans"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <EconomicsDetails
                formData={{
                  familyLaborCount: form.watch("familyLaborCount")
                    ? Number(form.watch("familyLaborCount"))
                    : undefined,
                  hiredLaborCount: form.watch("hiredLaborCount")
                    ? Number(form.watch("hiredLaborCount"))
                    : undefined,
                  annualInvestmentNPR: form.watch("annualInvestmentNPR")
                    ? Number(form.watch("annualInvestmentNPR"))
                    : undefined,
                  annualIncomeNPR: form.watch("annualIncomeNPR")
                    ? Number(form.watch("annualIncomeNPR"))
                    : undefined,
                  profitableOperation: form.watch("profitableOperation"),
                  marketAccessDetails: form.watch("marketAccessDetails"),
                  majorBuyerTypes: form.watch("majorBuyerTypes"),
                  linkedGrazingAreas: form.watch("linkedGrazingAreas"),
                  linkedProcessingCenters: form.watch(
                    "linkedProcessingCenters",
                  ),
                  linkedAgricZones: form.watch("linkedAgricZones"),
                  linkedGrasslands: form.watch("linkedGrasslands"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("crops")}
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
                <div className="text-lg font-medium">Farm Location</div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <FarmLocationMap
                      formData={{
                        wardNumber: form.watch("wardNumber")
                          ? Number(form.watch("wardNumber"))
                          : undefined,
                        location: form.watch("location"),
                        address: form.watch("address"),
                        locationPoint: form.watch("locationPoint"),
                        farmBoundary: form.watch("farmBoundary"),
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
                  onClick={() => setActiveTab("infrastructure")}
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
