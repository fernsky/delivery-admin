"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { FarmEditForm } from "../_components/farm-edit-form";
import { FarmMediaSection } from "../_components/farm-media-section";
import { toast } from "sonner";

export default function EditFarmPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch farm data by ID
  const { data: farm, isLoading } = api.farm.getById.useQuery(params.id, {
    retry: false,
    enabled: !!params.id,
    onError: () => {
      router.push("/dashboard/digital-profile/institutions/agricultural/farms");
      toast.error("Farm not found");
    },
  });

  // Get farm type label
  const getFarmTypeLabel = (type: string) => {
    const types = {
      CROP_FARM: "Crop Farm",
      LIVESTOCK_FARM: "Livestock Farm",
      MIXED_FARM: "Mixed Farm",
      POULTRY_FARM: "Poultry Farm",
      DAIRY_FARM: "Dairy Farm",
      AQUACULTURE_FARM: "Aquaculture Farm",
      HORTICULTURE_FARM: "Horticulture Farm",
      APICULTURE_FARM: "Apiculture Farm",
      SERICULTURE_FARM: "Sericulture Farm",
      ORGANIC_FARM: "Organic Farm",
      COMMERCIAL_FARM: "Commercial Farm",
      SUBSISTENCE_FARM: "Subsistence Farm",
      AGROFORESTRY: "Agroforestry",
      OTHER: "Other",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="Loading farm...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!farm) {
    return (
      <ContentLayout title="Farm not found">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>The requested farm could not be found</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/agricultural/farms",
                )
              }
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={`Edit ${farm.name}`}
      subtitle={getFarmTypeLabel(farm.farmType)}
      backHref={`/dashboard/digital-profile/institutions/agricultural/farms/${farm.id}`}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "general" | "media")}
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="general" className="flex-1 sm:flex-none">
            Basic Information
          </TabsTrigger>
          <TabsTrigger value="media" className="flex-1 sm:flex-none">
            Photos
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general">
            <FarmEditForm farm={farm} />
          </TabsContent>

          <TabsContent value="media">
            <FarmMediaSection
              farmId={farm.id}
              existingMedia={farm.media || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
