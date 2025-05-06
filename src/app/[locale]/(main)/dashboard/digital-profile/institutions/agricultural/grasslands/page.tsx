"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TableView } from "./_components/table-view";
import { GridView } from "./_components/grid-view";
import { MapView } from "./_components/map-view";
import { ViewSelector } from "./_components/view-selector";
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

// Define grassland types
const grasslandTypes = [
  { value: "NATURAL_MEADOW", label: "प्राकृतिक घाँसे मैदान" },
  { value: "IMPROVED_PASTURE", label: "सुधारिएको चरन क्षेत्र" },
  { value: "RANGELAND", label: "रेञ्जल्याण्ड" },
  { value: "SILVOPASTURE", label: "वन चरन (रूख र घाँस मिश्रित)" },
  { value: "WETLAND_GRAZING", label: "सिमसार चरन क्षेत्र" },
  { value: "ALPINE_GRASSLAND", label: "हिमाली घाँसे मैदान" },
  { value: "COMMON_GRAZING_LAND", label: "सामुदायिक चरन क्षेत्र" },
  { value: "OTHER", label: "अन्य" },
];

export default function GrasslandsPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"table" | "grid" | "map">(
    "table",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [grasslandToDelete, setGrasslandToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentType, setCurrentType] = useState<string>("all");
  const [hasWaterSource, setHasWaterSource] = useState<boolean | undefined>(
    undefined,
  );
  const [selectedVegetationDensity, setSelectedVegetationDensity] =
    useState<string>("all");

  // Fetch grasslands with filters
  const { data, isLoading, isError, refetch } =
    api.profile.grasslands.getAll.useQuery({
      page: currentPage,
      pageSize: 12,
      searchTerm: searchTerm,
      type: currentType !== "all" ? currentType : undefined,
      hasWaterSource: hasWaterSource,
      vegetationDensity:
        selectedVegetationDensity !== "all"
          ? (selectedVegetationDensity as any)
          : undefined,
      viewType: currentView,
    });

  // Delete grassland mutation
  const { mutate: deleteGrassland, isLoading: isDeleting } =
    api.profile.grasslands.delete.useMutation({
      onSuccess: () => {
        toast.success("चरन क्षेत्र सफलतापूर्वक हटाइयो");
        refetch();
        setGrasslandToDelete(null);
      },
      onError: (error) => {
        toast.error(`चरन क्षेत्र हटाउन असफल: ${error.message}`);
        setGrasslandToDelete(null);
      },
    });

  // Handle deletion confirmation
  const handleConfirmDelete = () => {
    if (grasslandToDelete) {
      deleteGrassland(grasslandToDelete.id);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle type filter change
  const handleTypeChange = (value: string) => {
    setCurrentType(value);
    setCurrentPage(1);
  };

  // Handle vegetation density filter change
  const handleVegetationDensityChange = (value: string) => {
    setSelectedVegetationDensity(value);
    setCurrentPage(1);
  };

  // Handle water source filter change
  const handleWaterSourceChange = (value: string) => {
    if (value === "all") {
      setHasWaterSource(undefined);
    } else if (value === "yes") {
      setHasWaterSource(true);
    } else if (value === "no") {
      setHasWaterSource(false);
    }
    setCurrentPage(1);
  };

  // Handle view change (table/grid/map)
  const handleViewChange = (view: "table" | "grid" | "map") => {
    setCurrentView(view);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle grassland deletion request
  const handleDeleteGrassland = (grassland: { id: string; name: string }) => {
    setGrasslandToDelete(grassland);
  };

  // Prepare pagination data
  const pagination = data
    ? {
        page: data.page,
        pageSize: data.pageSize,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPreviousPage: data.hasPreviousPage,
      }
    : {
        page: 1,
        pageSize: 12,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

  return (
    <ContentLayout
      title="चरन क्षेत्र व्यवस्थापन"
      actions={
        <Button
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/agricultural/grasslands/create",
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          नयाँ चरन क्षेत्र थप्नुहोस्
        </Button>
      }
    >
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4 flex-col sm:flex-row">
              <Select value={currentType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="सबै प्रकार" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै प्रकार</SelectItem>
                  {grasslandTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedVegetationDensity}
                onValueChange={handleVegetationDensityChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="वनस्पति घनत्व" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै घनत्व</SelectItem>
                  <SelectItem value="VERY_DENSE">अति घना</SelectItem>
                  <SelectItem value="DENSE">घना</SelectItem>
                  <SelectItem value="MODERATE">मध्यम</SelectItem>
                  <SelectItem value="SPARSE">पातलो</SelectItem>
                  <SelectItem value="VERY_SPARSE">अति पातलो</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={
                  hasWaterSource === undefined
                    ? "all"
                    : hasWaterSource
                      ? "yes"
                      : "no"
                }
                onValueChange={handleWaterSourceChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="पानी स्रोत" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै</SelectItem>
                  <SelectItem value="yes">पानी स्रोत छ</SelectItem>
                  <SelectItem value="no">पानी स्रोत छैन</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="चरन क्षेत्रको नाम खोज्नुहोस्..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1"
              />
            </div>

            <div className="flex justify-end">
              <ViewSelector
                currentView={currentView}
                onViewChange={handleViewChange}
              />
            </div>
          </div>
        </Card>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                डाटा लोड हुँदैछ...
              </p>
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-red-500">
              डाटा प्राप्त गर्न त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-4"
            >
              पुनः प्रयास गर्नुहोस्
            </Button>
          </div>
        )}

        {!isLoading && !isError && data?.items?.length === 0 && (
          <Alert className="bg-muted">
            <AlertDescription className="text-center py-6">
              कुनै चरन क्षेत्र फेला परेन। नयाँ चरन क्षेत्र थप्न माथिको बटन
              प्रयोग गर्नुहोस्।
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && data?.items && currentView === "table" && (
          <TableView
            grasslands={data.items}
            grasslandTypes={grasslandTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteGrassland}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "grid" && (
          <GridView
            grasslands={data.items}
            grasslandTypes={grasslandTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteGrassland}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "map" && (
          <MapView
            grasslands={data.items}
            grasslandTypes={grasslandTypes}
            isLoading={isLoading}
          />
        )}
      </div>

      <AlertDialog
        open={!!grasslandToDelete}
        onOpenChange={() => setGrasslandToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              चरन क्षेत्र &quot;{grasslandToDelete?.name}&quot; हटाउने। यो कार्य
              पूर्ववत हुन सक्दैन।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
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
