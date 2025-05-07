"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicHistoricalSiteDetails } from "../../create/_components/basic-historical-site-details";
import { HistoricalSiteLocationMap } from "../../create/_components/historical-site-location-map";
import { HistoricalDetails } from "../../create/_components/historical-details";
import { InfrastructureDetails } from "../../create/_components/infrastructure-details";
import { VisitorInformation } from "../../create/_components/visitor-information";
import { ManagementDetails } from "../../create/_components/management-details";
import { ArtifactsAndCulturalDetails } from "../../create/_components/artifacts-and-cultural-details";
import { SEOFields } from "./seo-fields";

import {
  historicalSiteTypeEnum,
  historicalArchitecturalStyleEnum,
  historicalConstructionMaterialEnum,
  historicalSignificanceEnum,
  historicalPreservationStatusEnum,
  historicalPeriodEnum,
} from "@/utils/enums/historical-sites-enums";

// Define the form schema
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "ऐतिहासिक स्थलको नाम आवश्यक छ"),
  description: z.string().optional(),
  type: z.enum(historicalSiteTypeEnum),

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
  architecturalStyle: z.enum(historicalArchitecturalStyleEnum).optional(),
  constructionMaterial: z.enum(historicalConstructionMaterialEnum).optional(),
  historicalPeriod: z.enum(historicalPeriodEnum).optional(),
  yearEstablished: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  yearAbandoned: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  lastRestorationYear: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

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
  excavationYear: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Heritage status
  isHeritageSite: z.boolean().optional(),
  heritageDesignation: z.string().optional(),
  heritageListingYear: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
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
  entryFeeNPR: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  entryFeeDetailsForeigners: z.string().optional(),

  // Physical infrastructure
  totalStructureCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
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
  parkingCapacity: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
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
  hasTourismInfrastructure: z.boolean().optional(),
  tourismDetails: z.string().optional(),
  visitorFacilities: z.string().optional(),
  photoAllowed: z.boolean().optional(),
  photoRestrictions: z.string().optional(),
  visitDuration: z.string().optional(),

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
  siteBoundary: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),

  // Status
  isVerified: z.boolean().optional(),

  // Additional fields for tracking original values
  originalName: z.string().optional(),
  originalSlug: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HistoricalSiteEditFormProps {
  site: any;
}

export function HistoricalSiteEditForm({ site }: HistoricalSiteEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with historical site data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: site.id,
      name: site.name || "",
      description: site.description || "",
      type: site.type,
      originalName: site.name,
      originalSlug: site.slug,

      // Location details
      wardNumber: site.wardNumber?.toString() || "",
      location: site.location || "",
      address: site.address || "",

      // Physical details
      areaInSquareMeters: site.areaInSquareMeters?.toString() || "",
      architecturalStyle: site.architecturalStyle,
      constructionMaterial: site.constructionMaterial,
      historicalPeriod: site.historicalPeriod,
      yearEstablished: site.yearEstablished?.toString() || "",
      yearAbandoned: site.yearAbandoned?.toString() || "",
      lastRestorationYear: site.lastRestorationYear?.toString() || "",

      // Historical context
      historicalSignificance: site.historicalSignificance,
      originalFunction: site.originalFunction || "",
      notablePeople: site.notablePeople || "",
      historicalEvents: site.historicalEvents || "",
      dynastyOrRulership: site.dynastyOrRulership || "",
      changeOfOwnership: site.changeOfOwnership || "",

      // Cultural and archaeological significance
      culturalSignificance: site.culturalSignificance || "",
      archaeologicalRemains: site.archaeologicalRemains || "",
      artifactsFound: site.artifactsFound || "",
      excavationHistory: site.excavationHistory || "",
      excavationYear: site.excavationYear?.toString() || "",

      // Heritage status
      isHeritageSite: site.isHeritageSite || false,
      heritageDesignation: site.heritageDesignation || "",
      heritageListingYear: site.heritageListingYear?.toString() || "",
      heritageReferenceId: site.heritageReferenceId || "",

      // Inscriptions and documentation
      hasInscriptions: site.hasInscriptions || false,
      inscriptionDetails: site.inscriptionDetails || "",
      hasHistoricalDocuments: site.hasHistoricalDocuments || false,
      documentationDetails: site.documentationDetails || "",

      // Management and operations
      managedBy: site.managedBy || "",
      contactPerson: site.contactPerson || "",
      contactPhone: site.contactPhone || "",
      contactEmail: site.contactEmail || "",
      websiteUrl: site.websiteUrl || "",
      dailyOpeningTime: site.dailyOpeningTime || "",
      dailyClosingTime: site.dailyClosingTime || "",
      isOpenAllDay: site.isOpenAllDay || false,
      weeklyClosedDays: site.weeklyClosedDays || "",
      entryFeeNPR: site.entryFeeNPR?.toString() || "",
      entryFeeDetailsForeigners: site.entryFeeDetailsForeigners || "",

      // Physical infrastructure
      totalStructureCount: site.totalStructureCount?.toString() || "",
      hasMainBuilding: site.hasMainBuilding || false,
      hasDefensiveWalls: site.hasDefensiveWalls || false,
      hasTowers: site.hasTowers || false,
      hasMoat: site.hasMoat || false,
      hasGardens: site.hasGardens || false,
      hasCourtyards: site.hasCourtyards || false,
      structureDetails: site.structureDetails || "",

      // Features and architectural elements
      notableFeatures: site.notableFeatures || "",
      architecturalElements: site.architecturalElements || "",
      hasUndergroundStructures: site.hasUndergroundStructures || false,
      undergroundDetails: site.undergroundDetails || "",
      hasDurbar: site.hasDurbar || false,
      hasTemple: site.hasTemple || false,
      hasArtificialWaterBody: site.hasArtificialWaterBody || false,
      waterBodyDetails: site.waterBodyDetails || "",

      // Facilities and amenities
      hasParking: site.hasParking || false,
      parkingCapacity: site.parkingCapacity?.toString() || "",
      hasToilets: site.hasToilets || false,
      hasHandicapAccess: site.hasHandicapAccess || false,
      hasElectricity:
        site.hasElectricity !== undefined ? site.hasElectricity : true,
      hasWaterSupply:
        site.hasWaterSupply !== undefined ? site.hasWaterSupply : true,
      hasCafeteria: site.hasCafeteria || false,
      hasGiftShop: site.hasGiftShop || false,

      // Preservation and restoration
      preservationStatus: site.preservationStatus,
      restorationDetails: site.restorationDetails || "",
      hasRegularMaintenance: site.hasRegularMaintenance || false,
      maintenanceDetails: site.maintenanceDetails || "",
      fundingSource: site.fundingSource || "",
      conservationChallenges: site.conservationChallenges || "",

      // Research and education
      researchValue: site.researchValue || "",
      ongoingResearch: site.ongoingResearch || "",
      educationalPrograms: site.educationalPrograms || "",
      publicationReferences: site.publicationReferences || "",

      // Visitor information
      estimatedDailyVisitors: site.estimatedDailyVisitors?.toString() || "",
      estimatedYearlyVisitors: site.estimatedYearlyVisitors?.toString() || "",
      peakVisitationMonths: site.peakVisitationMonths || "",
      hasOverseasVisitors: site.hasOverseasVisitors || false,
      guidesAvailable: site.guidesAvailable || false,
      hasTourismInfrastructure: site.hasTourismInfrastructure || false,
      tourismDetails: site.tourismDetails || "",
      visitorFacilities: site.visitorFacilities || "",
      photoAllowed: site.photoAllowed !== undefined ? site.photoAllowed : true,
      photoRestrictions: site.photoRestrictions || "",
      visitDuration: site.visitDuration || "",

      // SEO fields
      metaTitle: site.metaTitle || "",
      metaDescription: site.metaDescription || "",
      keywords: site.keywords || "",

      // Geometry fields
      locationPoint: site.locationPoint,
      siteBoundary: site.siteBoundary,

      // Status
      isVerified: site.isVerified || false,
    },
  });

  // Update historical site mutation
  const { mutate: updateHistoricalSite, isLoading } =
    api.historicalSite.update.useMutation({
      onSuccess: () => {
        toast.success("ऐतिहासिक स्थल सफलतापूर्वक अपडेट गरियो");
        router.push(
          `/dashboard/digital-profile/institutions/cultural/historical-sites/${site.id}`,
        );
      },
      onError: (error) => {
        toast.error(`ऐतिहासिक स्थल अपडेट गर्न असफल: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    updateHistoricalSite({
      ...values,
    });
  };

  // Handle geometry selection from map
  const handleGeometrySelect = (
    locationPoint?: { type: "Point"; coordinates: [number, number] },
    siteBoundary?: {
      type: "Polygon";
      coordinates: Array<Array<[number, number]>>;
    },
  ) => {
    if (locationPoint) {
      form.setValue("locationPoint", locationPoint);
    }

    if (siteBoundary) {
      form.setValue("siteBoundary", siteBoundary);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="basic">आधारभूत जानकारी</TabsTrigger>
          <TabsTrigger value="location">स्थान र नक्सा</TabsTrigger>
          <TabsTrigger value="historical">ऐतिहासिक विवरण</TabsTrigger>
          <TabsTrigger value="infrastructure">भौतिक संरचना</TabsTrigger>
          <TabsTrigger value="artifacts">पुरातात्विक महत्व</TabsTrigger>
          <TabsTrigger value="management">व्यवस्थापन</TabsTrigger>
          <TabsTrigger value="visitor">पर्यटक जानकारी</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicHistoricalSiteDetails form={form} />

              <SEOFields form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  रद्द गर्नुहोस्
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
                  ऐतिहासिक स्थलको अवस्थिति
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <HistoricalSiteLocationMap
                    form={form}
                    initialLocationPoint={form.watch("locationPoint")}
                    initialSiteBoundary={form.watch("siteBoundary")}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("basic")}
                >
                  पछिल्लो
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("historical")}
                >
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="historical">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <HistoricalDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("location")}
                >
                  पछिल्लो
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("infrastructure")}
                >
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="infrastructure">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <InfrastructureDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("historical")}
                >
                  पछिल्लो
                </Button>
                <Button type="button" onClick={() => setActiveTab("artifacts")}>
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="artifacts">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ArtifactsAndCulturalDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("infrastructure")}
                >
                  पछिल्लो
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("management")}
                >
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="management">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <ManagementDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("artifacts")}
                >
                  पछिल्लो
                </Button>
                <Button type="button" onClick={() => setActiveTab("visitor")}>
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="visitor">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <VisitorInformation form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("management")}
                >
                  पछिल्लो
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      सुरक्षित गर्दै...
                    </>
                  ) : (
                    "सुरक्षित गर्नुहोस्"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
