"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2Icon } from "lucide-react";
import { MediaUploader } from "@/components/media-uploader";
import BasicFishFarmDetails from "./basic-fish-farm-details";
import FishFarmLocationMap from "./fish-farm-location-map";
import WaterBodyDetails from "./water-body-details";
import CultureAndManagementDetails from "./culture-management-details";
import InfrastructureDetails from "./infrastructure-details";
import ProductionDetails from "./production-details";
import EconomicsDetails from "./economics-details";
import SustainabilityDetails from "./sustainability-details";

type FormData = {
  // Basic details
  name: string;
  description: string;
  farmType: string;

  // Location details
  wardNumber?: number;
  location?: string;
  address?: string;
  locationPoint?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  farmBoundary?: {
    type: "Polygon";
    coordinates: Array<Array<[number, number]>>; // Array of rings, each ring is array of [lon,lat] pairs
  };
  pondPolygons?: {
    type: "MultiPolygon";
    coordinates: Array<Array<Array<[number, number]>>>; // Array of polygons, each with array of rings, each ring with coordinates
  };

  // Physical details
  ownershipType?: string;
  totalAreaInHectares?: number;
  waterSurfaceAreaInHectares?: number;
  operationalSince?: number;

  // Water body characteristics
  totalPondCount?: number;
  activePondCount?: number;
  averagePondSizeInSquareMeters?: number;
  averageWaterDepthInMeters?: number;
  totalWaterVolumeInCubicMeters?: number;
  waterSource?: string;
  waterSourceDetails?: string;
  waterAvailabilityIssues?: string;
  hasWaterQualityMonitoring?: boolean;
  waterQualityParameters?: string;

  // Culture and management details
  cultureSystem?: string;
  primaryFishSpecies?: string;
  secondaryFishSpecies?: string;
  seedSourceDetails?: string;
  stockingDensityPerSquareMeter?: number;
  growoutPeriodInMonths?: number;
  feedingSystem?: string;
  feedTypes?: string;
  feedConversionRatio?: number;
  annualFeedUsageInKg?: number;

  // Water management
  waterManagementSystem?: string;
  usesProbiotics?: boolean;
  usesAeration?: boolean;
  aerationType?: string;
  waterExchangeFrequency?: string;
  waterExchangePercentage?: number;
  effluentManagementDetails?: string;

  // Production details
  annualProductionInKg?: number;
  averageYieldPerHectareInKg?: number;
  survivalRatePercentage?: number;
  averageFishSizeInGrams?: number;
  recordedYearProduction?: string;
  productionCycles?: number;

  // Infrastructure and equipment
  hasFarmHouse?: boolean;
  hasHatchery?: boolean;
  hatcheryCapacity?: number;
  hasNursery?: boolean;
  nurseryAreaInSquareMeters?: number;
  hasFeedStorage?: boolean;
  hasEquipment?: boolean;
  equipmentDetails?: string;
  hasLaboratory?: boolean;
  laboratoryPurpose?: string;
  hasIceProduction?: boolean;
  hasProcessingArea?: boolean;
  hasElectricity?: boolean;
  hasGenerator?: boolean;
  hasFencing?: boolean;
  hasSecuritySystem?: boolean;

  // Personnel and management
  ownerName?: string;
  ownerContact?: string;
  managerName?: string;
  managerContact?: string;
  technicalStaffCount?: number;
  regularStaffCount?: number;
  seasonalLaborCount?: number;
  hasTrainedStaff?: boolean;
  trainingDetails?: string;

  // Economic aspects
  annualOperatingCostNPR?: number;
  annualRevenueNPR?: number;
  profitableOperation?: boolean;
  marketAccessDetails?: string;
  majorBuyerTypes?: string;
  averageSellingPricePerKg?: number;

  // Health management
  commonDiseases?: string;
  diseasePreventionMethods?: string;
  usesChemicals?: boolean;
  chemicalUsageDetails?: string;
  mortalityPercentage?: number;
  healthMonitoringFrequency?: string;

  // Sustainability aspects
  hasEnvironmentalImpactAssessment?: boolean;
  usesRenewableEnergy?: boolean;
  renewableEnergyDetails?: string;
  wasteManagementPractices?: string;
  hasCertifications?: boolean;
  certificationDetails?: string;

  // Challenges and support
  majorConstraints?: string;
  disasterVulnerabilities?: string;
  receivesGovernmentSupport?: boolean;
  governmentSupportDetails?: string;
  receivesNGOSupport?: boolean;
  ngoSupportDetails?: string;
  technicalSupportNeeds?: string;

  // Future plans
  expansionPlans?: string;
  diversificationPlans?: string;
  technologyUpgradePlans?: string;

  // Linked entities
  linkedProcessingCenters?: Array<{ id: string; name?: string }>;
  linkedWaterBodies?: Array<{ id: string; name?: string }>;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;

  // Status
  isVerified?: boolean;
};

export default function CreateForm() {
  const t = useTranslations("FishFarms");
  const { toast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    farmType: "POND_CULTURE", // Default fish farm type
  });
  const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([]);
  const [primaryMediaId, setPrimaryMediaId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create fish farm mutation
  const createFishFarm = api.fishFarm.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: t("create.successTitle"),
        description: t("create.successDescription"),
      });

      // Reset form or redirect
      if (data?.id) {
        router.push(
          `/dashboard/digital-profile/institutions/agricultural/fish-farms/${data.slug}`,
        );
      }
    },
    onError: (error) => {
      toast({
        title: t("create.errorTitle"),
        description: error.message || t("create.errorDescription"),
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Media association mutation
  const associateMedia = api.media.associateMediaWithEntity.useMutation();

  const updateFormData = useCallback((field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateMapData = useCallback(
    (mapData: {
      locationPoint?: { type: "Point"; coordinates: [number, number] };
      farmBoundary?: {
        type: "Polygon";
        coordinates: Array<Array<[number, number]>>;
      };
      pondPolygons?: {
        type: "MultiPolygon";
        coordinates: Array<Array<Array<[number, number]>>>;
      };
    }) => {
      setFormData((prev) => ({ ...prev, ...mapData }));
    },
    [],
  );

  const handleSubmit = async () => {
    if (!formData.name || !formData.farmType) {
      toast({
        title: t("create.validationErrorTitle"),
        description: t("create.validationErrorDescription"),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit form data
      const response = await createFishFarm.mutateAsync(formData);

      // If we have media to associate
      if (response?.id && uploadedMediaIds.length > 0) {
        // Associate uploaded media with the new entity
        await Promise.all(
          uploadedMediaIds.map((mediaId) =>
            associateMedia.mutateAsync({
              mediaId,
              entityId: response.id,
              entityType: "FISH_FARM",
              isPrimary: mediaId === primaryMediaId,
            }),
          ),
        );
      }
    } catch (error) {
      // Error is handled by the mutation callbacks
      console.error("Error submitting form:", error);
    }
  };

  const handleMediaUpload = (mediaIds: string[]) => {
    setUploadedMediaIds(mediaIds);

    // Set first image as primary if none selected yet
    if (mediaIds.length > 0 && !primaryMediaId) {
      setPrimaryMediaId(mediaIds[0]);
    }
  };

  const handlePrimaryMediaChange = (mediaId: string) => {
    setPrimaryMediaId(mediaId);
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="w-full flex justify-start flex-wrap">
          <TabsTrigger value="basic">{t("create.tabs.basic")}</TabsTrigger>
          <TabsTrigger value="location">
            {t("create.tabs.location")}
          </TabsTrigger>
          <TabsTrigger value="waterbody">
            {t("create.tabs.waterbody")}
          </TabsTrigger>
          <TabsTrigger value="culture">{t("create.tabs.culture")}</TabsTrigger>
          <TabsTrigger value="infrastructure">
            {t("create.tabs.infrastructure")}
          </TabsTrigger>
          <TabsTrigger value="production">
            {t("create.tabs.production")}
          </TabsTrigger>
          <TabsTrigger value="economics">
            {t("create.tabs.economics")}
          </TabsTrigger>
          <TabsTrigger value="sustainability">
            {t("create.tabs.sustainability")}
          </TabsTrigger>
          <TabsTrigger value="media">{t("create.tabs.media")}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <BasicFishFarmDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <FishFarmLocationMap
            formData={formData}
            updateMapData={updateMapData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="waterbody" className="space-y-4">
          <WaterBodyDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="culture" className="space-y-4">
          <CultureAndManagementDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <InfrastructureDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="production" className="space-y-4">
          <ProductionDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="economics" className="space-y-4">
          <EconomicsDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <SustainabilityDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("create.media.title")}</h3>
            <MediaUploader
              entityType="FISH_FARM"
              onMediaChange={handleMediaUpload}
              onPrimaryChange={handlePrimaryMediaChange}
              selectedMediaIds={uploadedMediaIds}
              primaryMediaId={primaryMediaId}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          {t("create.cancelButton")}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("create.submitButton")}
        </Button>
      </div>
    </div>
  );
}
