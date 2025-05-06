"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { ProcessingCenterEditForm } from "../_components/processing-center-edit-form";
import { ProcessingCenterMediaSection } from "../_components/processing-center-media-section";
import { toast } from "sonner";

export default function EditProcessingCenterPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch processing center data by ID
  const { data: processingCenter, isLoading } =
    api.profile.processingCenters.getById.useQuery(params.id, {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/processing-centers",
        );
        toast.error("कृषि प्रशोधन केन्द्र फेला परेन");
      },
    });

  // Get processing center type label
  const getCenterTypeLabel = (type: string) => {
    const types = {
      COLLECTION_CENTER: "संकलन केन्द्र",
      STORAGE_FACILITY: "भण्डारण केन्द्र",
      PROCESSING_UNIT: "प्रशोधन इकाई",
      MULTIPURPOSE_CENTER: "बहुउद्देश्यीय केन्द्र",
      MARKET_CENTER: "बजार केन्द्र",
      COLD_STORAGE: "कोल्ड स्टोरेज",
      WAREHOUSE: "गोदाम",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="कृषि प्रशोधन केन्द्र लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!processingCenter) {
    return (
      <ContentLayout title="कृषि प्रशोधन केन्द्र फेला परेन">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>माग गरिएको कृषि प्रशोधन केन्द्र फेला परेन</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/agricultural/processing-centers",
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
      title={`${processingCenter.name} सम्पादन गर्नुहोस्`}
      subtitle={getCenterTypeLabel(processingCenter.centerType)}
      backHref={`/dashboard/digital-profile/institutions/agricultural/processing-centers/${processingCenter.id}`}
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
            <ProcessingCenterEditForm processingCenter={processingCenter} />
          </TabsContent>

          <TabsContent value="media">
            <ProcessingCenterMediaSection
              processingCenterId={processingCenter.id}
              existingMedia={processingCenter.media || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
