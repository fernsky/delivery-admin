"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Trash2, MapPin, Edit } from "lucide-react";
import dynamic from "next/dynamic";

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

  const handleModeSwitchChange = (value: string) => {
    if (value === "point" || value === "polygon") {
      setMapMode(value);
      setIsDrawing(false);
    }
  };

  const handleStartDrawing = (e: any) => {
    e.preventDefault();
    setIsDrawing(true);
  };

  const handleCompletePolygon = (e: any) => {
    e.preventDefault();

    // This is just UI feedback - actual completion is handled in the map component
    if (isDrawing) {
      alert("पहिलो बिन्दुमा क्लिक गरेर रेखाङ्कन पूरा गर्नुहोस्");
    }
  };

  const handleClearSelection = (e: any) => {
    e.preventDefault();
    setSelectedPoint(undefined);
    setSelectedPolygon(undefined);
    setIsDrawing(false);
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    onLocationSelect(selectedPoint, selectedPolygon);
  };

  const handleMapUpdate = (point?: Point, polygon?: Polygon) => {
    if (point) setSelectedPoint(point);
    if (polygon) setSelectedPolygon(polygon);
    if (polygon) setIsDrawing(false);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between">
        <ToggleGroup
          type="single"
          value={mapMode}
          onValueChange={handleModeSwitchChange}
        >
          <ToggleGroupItem value="point" aria-label="Toggle point mode">
            <MapPin className="h-4 w-4 mr-2" />
            बिन्दु स्थान
          </ToggleGroupItem>
          <ToggleGroupItem value="polygon" aria-label="Toggle polygon mode">
            <Edit className="h-4 w-4 mr-2" />
            क्षेत्र आकार
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex gap-2">
          {mapMode === "polygon" && (
            <>
              {!isDrawing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartDrawing}
                >
                  रेखाङ्कन सुरु गर्नुहोस्
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCompletePolygon}
                >
                  रेखाङ्कन पूरा गर्नुहोस्
                </Button>
              )}
            </>
          )}

          <Button variant="ghost" size="sm" onClick={handleClearSelection}>
            <Trash2 className="h-4 w-4 mr-2" />
            सबै हटाउनुहोस्
          </Button>
        </div>
      </div>

      <div className="w-full h-[400px]">
        <OpenLayersMap
          mapMode={mapMode}
          isDrawing={isDrawing}
          initialPoint={initialPoint}
          initialPolygon={initialPolygon}
          onUpdate={handleMapUpdate}
          startDrawing={isDrawing}
        />
      </div>

      <div className="p-4 border-t flex justify-between">
        <div className="text-sm">
          {mapMode === "point"
            ? "नक्सामा बिन्दु चयन गर्नका लागि क्लिक गर्नुहोस्"
            : isDrawing
              ? "रेखाङ्कन गर्न बिन्दुहरू क्लिक गर्दै जानुहोस् र पहिलो बिन्दुमा क्लिक गरेर समाप्त गर्नुहोस्"
              : "क्षेत्र रेखाङ्कन गर्न माथिको बटन क्लिक गर्नुहोस्"}
        </div>
        <Button variant="default" size="sm" onClick={handleSave}>
          स्थान पुष्टि गर्नुहोस्
        </Button>
      </div>
    </Card>
  );
}

export default LocationMapInput;
