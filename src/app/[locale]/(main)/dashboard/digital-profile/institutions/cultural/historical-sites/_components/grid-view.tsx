"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Edit,
  Trash2,
  Eye,
  History,
  LayoutLandscape,
  Clock,
  Trophy,
  Calendar,
  Check,
  X,
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
  historicalPeriod?: string;
  originalFunction?: string;
  isHeritageSite?: boolean;
  heritageDesignation?: string;
  managedBy?: string;
  preservationStatus?: string;
  isVerified?: boolean;
  hasArchaeologicalValue?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
  historicalSites: HistoricalSiteItem[];
  historicalSiteTypes: { value: string; label: string }[];
  architecturalStyles: { value: string; label: string }[];
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

export function GridView({
  historicalSites,
  historicalSiteTypes,
  architecturalStyles,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewHistoricalSite = (siteId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/cultural/historical-sites/${siteId}`,
    );
  };

  const getHistoricalSiteTypeColor = (type: string) => {
    switch (type) {
      case "PALACE":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "FORT":
        return "bg-gray-50 text-gray-600 border-gray-200";
      case "ANCIENT_SETTLEMENT":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "ARCHAEOLOGICAL_SITE":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "ANCIENT_MONUMENT":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "HERITAGE_BUILDING":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "HISTORIC_HOUSE":
        return "bg-cyan-50 text-cyan-600 border-cyan-200";
      case "MEDIEVAL_TOWN":
        return "bg-stone-50 text-stone-600 border-stone-200";
      case "ROYAL_RESIDENCE":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "HISTORIC_GARDEN":
        return "bg-green-50 text-green-600 border-green-200";
      case "HISTORIC_INFRASTRUCTURE":
        return "bg-teal-50 text-teal-600 border-teal-200";
      case "BATTLEFIELD":
        return "bg-red-50 text-red-600 border-red-200";
      case "ANCIENT_RUINS":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "HISTORIC_LANDMARK":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get architectural style label
  const getArchitecturalStyleLabel = (style?: string) => {
    if (!style) return "";
    const styleObject = architecturalStyles.find((s) => s.value === style);
    return styleObject?.label || style;
  };

  // Get historical period label
  const getHistoricalPeriodLabel = (period?: string) => {
    if (!period) return "";
    const periods: Record<string, string> = {
      ANCIENT: "प्राचीन काल",
      MEDIEVAL: "मध्यकालीन",
      LICCHAVI: "लिच्छवि काल",
      MALLA: "मल्ल काल",
      SHAH: "शाह काल",
      RANA: "राणा काल",
      PRE_UNIFICATION: "एकीकरण पूर्व",
      COLONIAL: "औपनिवेशिक काल",
      MODERN: "आधुनिक",
      CONTEMPORARY: "समकालीन",
      MULTIPLE_PERIODS: "विभिन्न कालखण्ड",
      OTHER: "अन्य",
    };
    return periods[period] || period;
  };

  if (historicalSites.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          कुनै पनि ऐतिहासिक स्थल फेला परेन
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {historicalSites.map((site) => {
          const siteType = historicalSiteTypes.find(
            (t) => t.value === site.type,
          );

          return (
            <Card key={site.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewHistoricalSite(site.id)}
              >
                {site.primaryMedia?.url ? (
                  <img
                    src={site.primaryMedia.url}
                    alt={site.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <History className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getHistoricalSiteTypeColor(site.type)}>
                    {siteType?.label || site.type}
                  </Badge>
                  {site.isVerified && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 border-green-200"
                    >
                      <Check className="h-3 w-3 text-green-600" />
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="font-medium text-lg truncate cursor-pointer hover:underline flex-1"
                    onClick={() => handleViewHistoricalSite(site.id)}
                  >
                    {site.name}
                  </h3>
                </div>

                {site.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {site.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {site.wardNumber && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      वडा नं. {site.wardNumber}
                    </div>
                  )}
                  {site.location && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {site.location}
                    </div>
                  )}
                  {site.isHeritageSite && (
                    <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center">
                      <Trophy className="h-3 w-3 mr-1" />
                      सम्पदा स्थल
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  {site.architecturalStyle && (
                    <div className="text-sm flex gap-1 items-center">
                      <LayoutLandscape className="h-4 w-4 text-purple-600" />
                      <span className="line-clamp-1">
                        {getArchitecturalStyleLabel(site.architecturalStyle)}
                      </span>
                    </div>
                  )}

                  {site.historicalPeriod && (
                    <div className="text-sm flex gap-1 items-center mt-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="line-clamp-1">
                        {getHistoricalPeriodLabel(site.historicalPeriod)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between mt-2">
                    {site.yearEstablished && (
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1 inline" />
                        स्थापना: {site.yearEstablished}
                      </p>
                    )}
                    {site.lastRestorationYear && (
                      <p className="text-xs text-muted-foreground">
                        जीर्णोद्धार: {site.lastRestorationYear}
                      </p>
                    )}
                  </div>

                  {site.managedBy && (
                    <p className="text-xs text-muted-foreground mt-2">
                      व्यवस्थापक: {site.managedBy}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {site.hasArchaeologicalValue && (
                    <Badge variant="outline" className="text-xs">
                      पुरातात्विक महत्व
                    </Badge>
                  )}
                  {site.originalFunction && (
                    <Badge variant="outline" className="text-xs">
                      {site.originalFunction.length > 20
                        ? `${site.originalFunction.substring(0, 20)}...`
                        : site.originalFunction}
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewHistoricalSite(site.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  हेर्नुहोस्
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
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
                    className="h-8 w-8"
                    onClick={() => onDelete({ id: site.id, name: site.name })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
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
