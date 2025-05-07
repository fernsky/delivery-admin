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

// Define grazing area types
const grazingAreaTypes = [
  { value: "OPEN_RANGE", label: "खुल्ला चरन क्षेत्र" },
  { value: "ALPINE_MEADOW", label: "हिमाली घाँसे मैदान" },
  { value: "COMMUNITY_PASTURE", label: "सामुदायिक चरन" },
  { value: "FOREST_UNDERSTORY", label: "वन मुनिको चरन क्षेत्र" },
  { value: "FLOODPLAIN", label: "बाढी मैदान चरन" },
  { value: "SEASONAL_PASTURE", label: "मौसमी चरन" },
  { value: "DRY_SEASON_RESERVE", label: "सुख्खा मौसम आरक्षित क्षेत्र" },
  { value: "ROTATIONAL_PADDOCK", label: "चक्रीय खर्क" },
  { value: "MIXED", label: "मिश्रित" },
  { value: "OTHER", label: "अन्य" },
];

export default function GrazingAreasPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"table" | "grid" | "map">(
    "table",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [grazingAreaToDelete, setGrazingAreaToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentType, setCurrentType] = useState<string>("all");
  const [hasWaterSource, setHasWaterSource] = useState<boolean | undefined>(
    undefined,
  );
  const [selectedAccessibility, setSelectedAccessibility] =
    useState<string>("all");

  // Fetch grazing areas with filters
  const { data, isLoading, isError, refetch } = api.grazingArea.getAll.useQuery(
    {
      page: currentPage,
      pageSize: 12,
      searchTerm: searchTerm,
      type: currentType !== "all" ? currentType : undefined,
      hasWaterSource: hasWaterSource,
      accessibility:
        selectedAccessibility !== "all"
          ? (selectedAccessibility as any)
          : undefined,
      viewType: currentView,
    },
  );

  // Delete grazing area mutation
  const { mutate: deleteGrazingArea, isLoading: isDeleting } =
    api.grazingArea.delete.useMutation({
      onSuccess: () => {
        toast.success("चरन खर्क क्षेत्र सफलतापूर्वक हटाइयो");
        refetch();
        setGrazingAreaToDelete(null);
      },
      onError: (error) => {
        toast.error(`चरन खर्क क्षेत्र हटाउन असफल: ${error.message}`);
        setGrazingAreaToDelete(null);
      },
    });

  // Handle deletion confirmation
  const handleConfirmDelete = () => {
    if (grazingAreaToDelete) {
      deleteGrazingArea(grazingAreaToDelete.id);
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

  // Handle accessibility filter change
  const handleAccessibilityChange = (value: string) => {
    setSelectedAccessibility(value);
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

  // Handle grazing area deletion request
  const handleDeleteGrazingArea = (grazingArea: {
    id: string;
    name: string;
  }) => {
    setGrazingAreaToDelete(grazingArea);
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
      title="चरन खर्क क्षेत्र व्यवस्थापन"
      actions={
        <Button
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/agricultural/grazing-areas/create",
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          नयाँ चरन खर्क क्षेत्र थप्नुहोस्
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
                  {grazingAreaTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedAccessibility}
                onValueChange={handleAccessibilityChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="पहुँचयोग्यता" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै</SelectItem>
                  <SelectItem value="EASILY_ACCESSIBLE">
                    सजिलै पहुँच योग्य
                  </SelectItem>
                  <SelectItem value="MODERATELY_ACCESSIBLE">
                    मध्यम पहुँच योग्य
                  </SelectItem>
                  <SelectItem value="DIFFICULT_ACCESS">कठिन पहुँच</SelectItem>
                  <SelectItem value="SEASONAL_ACCESS">मौसमी पहुँच</SelectItem>
                  <SelectItem value="REMOTE">दुर्गम</SelectItem>
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
                placeholder="चरन खर्क क्षेत्रको नाम खोज्नुहोस्..."
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
              कुनै चरन खर्क क्षेत्र फेला परेन। नयाँ चरन खर्क क्षेत्र थप्न माथिको
              बटन प्रयोग गर्नुहोस्।
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && data?.items && currentView === "table" && (
          <TableView
            grazingAreas={data.items}
            grazingAreaTypes={grazingAreaTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteGrazingArea}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "grid" && (
          <GridView
            grazingAreas={data.items}
            grazingAreaTypes={grazingAreaTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteGrazingArea}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "map" && (
          <MapView
            grazingAreas={data.items}
            grazingAreaTypes={grazingAreaTypes}
            isLoading={isLoading}
          />
        )}
      </div>

      <AlertDialog
        open={!!grazingAreaToDelete}
        onOpenChange={() => setGrazingAreaToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              चरन खर्क क्षेत्र &quot;{grazingAreaToDelete?.name}&quot; हटाउने।
              यो कार्य पूर्ववत हुन सक्दैन।
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
