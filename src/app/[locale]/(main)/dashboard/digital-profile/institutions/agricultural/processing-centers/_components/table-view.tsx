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
  Image,
  Eye,
  Factory,
  Warehouse,
  Flask,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface ProcessingCenterItem {
  id: string;
  name: string;
  slug: string;
  centerType: string;
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

interface TableViewProps {
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

export function TableView({
  centers,
  centerTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewCenter = (centerId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/agricultural/processing-centers/${centerId}`,
    );
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

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>नाम</TableHead>
              <TableHead>प्रकार र स्थान</TableHead>
              <TableHead>क्षमता / वस्तु</TableHead>
              <TableHead>सुविधाहरू</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {centers.length > 0 ? (
              centers.map((center) => {
                const centerType = centerTypes.find(
                  (t) => t.value === center.centerType,
                );

                return (
                  <TableRow key={center.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-start">
                        {center.primaryMedia?.url ? (
                          <div className="mr-3 flex-shrink-0">
                            <img
                              src={center.primaryMedia.url}
                              alt={center.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                        ) : (
                          <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <Factory className="h-5 w-5 text-muted-foreground opacity-70" />
                          </div>
                        )}
                        <div>
                          <button
                            className="hover:underline text-left font-medium"
                            onClick={() => handleViewCenter(center.id)}
                          >
                            {center.name}
                          </button>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <Badge
                              variant={
                                center.isOperational ? "success" : "destructive"
                              }
                              className="text-[10px] h-5 mr-2"
                            >
                              {center.isOperational ? "संचालित" : "बन्द"}
                            </Badge>
                            {center.ownershipType && (
                              <span>
                                {getOwnershipTypeLabel(center.ownershipType)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline">
                          {centerType?.label || center.centerType}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {center.wardNumber && (
                            <span className="mr-2">
                              वडा नं. {center.wardNumber}
                            </span>
                          )}
                          {center.location && (
                            <span className="mr-2">{center.location}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {center.hasStorageFacility &&
                          center.storageTotalCapacityMT && (
                            <div className="text-xs">
                              <span className="mr-1">भण्डारण क्षमता:</span>
                              <span className="font-medium">
                                {center.storageTotalCapacityMT} मे. टन
                              </span>
                            </div>
                          )}
                        {center.hasProcessingUnit &&
                          center.processingCapacityMTPerDay && (
                            <div className="text-xs">
                              <span className="mr-1">प्रशोधन क्षमता:</span>
                              <span className="font-medium">
                                {center.processingCapacityMTPerDay} मे. टन/दिन
                              </span>
                            </div>
                          )}
                        {center.primaryCommodities && (
                          <div className="text-xs mt-1">
                            <span className="font-medium">वस्तुहरू:</span>{" "}
                            {center.primaryCommodities.substring(0, 50)}
                            {center.primaryCommodities.length > 50 && "..."}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {center.hasStorageFacility && (
                          <Badge variant="outline">
                            <Warehouse className="h-3 w-3 mr-1" />
                            भण्डारण
                          </Badge>
                        )}
                        {center.hasProcessingUnit && (
                          <Badge variant="outline">
                            <Factory className="h-3 w-3 mr-1" />
                            प्रशोधन
                          </Badge>
                        )}
                        {center.hasQualityControlLab && (
                          <Badge variant="outline">
                            <Flask className="h-3 w-3 mr-1" />
                            प्रयोगशाला
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewCenter(center.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
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
                          onClick={() =>
                            onDelete({
                              id: center.id,
                              name: center.name,
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
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">
                    कुनै पनि प्रशोधन केन्द्र फेला परेन
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
