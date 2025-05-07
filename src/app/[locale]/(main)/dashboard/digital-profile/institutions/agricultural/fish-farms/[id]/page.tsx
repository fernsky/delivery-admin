"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { FishFarmDetails } from "./_components/fish-farm-details";
import { FishFarmMedia } from "./_components/fish-farm-media";
import { FishFarmMap } from "./_components/fish-farm-map";
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

export default function ViewFishFarmPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
        toast.error("माछा फार्म फेला परेन");
      },
    },
  );

  // Delete mutation
  const { mutate: deleteFishFarm, isLoading: isDeleting } =
    api.fishFarm.delete.useMutation({
      onSuccess: () => {
        toast.success("माछा फार्म सफलतापूर्वक हटाइयो");
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/fish-farms",
        );
      },
      onError: (error) => {
        toast.error(`माछा फार्म हटाउन असफल: ${error.message}`);
        setIsDeleteDialogOpen(false);
      },
    });

  // Handle delete confirmation
  const handleDelete = () => {
    if (fishFarm?.id) {
      deleteFishFarm(fishFarm.id);
    }
  };

  // Get fish farm type label
  const getFishFarmTypeLabel = (type: string) => {
    const types = {
      POND_CULTURE: "पोखरी मत्स्य पालन",
      CAGE_CULTURE: "पिंजडा मत्स्य पालन",
      TANK_CULTURE: "ट्यांक मत्स्य पालन",
      RACEWAY_CULTURE: "रेसवे मत्स्य पालन",
      RECIRCULATING_AQUACULTURE_SYSTEM: "रिसर्कुलेटिङ एक्वाकल्चर प्रणाली",
      HATCHERY: "ह्याचरी",
      NURSERY: "नर्सरी",
      INTEGRATED_FARMING: "एकीकृत मत्स्य पालन",
      RICE_FISH_CULTURE: "धान-माछा खेती",
      ORNAMENTAL_FISH_FARM: "सजावटी माछा फार्म",
      RESEARCH_FACILITY: "अनुसन्धान केन्द्र",
      MIXED: "मिश्रित",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="माछा फार्म लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!fishFarm) {
    return (
      <ContentLayout title="माछा फार्म फेला परेन">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">
            माग गरिएको माछा फार्म फेला परेन
          </p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/agricultural/fish-farms",
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
      title={fishFarm.name}
      subtitle={getFishFarmTypeLabel(fishFarm.farmType)}
      backHref="/dashboard/digital-profile/institutions/agricultural/fish-farms"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/digital-profile/institutions/agricultural/fish-farms/edit/${fishFarm.id}`,
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
            <FishFarmDetails fishFarm={fishFarm} />
          </TabsContent>

          <TabsContent value="map">
            <FishFarmMap fishFarm={fishFarm} />
          </TabsContent>

          <TabsContent value="media">
            <FishFarmMedia
              fishFarmId={fishFarm.id}
              media={fishFarm.media || []}
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
              माछा फार्म &quot;{fishFarm.name}&quot; हटाउने। यो कार्य पूर्ववत
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
