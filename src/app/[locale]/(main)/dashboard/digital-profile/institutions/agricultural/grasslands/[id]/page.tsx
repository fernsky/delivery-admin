"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { GrasslandDetails } from "./_components/grassland-details";
import { GrasslandMedia } from "./_components/grassland-media";
import { GrasslandMap } from "./_components/grassland-map";
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

export default function ViewGrasslandPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Delete mutation
  const { mutate: deleteGrassland, isLoading: isDeleting } =
    api.profile.grasslands.delete.useMutation({
      onSuccess: () => {
        toast.success("चरन क्षेत्र सफलतापूर्वक हटाइयो");
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/grasslands",
        );
      },
      onError: (error) => {
        toast.error(`चरन क्षेत्र हटाउन असफल: ${error.message}`);
        setIsDeleteDialogOpen(false);
      },
    });

  // Handle delete confirmation
  const handleDelete = () => {
    if (grassland?.id) {
      deleteGrassland(grassland.id);
    }
  };

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
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">
            माग गरिएको चरन क्षेत्र फेला परेन
          </p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/agricultural/grasslands",
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
      title={grassland.name}
      subtitle={getGrasslandTypeLabel(grassland.type)}
      backHref="/dashboard/digital-profile/institutions/agricultural/grasslands"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/digital-profile/institutions/agricultural/grasslands/edit/${grassland.id}`,
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
            <GrasslandDetails grassland={grassland} />
          </TabsContent>

          <TabsContent value="map">
            <GrasslandMap grassland={grassland} />
          </TabsContent>

          <TabsContent value="media">
            <GrasslandMedia
              grasslandId={grassland.id}
              media={grassland.media || []}
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
              चरन क्षेत्र &quot;{grassland.name}&quot; हटाउने। यो कार्य पूर्ववत
              हुन सक्दैन।
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
