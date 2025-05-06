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
import { Edit, Trash2, Eye, Image, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "./pagination";

interface ReligiousPlaceItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  mainDeity?: string;
  religiousSignificance?: string;
  preservationStatus?: string;
  yearEstablished?: number;
  isHeritageSite?: boolean;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface TableViewProps {
  religiousPlaces: ReligiousPlaceItem[];
  religiousPlaceTypes: { value: string; label: string }[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onDelete: (place: { id: string; name: string }) => void;
  isLoading?: boolean;
}

export function TableView({
  religiousPlaces,
  religiousPlaceTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: TableViewProps) {
  const router = useRouter();

  const handleViewReligiousPlace = (placeId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/cultural/religious-places/${placeId}`,
    );
  };

  // Get religious place type label
  const getReligiousPlaceTypeLabel = (type: string) => {
    const types = {
      HINDU_TEMPLE: "हिन्दु मन्दिर",
      BUDDHIST_TEMPLE: "बौद्ध गुम्बा",
      MOSQUE: "मस्जिद",
      CHURCH: "चर्च",
      GURUDWARA: "गुरुद्वारा",
      SHRINE: "मन्दिर",
      MONASTERY: "मठ",
      SYNAGOGUE: "यहुदी मन्दिर",
      JAIN_TEMPLE: "जैन मन्दिर",
      MEDITATION_CENTER: "ध्यान केन्द्र",
      PAGODA: "पगोडा",
      SACRED_GROVE: "पवित्र वन",
      SACRED_POND: "पवित्र पोखरी",
      SACRED_RIVER: "पवित्र नदी",
      SACRED_HILL: "पवित्र पहाड",
      PRAYER_HALL: "प्रार्थना हल",
      RELIGIOUS_COMPLEX: "धार्मिक परिसर",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get religious significance label
  const getReligiousSignificanceLabel = (significance?: string) => {
    if (!significance) return "";
    const significances = {
      LOCAL: "स्थानीय",
      REGIONAL: "क्षेत्रीय",
      NATIONAL: "राष्ट्रिय",
      INTERNATIONAL: "अन्तर्राष्ट्रिय",
    };
    return (
      significances[significance as keyof typeof significances] || significance
    );
  };

  // Get preservation status label
  const getPreservationStatusLabel = (status?: string) => {
    if (!status) return "";
    const statuses = {
      EXCELLENT: "उत्तम",
      GOOD: "राम्रो",
      FAIR: "ठीकठाक",
      POOR: "कमजोर",
      DAMAGED: "क्षतिग्रस्त",
      UNDER_RENOVATION: "मर्मत हुँदै",
      REBUILT: "पुनर्निर्माण भएको",
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  // Get preservation status color
  const getPreservationStatusColor = (status?: string) => {
    if (!status) return "";

    switch (status) {
      case "EXCELLENT":
      case "GOOD":
        return "bg-green-100 text-green-800";
      case "FAIR":
        return "bg-yellow-100 text-yellow-800";
      case "POOR":
      case "DAMAGED":
        return "bg-red-100 text-red-800";
      case "UNDER_RENOVATION":
        return "bg-blue-100 text-blue-800";
      case "REBUILT":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              <TableHead>महत्व र विवरण</TableHead>
              <TableHead>अवस्था</TableHead>
              <TableHead className="w-36 text-right">कार्यहरू</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {religiousPlaces.length > 0 ? (
              religiousPlaces.map((place) => (
                <TableRow key={place.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-start">
                      {place.primaryMedia?.url ? (
                        <div className="mr-3 flex-shrink-0">
                          <img
                            src={place.primaryMedia.url}
                            alt={place.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mr-3 flex-shrink-0 h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Landmark className="h-5 w-5 text-muted-foreground opacity-70" />
                        </div>
                      )}
                      <div>
                        <button
                          className="hover:underline text-left font-medium"
                          onClick={() => handleViewReligiousPlace(place.id)}
                        >
                          {place.name}
                        </button>
                        {place.mainDeity && (
                          <div className="text-xs text-muted-foreground mt-1">
                            मुख्य देवता: {place.mainDeity}
                          </div>
                        )}
                        {place.yearEstablished && (
                          <div className="text-xs text-muted-foreground">
                            स्थापना वर्ष: {place.yearEstablished}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getReligiousPlaceTypeLabel(place.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {place.wardNumber && (
                        <span className="mr-2">
                          वडा नं.: {place.wardNumber}
                        </span>
                      )}
                      {place.location && (
                        <span className="mr-2">{place.location}</span>
                      )}
                      {place.address && <span>{place.address}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {place.religiousSignificance && (
                        <div className="text-xs mb-1">
                          <Badge
                            variant="outline"
                            className={`${
                              place.religiousSignificance === "INTERNATIONAL"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : place.religiousSignificance === "NATIONAL"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }`}
                          >
                            {getReligiousSignificanceLabel(
                              place.religiousSignificance,
                            )}
                          </Badge>
                        </div>
                      )}
                      {place.isHeritageSite && (
                        <div className="text-xs mb-1">
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            सम्पदा स्थल
                          </Badge>
                        </div>
                      )}
                      {place.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {place.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {place.preservationStatus ? (
                      <Badge
                        className={getPreservationStatusColor(
                          place.preservationStatus,
                        )}
                      >
                        {getPreservationStatusLabel(place.preservationStatus)}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        अज्ञात
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewReligiousPlace(place.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(
                            `/dashboard/digital-profile/institutions/cultural/religious-places/edit/${place.id}`,
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
                            id: place.id,
                            name: place.name,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">
                    कुनै पनि धार्मिक स्थल फेला परेन
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
