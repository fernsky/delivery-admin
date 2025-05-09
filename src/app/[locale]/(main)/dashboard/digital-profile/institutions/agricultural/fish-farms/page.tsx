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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

// Define fish farm types
const fishFarmTypes = [
  { value: "POND_CULTURE", label: "पोखरी मत्स्य पालन" },
  { value: "CAGE_CULTURE", label: "पिंजडा मत्स्य पालन" },
  { value: "TANK_CULTURE", label: "ट्यांक मत्स्य पालन" },
  { value: "RACEWAY_CULTURE", label: "रेसवे मत्स्य पालन" },
  {
    value: "RECIRCULATING_AQUACULTURE_SYSTEM",
    label: "रिसर्कुलेटिङ एक्वाकल्चर प्रणाली",
  },
  { value: "HATCHERY", label: "ह्याचरी" },
  { value: "NURSERY", label: "नर्सरी" },
  { value: "INTEGRATED_FARMING", label: "एकीकृत मत्स्य पालन" },
  { value: "RICE_FISH_CULTURE", label: "धान-माछा खेती" },
  { value: "ORNAMENTAL_FISH_FARM", label: "सजावटी माछा फार्म" },
  { value: "RESEARCH_FACILITY", label: "अनुसन्धान केन्द्र" },
  { value: "MIXED", label: "मिश्रित" },
  { value: "OTHER", label: "अन्य" },
];

export default function FishFarmsPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"table" | "grid" | "map">(
    "table",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [farmToDelete, setFarmToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentType, setCurrentType] = useState<string>("all");
  const [waterSourceFilter, setWaterSourceFilter] = useState<string>("all");
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);

  // Fetch fish farms with filters
  const { data, isLoading, isError, refetch } =
    api.profile.agriculture.fishFarms.getAll.useQuery({
      page: currentPage,
      pageSize: 12,
      searchTerm: searchTerm,
      farmType: currentType !== "all" ? currentType : undefined,
      waterSource: waterSourceFilter !== "all" ? waterSourceFilter : undefined,
      isVerified: isVerified,
      viewType: currentView,
    });

  // Delete fish farm mutation
  const { mutate: deleteFishFarm, isLoading: isDeleting } =
    api.profile.agriculture.fishFarms.delete.useMutation({
      onSuccess: () => {
        toast.success("माछा फार्म सफलतापूर्वक हटाइयो");
        refetch();
        setFarmToDelete(null);
      },
      onError: (error) => {
        toast.error(`माछा फार्म हटाउन असफल: ${error.message}`);
        setFarmToDelete(null);
      },
    });

  // Handle fish farm deletion confirmation
  const handleConfirmDelete = () => {
    if (farmToDelete) {
      deleteFishFarm(farmToDelete.id);
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

  // Handle water source filter change
  const handleWaterSourceChange = (value: string) => {
    setWaterSourceFilter(value);
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

  // Handle fish farm deletion request
  const handleDeleteFishFarm = (farm: { id: string; name: string }) => {
    setFarmToDelete(farm);
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
      title="माछा फार्म व्यवस्थापन"
      actions={
        <Button
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/agricultural/fish-farms/create",
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          नयाँ माछा फार्म थप्नुहोस्
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
                  {fishFarmTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={waterSourceFilter}
                onValueChange={handleWaterSourceChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="पानीको स्रोत" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै स्रोतहरू</SelectItem>
                  <SelectItem value="RIVER">नदी</SelectItem>
                  <SelectItem value="STREAM">खोला</SelectItem>
                  <SelectItem value="SPRING">झरना</SelectItem>
                  <SelectItem value="WELL">कुवा</SelectItem>
                  <SelectItem value="GROUNDWATER">भूमिगत पानी</SelectItem>
                  <SelectItem value="RAINWATER">वर्षातको पानी</SelectItem>
                  <SelectItem value="CANAL">कुलो/नहर</SelectItem>
                  <SelectItem value="RESERVOIR">जलाशय</SelectItem>
                  <SelectItem value="LAKE">ताल</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="माछा फार्मको नाम खोज्नुहोस्..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1"
              />
            </div>

            <div className="flex justify-between sm:justify-end gap-4 items-center">
              <ViewSelector
                currentView={currentView}
                onViewChange={handleViewChange}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="verified-filter"
                checked={isVerified === true}
                onCheckedChange={(checked) => {
                  setIsVerified(checked ? true : undefined);
                  setCurrentPage(1);
                }}
              />
              <Label htmlFor="verified-filter">प्रमाणित मात्र</Label>
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
              कुनै माछा फार्म फेला परेन। नयाँ माछा फार्म थप्न माथिको बटन प्रयोग
              गर्नुहोस्।
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && data?.items && currentView === "table" && (
          <TableView
            fishFarms={data.items}
            fishFarmTypes={fishFarmTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteFishFarm}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "grid" && (
          <GridView
            fishFarms={data.items}
            fishFarmTypes={fishFarmTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteFishFarm}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "map" && (
          <MapView
            fishFarms={data.items}
            fishFarmTypes={fishFarmTypes}
            isLoading={isLoading}
          />
        )}
      </div>

      <AlertDialog
        open={!!farmToDelete}
        onOpenChange={() => setFarmToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              माछा फार्म &quot;{farmToDelete?.name}&quot; हटाउने। यो कार्य
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
