"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MapComponent from "@/components/map/map-component";

interface FormData {
  wardNumber?: number;
  location?: string;
  address?: string;
  locationPoint?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  farmBoundary?: {
    type: "Polygon";
    coordinates: Array<Array<[number, number]>>; // Array of rings, each ring is array of [lon,lat] pairs
  };
  [key: string]: any;
}

interface FarmLocationMapProps {
  formData: FormData;
  updateMapData: (data: {
    locationPoint?: { type: "Point"; coordinates: [number, number] };
    farmBoundary?: {
      type: "Polygon";
      coordinates: Array<Array<[number, number]>>;
    };
  }) => void;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export default function FarmLocationMap({
  formData,
  updateMapData,
  updateFormData,
}: FarmLocationMapProps) {
  const t = useTranslations("Farms");
  const [wardOptions, setWardOptions] = useState<number[]>([]);

  // Generate ward options (1 to 12, or adjust as needed)
  useEffect(() => {
    const wards = Array.from({ length: 12 }, (_, i) => i + 1);
    setWardOptions(wards);
  }, []);

  // Handle marker position change (single point)
  const handleMarkerPositionChange = (longitude: number, latitude: number) => {
    updateMapData({
      locationPoint: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });
  };

  // Handle polygon drawing completion
  const handlePolygonComplete = (
    coordinates: Array<Array<[number, number]>>,
  ) => {
    updateMapData({
      farmBoundary: {
        type: "Polygon",
        coordinates,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{t("create.location.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("create.location.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="wardNumber">{t("create.location.wardNumber")}</Label>
          <Select
            value={formData.wardNumber?.toString() || ""}
            onValueChange={(value) =>
              updateFormData("wardNumber", parseInt(value))
            }
          >
            <SelectTrigger id="wardNumber" className="mt-1">
              <SelectValue
                placeholder={t("create.location.wardNumberPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {wardOptions.map((ward) => (
                <SelectItem key={ward} value={ward.toString()}>
                  {t("create.location.wardOption", { wardNumber: ward })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">{t("create.location.location")}</Label>
          <Input
            id="location"
            value={formData.location || ""}
            onChange={(e) => updateFormData("location", e.target.value)}
            placeholder={t("create.location.locationPlaceholder")}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="address">{t("create.location.address")}</Label>
          <Input
            id="address"
            value={formData.address || ""}
            onChange={(e) => updateFormData("address", e.target.value)}
            placeholder={t("create.location.addressPlaceholder")}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label>{t("create.location.mapTitle")}</Label>
        <Card className="mt-1 overflow-hidden">
          <MapComponent
            height="500px"
            drawingTools={true}
            initialCenter={{ lat: 28.5, lng: 84.25 }} // Default to Nepal
            initialZoom={7}
            onMarkerPositionChange={handleMarkerPositionChange}
            onPolygonComplete={handlePolygonComplete}
            initialMarker={
              formData.locationPoint
                ? {
                    lat: formData.locationPoint.coordinates[1],
                    lng: formData.locationPoint.coordinates[0],
                  }
                : undefined
            }
            initialPolygon={
              formData.farmBoundary
                ? formData.farmBoundary.coordinates[0].map((coord) => ({
                    lat: coord[1],
                    lng: coord[0],
                  }))
                : undefined
            }
          />
        </Card>
        <p className="text-sm text-muted-foreground mt-2">
          {t("create.location.mapHelp")}
        </p>
      </div>
    </div>
  );
}
