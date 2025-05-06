"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { ReligiousPlaceEditForm } from "../_components/religious-place-edit-form";
import { ReligiousPlaceMediaSection } from "../_components/religious-place-media-section";
import { toast } from "sonner";

export default function EditReligiousPlacePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch religious place data by ID
  const { data: religiousPlace, isLoading } =
    api.religiousPlace.getById.useQuery(params.id, {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/cultural/religious-places",
        );
        toast.error("Religious place not found");
      },
    });

  // Get religious place type label
  const getReligiousPlaceTypeLabel = (type: string) => {
    const types = {
      HINDU_TEMPLE: "Hindu Temple",
      BUDDHIST_TEMPLE: "Buddhist Temple",
      MOSQUE: "Mosque",
      CHURCH: "Church",
      GURUDWARA: "Gurudwara",
      SHRINE: "Shrine",
      MONASTERY: "Monastery",
      SYNAGOGUE: "Synagogue",
      JAIN_TEMPLE: "Jain Temple",
      MEDITATION_CENTER: "Meditation Center",
      PAGODA: "Pagoda",
      SACRED_GROVE: "Sacred Grove",
      SACRED_POND: "Sacred Pond",
      SACRED_RIVER: "Sacred River",
      SACRED_HILL: "Sacred Hill",
      PRAYER_HALL: "Prayer Hall",
      RELIGIOUS_COMPLEX: "Religious Complex",
      OTHER: "Other",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="Loading religious place...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!religiousPlace) {
    return (
      <ContentLayout title="Religious place not found">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>The requested religious place could not be found</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/cultural/religious-places",
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
      title={`Edit ${religiousPlace.name}`}
      subtitle={getReligiousPlaceTypeLabel(religiousPlace.type)}
      backHref={`/dashboard/digital-profile/institutions/cultural/religious-places/${religiousPlace.id}`}
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
            <ReligiousPlaceEditForm religiousPlace={religiousPlace} />
          </TabsContent>

          <TabsContent value="media">
            <ReligiousPlaceMediaSection
              religiousPlaceId={religiousPlace.id}
              existingMedia={religiousPlace.media || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
