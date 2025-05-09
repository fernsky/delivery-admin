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

// Define historical site types
const historicalSiteTypes = [
  { value: "PALACE", label: "दरबार" },
  { value: "FORT", label: "किल्ला" },
  { value: "ANCIENT_SETTLEMENT", label: "प्राचीन बस्ती" },
  { value: "ARCHAEOLOGICAL_SITE", label: "पुरातात्विक स्थल" },
  { value: "ANCIENT_MONUMENT", label: "प्राचीन स्मारक" },
  { value: "HERITAGE_BUILDING", label: "सम्पदा भवन" },
  { value: "HISTORIC_HOUSE", label: "ऐतिहासिक घर" },
  { value: "MEDIEVAL_TOWN", label: "मध्यकालीन शहर" },
  { value: "ROYAL_RESIDENCE", label: "राजकीय निवास" },
  { value: "HISTORIC_GARDEN", label: "ऐतिहासिक बगैंचा" },
  { value: "HISTORIC_INFRASTRUCTURE", label: "ऐतिहासिक पूर्वाधार" },
  { value: "BATTLEFIELD", label: "युद्धक्षेत्र" },
  { value: "ANCIENT_RUINS", label: "प्राचीन भग्नावशेष" },
  { value: "HISTORIC_LANDMARK", label: "ऐतिहासिक चिन्ह" },
  { value: "OTHER", label: "अन्य" },
];

// Define architectural styles
const architecturalStyles = [
  { value: "TRADITIONAL_NEPALI", label: "पारम्परिक नेपाली" },
  { value: "PAGODA", label: "पगोडा" },
  { value: "NEWAR", label: "नेवार" },
  { value: "MALLA", label: "मल्ल" },
  { value: "SHAH", label: "शाह" },
  { value: "RAI", label: "राई" },
  { value: "LIMBU", label: "लिम्बु" },
  { value: "MEDIEVAL", label: "मध्यकालीन" },
  { value: "COLONIAL", label: "औपनिवेशिक" },
  { value: "GOTHIC", label: "गोथिक" },
  { value: "MUGHAL", label: "मुगल" },
  { value: "RANA_PALACE", label: "राणा दरबार" },
  { value: "SHIKHARA", label: "शिखर" },
  { value: "STUPA", label: "स्तुप" },
  { value: "MIXED", label: "मिश्रित" },
  { value: "VERNACULAR", label: "स्थानीय" },
  { value: "OTHER", label: "अन्य" },
];

export default function HistoricalSitesPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"table" | "grid" | "map">(
    "table",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [siteToDelete, setSiteToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentType, setCurrentType] = useState<string>("all");
  const [architecturalStyle, setArchitecturalStyle] = useState<string>("all");
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);
  const [isHeritageSite, setIsHeritageSite] = useState<boolean | undefined>(
    undefined,
  );

  // Fetch historical sites with filters
  const { data, isLoading, isError, refetch } =
    api.historicalSite.getAll.useQuery({
      page: currentPage,
      pageSize: 12,
      searchTerm: searchTerm,
      type: currentType !== "all" ? currentType : undefined,
      architecturalStyle:
        architecturalStyle !== "all" ? architecturalStyle : undefined,
      isVerified: isVerified,
      isHeritageSite: isHeritageSite,
      viewType: currentView,
    });

  // Delete historical site mutation
  const { mutate: deleteHistoricalSite, isLoading: isDeleting } =
    api.historicalSite.delete.useMutation({
      onSuccess: () => {
        toast.success("ऐतिहासिक स्थल सफलतापूर्वक हटाइयो");
        refetch();
        setSiteToDelete(null);
      },
      onError: (error) => {
        toast.error(`ऐतिहासिक स्थल हटाउन असफल: ${error.message}`);
        setSiteToDelete(null);
      },
    });

  // Handle historical site deletion confirmation
  const handleConfirmDelete = () => {
    if (siteToDelete) {
      deleteHistoricalSite(siteToDelete.id);
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

  // Handle architectural style filter change
  const handleStyleChange = (value: string) => {
    setArchitecturalStyle(value);
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

  // Handle historical site deletion request
  const handleDeleteHistoricalSite = (site: { id: string; name: string }) => {
    setSiteToDelete(site);
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
      title="ऐतिहासिक स्थल व्यवस्थापन"
      actions={
        <Button
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/cultural/historical-sites/create",
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          नयाँ ऐतिहासिक स्थल थप्नुहोस्
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
                  {historicalSiteTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={architecturalStyle}
                onValueChange={handleStyleChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="वास्तुकला शैली" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै शैली</SelectItem>
                  {architecturalStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="ऐतिहासिक स्थलको नाम खोज्नुहोस्..."
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

            <div className="flex items-center space-x-2">
              <Switch
                id="heritage-filter"
                checked={isHeritageSite === true}
                onCheckedChange={(checked) => {
                  setIsHeritageSite(checked ? true : undefined);
                  setCurrentPage(1);
                }}
              />
              <Label htmlFor="heritage-filter">सम्पदा स्थल मात्र</Label>
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
              कुनै ऐतिहासिक स्थल फेला परेन। नयाँ ऐतिहासिक स्थल थप्न माथिको बटन
              प्रयोग गर्नुहोस्।
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && data?.items && currentView === "table" && (
          <TableView
            historicalSites={data.items}
            historicalSiteTypes={historicalSiteTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteHistoricalSite}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "grid" && (
          <GridView
            historicalSites={data.items}
            historicalSiteTypes={historicalSiteTypes}
            architecturalStyles={architecturalStyles}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteHistoricalSite}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "map" && (
          <MapView
            historicalSites={data.items}
            historicalSiteTypes={historicalSiteTypes}
            isLoading={isLoading}
          />
        )}
      </div>

      <AlertDialog
        open={!!siteToDelete}
        onOpenChange={() => setSiteToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              ऐतिहासिक स्थल &quot;{siteToDelete?.name}&quot; हटाउने। यो कार्य
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
