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
import BasicReligiousPlaceDetails from "./basic-religious-place-details";
import ReligiousPlaceLocationMap from "./religious-place-location-map";
import ReligiousDetails from "./religious-details";
import CulturalHistoricalDetails from "./cultural-historical-details";
import ManagementOperations from "./management-operations";
import InfrastructureDetails from "./infrastructure-details";
import VisitorInformation from "./visitor-information";

type FormData = {
  // Basic details
  name: string;
  description: string;
  type: string;

  // Location details
  wardNumber?: number;
  location?: string;
  address?: string;
  locationPoint?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  complexBoundary?: {
    type: "Polygon";
    coordinates: Array<Array<[number, number]>>; // Array of rings, each ring is array of [lon,lat] pairs
  };

  // Physical details
  areaInSquareMeters?: number;
  architecturalStyle?: string;
  constructionMaterial?: string;
  yearEstablished?: number;
  yearRenovated?: number;

  // Religious details
  mainDeity?: string;
  secondaryDeities?: string;
  religiousTradition?: string;
  religiousSignificance?: string;
  religiousStory?: string;

  // Cultural and historical significance
  historicalSignificance?: string;
  culturalSignificance?: string;
  isHeritageSite?: boolean;
  heritageDesignation?: string;
  inscriptions?: string;
  hasArchaeologicalValue?: boolean;
  archaeologicalDetails?: string;

  // Management and operations
  managedBy?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  websiteUrl?: string;
  dailyOpeningTime?: string;
  dailyClosingTime?: string;
  isOpenAllDay?: boolean;
  weeklyClosedDays?: string;
  entryFeeNPR?: number;
  entryFeeDetailsForeigners?: string;

  // Physical infrastructure
  totalBuildingCount?: number;
  hasMainHall?: boolean;
  mainHallCapacity?: number;
  hasCommunitySpace?: boolean;
  hasAccommodation?: boolean;
  accommodationCapacity?: number;
  hasKitchen?: boolean;
  hasDiningHall?: boolean;
  diningCapacity?: number;
  hasLibrary?: boolean;
  hasMuseum?: boolean;

  // Facilities and amenities
  hasParking?: boolean;
  parkingCapacity?: number;
  hasToilets?: boolean;
  hasHandicapAccess?: boolean;
  hasElectricity?: boolean;
  hasWaterSupply?: boolean;
  hasDrinkingWater?: boolean;
  hasFootwear?: boolean;
  hasClothStorage?: boolean;

  // Preservation and restoration
  preservationStatus?: string;
  lastRestorationYear?: number;
  restorationDetails?: string;
  hasRegularMaintenance?: boolean;
  maintenanceDetails?: string;
  fundingSource?: string;

  // Religious activities
  regularPrayers?: string;
  specialRituals?: string;
  annualFestivals?: string;
  festivalMonths?: string;
  festivalDetails?: string;
  specialOfferings?: string;

  // Visitor information
  estimatedDailyVisitors?: number;
  estimatedYearlyVisitors?: number;
  peakVisitationMonths?: string;
  hasOverseasVisitors?: boolean;
  guidesAvailable?: boolean;
  visitorDressCode?: string;
  photoAllowed?: boolean;
  photoRestrictions?: string;

  // Linked entities
  linkedCulturalEvents?: Array<{ id: string; name?: string }>;
  linkedCulturalOrganizations?: Array<{ id: string; name?: string }>;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;

  // Status
  isVerified?: boolean;
};

export default function CreateForm() {
  const t = useTranslations("ReligiousPlaces");
  const { toast } = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    type: "HINDU_TEMPLE",
  });
  const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([]);
  const [primaryMediaId, setPrimaryMediaId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create religious place mutation
  const createReligiousPlace = api.religiousPlace.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: t("create.successTitle"),
        description: t("create.successDescription"),
      });

      // Reset form or redirect
      if (data?.id) {
        router.push(
          `/dashboard/digital-profile/institutions/cultural/religious-places/${data.slug}`,
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
      complexBoundary?: {
        type: "Polygon";
        coordinates: Array<Array<[number, number]>>;
      };
    }) => {
      setFormData((prev) => ({ ...prev, ...mapData }));
    },
    [],
  );

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) {
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
      const response = await createReligiousPlace.mutateAsync(formData);

      // If we have media to associate
      if (response?.id && uploadedMediaIds.length > 0) {
        // Associate uploaded media with the new entity
        await Promise.all(
          uploadedMediaIds.map((mediaId) =>
            associateMedia.mutateAsync({
              mediaId,
              entityId: response.id,
              entityType: "RELIGIOUS_PLACE",
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
          <TabsTrigger value="religious">
            {t("create.tabs.religious")}
          </TabsTrigger>
          <TabsTrigger value="cultural">
            {t("create.tabs.cultural")}
          </TabsTrigger>
          <TabsTrigger value="management">
            {t("create.tabs.management")}
          </TabsTrigger>
          <TabsTrigger value="infrastructure">
            {t("create.tabs.infrastructure")}
          </TabsTrigger>
          <TabsTrigger value="visitors">
            {t("create.tabs.visitors")}
          </TabsTrigger>
          <TabsTrigger value="media">{t("create.tabs.media")}</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <BasicReligiousPlaceDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <ReligiousPlaceLocationMap
            formData={formData}
            updateMapData={updateMapData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="religious" className="space-y-4">
          <ReligiousDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="cultural" className="space-y-4">
          <CulturalHistoricalDetails
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <ManagementOperations
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

        <TabsContent value="visitors" className="space-y-4">
          <VisitorInformation
            formData={formData}
            updateFormData={updateFormData}
          />
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("create.media.title")}</h3>
            <MediaUploader
              entityType="RELIGIOUS_PLACE"
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
