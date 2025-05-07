"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2, Eye, Droplet, Leaf, Tractor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface GrazingAreaItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  areaInHectares?: number;
  accessibility?: string;
  groundCover?: string;
  terrain?: string;
  primaryLivestockType?: string;
  livestockCapacity?: number;
  grazingSeasons?: string;
  grazingDuration?: string;
  rotationalSystem?: boolean;
  restPeriod?: string;
  hasWaterSource?: boolean;
  waterSourceTypes?: string;
  hasFencing?: boolean;
  hasShelters?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
  grazingAreas: GrazingAreaItem[];
  grazingAreaTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (grazingArea: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function GridView({
  grazingAreas,
  grazingAreaTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewGrazingArea = (id: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/grazing-areas/${id}`,
    );
  };

  const getGrazingAreaTypeColor = (type: string) => {
    switch (type) {
      case "OPEN_RANGE":
        return "bg-green-50 text-green-600 border-green-200";
      case "ALPINE_MEADOW":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "COMMUNITY_PASTURE":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "FOREST_UNDERSTORY":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "FLOODPLAIN":
        return "bg-cyan-50 text-cyan-600 border-cyan-200";
      case "SEASONAL_PASTURE":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "DRY_SEASON_RESERVE":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "ROTATIONAL_PADDOCK":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "MIXED":
        return "bg-pink-50 text-pink-600 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Terrain label helper
  const getTerrainLabel = (terrain?: string) => {
    if (!terrain) return "";
    const types = {
      FLAT: "समतल",
      ROLLING: "घुम्ने/ओर्लोचढाइ",
      HILLY: "पहाडी",
      MOUNTAINOUS: "हिमाली",
      VALLEY: "उपत्यका",
      RIVERINE: "नदी किनार",
      MIXED: "मिश्रित",
    };
    return types[terrain as keyof typeof types] || terrain;
  };

  // Accessibility label helper
  const getAccessibilityLabel = (access?: string) => {
    if (!access) return "";
    const labels: Record<string, string> = {
      EASILY_ACCESSIBLE: "सजिलै पहुँच योग्य",
      MODERATELY_ACCESSIBLE: "मध्यम पहुँच योग्य",
      DIFFICULT_ACCESS: "कठिन पहुँच",
      SEASONAL_ACCESS: "मौसमी पहुँच",
      REMOTE: "दुर्गम",
    };
    return labels[access] || access;
  };

  if (grazingAreas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          कुनै पनि चरन खर्क क्षेत्र फेला परेन
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {grazingAreas.map((area) => {
          const areaType = grazingAreaTypes.find((t) => t.value === area.type);

          return (
            <Card key={area.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewGrazingArea(area.id)}
              >
                {area.primaryMedia?.url ? (
                  <img
                    src={area.primaryMedia.url}
                    alt={area.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Leaf className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getGrazingAreaTypeColor(area.type)}>
                    {areaType?.label}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="font-medium text-lg truncate cursor-pointer hover:underline flex-1"
                    onClick={() => handleViewGrazingArea(area.id)}
                  >
                    {area.name}
                  </h3>
                </div>

                {area.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {area.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {area.wardNumber && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      वडा नं. {area.wardNumber}
                    </div>
                  )}
                  {area.location && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {area.location}
                    </div>
                  )}
                  {area.areaInHectares && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {area.areaInHectares} हेक्टर
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  {area.primaryLivestockType && (
                    <p className="text-sm font-medium">
                      पशु: {area.primaryLivestockType}
                    </p>
                  )}

                  {area.livestockCapacity && (
                    <p className="text-xs text-muted-foreground">
                      क्षमता: {area.livestockCapacity} पशुधन
                    </p>
                  )}

                  {area.grazingSeasons && (
                    <p className="text-xs text-muted-foreground mt-1">
                      मौसम: {area.grazingSeasons}
                    </p>
                  )}

                  {area.terrain && (
                    <p className="text-xs text-muted-foreground">
                      भू-बनोट: {getTerrainLabel(area.terrain)}
                    </p>
                  )}

                  {area.accessibility && (
                    <p className="text-xs text-muted-foreground">
                      पहुँच: {getAccessibilityLabel(area.accessibility)}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {area.hasWaterSource && (
                    <Badge variant="outline" className="text-xs">
                      <Droplet className="h-3 w-3 mr-1" />
                      पानी स्रोत
                    </Badge>
                  )}
                  {area.hasFencing && (
                    <Badge variant="outline" className="text-xs">
                      बाडा लगाइएको
                    </Badge>
                  )}
                  {area.hasShelters && (
                    <Badge variant="outline" className="text-xs">
                      आश्रय स्थल
                    </Badge>
                  )}
                  {area.rotationalSystem && (
                    <Badge variant="outline" className="text-xs">
                      चक्रीय चरन प्रणाली
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewGrazingArea(area.id)}
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
                        `/dashboard/digital-profile/institutions/agricultural/grazing-areas/edit/${area.id}`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete({ id: area.id, name: area.name })}
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
