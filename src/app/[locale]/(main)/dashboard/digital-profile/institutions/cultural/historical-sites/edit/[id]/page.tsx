"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { HistoricalSiteEditForm } from "../_components/historical-site-edit-form";
import { HistoricalSiteMediaSection } from "../_components/historical-site-media-section";
import { toast } from "sonner";

export default function EditHistoricalSitePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch historical site data by ID
  const { data: site, isLoading } = api.historicalSite.getById.useQuery(
    params.id,
    {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/cultural/historical-sites",
        );
        toast.error("ऐतिहासिक स्थल फेला परेन");
      },
    },
  );

  // Get historical site type label in Nepali
  const getHistoricalSiteTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      PALACE: "दरबार",
      FORT: "किल्ला",
      ANCIENT_SETTLEMENT: "प्राचीन बस्ती",
      ARCHAEOLOGICAL_SITE: "पुरातात्विक स्थल",
      ANCIENT_MONUMENT: "प्राचीन स्मारक",
      HERITAGE_BUILDING: "सम्पदा भवन",
      HISTORIC_HOUSE: "ऐतिहासिक घर",
      MEDIEVAL_TOWN: "मध्यकालीन शहर",
      ROYAL_RESIDENCE: "राजकीय निवास",
      HISTORIC_GARDEN: "ऐतिहासिक बगैंचा",
      HISTORIC_INFRASTRUCTURE: "ऐतिहासिक पूर्वाधार",
      BATTLEFIELD: "युद्धक्षेत्र",
      ANCIENT_RUINS: "प्राचीन भग्नावशेष",
      HISTORIC_LANDMARK: "ऐतिहासिक चिन्ह",
      OTHER: "अन्य",
    };
    return types[type] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="ऐतिहासिक स्थल लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!site) {
    return (
      <ContentLayout title="ऐतिहासिक स्थल फेला परेन">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>माग गरिएको ऐतिहासिक स्थल फेला परेन</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/cultural/historical-sites",
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
      title={`${site.name} सम्पादन गर्नुहोस्`}
      subtitle={getHistoricalSiteTypeLabel(site.type)}
      backHref={`/dashboard/digital-profile/institutions/cultural/historical-sites/${site.id}`}
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
            <HistoricalSiteEditForm site={site} />
          </TabsContent>

          <TabsContent value="media">
            <HistoricalSiteMediaSection
              siteId={site.id}
              existingMedia={site.media || []}
              entityType="HISTORICAL_SITE"
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
