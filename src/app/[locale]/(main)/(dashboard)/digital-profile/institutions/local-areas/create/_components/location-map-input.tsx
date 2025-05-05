"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Map as MapIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import dynamic from "next/dynamic";
import { useMapViewStore } from "@/store/map-view-store";

// Define the types for our component
type Point = {
  type: "Point";
  coordinates: [number, number];
};

type Polygon = {
  type: "Polygon";
  coordinates: [number, number][][];
};

interface LocationMapInputProps {
  onLocationSelect: (point?: Point, polygon?: Polygon) => void;
  initialPoint?: Point;
  initialPolygon?: Polygon;
}

// Create a client-only OpenLayers map component
const OpenLayersMap = dynamic(
  () => import("./_map-implementation").then((mod) => mod.OpenLayersMap),
  { ssr: false },
);

export function LocationMapInput({
  onLocationSelect,
  initialPoint,
  initialPolygon,
}: LocationMapInputProps) {
  const [mapMode, setMapMode] = useState<"point" | "polygon">("point");
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<Point | undefined>(
    initialPoint,
  );
  const [selectedPolygon, setSelectedPolygon] = useState<Polygon | undefined>(
    initialPolygon,
  );
  const { isStreetView, toggleView } = useMapViewStore();

  const handleModeSwitchChange = (value: string) => {
    if (value === "point" || value === "polygon") {
      setMapMode(value);
      setIsDrawing(false);
    }
  };

  const handleStartDrawing = () => {
    setIsDrawing(true);
  };

  const handleClearSelection = () => {
    setSelectedPoint(undefined);
    setSelectedPolygon(undefined);
    setIsDrawing(false);
    onLocationSelect(undefined, undefined);
  };

  const handleMapUpdate = (point?: Point, polygon?: Polygon) => {
    if (point) setSelectedPoint(point);
    if (polygon) setSelectedPolygon(polygon);
    if (polygon) setIsDrawing(false);

    // Immediately notify parent of the selection
    onLocationSelect(point, polygon);
  };

  return (
    <div className="flex flex-col">
      <div className="p-3 border-b bg-background flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-4">
          <ToggleGroup
            type="single"
            value={mapMode}
            onValueChange={handleModeSwitchChange}
            className="justify-start"
          >
            <ToggleGroupItem
              value="point"
              aria-label="Toggle point mode"
              className="text-xs sm:text-sm"
            >
              बिन्दु स्थान
            </ToggleGroupItem>
            <ToggleGroupItem
              value="polygon"
              aria-label="Toggle polygon mode"
              className="text-xs sm:text-sm"
            >
              क्षेत्र आकार
            </ToggleGroupItem>
          </ToggleGroup>

          <Button
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm"
            onClick={(e) => {
              e.preventDefault();
              toggleView();
            }}
          >
            <MapIcon className="h-3 w-3 mr-1" />
            {isStreetView ? "उपग्रह दृश्य" : "सडक दृश्य"}
          </Button>
        </div>

        <div className="flex gap-2">
          {mapMode === "polygon" && !isDrawing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartDrawing}
              className="text-xs sm:text-sm"
            >
              रेखाङ्कन सुरु
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearSelection}
            className="text-xs sm:text-sm"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            सबै हटाउनुहोस्
          </Button>
        </div>
      </div>

      {/* Height increased for better UX - now even taller */}
      <div className="w-full h-[450px]">
        <OpenLayersMap
          mapMode={mapMode}
          isDrawing={isDrawing}
          initialPoint={initialPoint}
          initialPolygon={initialPolygon}
          onUpdate={handleMapUpdate}
          startDrawing={isDrawing}
          isStreetView={isStreetView}
        />
      </div>

      <div className="p-2 border-t text-xs bg-muted/20">
        {mapMode === "point"
          ? "नक्सामा बिन्दु चयन गर्नका लागि क्लिक गर्नुहोस्"
          : isDrawing
            ? "रेखाङ्कन गर्न बिन्दुहरू क्लिक गर्दै जानुहोस् र पहिलो बिन्दुमा क्लिक गरेर समाप्त गर्नुहोस्"
            : "क्षेत्र रेखाङ्कन गर्न माथिको बटन क्लिक गर्नुहोस्"}
      </div>
    </div>
  );
}

export default LocationMapInput;
