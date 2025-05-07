"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Layers, MapPin, PenTool, Map as MapIcon } from "lucide-react";
import { useMapViewStore } from "@/store/map-view-store";
import { useMapLayersStore } from "@/store/map-layers-store";

export function MapLayerControls() {
  const { isStreetView, toggleView } = useMapViewStore();
  const { showPoints, showPolygons, togglePoints, togglePolygons } =
    useMapLayersStore();

  const handleViewToggle = () => {
    toggleView();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="flex items-center gap-2 font-medium mb-3">
          <MapIcon className="h-4 w-4 text-muted-foreground" />
          नक्साको प्रकार
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={isStreetView ? "default" : "outline"}
            size="sm"
            className="w-full"
            onClick={() => {
              if (!isStreetView) handleViewToggle();
            }}
          >
            सडक नक्सा
          </Button>
          <Button
            variant={isStreetView ? "outline" : "default"}
            size="sm"
            className="w-full"
            onClick={() => {
              if (isStreetView) handleViewToggle();
            }}
          >
            उपग्रह नक्सा
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="flex items-center gap-2 font-medium mb-1">
          <Layers className="h-4 w-4 text-muted-foreground" />
          तहहरू
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-points"
              checked={showPoints}
              onCheckedChange={togglePoints}
            />
            <Label
              htmlFor="show-points"
              className="flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="h-4 w-4 text-blue-600" />
              माछा फार्म स्थानहरू
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="show-polygons"
              checked={showPolygons}
              onCheckedChange={togglePolygons}
            />
            <Label
              htmlFor="show-polygons"
              className="flex items-center gap-2 cursor-pointer"
            >
              <PenTool className="h-4 w-4 text-indigo-600" />
              फार्म र पोखरी क्षेत्रहरू
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
