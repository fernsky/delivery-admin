"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Edit,
  Trash2,
  Eye,
  Image,
  Factory,
  Warehouse,
  Flask,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface ProcessingCenterItem {
  id: string;
  name: string;
  slug: string;
  centerType: string;
  description?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  isOperational?: boolean;
  hasStorageFacility?: boolean;
  storageTotalCapacityMT?: number;
  hasProcessingUnit?: boolean;
  processingCapacityMTPerDay?: number;
  hasQualityControlLab?: boolean;
  primaryCommodities?: string;
  ownershipType?: string;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
  centers: ProcessingCenterItem[];
  centerTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (center: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function GridView({
  centers,
  centerTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewCenter = (centerId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/processing-centers/${centerId}`,
    );
  };

  const getCenterTypeColor = (type: string) => {
    switch (type) {
      case "COLLECTION_CENTER":
        return "bg-green-50 text-green-600 border-green-200";
      case "STORAGE_FACILITY":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "PROCESSING_UNIT":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "MULTIPURPOSE_CENTER":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "MARKET_CENTER":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "COLD_STORAGE":
        return "bg-cyan-50 text-cyan-600 border-cyan-200";
      case "WAREHOUSE":
        return "bg-orange-50 text-orange-600 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Ownership type label helper
  const getOwnershipTypeLabel = (type?: string) => {
    if (!type) return "";
    const labels: Record<string, string> = {
      GOVERNMENT: "सरकारी",
      PRIVATE: "निजी",
      COOPERATIVE: "सहकारी",
      COMMUNITY: "सामुदायिक",
      PUBLIC_PRIVATE_PARTNERSHIP: "सार्वजनिक-निजी साझेदारी",
      NGO_MANAGED: "गैरसरकारी संस्था व्यवस्थित",
      MIXED: "मिश्रित",
    };
    return labels[type] || type;
  };

  if (centers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          कुनै पनि प्रशोधन केन्द्र फेला परेन
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {centers.map((center) => {
          const centerType = centerTypes.find(
            (t) => t.value === center.centerType,
          );

          return (
            <Card key={center.id} className="overflow-hidden">
              <div
                className="aspect-video relative bg-muted cursor-pointer"
                onClick={() => handleViewCenter(center.id)}
              >
                {center.primaryMedia?.url ? (
                  <img
                    src={center.primaryMedia.url}
                    alt={center.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Factory className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge className={getCenterTypeColor(center.centerType)}>
                    {centerType?.label}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge
                    variant={center.isOperational ? "success" : "destructive"}
                  >
                    {center.isOperational ? "संचालित" : "बन्द"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <h3
                    className="font-medium text-lg truncate cursor-pointer hover:underline flex-1"
                    onClick={() => handleViewCenter(center.id)}
                  >
                    {center.name}
                  </h3>
                </div>

                {center.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {center.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mt-3">
                  {center.wardNumber && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      वडा नं. {center.wardNumber}
                    </div>
                  )}
                  {center.location && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {center.location}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  {center.primaryCommodities && (
                    <p className="text-sm font-medium">
                      वस्तुहरू: {center.primaryCommodities.substring(0, 40)}
                      {center.primaryCommodities.length > 40 && "..."}
                    </p>
                  )}

                  {center.ownershipType && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {getOwnershipTypeLabel(center.ownershipType)}
                    </p>
                  )}
                </div>

                {/* Capacities */}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {center.hasStorageFacility &&
                    center.storageTotalCapacityMT && (
                      <div className="border rounded px-2 py-1">
                        <div className="text-xs text-muted-foreground">
                          भण्डारण क्षमता
                        </div>
                        <div className="text-sm font-medium">
                          {center.storageTotalCapacityMT} मे.टन
                        </div>
                      </div>
                    )}

                  {center.hasProcessingUnit &&
                    center.processingCapacityMTPerDay && (
                      <div className="border rounded px-2 py-1">
                        <div className="text-xs text-muted-foreground">
                          प्रशोधन क्षमता
                        </div>
                        <div className="text-sm font-medium">
                          {center.processingCapacityMTPerDay} मे.टन/दिन
                        </div>
                      </div>
                    )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {center.hasStorageFacility && (
                    <Badge variant="outline" className="text-xs">
                      <Warehouse className="h-3 w-3 mr-1" />
                      भण्डारण
                    </Badge>
                  )}
                  {center.hasProcessingUnit && (
                    <Badge variant="outline" className="text-xs">
                      <Factory className="h-3 w-3 mr-1" />
                      प्रशोधन
                    </Badge>
                  )}
                  {center.hasQualityControlLab && (
                    <Badge variant="outline" className="text-xs">
                      <Flask className="h-3 w-3 mr-1" />
                      प्रयोगशाला
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewCenter(center.id)}
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
                        `/dashboard/digital-profile/institutions/agricultural/processing-centers/edit/${center.id}`,
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
                      onDelete({ id: center.id, name: center.name })
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
