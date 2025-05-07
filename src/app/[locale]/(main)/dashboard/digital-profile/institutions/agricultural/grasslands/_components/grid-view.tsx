"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2, Eye, Image, Droplet, GrassIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface GrasslandItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  areaInHectares?: number;
  vegetationDensity?: string;
  managementType?: string;
  dominantSpecies?: string;
  grazingPeriod?: string;
  ownerName?: string;
  hasWaterSource?: boolean;
  isFenced?: boolean;
  hasGrazingRights?: boolean;
  waterSourceType?: string;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
  grasslands: GrasslandItem[];
  grasslandTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (grassland: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function GridView({
  grasslands,
  grasslandTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewGrassland = (grasslandId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/grasslands/${grasslandId}`,
    );
  };

  const getGrasslandTypeColor = (type: string) => {
    switch (type) {
      case "NATURAL_MEADOW":
        return "bg-green-50 text-green-600 border-green-200";
      case "IMPROVED_PASTURE":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "RANGELAND":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "SILVOPASTURE":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "WETLAND_GRAZING":
        return "bg-cyan-50 text-cyan-600 border-cyan-200";
      case "ALPINE_GRASSLAND":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "COMMON_GRAZING_LAND":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Vegetation density label helper
  const getVegetationDensityLabel = (density?: string) => {
    if (!density) return "";
    const densities: Record<string, string> = {
      VERY_DENSE: "अति घना",
      DENSE: "घना",
      MODERATE: "मध्यम",
      SPARSE: "पातलो",
      VERY_SPARSE: "अति पातलो",
    };
    return densities[density] || density;
  };

  // Management type label helper
  const getManagementTypeLabel = (type?: string) => {
    if (!type) return "";
    const types: Record<string, string> = {
      ROTATIONAL_GRAZING: "चक्रीय चराई",
      CONTINUOUS_GRAZING: "निरन्तर चराई",
      DEFERRED_GRAZING: "विलम्बित चराई",
      HAY_PRODUCTION: "घाँस उत्पादन",
      CONSERVATION: "संरक्षण",
      UNMANAGED: "अव्यवस्थित",
      MIXED: "मिश्रित",
    };
    return types[type] || type;
  };

  if (grasslands.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">कुनै पनि चरन क्षेत्र फेला परेन</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {grasslands.map((grassland) => {
          const grasslandType = grasslandTypes.find(
            (t) => t.value === grassland.type,
          );

          return (
            <Card key={grassland.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewGrassland(grassland.id)}
              >
                {grassland.primaryMedia?.url ? (
                  <img
                    src={grassland.primaryMedia.url}
                    alt={grassland.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <GrassIcon className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getGrasslandTypeColor(grassland.type)}>
                    {grasslandType?.label}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="font-medium text-lg truncate cursor-pointer hover:underline flex-1"
                    onClick={() => handleViewGrassland(grassland.id)}
                  >
                    {grassland.name}
                  </h3>
                </div>

                {grassland.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {grassland.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {grassland.wardNumber && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      वडा नं. {grassland.wardNumber}
                    </div>
                  )}
                  {grassland.location && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {grassland.location}
                    </div>
                  )}
                  {grassland.areaInHectares && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {grassland.areaInHectares} हेक्टर
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  {grassland.dominantSpecies && (
                    <p className="text-sm font-medium">
                      प्रमुख घाँस: {grassland.dominantSpecies}
                    </p>
                  )}

                  {grassland.grazingPeriod && (
                    <p className="text-xs text-muted-foreground">
                      चराई अवधि: {grassland.grazingPeriod}
                    </p>
                  )}

                  {grassland.vegetationDensity && (
                    <p className="text-xs text-muted-foreground mt-1">
                      घनत्व:{" "}
                      {getVegetationDensityLabel(grassland.vegetationDensity)}
                    </p>
                  )}

                  {grassland.managementType && (
                    <p className="text-xs text-muted-foreground">
                      व्यवस्थापन:{" "}
                      {getManagementTypeLabel(grassland.managementType)}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {grassland.hasWaterSource && grassland.waterSourceType && (
                    <Badge variant="outline" className="text-xs">
                      <Droplet className="h-3 w-3 mr-1" />
                      {grassland.waterSourceType}
                    </Badge>
                  )}
                  {grassland.hasWaterSource && !grassland.waterSourceType && (
                    <Badge variant="outline" className="text-xs">
                      <Droplet className="h-3 w-3 mr-1" />
                      पानी स्रोत
                    </Badge>
                  )}
                  {grassland.isFenced && (
                    <Badge variant="outline" className="text-xs">
                      बाडा लगाइएको
                    </Badge>
                  )}
                  {grassland.hasGrazingRights && (
                    <Badge variant="outline" className="text-xs">
                      चराई अधिकार
                    </Badge>
                  )}
                </div>

                {grassland.ownerName && (
                  <p className="text-xs text-muted-foreground mt-2">
                    मालिक: {grassland.ownerName}
                  </p>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewGrassland(grassland.id)}
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
                        `/dashboard/digital-profile/institutions/agricultural/grasslands/edit/${grassland.id}`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      onDelete({ id: grassland.id, name: grassland.name })
                    }
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
