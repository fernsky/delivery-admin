"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { GrazingAreaEditForm } from "../_components/grazing-area-edit-form";
import { GrazingAreaMediaSection } from "../_components/grazing-area-media-section";
import { toast } from "sonner";

export default function EditGrazingAreaPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch grazing area data by ID
  const { data: grazingArea, isLoading } = api.grazingArea.getById.useQuery(
    params.id,
    {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/grazing-areas",
        );
        toast.error("चरन खर्क क्षेत्र फेला परेन");
      },
    },
  );

  // Get grazing area type label
  const getGrazingAreaTypeLabel = (type: string) => {
    const types = {
      OPEN_RANGE: "खुल्ला चरन क्षेत्र",
      ALPINE_MEADOW: "हिमाली घाँसे मैदान",
      COMMUNITY_PASTURE: "सामुदायिक चरन",
      FOREST_UNDERSTORY: "वन मुनिको चरन क्षेत्र",
      FLOODPLAIN: "बाढी मैदान चरन",
      SEASONAL_PASTURE: "मौसमी चरन",
      DRY_SEASON_RESERVE: "सुख्खा मौसम आरक्षित क्षेत्र",
      ROTATIONAL_PADDOCK: "चक्रीय खर्क",
      MIXED: "मिश्रित",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="चरन खर्क क्षेत्र लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!grazingArea) {
    return (
      <ContentLayout title="चरन खर्क क्षेत्र फेला परेन">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>माग गरिएको चरन खर्क क्षेत्र फेला परेन</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/agricultural/grazing-areas",
                )
              }
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              फिर्ता जानुहोस्
            </Button>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={`${grazingArea.name} सम्पादन गर्नुहोस्`}
      subtitle={getGrazingAreaTypeLabel(grazingArea.type)}
      backHref={`/dashboard/digital-profile/institutions/agricultural/grazing-areas/${grazingArea.id}`}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "general" | "media")}
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="general" className="flex-1 sm:flex-none">
            आधारभूत जानकारी
          </TabsTrigger>
          <TabsTrigger value="media" className="flex-1 sm:flex-none">
            फोटोहरू
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general">
            <GrazingAreaEditForm grazingArea={grazingArea} />
          </TabsContent>

          <TabsContent value="media">
            <GrazingAreaMediaSection
              grazingAreaId={grazingArea.id}
              existingMedia={grazingArea.media || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
