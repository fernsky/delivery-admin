"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { HistoricalSiteDetails } from "./_components/historical-site-details";
import { HistoricalSiteMedia } from "./_components/historical-site-media";
import { HistoricalSiteMap } from "./_components/historical-site-map";

export default function HistoricalSiteDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"details" | "media" | "map">(
    "details",
  );

  // Fetch historical site data by ID
  const {
    data: historicalSite,
    isLoading,
    error,
  } = api.historicalSite.getById.useQuery(id, {
    retry: false,
    enabled: !!id,
  });

  // Delete historical site mutation
  const { mutate: deleteHistoricalSite, isLoading: isDeleting } =
    api.historicalSite.delete.useMutation({
      onSuccess: () => {
        toast.success("ऐतिहासिक स्थल सफलतापूर्वक मेटाइयो");
        router.push(
          "/dashboard/digital-profile/institutions/cultural/historical-sites",
        );
      },
      onError: (error) => {
        toast.error(`ऐतिहासिक स्थल मेटाउन असफल: ${error.message}`);
      },
    });

  // Handle delete confirmation
  const handleDelete = () => {
    if (
      window.confirm(
        "के तपाइँ यो ऐतिहासिक स्थल मेटाउन निश्चित हुनुहुन्छ? यो क्रिया पूर्ववत् गर्न सकिँदैन।",
      )
    ) {
      deleteHistoricalSite(id);
    }
  };

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

  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <ContentLayout title="ऐतिहासिक स्थल लोड हुँदै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  // If error occurs, show error message
  if (error || !historicalSite) {
    return (
      <ContentLayout title="त्रुटि">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>ऐतिहासिक स्थल खोज्न असफल</AlertTitle>
          <AlertDescription>
            माग गरिएको ऐतिहासिक स्थल खोज्न समस्या भयो। कृपया पछि फेरि प्रयास
            गर्नुहोला।
          </AlertDescription>
        </Alert>
        <Button
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/cultural/historical-sites",
            )
          }
          className="mt-4"
        >
          फिर्ता जानुहोस्
        </Button>
      </ContentLayout>
    );
  }

  const getActionButtons = () => {
    return [
      {
        label: "सम्पादन गर्नुहोस्",
        href: `/dashboard/digital-profile/institutions/cultural/historical-sites/edit/${id}`,
        variant: "default" as const,
      },
      {
        label: "मेटाउनुहोस्",
        onClick: handleDelete,
        disabled: isDeleting,
        variant: "destructive" as const,
      },
    ];
  };

  return (
    <ContentLayout
      title={historicalSite.name}
      subtitle={getHistoricalSiteTypeLabel(historicalSite.type)}
      backHref="/dashboard/digital-profile/institutions/cultural/historical-sites"
      actionButtons={getActionButtons()}
      verified={historicalSite.isVerified}
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="details" className="flex-1 sm:flex-none">
            विवरण
          </TabsTrigger>
          <TabsTrigger value="media" className="flex-1 sm:flex-none">
            फोटोहरू
          </TabsTrigger>
          <TabsTrigger value="map" className="flex-1 sm:flex-none">
            नक्सा
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="details">
            <HistoricalSiteDetails historicalSite={historicalSite} />
          </TabsContent>

          <TabsContent value="media">
            <HistoricalSiteMedia
              historicalSiteId={id}
              media={historicalSite.media || []}
            />
          </TabsContent>

          <TabsContent value="map">
            <HistoricalSiteMap historicalSite={historicalSite} />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
