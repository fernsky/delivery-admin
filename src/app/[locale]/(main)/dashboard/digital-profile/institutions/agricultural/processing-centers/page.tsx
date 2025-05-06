"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { api } from "@/trpc/react";
import { Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { TableView } from "./_components/table-view";
import { GridView } from "./_components/grid-view";
import { MapView } from "./_components/map-view";
import { ViewSelector } from "./_components/view-selector";
import { Filters } from "./_components/filters";

export default function ProcessingCentersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get view type from URL or default to table
  const viewParam = searchParams.get("view") || "table";
  const viewType = ["table", "grid", "map"].includes(viewParam)
    ? (viewParam as "table" | "grid" | "map")
    : "table";

  // Get page from URL or default to 1
  const pageParam = searchParams.get("page");
  const page = pageParam ? parseInt(pageParam) : 1;

  // Get filter params from URL
  const centerType = searchParams.get("centerType") || undefined;
  const storageType = searchParams.get("storageType") || undefined;
  const processingLevel = searchParams.get("processingLevel") || undefined;
  const ownershipType = searchParams.get("ownershipType") || undefined;
  const wardNumber = searchParams.get("wardNumber")
    ? parseInt(searchParams.get("wardNumber")!)
    : undefined;
  const searchTerm = searchParams.get("searchTerm") || undefined;
  const hasStorageFacility = searchParams.get("hasStorageFacility")
    ? searchParams.get("hasStorageFacility") === "true"
    : undefined;
  const hasProcessingUnit = searchParams.get("hasProcessingUnit")
    ? searchParams.get("hasProcessingUnit") === "true"
    : undefined;
  const hasQualityControlLab = searchParams.get("hasQualityControlLab")
    ? searchParams.get("hasQualityControlLab") === "true"
    : undefined;
  const isOperational = searchParams.get("isOperational")
    ? searchParams.get("isOperational") === "true"
    : undefined;
  const primaryCommodity = searchParams.get("primaryCommodity") || undefined;

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [centerToDelete, setCenterToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Fetch processing centers with pagination and filters
  const { data, isLoading } = api.profile.processingCenters.getAll.useQuery({
    page,
    pageSize: viewType === "map" ? 50 : 12,
    viewType,
    centerType: centerType as any,
    storageType: storageType as any,
    processingLevel: processingLevel as any,
    ownershipType: ownershipType as any,
    wardNumber,
    searchTerm,
    hasStorageFacility,
    hasProcessingUnit,
    hasQualityControlLab,
    isOperational,
    primaryCommodity,
    sortBy: "name",
    sortOrder: "asc",
  });

  // Delete processing center mutation
  const { mutate: deleteProcessingCenter, isLoading: isDeleting } =
    api.profile.processingCenters.delete.useMutation({
      onSuccess: () => {
        toast.success("कृषि प्रशोधन केन्द्र हटाइयो");
        setDeleteDialogOpen(false);
        setCenterToDelete(null);
        // Refetch data
        router.refresh();
      },
      onError: (error) => {
        toast.error(`हटाउन असफल: ${error.message}`);
        setDeleteDialogOpen(false);
      },
    });

  // Handle view type change
  const handleViewChange = (view: "table" | "grid" | "map") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle filter change
  const handleFilterChange = (filters: Record<string, any>) => {
    const params = new URLSearchParams();

    // Set view type
    params.set("view", viewType);

    // Set page to 1 when filtering
    params.set("page", "1");

    // Add all the filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value.toString());
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  // Handle delete button click
  const handleDeleteClick = (center: { id: string; name: string }) => {
    setCenterToDelete(center);
    setDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (centerToDelete) {
      deleteProcessingCenter(centerToDelete.id);
    }
  };

  // Setup center type options for filter
  const centerTypeOptions = [
    { value: "COLLECTION_CENTER", label: "संकलन केन्द्र" },
    { value: "STORAGE_FACILITY", label: "भण्डारण केन्द्र" },
    { value: "PROCESSING_UNIT", label: "प्रशोधन इकाई" },
    { value: "MULTIPURPOSE_CENTER", label: "बहुउद्देश्यीय केन्द्र" },
    { value: "MARKET_CENTER", label: "बजार केन्द्र" },
    { value: "COLD_STORAGE", label: "कोल्ड स्टोरेज" },
    { value: "WAREHOUSE", label: "गोदाम" },
    { value: "OTHER", label: "अन्य" },
  ];

  // Setup storage type options for filter
  const storageTypeOptions = [
    { value: "AMBIENT", label: "साधारण तापक्रम" },
    { value: "COLD_STORAGE", label: "शीत भण्डार" },
    { value: "CONTROLLED_ATMOSPHERE", label: "नियन्त्रित वातावरण" },
    { value: "SILO", label: "साइलो" },
    { value: "WAREHOUSE", label: "गोदाम" },
    { value: "GRANARY", label: "अन्न भण्डार" },
    { value: "MIXED", label: "मिश्रित" },
    { value: "OTHER", label: "अन्य" },
  ];

  // Setup processing level options for filter
  const processingLevelOptions = [
    { value: "PRIMARY_PROCESSING", label: "प्राथमिक प्रशोधन" },
    { value: "SECONDARY_PROCESSING", label: "द्वितीय प्रशोधन" },
    { value: "TERTIARY_PROCESSING", label: "तृतीय प्रशोधन" },
    { value: "MINIMAL_PROCESSING", label: "न्युनतम प्रशोधन" },
    { value: "COMPREHENSIVE_PROCESSING", label: "व्यापक प्रशोधन" },
    { value: "NOT_APPLICABLE", label: "लागू नहुने" },
  ];

  // Setup ownership type options for filter
  const ownershipTypeOptions = [
    { value: "GOVERNMENT", label: "सरकारी" },
    { value: "PRIVATE", label: "निजी" },
    { value: "COOPERATIVE", label: "सहकारी" },
    { value: "COMMUNITY", label: "सामुदायिक" },
    { value: "PUBLIC_PRIVATE_PARTNERSHIP", label: "सार्वजनिक-निजी साझेदारी" },
    { value: "NGO_MANAGED", label: "गैरसरकारी संस्था व्यवस्थित" },
    { value: "MIXED", label: "मिश्रित" },
  ];

  return (
    <ContentLayout
      title="कृषि प्रशोधन केन्द्रहरू"
      subtitle="प्रशोधन केन्द्र, भण्डारण सुविधा, र संकलन केन्द्रहरूको व्यवस्थापन"
      actions={
        <Button onClick={() => router.push(`${pathname}/create`)}>
          <Plus className="mr-2 h-4 w-4" /> नयाँ थप्नुहोस्
        </Button>
      }
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ViewSelector currentView={viewType} onViewChange={handleViewChange} />

        <Filters
          centerTypeOptions={centerTypeOptions}
          storageTypeOptions={storageTypeOptions}
          processingLevelOptions={processingLevelOptions}
          ownershipTypeOptions={ownershipTypeOptions}
          initialFilters={{
            centerType,
            storageType,
            processingLevel,
            ownershipType,
            wardNumber,
            searchTerm,
            hasStorageFacility,
            hasProcessingUnit,
            hasQualityControlLab,
            isOperational,
            primaryCommodity,
          }}
          onFilterChange={handleFilterChange}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {viewType === "table" && (
            <TableView
              centers={data?.items || []}
              centerTypes={centerTypeOptions}
              pagination={
                data || {
                  page: 1,
                  pageSize: 12,
                  totalItems: 0,
                  totalPages: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                }
              }
              onPageChange={handlePageChange}
              onDelete={handleDeleteClick}
              isLoading={isLoading}
            />
          )}

          {viewType === "grid" && (
            <GridView
              centers={data?.items || []}
              centerTypes={centerTypeOptions}
              pagination={
                data || {
                  page: 1,
                  pageSize: 12,
                  totalItems: 0,
                  totalPages: 1,
                  hasNextPage: false,
                  hasPreviousPage: false,
                }
              }
              onPageChange={handlePageChange}
              onDelete={handleDeleteClick}
              isLoading={isLoading}
            />
          )}

          {viewType === "map" && (
            <MapView
              centers={data?.items || []}
              centerTypes={centerTypeOptions}
              isLoading={isLoading}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              के तपाईं यो कृषि प्रशोधन केन्द्र हटाउन निश्चित हुनुहुन्छ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              यो कार्य अपरिवर्तनीय छ। यसले स्थायी रूपमा {centerToDelete?.name}{" "}
              हटाउनेछ र यससँग सम्बन्धित सबै डेटा मेटाउनेछ।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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
