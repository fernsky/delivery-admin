"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { api } from "@/trpc/react";

import BasicHistoricalSiteDetails from "./basic-historical-site-details";
import HistoricalSiteLocationMap from "./historical-site-location-map";
import HistoricalDetails from "./historical-details";
import InfrastructureDetails from "./infrastructure-details";
import VisitorInformation from "./visitor-information";
import ManagementDetails from "./management-details";
import ArtifactsAndCulturalDetails from "./artifacts-and-cultural-details";
import ImageUpload from "@/components/image-upload";

import {
  historicalSiteTypeEnum,
  historicalArchitecturalStyleEnum,
  historicalConstructionMaterialEnum,
  historicalSignificanceEnum,
  historicalPreservationStatusEnum,
  historicalPeriodEnum,
} from "@/utils/enums/historical-sites-enums";

// Create schema for historical site creation
const formSchema = z.object({
  name: z.string().min(1, { message: "नाम आवश्यक छ" }),
  type: z.enum(historicalSiteTypeEnum),
  description: z.string().optional(),
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInSquareMeters: z.number().positive().optional(),
  architecturalStyle: z.enum(historicalArchitecturalStyleEnum).optional(),
  constructionMaterial: z.enum(historicalConstructionMaterialEnum).optional(),
  historicalPeriod: z.enum(historicalPeriodEnum).optional(),
  yearEstablished: z.number().int().optional(),
  yearAbandoned: z.number().int().optional(),
  lastRestorationYear: z.number().int().optional(),

  // Historical context
  historicalSignificance: z.enum(historicalSignificanceEnum).optional(),
  originalFunction: z.string().optional(),
  notablePeople: z.string().optional(),
  historicalEvents: z.string().optional(),
  dynastyOrRulership: z.string().optional(),
  changeOfOwnership: z.string().optional(),

  // Cultural and archaeological significance
  culturalSignificance: z.string().optional(),
  archaeologicalRemains: z.string().optional(),
  artifactsFound: z.string().optional(),
  excavationHistory: z.string().optional(),
  excavationYear: z.number().int().optional(),

  // Heritage status
  isHeritageSite: z.boolean().optional(),
  heritageDesignation: z.string().optional(),
  heritageListingYear: z.number().int().optional(),
  heritageReferenceId: z.string().optional(),

  // Inscriptions and documentation
  hasInscriptions: z.boolean().optional(),
  inscriptionDetails: z.string().optional(),
  hasHistoricalDocuments: z.boolean().optional(),
  documentationDetails: z.string().optional(),

  // Management and operations
  managedBy: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().optional(),
  websiteUrl: z.string().optional(),
  dailyOpeningTime: z.string().optional(),
  dailyClosingTime: z.string().optional(),
  isOpenAllDay: z.boolean().optional(),
  weeklyClosedDays: z.string().optional(),
  entryFeeNPR: z.number().int().nonnegative().optional(),
  entryFeeDetailsForeigners: z.string().optional(),

  // Physical infrastructure
  totalStructureCount: z.number().int().nonnegative().optional(),
  hasMainBuilding: z.boolean().optional(),
  hasDefensiveWalls: z.boolean().optional(),
  hasTowers: z.boolean().optional(),
  hasMoat: z.boolean().optional(),
  hasGardens: z.boolean().optional(),
  hasCourtyards: z.boolean().optional(),
  structureDetails: z.string().optional(),

  // Features and architectural elements
  notableFeatures: z.string().optional(),
  architecturalElements: z.string().optional(),
  hasUndergroundStructures: z.boolean().optional(),
  undergroundDetails: z.string().optional(),
  hasDurbar: z.boolean().optional(),
  hasTemple: z.boolean().optional(),
  hasArtificialWaterBody: z.boolean().optional(),
  waterBodyDetails: z.string().optional(),

  // Facilities and amenities
  hasParking: z.boolean().optional(),
  parkingCapacity: z.number().int().positive().optional(),
  hasToilets: z.boolean().optional(),
  hasHandicapAccess: z.boolean().optional(),
  hasElectricity: z.boolean().optional(),
  hasWaterSupply: z.boolean().optional(),
  hasCafeteria: z.boolean().optional(),
  hasGiftShop: z.boolean().optional(),

  // Preservation and restoration
  preservationStatus: z.enum(historicalPreservationStatusEnum).optional(),
  restorationDetails: z.string().optional(),
  hasRegularMaintenance: z.boolean().optional(),
  maintenanceDetails: z.string().optional(),
  fundingSource: z.string().optional(),
  conservationChallenges: z.string().optional(),

  // Research and education
  researchValue: z.string().optional(),
  ongoingResearch: z.string().optional(),
  educationalPrograms: z.string().optional(),
  publicationReferences: z.string().optional(),

  // Visitor information
  estimatedDailyVisitors: z.number().int().nonnegative().optional(),
  estimatedYearlyVisitors: z.number().int().nonnegative().optional(),
  peakVisitationMonths: z.string().optional(),
  hasOverseasVisitors: z.boolean().optional(),
  guidesAvailable: z.boolean().optional(),
  hasTourismInfrastructure: z.boolean().optional(),
  tourismDetails: z.string().optional(),
  visitorFacilities: z.string().optional(),
  photoAllowed: z.boolean().optional(),
  photoRestrictions: z.string().optional(),
  visitDuration: z.string().optional(),

  // Location point geometry
  locationPoint: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),

  // Boundary geometry
  siteBoundary: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),

  // Media
  mediaIds: z.array(z.string()).optional(),
  primaryMediaId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateForm() {
  const t = useTranslations("HistoricalSites");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic-info");

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<
    { id: string; url: string; name: string }[]
  >([]);
  const [primaryImageId, setPrimaryImageId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: undefined,
      hasElectricity: true,
      hasWaterSupply: true,
      photoAllowed: true,
      mediaIds: [],
    },
  });

  const createHistoricalSite = api.historicalSite.create.useMutation({
    onSuccess: () => {
      toast.success(t("create.successMessage"));
      router.push(
        "/dashboard/digital-profile/institutions/cultural/historical-sites",
      );
    },
    onError: (error) => {
      console.error("Error creating historical site:", error);
      toast.error(t("create.errorMessage"));
      setIsSubmitting(false);
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    // Map media IDs
    const mediaIds = uploadedImages.map((img) => img.id);
    const primaryMediaId =
      primaryImageId ||
      (uploadedImages.length > 0 ? uploadedImages[0].id : undefined);

    try {
      // Send the form data to the API
      await createHistoricalSite.mutateAsync({
        ...data,
        mediaIds,
        primaryMediaId,
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error in form submission:", error);
    }
  }

  const handleImageUploadComplete = (
    images: { id: string; url: string; name: string }[],
  ) => {
    setUploadedImages(images);
    if (images.length > 0 && !primaryImageId) {
      setPrimaryImageId(images[0].id);
    }
  };

  const handlePrimaryImageChange = (imageId: string) => {
    setPrimaryImageId(imageId);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 mb-8">
              <TabsTrigger value="basic-info">
                {t("create.tabs.basicInfo")}
              </TabsTrigger>
              <TabsTrigger value="location-map">
                {t("create.tabs.locationMap")}
              </TabsTrigger>
              <TabsTrigger value="historical-details">
                {t("create.tabs.historicalDetails")}
              </TabsTrigger>
              <TabsTrigger value="infrastructure">
                {t("create.tabs.infrastructure")}
              </TabsTrigger>
              <TabsTrigger value="artifacts-cultural">
                {t("create.tabs.artifactsCultural")}
              </TabsTrigger>
              <TabsTrigger value="management">
                {t("create.tabs.management")}
              </TabsTrigger>
              <TabsTrigger value="visitor-info">
                {t("create.tabs.visitorInfo")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic-info" className="space-y-4">
              <BasicHistoricalSiteDetails form={form} />

              <div className="space-y-2 mt-6">
                <h3 className="text-lg font-medium">
                  {t("create.images.title")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("create.images.description")}
                </p>
                <ImageUpload
                  entityType="HISTORICAL_SITE"
                  onComplete={handleImageUploadComplete}
                  onPrimaryImageChange={handlePrimaryImageChange}
                  primaryImageId={primaryImageId}
                  existingImages={uploadedImages}
                />
              </div>
            </TabsContent>

            <TabsContent value="location-map">
              <HistoricalSiteLocationMap form={form} />
            </TabsContent>

            <TabsContent value="historical-details">
              <HistoricalDetails form={form} />
            </TabsContent>

            <TabsContent value="infrastructure">
              <InfrastructureDetails form={form} />
            </TabsContent>

            <TabsContent value="artifacts-cultural">
              <ArtifactsAndCulturalDetails form={form} />
            </TabsContent>

            <TabsContent value="management">
              <ManagementDetails form={form} />
            </TabsContent>

            <TabsContent value="visitor-info">
              <VisitorInformation form={form} />
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              {t("create.cancelButton")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("create.submittingButton")}
                </>
              ) : (
                t("create.submitButton")
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
