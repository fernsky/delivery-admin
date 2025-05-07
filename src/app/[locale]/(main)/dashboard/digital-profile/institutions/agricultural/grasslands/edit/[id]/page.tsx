"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { GrasslandEditForm } from "../_components/grassland-edit-form";
import { GrasslandMediaSection } from "../_components/grassland-media-section";
import { toast } from "sonner";

export default function EditGrasslandPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch grassland data by ID
  const { data: grassland, isLoading } =
    api.profile.grasslands.getById.useQuery(params.id, {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/grasslands",
        );
        toast.error("चरन क्षेत्र फेला परेन");
      },
    });

  // Get grassland type label
  const getGrasslandTypeLabel = (type: string) => {
    const types = {
      NATURAL_MEADOW: "प्राकृतिक घाँसे मैदान",
      IMPROVED_PASTURE: "सुधारिएको चरन क्षेत्र",
      RANGELAND: "रेञ्जल्याण्ड",
      SILVOPASTURE: "वन चरन (रूख र घाँस मिश्रित)",
      WETLAND_GRAZING: "सिमसार चरन क्षेत्र",
      ALPINE_GRASSLAND: "हिमाली घाँसे मैदान",
      COMMON_GRAZING_LAND: "सामुदायिक चरन क्षेत्र",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="चरन क्षेत्र लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!grassland) {
    return (
      <ContentLayout title="चरन क्षेत्र फेला परेन">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>माग गरिएको चरन क्षेत्र फेला परेन</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/agricultural/grasslands",
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
      title={`${grassland.name} सम्पादन गर्नुहोस्`}
      subtitle={getGrasslandTypeLabel(grassland.type)}
      backHref={`/dashboard/digital-profile/institutions/agricultural/grasslands/${grassland.id}`}
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
            <GrasslandEditForm grassland={grassland} />
          </TabsContent>

          <TabsContent value="media">
            <GrasslandMediaSection
              grasslandId={grassland.id}
              existingMedia={grassland.media || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
