"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { ReligiousPlaceDetails } from "./_components/religious-place-details";
import { ReligiousPlaceMedia } from "./_components/religious-place-media";
import { ReligiousPlaceMap } from "./_components/religious-place-map";
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

export default function ViewReligiousPlacePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch religious place data by ID
  const { data: religiousPlace, isLoading } =
    api.religiousPlace.getById.useQuery(params.id, {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/cultural/religious-places",
        );
        toast.error("धार्मिक स्थल फेला परेन");
      },
    });

  // Delete mutation
  const { mutate: deleteReligiousPlace, isLoading: isDeleting } =
    api.religiousPlace.delete.useMutation({
      onSuccess: () => {
        toast.success("धार्मिक स्थल सफलतापूर्वक हटाइयो");
        router.push(
          "/dashboard/digital-profile/institutions/cultural/religious-places",
        );
      },
      onError: (error) => {
        toast.error(`धार्मिक स्थल हटाउन असफल: ${error.message}`);
        setIsDeleteDialogOpen(false);
      },
    });

  // Handle delete confirmation
  const handleDelete = () => {
    if (religiousPlace?.id) {
      deleteReligiousPlace(religiousPlace.id);
    }
  };

  // Get religious place type label
  const getReligiousPlaceTypeLabel = (type: string) => {
    const types = {
      HINDU_TEMPLE: "हिन्दु मन्दिर",
      BUDDHIST_TEMPLE: "बौद्ध गुम्बा",
      MOSQUE: "मस्जिद",
      CHURCH: "चर्च",
      GURUDWARA: "गुरुद्वारा",
      SHRINE: "मन्दिर",
      MONASTERY: "मठ",
      SYNAGOGUE: "यहुदी मन्दिर",
      JAIN_TEMPLE: "जैन मन्दिर",
      MEDITATION_CENTER: "ध्यान केन्द्र",
      PAGODA: "पगोडा",
      SACRED_GROVE: "पवित्र वन",
      SACRED_POND: "पवित्र पोखरी",
      SACRED_RIVER: "पवित्र नदी",
      SACRED_HILL: "पवित्र पहाड",
      PRAYER_HALL: "प्रार्थना हल",
      RELIGIOUS_COMPLEX: "धार्मिक परिसर",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="धार्मिक स्थल लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!religiousPlace) {
    return (
      <ContentLayout title="धार्मिक स्थल फेला परेन">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">
            माग गरिएको धार्मिक स्थल फेला परेन
          </p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/cultural/religious-places",
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
      title={religiousPlace.name}
      subtitle={getReligiousPlaceTypeLabel(religiousPlace.type)}
      backHref="/dashboard/digital-profile/institutions/cultural/religious-places"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/digital-profile/institutions/cultural/religious-places/edit/${religiousPlace.id}`,
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
            <ReligiousPlaceDetails religiousPlace={religiousPlace} />
          </TabsContent>

          <TabsContent value="map">
            <ReligiousPlaceMap religiousPlace={religiousPlace} />
          </TabsContent>

          <TabsContent value="media">
            <ReligiousPlaceMedia
              religiousPlaceId={religiousPlace.id}
              media={religiousPlace.media || []}
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
              धार्मिक स्थल &quot;{religiousPlace.name}&quot; हटाउने। यो कार्य
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
