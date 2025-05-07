"use client";

import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { ProcessingCenterDetails } from "./_components/processing-center-details";
import { ProcessingCenterMap } from "./_components/processing-center-map";
import { ProcessingCenterMedia } from "./_components/processing-center-media";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function ProcessingCenterPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch processing center data by ID
  const { data: processingCenter, isLoading } =
    api.profile.processingCenters.getById.useQuery(params.id, {
      retry: false,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/processing-centers",
        );
      },
    });

  // Delete processing center mutation
  const { mutate: deleteProcessingCenter, isLoading: isDeleting } =
    api.profile.processingCenters.delete.useMutation({
      onSuccess: () => {
        toast.success("कृषि प्रशोधन केन्द्र हटाइयो");
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/processing-centers",
        );
      },
      onError: (error) => {
        toast.error(`हटाउन असफल: ${error.message}`);
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

  const handleDelete = () => {
    deleteProcessingCenter(params.id);
    setDeleteDialogOpen(false);
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
        <div className="text-center py-10">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            माग गरिएको कृषि प्रशोधन केन्द्र फेला परेन
          </h2>
          <p className="mb-4 text-muted-foreground">
            यो कृषि प्रशोधन केन्द्र हटाइएको हुन सक्छ वा यसको आईडी गलत हुन सक्छ।
          </p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/agricultural/processing-centers",
              )
            }
          >
            प्रशोधन केन्द्रहरूको सूचीमा फर्कनुहोस्
          </Button>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={processingCenter.name}
      subtitle={getCenterTypeLabel(processingCenter.centerType)}
      backHref="/dashboard/digital-profile/institutions/agricultural/processing-centers"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() =>
              router.push(
                `/dashboard/digital-profile/institutions/agricultural/processing-centers/edit/${processingCenter.id}`,
              )
            }
          >
            <Pencil className="h-4 w-4" />
            सम्पादन गर्नुहोस्
          </Button>
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            हटाउनुहोस्
          </Button>
        </div>
      }
    >
      <Tabs defaultValue="overview">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">
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
          <TabsContent value="overview">
            <ProcessingCenterDetails processingCenter={processingCenter} />
          </TabsContent>
          <TabsContent value="media">
            <ProcessingCenterMedia media={processingCenter.media} />
          </TabsContent>
          <TabsContent value="map">
            <ProcessingCenterMap
              locationPoint={processingCenter.locationPoint}
              facilityFootprint={processingCenter.facilityFootprint}
              name={processingCenter.name}
              centerType={processingCenter.centerType}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              के तपाईं यो कृषि प्रशोधन केन्द्र हटाउन निश्चित हुनुहुन्छ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              यो कार्य अपरिवर्तनीय छ। यसले स्थायी रूपमा {processingCenter.name}{" "}
              हटाउनेछ र यससँग सम्बन्धित सबै डेटा मेटाउनेछ।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              हटाउनुहोस्
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentLayout>
  );
}
