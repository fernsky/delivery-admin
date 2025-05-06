"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { FishFarmEditForm } from "../_components/fish-farm-edit-form";
import { FishFarmMediaSection } from "../_components/fish-farm-media-section";
import { toast } from "sonner";

export default function EditFishFarmPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch fish farm data by ID
  const { data: fishFarm, isLoading } = api.fishFarm.getById.useQuery(
    params.id,
    {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/fish-farms",
        );
        toast.error("Fish farm not found");
      },
    },
  );

  // Get fish farm type label
  const getFishFarmTypeLabel = (type: string) => {
    const types = {
      POND_CULTURE: "Pond Culture",
      CAGE_CULTURE: "Cage Culture",
      TANK_CULTURE: "Tank Culture",
      RACEWAY_CULTURE: "Raceway Culture",
      RECIRCULATING_AQUACULTURE_SYSTEM: "Recirculating Aquaculture System",
      HATCHERY: "Hatchery",
      NURSERY: "Nursery",
      INTEGRATED_FARMING: "Integrated Farming",
      RICE_FISH_CULTURE: "Rice-Fish Culture",
      ORNAMENTAL_FISH_FARM: "Ornamental Fish Farm",
      RESEARCH_FACILITY: "Research Facility",
      MIXED: "Mixed",
      OTHER: "Other",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="Loading fish farm...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!fishFarm) {
    return (
      <ContentLayout title="Fish farm not found">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>The requested fish farm could not be found</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/agricultural/fish-farms",
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
      title={`Edit ${fishFarm.name}`}
      subtitle={getFishFarmTypeLabel(fishFarm.farmType)}
      backHref={`/dashboard/digital-profile/institutions/agricultural/fish-farms/${fishFarm.id}`}
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
            <FishFarmEditForm fishFarm={fishFarm} />
          </TabsContent>

          <TabsContent value="media">
            <FishFarmMediaSection
              fishFarmId={fishFarm.id}
              existingMedia={fishFarm.media || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
