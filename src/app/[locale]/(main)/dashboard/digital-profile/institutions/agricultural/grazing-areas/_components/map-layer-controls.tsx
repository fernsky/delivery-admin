"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMapLayersStore } from "@/store/map-layers-store";
import { MapPin, Map } from "lucide-react";

export function MapLayerControls() {
  const { showPoints, showPolygons, togglePoints, togglePolygons } =
    useMapLayersStore();

  return (
    <div className="space-y-2">
      <div className="mb-1 font-medium text-sm">नक्सा तहहरू</div>

      <div className="flex items-center space-x-2">
        <Switch
          id="showPoints"
          checked={showPoints}
          onCheckedChange={togglePoints}
        />
        <Label htmlFor="showPoints" className="flex items-center gap-1 text-sm">
          <MapPin className="h-3.5 w-3.5" />
          स्थान बिन्दुहरू
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="showPolygons"
          checked={showPolygons}
          onCheckedChange={togglePolygons}
        />
        <Label
          htmlFor="showPolygons"
          className="flex items-center gap-1 text-sm"
        >
          <Map className="h-3.5 w-3.5" />
          क्षेत्र सीमानाहरू
        </Label>
      </div>
    </div>
  );
}
