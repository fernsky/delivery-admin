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
  Fish,
  Droplet,
  Check,
  X,
  Water,
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
  isVerified?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface TableViewProps {
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

export function TableView({
  fishFarms,
  fishFarmTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewFishFarm = (farmId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/fish-farms/${farmId}`,
    );
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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>नाम</TableHead>
              <TableHead>प्रकार</TableHead>
              <TableHead>स्थान</TableHead>
              <TableHead>मत्स्य पालन विवरण</TableHead>
              <TableHead>क्षेत्रफल/पोखरीहरू</TableHead>
              <TableHead className="text-center">प्रमाणित</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fishFarms.length > 0 ? (
              fishFarms.map((farm) => {
                const farmType = fishFarmTypes.find(
                  (t) => t.value === farm.farmType,
                );

                return (
                  <TableRow key={farm.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {farm.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={farm.primaryMedia.url}
                              alt={farm.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Fish className="h-5 w-5 text-muted-foreground opacity-70" />
                          </div>
                        )}
                        <div>
                          <button
                            className="hover:underline text-left font-medium"
                            onClick={() => handleViewFishFarm(farm.id)}
                          >
                            {farm.name}
                          </button>
                          {farm.cultureSystem && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {getCultureSystemLabel(farm.cultureSystem)}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {farmType?.label || farm.farmType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {farm.wardNumber && (
                          <span className="mr-2">
                            वडा नं.: {farm.wardNumber}
                          </span>
                        )}
                        {farm.location && (
                          <span className="mr-2">{farm.location}</span>
                        )}
                        {farm.address && <span>{farm.address}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {farm.primaryFishSpecies && (
                          <div className="flex items-center text-xs">
                            <Fish className="h-3 w-3 mr-1" />
                            <span>
                              {farm.primaryFishSpecies.substring(0, 30)}
                              {farm.primaryFishSpecies.length > 30 ? "..." : ""}
                            </span>
                          </div>
                        )}

                        {farm.secondaryFishSpecies && (
                          <div className="flex items-center text-xs mt-1">
                            <span className="ml-4">
                              {farm.secondaryFishSpecies.substring(0, 30)}
                              {farm.secondaryFishSpecies.length > 30
                                ? "..."
                                : ""}
                            </span>
                          </div>
                        )}

                        {farm.waterSource && (
                          <div className="flex items-center text-xs mt-1">
                            <Droplet className="h-3 w-3 mr-1" />
                            <span>{getWaterSourceLabel(farm.waterSource)}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {farm.totalAreaInHectares !== null &&
                          farm.totalAreaInHectares !== undefined && (
                            <div className="text-xs">
                              <span className="mr-1">जम्मा क्षेत्र:</span>
                              <span className="font-medium">
                                {farm.totalAreaInHectares} हे.
                              </span>
                            </div>
                          )}

                        {farm.waterSurfaceAreaInHectares !== null &&
                          farm.waterSurfaceAreaInHectares !== undefined && (
                            <div className="text-xs">
                              <span className="mr-1">जलाशय क्षेत्र:</span>
                              <span className="font-medium">
                                {farm.waterSurfaceAreaInHectares} हे.
                              </span>
                            </div>
                          )}

                        {farm.totalPondCount !== null &&
                          farm.totalPondCount !== undefined && (
                            <div className="text-xs">
                              <span className="mr-1">पोखरीहरू:</span>
                              <span className="font-medium">
                                {farm.totalPondCount} (सक्रिय:{" "}
                                {farm.activePondCount || 0})
                              </span>
                            </div>
                          )}

                        {farm.annualProductionInKg !== null &&
                          farm.annualProductionInKg !== undefined && (
                            <div className="text-xs">
                              <span className="mr-1">वार्षिक उत्पादन:</span>
                              <span className="font-medium">
                                {farm.annualProductionInKg} के.जी.
                              </span>
                            </div>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {farm.isVerified ? (
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
                          onClick={() => handleViewFishFarm(farm.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
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
                          onClick={() =>
                            onDelete({
                              id: farm.id,
                              name: farm.name,
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
                    कुनै पनि माछा फार्म फेला परेन
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
