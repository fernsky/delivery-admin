"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { GrazingAreaDetails } from "./_components/grazing-area-details";
import { GrazingAreaMedia } from "./_components/grazing-area-media";
import { GrazingAreaMap } from "./_components/grazing-area-map";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ViewGrazingAreaPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Delete mutation
  const { mutate: deleteGrazingArea, isLoading: isDeleting } =
    api.grazingArea.delete.useMutation({
      onSuccess: () => {
        toast.success("चरन खर्क क्षेत्र सफलतापूर्वक हटाइयो");
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/grazing-areas",
        );
      },
      onError: (error) => {
        toast.error(`चरन खर्क क्षेत्र हटाउन असफल: ${error.message}`);
        setIsDeleteDialogOpen(false);
      },
    });

  // Handle delete confirmation
  const handleDelete = () => {
    if (grazingArea?.id) {
      deleteGrazingArea(grazingArea.id);
    }
  };

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
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">
            माग गरिएको चरन खर्क क्षेत्र फेला परेन
          </p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/agricultural/grazing-areas",
              )
            }
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            सूचीमा फर्कनुहोस्
          </Button>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={grazingArea.name}
      subtitle={getGrazingAreaTypeLabel(grazingArea.type)}
      backHref="/dashboard/digital-profile/institutions/agricultural/grazing-areas"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/digital-profile/institutions/agricultural/grazing-areas/edit/${grazingArea.id}`,
              )
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            सम्पादन
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            हटाउनुहोस्
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">विवरण</TabsTrigger>
            <TabsTrigger value="map">नक्सा</TabsTrigger>
            <TabsTrigger value="media">फोटोहरू</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <GrazingAreaDetails grazingArea={grazingArea} />
          </TabsContent>

          <TabsContent value="map">
            <GrazingAreaMap grazingArea={grazingArea} />
          </TabsContent>

          <TabsContent value="media">
            <GrazingAreaMedia
              grazingAreaId={grazingArea.id}
              media={grazingArea.media || []}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              चरन खर्क क्षेत्र &quot;{grazingArea.name}&quot; हटाउने। यो कार्य
              पूर्ववत हुन सक्दैन।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              हटाउनुहोस्
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentLayout>
  );
}
