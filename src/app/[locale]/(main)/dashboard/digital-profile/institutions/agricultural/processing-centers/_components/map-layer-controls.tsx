"use client";

import { useMapLayersStore } from "@/store/map-layers-store";
import { Button } from "@/components/ui/button";
import { LayersIcon, MapPin, Map as MapIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MapLayerControls() {
  const { showPoints, showPolygons, togglePoints, togglePolygons } =
    useMapLayersStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <LayersIcon className="h-4 w-4 mr-1" />
          तहहरू
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>नक्सा तहहरू</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showPoints}
          onCheckedChange={togglePoints}
        >
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>प्रशोधन केन्द्र स्थान</span>
          </div>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPolygons}
          onCheckedChange={togglePolygons}
        >
          <div className="flex items-center">
            <MapIcon className="h-4 w-4 mr-2" />
            <span>प्रशोधन केन्द्र क्षेत्र</span>
          </div>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
