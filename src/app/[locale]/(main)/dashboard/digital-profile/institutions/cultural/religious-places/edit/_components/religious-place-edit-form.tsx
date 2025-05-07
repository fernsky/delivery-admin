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
import { ReligiousPlaceLocationMap } from "../../create/_components/religious-place-location-map";
import { BasicReligiousPlaceDetails } from "../../create/_components/basic-religious-place-details";
import { ReligiousDetails } from "../../create/_components/religious-details";
import { CulturalHistoricalDetails } from "../../create/_components/cultural-historical-details";
import { ManagementOperations } from "../../create/_components/management-operations";
import { InfrastructureDetails } from "../../create/_components/infrastructure-details";
import { VisitorInformation } from "../../create/_components/visitor-information";
import { SEOFields } from "./seo-fields";

// Define the form schema
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Religious place name is required"),
  description: z.string().optional(),
  type: z.string(),

  // Location details
  wardNumber: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInSquareMeters: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  architecturalStyle: z.string().optional(),
  constructionMaterial: z.string().optional(),
  yearEstablished: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  yearRenovated: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Religious details
  mainDeity: z.string().optional(),
  secondaryDeities: z.string().optional(),
  religiousTradition: z.string().optional(),
  religiousSignificance: z.string().optional(),
  religiousStory: z.string().optional(),

  // Cultural/historical fields
  historicalSignificance: z.string().optional(),
  culturalSignificance: z.string().optional(),
  isHeritageSite: z.boolean().optional(),
  heritageDesignation: z.string().optional(),
  inscriptions: z.string().optional(),
  hasArchaeologicalValue: z.boolean().optional(),
  archaeologicalDetails: z.string().optional(),

  // Religious activities
  regularPrayers: z.string().optional(),
  specialRituals: z.string().optional(),
  annualFestivals: z.string().optional(),
  festivalMonths: z.string().optional(),
  festivalDetails: z.string().optional(),
  specialOfferings: z.string().optional(),

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
  entryFeeNPR: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  entryFeeDetailsForeigners: z.string().optional(),

  // Preservation and restoration
  preservationStatus: z.string().optional(),
  lastRestorationYear: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  restorationDetails: z.string().optional(),
  hasRegularMaintenance: z.boolean().optional(),
  maintenanceDetails: z.string().optional(),
  fundingSource: z.string().optional(),

  // Physical infrastructure fields
  totalBuildingCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hasMainHall: z.boolean().optional(),
  mainHallCapacity: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hasCommunitySpace: z.boolean().optional(),
  hasAccommodation: z.boolean().optional(),
  accommodationCapacity: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hasKitchen: z.boolean().optional(),
  hasDiningHall: z.boolean().optional(),
  diningCapacity: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hasLibrary: z.boolean().optional(),
  hasMuseum: z.boolean().optional(),

  // Facilities and amenities
  hasParking: z.boolean().optional(),
  parkingCapacity: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  hasToilets: z.boolean().optional(),
  hasHandicapAccess: z.boolean().optional(),
  hasElectricity: z.boolean().optional(),
  hasWaterSupply: z.boolean().optional(),
  hasDrinkingWater: z.boolean().optional(),
  hasFootwear: z.boolean().optional(),
  hasClothStorage: z.boolean().optional(),

  // Artworks and treasures
  hasSignificantArtwork: z.boolean().optional(),
  artworkDetails: z.string().optional(),
  hasHistoricalArtifacts: z.boolean().optional(),
  artifactsDetails: z.string().optional(),
  hasRegisteredTreasures: z.boolean().optional(),
  treasureDetails: z.string().optional(),

  // Safety and security
  hasSecurityPersonnel: z.boolean().optional(),
  hasCCTV: z.boolean().optional(),
  hasFireSafety: z.boolean().optional(),
  disasterPreparedness: z.string().optional(),

  // Visitor information
  estimatedDailyVisitors: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  estimatedYearlyVisitors: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  peakVisitationMonths: z.string().optional(),
  hasOverseasVisitors: z.boolean().optional(),
  guidesAvailable: z.boolean().optional(),
  visitorDressCode: z.string().optional(),
  photoAllowed: z.boolean().optional(),
  photoRestrictions: z.string().optional(),

  // Community engagement
  communityBenefits: z.string().optional(),
  socialServicesOffered: z.string().optional(),
  educationalActivities: z.string().optional(),

  // Economic aspects
  hasShops: z.boolean().optional(),
  shopCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  shopTypes: z.string().optional(),
  economicImpact: z.string().optional(),
  totalAnnualRevenue: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  annualOperatingBudget: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Challenges and needs
  currentChallenges: z.string().optional(),
  conservationNeeds: z.string().optional(),
  developmentPlans: z.string().optional(),

  // Linked entities
  linkedCulturalEvents: z
    .array(z.object({ id: z.string(), name: z.string().optional() }))
    .optional(),
  linkedCulturalOrganizations: z
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
  complexBoundary: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),

  // Status
  isVerified: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ReligiousPlaceEditFormProps {
  religiousPlace: any;
}

export function ReligiousPlaceEditForm({
  religiousPlace,
}: ReligiousPlaceEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with pre-filled religious place data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: religiousPlace.id,
      name: religiousPlace.name || "",
      description: religiousPlace.description || "",
      type: religiousPlace.type,

      // Location details
      wardNumber: religiousPlace.wardNumber?.toString() || "",
      location: religiousPlace.location || "",
      address: religiousPlace.address || "",

      // Physical details
      areaInSquareMeters: religiousPlace.areaInSquareMeters?.toString() || "",
      architecturalStyle: religiousPlace.architecturalStyle || "",
      constructionMaterial: religiousPlace.constructionMaterial || "",
      yearEstablished: religiousPlace.yearEstablished?.toString() || "",
      yearRenovated: religiousPlace.yearRenovated?.toString() || "",

      // Religious details
      mainDeity: religiousPlace.mainDeity || "",
      secondaryDeities: religiousPlace.secondaryDeities || "",
      religiousTradition: religiousPlace.religiousTradition || "",
      religiousSignificance: religiousPlace.religiousSignificance || "",
      religiousStory: religiousPlace.religiousStory || "",

      // Cultural/historical fields
      historicalSignificance: religiousPlace.historicalSignificance || "",
      culturalSignificance: religiousPlace.culturalSignificance || "",
      isHeritageSite: religiousPlace.isHeritageSite || false,
      heritageDesignation: religiousPlace.heritageDesignation || "",
      inscriptions: religiousPlace.inscriptions || "",
      hasArchaeologicalValue: religiousPlace.hasArchaeologicalValue || false,
      archaeologicalDetails: religiousPlace.archaeologicalDetails || "",

      // Religious activities
      regularPrayers: religiousPlace.regularPrayers || "",
      specialRituals: religiousPlace.specialRituals || "",
      annualFestivals: religiousPlace.annualFestivals || "",
      festivalMonths: religiousPlace.festivalMonths || "",
      festivalDetails: religiousPlace.festivalDetails || "",
      specialOfferings: religiousPlace.specialOfferings || "",

      // Management and operations
      managedBy: religiousPlace.managedBy || "",
      contactPerson: religiousPlace.contactPerson || "",
      contactPhone: religiousPlace.contactPhone || "",
      contactEmail: religiousPlace.contactEmail || "",
      websiteUrl: religiousPlace.websiteUrl || "",
      dailyOpeningTime: religiousPlace.dailyOpeningTime || "",
      dailyClosingTime: religiousPlace.dailyClosingTime || "",
      isOpenAllDay: religiousPlace.isOpenAllDay || false,
      weeklyClosedDays: religiousPlace.weeklyClosedDays || "",
      entryFeeNPR: religiousPlace.entryFeeNPR?.toString() || "",
      entryFeeDetailsForeigners: religiousPlace.entryFeeDetailsForeigners || "",

      // Preservation and restoration
      preservationStatus: religiousPlace.preservationStatus || "",
      lastRestorationYear: religiousPlace.lastRestorationYear?.toString() || "",
      restorationDetails: religiousPlace.restorationDetails || "",
      hasRegularMaintenance: religiousPlace.hasRegularMaintenance || false,
      maintenanceDetails: religiousPlace.maintenanceDetails || "",
      fundingSource: religiousPlace.fundingSource || "",

      // Physical infrastructure fields
      totalBuildingCount: religiousPlace.totalBuildingCount?.toString() || "",
      hasMainHall: religiousPlace.hasMainHall || false,
      mainHallCapacity: religiousPlace.mainHallCapacity?.toString() || "",
      hasCommunitySpace: religiousPlace.hasCommunitySpace || false,
      hasAccommodation: religiousPlace.hasAccommodation || false,
      accommodationCapacity:
        religiousPlace.accommodationCapacity?.toString() || "",
      hasKitchen: religiousPlace.hasKitchen || false,
      hasDiningHall: religiousPlace.hasDiningHall || false,
      diningCapacity: religiousPlace.diningCapacity?.toString() || "",
      hasLibrary: religiousPlace.hasLibrary || false,
      hasMuseum: religiousPlace.hasMuseum || false,

      // Facilities and amenities
      hasParking: religiousPlace.hasParking || false,
      parkingCapacity: religiousPlace.parkingCapacity?.toString() || "",
      hasToilets: religiousPlace.hasToilets || false,
      hasHandicapAccess: religiousPlace.hasHandicapAccess || false,
      hasElectricity:
        religiousPlace.hasElectricity !== undefined
          ? religiousPlace.hasElectricity
          : true,
      hasWaterSupply:
        religiousPlace.hasWaterSupply !== undefined
          ? religiousPlace.hasWaterSupply
          : true,
      hasDrinkingWater: religiousPlace.hasDrinkingWater || false,
      hasFootwear: religiousPlace.hasFootwear || false,
      hasClothStorage: religiousPlace.hasClothStorage || false,

      // Artworks and treasures
      hasSignificantArtwork: religiousPlace.hasSignificantArtwork || false,
      artworkDetails: religiousPlace.artworkDetails || "",
      hasHistoricalArtifacts: religiousPlace.hasHistoricalArtifacts || false,
      artifactsDetails: religiousPlace.artifactsDetails || "",
      hasRegisteredTreasures: religiousPlace.hasRegisteredTreasures || false,
      treasureDetails: religiousPlace.treasureDetails || "",

      // Safety and security
      hasSecurityPersonnel: religiousPlace.hasSecurityPersonnel || false,
      hasCCTV: religiousPlace.hasCCTV || false,
      hasFireSafety: religiousPlace.hasFireSafety || false,
      disasterPreparedness: religiousPlace.disasterPreparedness || "",

      // Visitor information
      estimatedDailyVisitors:
        religiousPlace.estimatedDailyVisitors?.toString() || "",
      estimatedYearlyVisitors:
        religiousPlace.estimatedYearlyVisitors?.toString() || "",
      peakVisitationMonths: religiousPlace.peakVisitationMonths || "",
      hasOverseasVisitors: religiousPlace.hasOverseasVisitors || false,
      guidesAvailable: religiousPlace.guidesAvailable || false,
      visitorDressCode: religiousPlace.visitorDressCode || "",
      photoAllowed:
        religiousPlace.photoAllowed !== undefined
          ? religiousPlace.photoAllowed
          : true,
      photoRestrictions: religiousPlace.photoRestrictions || "",

      // Community engagement
      communityBenefits: religiousPlace.communityBenefits || "",
      socialServicesOffered: religiousPlace.socialServicesOffered || "",
      educationalActivities: religiousPlace.educationalActivities || "",

      // Economic aspects
      hasShops: religiousPlace.hasShops || false,
      shopCount: religiousPlace.shopCount?.toString() || "",
      shopTypes: religiousPlace.shopTypes || "",
      economicImpact: religiousPlace.economicImpact || "",
      totalAnnualRevenue: religiousPlace.totalAnnualRevenue?.toString() || "",
      annualOperatingBudget:
        religiousPlace.annualOperatingBudget?.toString() || "",

      // Challenges and needs
      currentChallenges: religiousPlace.currentChallenges || "",
      conservationNeeds: religiousPlace.conservationNeeds || "",
      developmentPlans: religiousPlace.developmentPlans || "",

      // Linked entities
      linkedCulturalEvents: religiousPlace.linkedCulturalEvents || [],
      linkedCulturalOrganizations:
        religiousPlace.linkedCulturalOrganizations || [],

      // SEO fields
      metaTitle: religiousPlace.metaTitle || "",
      metaDescription: religiousPlace.metaDescription || "",
      keywords: religiousPlace.keywords || "",

      // Geometry fields
      locationPoint: religiousPlace.locationPoint,
      complexBoundary: religiousPlace.complexBoundary,

      // Status
      isVerified: religiousPlace.isVerified || false,
    },
  });

  // Update religious place mutation
  const { mutate: updateReligiousPlace, isLoading } =
    api.religiousPlace.update.useMutation({
      onSuccess: () => {
        toast.success("Religious place updated successfully");
        router.push(
          `/dashboard/digital-profile/institutions/cultural/religious-places/${religiousPlace.id}`,
        );
      },
      onError: (error) => {
        toast.error(`Failed to update religious place: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    // Convert string inputs to appropriate types
    updateReligiousPlace({
      ...values,
      // Include the original name/slug for comparison in the update procedure
      originalName: religiousPlace.name,
      originalSlug: religiousPlace.slug,
    });
  };

  // Handle geometry selection from map
  const handleGeometrySelect = (
    locationPoint?: { type: "Point"; coordinates: [number, number] },
    complexBoundary?: {
      type: "Polygon";
      coordinates: Array<Array<[number, number]>>;
    },
  ) => {
    if (locationPoint) {
      form.setValue("locationPoint", locationPoint);
    }
    if (complexBoundary) {
      form.setValue("complexBoundary", complexBoundary);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="religious">Religious Details</TabsTrigger>
          <TabsTrigger value="cultural">Cultural</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicReligiousPlaceDetails
                formData={{
                  name: form.watch("name"),
                  description: form.watch("description"),
                  type: form.watch("type"),
                  architecturalStyle: form.watch("architecturalStyle"),
                  constructionMaterial: form.watch("constructionMaterial"),
                  yearEstablished: form.watch("yearEstablished")
                    ? Number(form.watch("yearEstablished"))
                    : undefined,
                  yearRenovated: form.watch("yearRenovated")
                    ? Number(form.watch("yearRenovated"))
                    : undefined,
                  metaTitle: form.watch("metaTitle"),
                  metaDescription: form.watch("metaDescription"),
                  keywords: form.watch("keywords"),
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
                <Button type="button" onClick={() => setActiveTab("religious")}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="religious">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ReligiousDetails
                formData={{
                  mainDeity: form.watch("mainDeity"),
                  secondaryDeities: form.watch("secondaryDeities"),
                  religiousTradition: form.watch("religiousTradition"),
                  religiousSignificance: form.watch("religiousSignificance"),
                  religiousStory: form.watch("religiousStory"),
                  regularPrayers: form.watch("regularPrayers"),
                  specialRituals: form.watch("specialRituals"),
                  annualFestivals: form.watch("annualFestivals"),
                  festivalMonths: form.watch("festivalMonths"),
                  festivalDetails: form.watch("festivalDetails"),
                  specialOfferings: form.watch("specialOfferings"),
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
                <Button type="button" onClick={() => setActiveTab("cultural")}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="cultural">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CulturalHistoricalDetails
                formData={{
                  historicalSignificance: form.watch("historicalSignificance"),
                  culturalSignificance: form.watch("culturalSignificance"),
                  isHeritageSite: form.watch("isHeritageSite"),
                  heritageDesignation: form.watch("heritageDesignation"),
                  inscriptions: form.watch("inscriptions"),
                  hasArchaeologicalValue: form.watch("hasArchaeologicalValue"),
                  archaeologicalDetails: form.watch("archaeologicalDetails"),
                  preservationStatus: form.watch("preservationStatus"),
                  lastRestorationYear: form.watch("lastRestorationYear")
                    ? Number(form.watch("lastRestorationYear"))
                    : undefined,
                  restorationDetails: form.watch("restorationDetails"),
                  hasRegularMaintenance: form.watch("hasRegularMaintenance"),
                  maintenanceDetails: form.watch("maintenanceDetails"),
                  fundingSource: form.watch("fundingSource"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("religious")}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("management")}
                >
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="management">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ManagementOperations
                formData={{
                  managedBy: form.watch("managedBy"),
                  contactPerson: form.watch("contactPerson"),
                  contactPhone: form.watch("contactPhone"),
                  contactEmail: form.watch("contactEmail"),
                  websiteUrl: form.watch("websiteUrl"),
                  dailyOpeningTime: form.watch("dailyOpeningTime"),
                  dailyClosingTime: form.watch("dailyClosingTime"),
                  isOpenAllDay: form.watch("isOpenAllDay"),
                  weeklyClosedDays: form.watch("weeklyClosedDays"),
                  entryFeeNPR: form.watch("entryFeeNPR")
                    ? Number(form.watch("entryFeeNPR"))
                    : undefined,
                  entryFeeDetailsForeigners: form.watch(
                    "entryFeeDetailsForeigners",
                  ),
                  linkedCulturalEvents: form.watch("linkedCulturalEvents"),
                  linkedCulturalOrganizations: form.watch(
                    "linkedCulturalOrganizations",
                  ),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("cultural")}
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
              <InfrastructureDetails
                formData={{
                  totalBuildingCount: form.watch("totalBuildingCount")
                    ? Number(form.watch("totalBuildingCount"))
                    : undefined,
                  hasMainHall: form.watch("hasMainHall"),
                  mainHallCapacity: form.watch("mainHallCapacity")
                    ? Number(form.watch("mainHallCapacity"))
                    : undefined,
                  hasCommunitySpace: form.watch("hasCommunitySpace"),
                  hasAccommodation: form.watch("hasAccommodation"),
                  accommodationCapacity: form.watch("accommodationCapacity")
                    ? Number(form.watch("accommodationCapacity"))
                    : undefined,
                  hasKitchen: form.watch("hasKitchen"),
                  hasDiningHall: form.watch("hasDiningHall"),
                  diningCapacity: form.watch("diningCapacity")
                    ? Number(form.watch("diningCapacity"))
                    : undefined,
                  hasLibrary: form.watch("hasLibrary"),
                  hasMuseum: form.watch("hasMuseum"),

                  hasParking: form.watch("hasParking"),
                  parkingCapacity: form.watch("parkingCapacity")
                    ? Number(form.watch("parkingCapacity"))
                    : undefined,
                  hasToilets: form.watch("hasToilets"),
                  hasHandicapAccess: form.watch("hasHandicapAccess"),
                  hasElectricity: form.watch("hasElectricity"),
                  hasWaterSupply: form.watch("hasWaterSupply"),
                  hasDrinkingWater: form.watch("hasDrinkingWater"),
                  hasFootwear: form.watch("hasFootwear"),
                  hasClothStorage: form.watch("hasClothStorage"),

                  hasSignificantArtwork: form.watch("hasSignificantArtwork"),
                  artworkDetails: form.watch("artworkDetails"),
                  hasHistoricalArtifacts: form.watch("hasHistoricalArtifacts"),
                  artifactsDetails: form.watch("artifactsDetails"),
                  hasRegisteredTreasures: form.watch("hasRegisteredTreasures"),
                  treasureDetails: form.watch("treasureDetails"),

                  hasSecurityPersonnel: form.watch("hasSecurityPersonnel"),
                  hasCCTV: form.watch("hasCCTV"),
                  hasFireSafety: form.watch("hasFireSafety"),
                  disasterPreparedness: form.watch("disasterPreparedness"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("management")}
                >
                  Back
                </Button>
                <Button type="button" onClick={() => setActiveTab("visitors")}>
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="visitors">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <VisitorInformation
                formData={{
                  estimatedDailyVisitors: form.watch("estimatedDailyVisitors")
                    ? Number(form.watch("estimatedDailyVisitors"))
                    : undefined,
                  estimatedYearlyVisitors: form.watch("estimatedYearlyVisitors")
                    ? Number(form.watch("estimatedYearlyVisitors"))
                    : undefined,
                  peakVisitationMonths: form.watch("peakVisitationMonths"),
                  hasOverseasVisitors: form.watch("hasOverseasVisitors"),
                  guidesAvailable: form.watch("guidesAvailable"),
                  visitorDressCode: form.watch("visitorDressCode"),
                  photoAllowed: form.watch("photoAllowed"),
                  photoRestrictions: form.watch("photoRestrictions"),

                  communityBenefits: form.watch("communityBenefits"),
                  socialServicesOffered: form.watch("socialServicesOffered"),
                  educationalActivities: form.watch("educationalActivities"),

                  hasShops: form.watch("hasShops"),
                  shopCount: form.watch("shopCount")
                    ? Number(form.watch("shopCount"))
                    : undefined,
                  shopTypes: form.watch("shopTypes"),
                  economicImpact: form.watch("economicImpact"),
                  totalAnnualRevenue: form.watch("totalAnnualRevenue")
                    ? Number(form.watch("totalAnnualRevenue"))
                    : undefined,
                  annualOperatingBudget: form.watch("annualOperatingBudget")
                    ? Number(form.watch("annualOperatingBudget"))
                    : undefined,

                  currentChallenges: form.watch("currentChallenges"),
                  conservationNeeds: form.watch("conservationNeeds"),
                  developmentPlans: form.watch("developmentPlans"),
                }}
                updateFormData={(field, value) => form.setValue(field, value)}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("infrastructure")}
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
                <div className="text-lg font-medium">
                  Religious Place Location
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <ReligiousPlaceLocationMap
                      formData={{
                        wardNumber: form.watch("wardNumber")
                          ? Number(form.watch("wardNumber"))
                          : undefined,
                        location: form.watch("location"),
                        address: form.watch("address"),
                        areaInSquareMeters: form.watch("areaInSquareMeters")
                          ? Number(form.watch("areaInSquareMeters"))
                          : undefined,
                        locationPoint: form.watch("locationPoint"),
                        complexBoundary: form.watch("complexBoundary"),
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
                  onClick={() => setActiveTab("visitors")}
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
