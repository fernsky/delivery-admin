"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Button } from "@/components/ui/button";

interface HistoricalSiteLocationMapProps {
  form: UseFormReturn<any>;
}

export default function HistoricalSiteLocationMap({
  form,
}: HistoricalSiteLocationMapProps) {
  const t = useTranslations("HistoricalSites");
  const [position, setPosition] = useState<[number, number]>([28.3949, 84.124]);
  const [zoom, setZoom] = useState(7);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null,
  );
  const [polygonPositions, setPolygonPositions] = useState<[number, number][]>(
    [],
  );
  const mapRef = useRef<L.Map | null>(null);
  const polygonRef = useRef<L.Polygon | null>(null);

  // Initialize from form values if they exist
  useEffect(() => {
    const locationPoint = form.getValues("locationPoint");
    if (locationPoint?.coordinates) {
      const [lng, lat] = locationPoint.coordinates;
      setMarkerPosition([lat, lng]);
      setPosition([lat, lng]);
      setZoom(15);
    }

    const boundary = form.getValues("siteBoundary");
    if (boundary?.coordinates?.length && boundary.coordinates[0]?.length) {
      const coordinates: [number, number][] = boundary.coordinates[0].map(
        ([lng, lat]) => [lat, lng] as [number, number],
      );
      setPolygonPositions(coordinates);
    }
  }, [form]);

  // Update form values when marker or polygon changes
  useEffect(() => {
    if (markerPosition) {
      const [lat, lng] = markerPosition;
      form.setValue(
        "locationPoint",
        {
          type: "Point",
          coordinates: [lng, lat],
        },
        { shouldValidate: true },
      );
    } else {
      form.setValue("locationPoint", undefined);
    }
  }, [markerPosition, form]);

  useEffect(() => {
    if (polygonPositions.length > 0) {
      const geoJsonCoordinates = [
        polygonPositions.map(([lat, lng]) => [lng, lat] as [number, number]),
      ];
      form.setValue(
        "siteBoundary",
        {
          type: "Polygon",
          coordinates: geoJsonCoordinates,
        },
        { shouldValidate: true },
      );
    } else {
      form.setValue("siteBoundary", undefined);
    }
  }, [polygonPositions, form]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!polygonRef.current) {
      setMarkerPosition([e.latlng.lat, e.latlng.lng]);
    }
  };

  const handleStartPolygon = () => {
    setPolygonPositions([]);
  };

  const handleMapClickForPolygon = (e: L.LeafletMouseEvent) => {
    setPolygonPositions((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
  };

  const handleCompletePolygon = () => {
    // If we have at least 3 points, close the polygon
    if (polygonPositions.length >= 3) {
      setPolygonPositions((prev) => {
        const firstPoint = prev[0];
        // Check if the polygon is already closed
        if (
          prev.length > 0 &&
          firstPoint[0] === prev[prev.length - 1][0] &&
          firstPoint[1] === prev[prev.length - 1][1]
        ) {
          return prev;
        }
        // Close the polygon
        return [...prev, firstPoint];
      });
    }
  };

  const handleClearPolygon = () => {
    setPolygonPositions([]);
  };

  const handleCenterMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
          }
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting current location:", error);
        },
      );
    } else {
      alert(t("create.locationMap.geolocationNotSupported"));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          {t("create.locationMap.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("create.locationMap.description")}
        </p>
      </div>

      <div className="h-[500px] relative border rounded-md overflow-hidden">
        <MapContainer
          center={position}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          onclick={
            polygonPositions.length > 0
              ? handleMapClickForPolygon
              : handleMapClick
          }
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markerPosition && <Marker position={markerPosition} />}
          {polygonPositions.length >= 3 && (
            <Polygon
              ref={polygonRef}
              positions={polygonPositions}
              pathOptions={{ color: "blue" }}
            />
          )}
        </MapContainer>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button type="button" onClick={handleCenterMap}>
          {t("create.locationMap.centerMapButton")}
        </Button>
        <Button type="button" variant="outline" onClick={handleStartPolygon}>
          {t("create.locationMap.startPolygonButton")}
        </Button>
        <Button type="button" onClick={handleCompletePolygon}>
          {t("create.locationMap.completePolygonButton")}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleClearPolygon}
        >
          {t("create.locationMap.clearPolygonButton")}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {polygonPositions.length > 0
          ? t("create.locationMap.drawingPolygonInstructions", {
              points: polygonPositions.length,
            })
          : t("create.locationMap.clickMapInstructions")}
      </p>
    </div>
  );
}
