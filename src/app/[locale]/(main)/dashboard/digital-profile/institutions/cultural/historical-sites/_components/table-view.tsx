"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Eye,
  History,
  LayoutLandscape,
  Check,
  X,
  Clock,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface HistoricalSiteItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  architecturalStyle?: string;
  yearEstablished?: number;
  lastRestorationYear?: number;
  historicalSignificance?: string;
  originalFunction?: string;
  isHeritageSite?: boolean;
  heritageDesignation?: string;
  managedBy?: string;
  contactPerson?: string;
  preservationStatus?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface TableViewProps {
  historicalSites: HistoricalSiteItem[];
  historicalSiteTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (site: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function TableView({
  historicalSites,
  historicalSiteTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewHistoricalSite = (siteId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/cultural/historical-sites/${siteId}`,
    );
  };

  // Get architectural style label
  const getArchitecturalStyleLabel = (style?: string) => {
    if (!style) return "";
    const styles: Record<string, string> = {
      TRADITIONAL_NEPALI: "पारम्परिक नेपाली",
      PAGODA: "पगोडा",
      NEWAR: "नेवार",
      MALLA: "मल्ल",
      SHAH: "शाह",
      RAI: "राई",
      LIMBU: "लिम्बु",
      MEDIEVAL: "मध्यकालीन",
      COLONIAL: "औपनिवेशिक",
      GOTHIC: "गोथिक",
      MUGHAL: "मुगल",
      RANA_PALACE: "राणा दरबार",
      SHIKHARA: "शिखर",
      STUPA: "स्तुप",
      MIXED: "मिश्रित",
      VERNACULAR: "स्थानीय",
      OTHER: "अन्य",
    };
    return styles[style] || style;
  };

  // Get preservation status label
  const getPreservationStatusLabel = (status?: string) => {
    if (!status) return "";
    const statuses: Record<string, string> = {
      EXCELLENT: "उत्तम",
      GOOD: "राम्रो",
      FAIR: "ठिकै",
      POOR: "खराब",
      DAMAGED: "क्षतिग्रस्त",
      UNDER_RENOVATION: "जीर्णोद्धार हुँदै",
      REBUILT: "पुनर्निर्माण गरिएको",
    };
    return statuses[status] || status;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">नाम</TableHead>
              <TableHead>प्रकार</TableHead>
              <TableHead>स्थान</TableHead>
              <TableHead>ऐतिहासिक विवरण</TableHead>
              <TableHead>संरक्षण स्थिति</TableHead>
              <TableHead className="text-center">प्रमाणित</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historicalSites.length > 0 ? (
              historicalSites.map((site) => {
                const siteType = historicalSiteTypes.find(
                  (t) => t.value === site.type,
                );

                return (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {site.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={site.primaryMedia.url}
                              alt={site.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <History className="h-5 w-5 text-muted-foreground opacity-70" />
                          </div>
                        )}
                        <div>
                          <button
                            className="hover:underline text-left font-medium"
                            onClick={() => handleViewHistoricalSite(site.id)}
                          >
                            {site.name}
                          </button>
                          {site.yearEstablished && (
                            <div className="text-xs text-muted-foreground mt-1">
                              स्थापना वर्ष: {site.yearEstablished}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {siteType?.label || site.type}
                      </Badge>
                      {site.architecturalStyle && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {getArchitecturalStyleLabel(site.architecturalStyle)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {site.wardNumber && (
                          <span className="mr-2">
                            वडा नं.: {site.wardNumber}
                          </span>
                        )}
                        {site.location && (
                          <span className="mr-2">{site.location}</span>
                        )}
                        {site.address && <span>{site.address}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {site.originalFunction && (
                          <div className="flex items-center text-xs">
                            <span>
                              मूल प्रयोजन:{" "}
                              {site.originalFunction.substring(0, 30)}
                              {site.originalFunction.length > 30 ? "..." : ""}
                            </span>
                          </div>
                        )}

                        {site.isHeritageSite && (
                          <div className="flex items-center text-xs mt-1">
                            <Trophy className="h-3 w-3 mr-1 text-amber-600" />
                            <span>
                              सम्पदा स्थल
                              {site.heritageDesignation &&
                                ` - ${site.heritageDesignation}`}
                            </span>
                          </div>
                        )}

                        {site.managedBy && (
                          <div className="flex items-center text-xs mt-1">
                            <span>व्यवस्थापक: {site.managedBy}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {site.preservationStatus && (
                          <div className="text-xs">
                            <span className="mr-1">संरक्षण स्थिति:</span>
                            <span className="font-medium">
                              {getPreservationStatusLabel(
                                site.preservationStatus,
                              )}
                            </span>
                          </div>
                        )}

                        {site.lastRestorationYear && (
                          <div className="flex items-center text-xs mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              अन्तिम जीर्णोद्धार: {site.lastRestorationYear}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {site.isVerified ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 border-green-200"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 border-gray-200"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewHistoricalSite(site.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/dashboard/digital-profile/institutions/cultural/historical-sites/edit/${site.id}`,
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            onDelete({
                              id: site.id,
                              name: site.name,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">
                    कुनै पनि ऐतिहासिक स्थल फेला परेन
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}
