"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Edit,
  Trash2,
  Eye,
  Landmark,
  Calendar,
  MapPin,
  CheckIcon,
  PrayingHands,
} from "lucide-react";
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
  secondaryDeities?: string;
  religiousSignificance?: string;
  preservationStatus?: string;
  yearEstablished?: number;
  isHeritageSite?: boolean;
  annualFestivals?: string;
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface GridViewProps {
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

export function GridView({
  religiousPlaces,
  religiousPlaceTypes,
  pagination,
  onPageChange,
  onDelete,
  isLoading,
}: GridViewProps) {
  const router = useRouter();

  const handleViewReligiousPlace = (placeId: string) => {
    router.push(
      `/dashboard/digital-profile/institutions/cultural/religious-places/${placeId}`,
    );
  };

  // Get religious place type color
  const getReligiousPlaceTypeColor = (type: string) => {
    switch (type) {
      case "HINDU_TEMPLE":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "BUDDHIST_TEMPLE":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "MOSQUE":
        return "bg-green-50 text-green-600 border-green-200";
      case "CHURCH":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "GURUDWARA":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "SHRINE":
        return "bg-pink-50 text-pink-600 border-pink-200";
      case "MONASTERY":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "SYNAGOGUE":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "JAIN_TEMPLE":
        return "bg-red-50 text-red-600 border-red-200";
      case "MEDITATION_CENTER":
        return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "PAGODA":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "SACRED_GROVE":
      case "SACRED_POND":
      case "SACRED_RIVER":
      case "SACRED_HILL":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "PRAYER_HALL":
        return "bg-violet-50 text-violet-600 border-violet-200";
      case "RELIGIOUS_COMPLEX":
        return "bg-cyan-50 text-cyan-600 border-cyan-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
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

  if (religiousPlaces.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">कुनै पनि धार्मिक स्थल फेला परेन</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {religiousPlaces.map((place) => (
          <Card key={place.id} className="overflow-hidden">
            <div
              className="aspect-video relative bg-muted cursor-pointer"
              onClick={() => handleViewReligiousPlace(place.id)}
            >
              {place.primaryMedia?.url ? (
                <img
                  src={place.primaryMedia.url}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Landmark className="h-12 w-12 text-muted-foreground opacity-20" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <Badge className={getReligiousPlaceTypeColor(place.type)}>
                  {getReligiousPlaceTypeLabel(place.type)}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start gap-2">
                <h3
                  className="font-medium text-lg truncate cursor-pointer hover:underline flex-1"
                  onClick={() => handleViewReligiousPlace(place.id)}
                >
                  {place.name}
                </h3>
              </div>

              {place.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {place.description}
                </p>
              )}

              <div className="flex flex-wrap gap-1 mt-3">
                {place.wardNumber && (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    वडा नं. {place.wardNumber}
                  </div>
                )}
                {place.location && (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    {place.location}
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-2">
                {place.mainDeity && (
                  <p className="text-sm flex gap-1 items-center">
                    <PrayingHands className="h-4 w-4 text-amber-600" />
                    <span className="line-clamp-1">{place.mainDeity}</span>
                  </p>
                )}

                {place.yearEstablished && (
                  <p className="text-sm flex gap-1 items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>स्थापना वर्ष: {place.yearEstablished}</span>
                  </p>
                )}

                {place.address && (
                  <p className="text-sm flex gap-1 items-center">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span className="line-clamp-1">{place.address}</span>
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mt-2">
                {place.religiousSignificance && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      place.religiousSignificance === "INTERNATIONAL"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : place.religiousSignificance === "NATIONAL"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {getReligiousSignificanceLabel(place.religiousSignificance)}
                  </Badge>
                )}
                {place.isHeritageSite && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                  >
                    सम्पदा स्थल
                  </Badge>
                )}
                {place.preservationStatus && (
                  <Badge variant="outline" className="text-xs">
                    {getPreservationStatusLabel(place.preservationStatus)}
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between border-t mt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleViewReligiousPlace(place.id)}
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
                      `/dashboard/digital-profile/institutions/cultural/religious-places/edit/${place.id}`,
                    )
                  }
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete({ id: place.id, name: place.name })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
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
