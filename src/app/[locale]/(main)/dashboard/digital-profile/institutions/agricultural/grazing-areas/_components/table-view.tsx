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
import { Edit, Trash2, Eye, Droplet, Leaf, Tractor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface GrazingAreaItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  areaInHectares?: number;
  accessibility?: string;
  groundCover?: string;
  livestockCapacity?: number;
  primaryLivestockType?: string;
  grazingDuration?: string;
  rotationalSystem?: boolean;
  hasWaterSource?: boolean;
  waterSourceTypes?: string;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface TableViewProps {
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

export function TableView({
  grazingAreas,
  grazingAreaTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewGrazingArea = (id: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/grazing-areas/${id}`,
    );
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

  // Ground cover label helper
  const getGroundCoverLabel = (cover?: string) => {
    if (!cover) return "";
    const groundCovers: Record<string, string> = {
      PRIMARILY_GRASSES: "मुख्यतः घाँस",
      SHRUB_DOMINANT: "झाडी प्रमुख",
      MIXED_VEGETATION: "मिश्रित वनस्पति",
      FORBS_DOMINANT: "जडीबुटी प्रमुख",
      TREE_SCATTERED: "छरिएका रूख",
      DEGRADED: "बिग्रेको/नष्ट भएको",
    };
    return groundCovers[cover] || cover;
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
              <TableHead>विशेषता</TableHead>
              <TableHead>पशुधन</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grazingAreas.length > 0 ? (
              grazingAreas.map((area) => {
                const areaType = grazingAreaTypes.find(
                  (t) => t.value === area.type,
                );

                return (
                  <TableRow key={area.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {area.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={area.primaryMedia.url}
                              alt={area.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-muted-foreground opacity-70" />
                          </div>
                        )}
                        <div>
                          <button
                            className="hover:underline text-left font-medium"
                            onClick={() => handleViewGrazingArea(area.id)}
                          >
                            {area.name}
                          </button>
                          {area.groundCover && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {getGroundCoverLabel(area.groundCover)}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{areaType?.label || area.type}</TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {area.wardNumber && (
                          <span className="mr-2">
                            वडा नं.: {area.wardNumber}
                          </span>
                        )}
                        {area.location && (
                          <span className="mr-2">{area.location}</span>
                        )}
                        {area.accessibility && (
                          <div className="text-xs mt-1">
                            पहुँच: {getAccessibilityLabel(area.accessibility)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {area.areaInHectares && (
                          <div className="text-xs">
                            <span className="mr-1">क्षेत्रफल:</span>
                            <span className="font-medium">
                              {area.areaInHectares} हेक्टर
                            </span>
                          </div>
                        )}
                        {area.rotationalSystem && (
                          <div className="text-xs mt-1">
                            <Badge variant="outline" className="text-xs">
                              चक्रीय चरन प्रणाली
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {area.livestockCapacity && (
                          <div className="text-xs">
                            <span className="mr-1">क्षमता:</span>
                            <span className="font-medium">
                              {area.livestockCapacity} पशुधन
                            </span>
                          </div>
                        )}
                        {area.primaryLivestockType && (
                          <div className="text-xs">
                            <span className="mr-1">पशु:</span>
                            <span>{area.primaryLivestockType}</span>
                          </div>
                        )}
                        {area.hasWaterSource && (
                          <Badge variant="outline">
                            <Droplet className="h-3 w-3 mr-1" />
                            पानी स्रोत
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewGrazingArea(area.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
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
                          onClick={() =>
                            onDelete({ id: area.id, name: area.name })
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
                    कुनै पनि चरन खर्क क्षेत्र फेला परेन
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
