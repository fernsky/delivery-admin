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
import { Edit, Trash2, Image, Eye, Droplet, GrassIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface GrasslandItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  areaInHectares?: number;
  vegetationDensity?: string;
  dominantSpecies?: string;
  hasWaterSource?: boolean;
  isFenced?: boolean;
  hasGrazingRights?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface TableViewProps {
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

export function TableView({
  grasslands,
  grasslandTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewGrassland = (grasslandId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/grasslands/${grasslandId}`,
    );
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

  // Vegetation density badge color helper
  const getVegetationDensityColor = (density?: string) => {
    if (!density) return "";
    switch (density) {
      case "VERY_DENSE":
        return "bg-green-100 text-green-800 border-green-200";
      case "DENSE":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "MODERATE":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "SPARSE":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "VERY_SPARSE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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
              <TableHead>वनस्पति</TableHead>
              <TableHead>विशेषताहरू</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grasslands.length > 0 ? (
              grasslands.map((grassland) => {
                const grasslandType = grasslandTypes.find(
                  (t) => t.value === grassland.type,
                );

                return (
                  <TableRow key={grassland.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {grassland.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={grassland.primaryMedia.url}
                              alt={grassland.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <GrassIcon className="h-5 w-5 text-muted-foreground opacity-70" />
                          </div>
                        )}
                        <div>
                          <button
                            className="hover:underline text-left font-medium"
                            onClick={() => handleViewGrassland(grassland.id)}
                          >
                            {grassland.name}
                          </button>
                          {grassland.dominantSpecies && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {grassland.dominantSpecies.substring(0, 30)}
                              {grassland.dominantSpecies.length > 30
                                ? "..."
                                : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {grasslandType?.label || grassland.type}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {grassland.wardNumber && (
                          <span className="mr-2">
                            वडा नं.: {grassland.wardNumber}
                          </span>
                        )}
                        {grassland.location && (
                          <span className="mr-2">{grassland.location}</span>
                        )}
                        {grassland.address && <span>{grassland.address}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {grassland.areaInHectares && (
                          <div className="text-xs">
                            <span className="mr-1">क्षेत्रफल:</span>
                            <span className="font-medium">
                              {grassland.areaInHectares} हेक्टर
                            </span>
                          </div>
                        )}
                        {grassland.vegetationDensity && (
                          <div className="mt-1">
                            <Badge
                              className={getVegetationDensityColor(
                                grassland.vegetationDensity,
                              )}
                            >
                              {getVegetationDensityLabel(
                                grassland.vegetationDensity,
                              )}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {grassland.hasWaterSource && (
                          <Badge variant="outline">
                            <Droplet className="h-3 w-3 mr-1" />
                            पानी स्रोत
                          </Badge>
                        )}
                        {grassland.isFenced && (
                          <Badge variant="outline">बाडा लगाइएको</Badge>
                        )}
                        {grassland.hasGrazingRights && (
                          <Badge variant="outline">चराई अधिकार</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewGrassland(grassland.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
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
                          onClick={() =>
                            onDelete({
                              id: grassland.id,
                              name: grassland.name,
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
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">
                    कुनै पनि चरन क्षेत्र फेला परेन
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
