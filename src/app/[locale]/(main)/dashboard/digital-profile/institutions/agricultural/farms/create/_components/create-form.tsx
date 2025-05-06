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
import BasicFarmDetails from "./basic-farm-details";
import FarmLocationMap from "./farm-location-map";
import CropsAndLivestockDetails from "./crops-livestock-details";
import FarmInfrastructureDetails from "./farm-infrastructure-details";
import FarmerDetails from "./farmer-details";
import ManagementPractices from "./management-practices";
import EconomicsDetails from "./economics-details";

type FormData = {
  // Basic details
  name: string;
  description: string;
  farmType: string;
  farmingSystem?: string;

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

  // Land details
  totalAreaInHectares?: number;
  cultivatedAreaInHectares?: number;
  landOwnership?: string;
  soilType?: string;
  irrigationType?: string;
  irrigationSourceDetails?: string;
  irrigatedAreaInHectares?: number;

  // Crop details
  mainCrops?: string;
  secondaryCrops?: string;
  cropRotation?: boolean;
  cropRotationDetails?: string;
  intercropping?: boolean;
  croppingSeasons?: string;
  annualCropYieldMT?: number;
  recordedYearCrops?: string;

  // Livestock details
  hasLivestock?: boolean;
  livestockTypes?: string;
  cattleCount?: number;
  buffaloCount?: number;
  goatCount?: number;
  sheepCount?: number;
  pigCount?: number;
  poultryCount?: number;
  otherLivestockCount?: number;
  otherLivestockDetails?: string;
  livestockHousingType?: string;
  livestockManagementDetails?: string;
  annualMilkProductionLiters?: number;
  annualEggProduction?: number;
  annualMeatProductionKg?: number;
  recordedYearLivestock?: string;

  // Farmer details
  ownerName?: string;
  ownerContact?: string;
  farmerType?: string;
  farmerEducation?: string;
  farmerExperienceYears?: number;
  hasCooperativeMembership?: boolean;
  cooperativeName?: string;

  // Labor and economics
  familyLaborCount?: number;
  hiredLaborCount?: number;
  annualInvestmentNPR?: number;
  annualIncomeNPR?: number;
  profitableOperation?: boolean;
  marketAccessDetails?: string;
  majorBuyerTypes?: string;

  // Infrastructure
  hasFarmHouse?: boolean;
  hasStorage?: boolean;
  storageCapacityMT?: number;
  hasFarmEquipment?: boolean;
  equipmentDetails?: string;
  hasElectricity?: boolean;
  hasRoadAccess?: boolean;
  roadAccessType?: string;

  // Sustainability and practices
  usesChemicalFertilizer?: boolean;
  usesPesticides?: boolean;
  usesOrganicMethods?: boolean;
  composting?: boolean;
  soilConservationPractices?: string;
  rainwaterHarvesting?: boolean;
  manureManagement?: string;
  hasCertifications?: boolean;
  certificationDetails?: string;

  // Technical support and training
  receivesExtensionServices?: boolean;
  extensionServiceProvider?: string;
  trainingReceived?: string;
  technicalSupportNeeds?: string;

  // Challenges and opportunities
  majorChallenges?: string;
  disasterVulnerabilities?: string;
  growthOpportunities?: string;
  futureExpansionPlans?: string;

  // Linked entities
  linkedGrazingAreas?: Array<{ id: string; name?: string }>;
  linkedProcessingCenters?: Array<{ id: string; name?: string }>;
  linkedAgricZones?: Array<{ id: string; name?: string }>;
  linkedGrasslands?: Array<{ id: string; name?: string }>;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;

  // Status
  isVerified?: boolean;
};

export default function CreateForm() {
  const t = useTranslations("Farms");
  const { toast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    farmType: "MIXED_FARM",
  });
  const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([]);
  const [primaryMediaId, setPrimaryMediaId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create farm mutation
  const createFarm = api.farm.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: t("create.successTitle"),
        description: t("create.successDescription"),
      });

      // Reset form or redirect
      if (data?.id) {
        router.push(
          `/dashboard/digital-profile/institutions/agricultural/farms/${data.slug}`,
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
      const response = await createFarm.mutateAsync(formData);

      // If we have media to associate
      if (response?.id && uploadedMediaIds.length > 0) {
        // Associate uploaded media with the new entity
        await Promise.all(
          uploadedMediaIds.map((mediaId) =>
            associateMedia.mutateAsync({
              mediaId,
              entityId: response.id,
              entityType: "FARM",
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
          <TabsTrigger value="crops">
            {t("create.tabs.cropsLivestock")}
          </TabsTrigger>
          <TabsTrigger value="farmer">{t("create.tabs.farmer")}</TabsTrigger>
          <TabsTrigger value="infrastructure">
            {t("create.tabs.infrastructure")}
          </TabsTrigger>
          <TabsTrigger value="practices">
            {t("create.tabs.practices")}
          </TabsTrigger>
          <TabsTrigger value="economics">
            {t("create.tabs.economics")}
          </TabsTrigger>
          <TabsTrigger value="media">{t("create.tabs.media")}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <BasicFarmDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <FarmLocationMap
            formData={formData}
            updateMapData={updateMapData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="crops" className="space-y-4">
          <CropsAndLivestockDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="farmer" className="space-y-4">
          <FarmerDetails formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <FarmInfrastructureDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="practices" className="space-y-4">
          <ManagementPractices
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

        <TabsContent value="media" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("create.media.title")}</h3>
            <MediaUploader
              entityType="FARM"
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
