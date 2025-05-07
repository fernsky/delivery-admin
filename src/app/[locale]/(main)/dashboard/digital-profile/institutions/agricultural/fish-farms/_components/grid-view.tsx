"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Edit,
  Trash2,
  Eye,
  Fish,
  Droplet,
  Scale,
  Check,
  X,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface FishFarmItem {
  id: string;
  name: string;
  slug: string;
  farmType: string;
  description?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  ownerName?: string;
  ownerContact?: string;
  primaryFishSpecies?: string;
  secondaryFishSpecies?: string;
  cultureSystem?: string;
  waterSource?: string;
  totalAreaInHectares?: number;
  waterSurfaceAreaInHectares?: number;
  totalPondCount?: number;
  activePondCount?: number;
  annualProductionInKg?: number;
  hasFarmHouse?: boolean;
  hasHatchery?: boolean;
  hasNursery?: boolean;
  isVerified?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
  fishFarms: FishFarmItem[];
  fishFarmTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (farm: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function GridView({
  fishFarms,
  fishFarmTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewFishFarm = (farmId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/fish-farms/${farmId}`,
    );
  };

  const getFishFarmTypeColor = (type: string) => {
    switch (type) {
      case "POND_CULTURE":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "CAGE_CULTURE":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "TANK_CULTURE":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "RACEWAY_CULTURE":
        return "bg-cyan-50 text-cyan-600 border-cyan-200";
      case "RECIRCULATING_AQUACULTURE_SYSTEM":
        return "bg-teal-50 text-teal-600 border-teal-200";
      case "HATCHERY":
        return "bg-green-50 text-green-600 border-green-200";
      case "NURSERY":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "INTEGRATED_FARMING":
        return "bg-lime-50 text-lime-600 border-lime-200";
      case "RICE_FISH_CULTURE":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "ORNAMENTAL_FISH_FARM":
        return "bg-pink-50 text-pink-600 border-pink-200";
      case "RESEARCH_FACILITY":
        return "bg-violet-50 text-violet-600 border-violet-200";
      case "MIXED":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get culture system label helper
  const getCultureSystemLabel = (system?: string) => {
    if (!system) return "";
    const systems: Record<string, string> = {
      EXTENSIVE: "विस्तृत",
      SEMI_INTENSIVE: "अर्ध-सघन",
      INTENSIVE: "सघन",
      SUPER_INTENSIVE: "अति सघन",
      POLYCULTURE: "मिश्रित मत्स्यपालन",
      MONOCULTURE: "एकल मत्स्यपालन",
    };
    return systems[system] || system;
  };

  // Get water source label helper
  const getWaterSourceLabel = (source?: string) => {
    if (!source) return "";
    const sources: Record<string, string> = {
      RIVER: "नदी",
      STREAM: "खोला",
      SPRING: "झरना",
      WELL: "कुवा",
      GROUNDWATER: "भूमिगत पानी",
      RAINWATER: "वर्षातको पानी",
      CANAL: "कुलो/नहर",
      RESERVOIR: "जलाशय",
      LAKE: "ताल",
      MIXED: "मिश्रित",
    };
    return sources[source] || source;
  };

  if (fishFarms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">कुनै पनि माछा फार्म फेला परेन</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fishFarms.map((farm) => {
          const farmType = fishFarmTypes.find((t) => t.value === farm.farmType);

          return (
            <Card key={farm.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewFishFarm(farm.id)}
              >
                {farm.primaryMedia?.url ? (
                  <img
                    src={farm.primaryMedia.url}
                    alt={farm.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Fish className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getFishFarmTypeColor(farm.farmType)}>
                    {farmType?.label || farm.farmType}
                  </Badge>
                  {farm.isVerified && (
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
                    onClick={() => handleViewFishFarm(farm.id)}
                  >
                    {farm.name}
                  </h3>
                </div>

                {farm.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {farm.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {farm.wardNumber && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      वडा नं. {farm.wardNumber}
                    </div>
                  )}
                  {farm.location && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {farm.location}
                    </div>
                  )}
                  {farm.totalPondCount !== null &&
                    farm.totalPondCount !== undefined && (
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {farm.totalPondCount} पोखरी
                      </div>
                    )}
                </div>

                <div className="mt-3">
                  {farm.cultureSystem && (
                    <div className="text-sm text-muted-foreground">
                      {getCultureSystemLabel(farm.cultureSystem)}
                    </div>
                  )}

                  {farm.primaryFishSpecies && (
                    <p className="text-sm flex gap-1 items-center mt-1">
                      <Fish className="h-4 w-4 text-blue-600" />
                      <span className="line-clamp-1">
                        {farm.primaryFishSpecies}
                      </span>
                    </p>
                  )}

                  {farm.waterSource && (
                    <p className="text-sm flex gap-1 items-center mt-1">
                      <Droplet className="h-4 w-4 text-blue-400" />
                      <span>{getWaterSourceLabel(farm.waterSource)}</span>
                    </p>
                  )}

                  <div className="flex justify-between mt-2">
                    {farm.totalAreaInHectares !== null &&
                      farm.totalAreaInHectares !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          क्षेत्रफल: {farm.totalAreaInHectares} हे.
                        </p>
                      )}
                    {farm.annualProductionInKg !== null &&
                      farm.annualProductionInKg !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          उत्पादन: {farm.annualProductionInKg} के.जी.
                        </p>
                      )}
                  </div>

                  {farm.ownerName && (
                    <p className="text-xs text-muted-foreground mt-2">
                      मालिक: {farm.ownerName}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {farm.hasHatchery && (
                    <Badge variant="outline" className="text-xs">
                      ह्याचरी
                    </Badge>
                  )}
                  {farm.hasNursery && (
                    <Badge variant="outline" className="text-xs">
                      नर्सरी
                    </Badge>
                  )}
                  {farm.hasFarmHouse && (
                    <Badge variant="outline" className="text-xs">
                      <Building className="h-3 w-3 mr-1" />
                      फार्म हाउस
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewFishFarm(farm.id)}
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
                        `/dashboard/digital-profile/institutions/agricultural/fish-farms/edit/${farm.id}`,
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete({ id: farm.id, name: farm.name })}
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
