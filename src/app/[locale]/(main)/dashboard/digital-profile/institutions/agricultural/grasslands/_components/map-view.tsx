"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapIcon, Eye, Droplet, GrassIcon } from "lucide-react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle, Text } from "ol/style";
import { Feature } from "ol";
import { Point as OLPoint, Polygon as OLPolygon } from "ol/geom";
import Overlay from "ol/Overlay";
import { useMapViewStore } from "@/store/map-view-store";
import { useMapLayersStore } from "@/store/map-layers-store";
import { Badge } from "@/components/ui/badge";
import { MapLayerControls } from "./map-layer-controls";

interface GrasslandItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  areaInHectares?: number;
  elevationInMeters?: number;
  vegetationDensity?: string;
  managementType?: string;
  dominantSpecies?: string;
  grazingPeriod?: string;
  hasWaterSource?: boolean;
  isFenced?: boolean;
  hasGrazingRights?: boolean;
  locationPoint?: {
    type: string;
    coordinates: [number, number];
  };
  areaPolygon?: {
    type: string;
    coordinates: Array<Array<[number, number]>>;
  };
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface MapViewProps {
  grasslands: GrasslandItem[];
  grasslandTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({
  grasslands,
  grasslandTypes,
  isLoading,
}: MapViewProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<TileLayer<any> | null>(null);
  const pointLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const polygonLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const { showPoints, showPolygons } = useMapLayersStore();
  const [selectedGrassland, setSelectedGrassland] =
    useState<GrasslandItem | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector sources for points and polygons
    const pointSource = new VectorSource();
    const polygonSource = new VectorSource();

    // Create vector layer for point features
    const pointLayer = new VectorLayer({
      source: pointSource,
      style: (feature) => {
        const grasslandType = feature.get("type");
        const vegetationDensity = feature.get("vegetationDensity");

        let fillColor = "#10b981"; // Default green

        // Color based on grassland type
        switch (grasslandType) {
          case "NATURAL_MEADOW":
            fillColor = "#10b981"; // Green
            break;
          case "IMPROVED_PASTURE":
            fillColor = "#34d399"; // Emerald
            break;
          case "RANGELAND":
            fillColor = "#f59e0b"; // Amber
            break;
          case "SILVOPASTURE":
            fillColor = "#3b82f6"; // Blue
            break;
          case "WETLAND_GRAZING":
            fillColor = "#06b6d4"; // Cyan
            break;
          case "ALPINE_GRASSLAND":
            fillColor = "#8b5cf6"; // Purple
            break;
          case "COMMON_GRAZING_LAND":
            fillColor = "#d97706"; // Amber
            break;
          case "OTHER":
            fillColor = "#6b7280"; // Gray
            break;
        }

        // Different style based on vegetation density
        let strokeWidth = 2;
        if (vegetationDensity) {
          if (
            vegetationDensity === "VERY_DENSE" ||
            vegetationDensity === "DENSE"
          ) {
            strokeWidth = 3; // Better vegetation gets thicker border
          }
        }

        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color: "#ffffff", width: strokeWidth }),
          }),
          text: new Text({
            text: feature.get("name"),
            offsetY: -15,
            font: "12px sans-serif",
            fill: new Fill({ color: "#000000" }),
            stroke: new Stroke({ color: "#ffffff", width: 3 }),
            textAlign: "center",
          }),
        });
      },
      visible: showPoints,
    });

    // Create vector layer for polygon features
    const polygonLayer = new VectorLayer({
      source: polygonSource,
      style: (feature) => {
        const grasslandType = feature.get("type");
        let fillColor = "rgba(16, 185, 129, 0.2)"; // Default light green
        let strokeColor = "#10b981"; // Default green

        // Color based on grassland type
        switch (grasslandType) {
          case "NATURAL_MEADOW":
            fillColor = "rgba(16, 185, 129, 0.2)"; // Light green
            strokeColor = "#10b981"; // Green
            break;
          case "IMPROVED_PASTURE":
            fillColor = "rgba(52, 211, 153, 0.2)"; // Light emerald
            strokeColor = "#34d399"; // Emerald
            break;
          case "RANGELAND":
            fillColor = "rgba(245, 158, 11, 0.2)"; // Light amber
            strokeColor = "#f59e0b"; // Amber
            break;
          case "SILVOPASTURE":
            fillColor = "rgba(59, 130, 246, 0.2)"; // Light blue
            strokeColor = "#3b82f6"; // Blue
            break;
          case "WETLAND_GRAZING":
            fillColor = "rgba(6, 182, 212, 0.2)"; // Light cyan
            strokeColor = "#06b6d4"; // Cyan
            break;
          case "ALPINE_GRASSLAND":
            fillColor = "rgba(139, 92, 246, 0.2)"; // Light purple
            strokeColor = "#8b5cf6"; // Purple
            break;
          case "COMMON_GRAZING_LAND":
            fillColor = "rgba(217, 119, 6, 0.2)"; // Light amber
            strokeColor = "#d97706"; // Amber
            break;
          case "OTHER":
            fillColor = "rgba(107, 114, 128, 0.2)"; // Light gray
            strokeColor = "#6b7280"; // Gray
            break;
        }

        return new Style({
          fill: new Fill({ color: fillColor }),
          stroke: new Stroke({ color: strokeColor, width: 2 }),
        });
      },
      visible: showPolygons,
    });

    // Store references to layers
    pointLayerRef.current = pointLayer;
    polygonLayerRef.current = polygonLayer;

    // Create the base tile layer based on the view preference
    const tileLayer = new TileLayer({
      source: isStreetView
        ? new XYZ({
            url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            maxZoom: 19,
          })
        : new XYZ({
            url: "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}",
            maxZoom: 19,
          }),
    });

    tileLayerRef.current = tileLayer;

    // Create overlay div for popup
    const overlayContent = document.createElement("div");
    overlayContent.className = "bg-white p-3 rounded shadow-lg max-w-xs";
    overlayContentRef.current = overlayContent;

    // Create the popup overlay
    const overlay = new Overlay({
      element: overlayContent,
      positioning: "bottom-center",
      offset: [0, -10],
      autoPan: true,
    });

    overlayRef.current = overlay;

    // Create the map
    mapRef.current = new Map({
      target: mapContainer.current,
      layers: [tileLayer, polygonLayer, pointLayer], // Order matters for rendering
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
      overlays: [overlay],
    });

    // Add click handler for grassland selection
    mapRef.current.on("click", function (evt) {
      const feature = mapRef.current!.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const grasslandId = feature.get("id");
        const grassland = grasslands.find((g) => g.id === grasslandId);
        if (grassland) {
          setSelectedGrassland(grassland);

          // Position the overlay
          let coordinates;
          if (feature.getGeometry()?.getType() === "Point") {
            coordinates = (feature.getGeometry() as OLPoint).getCoordinates();
          } else if (feature.getGeometry()?.getType() === "Polygon") {
            // For polygons, get the centroid
            const polyGeom = feature.getGeometry() as OLPolygon;
            const extent = polyGeom.getExtent();
            coordinates = [
              (extent[0] + extent[2]) / 2,
              (extent[1] + extent[3]) / 2,
            ];
          }

          if (coordinates && overlayRef.current) {
            overlayRef.current.setPosition(coordinates);
          }
        }
      } else {
        setSelectedGrassland(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all grasslands
    addGrasslandFeatures(pointSource, polygonSource, grasslands);

    // Auto-fit to all features
    fitMapToFeatures(pointSource, polygonSource);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  // Update the map when grasslands change
  useEffect(() => {
    if (!mapRef.current || !pointLayerRef.current || !polygonLayerRef.current)
      return;

    // Get the vector sources from the layers
    const pointSource = pointLayerRef.current.getSource();
    const polygonSource = polygonLayerRef.current.getSource();

    // Clear existing features
    pointSource?.clear();
    polygonSource?.clear();

    // Add new features
    addGrasslandFeatures(pointSource, polygonSource, grasslands);

    // Reset selection when grasslands change
    setSelectedGrassland(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all features
    fitMapToFeatures(pointSource, polygonSource);
  }, [grasslands]);

  // Update the tile layer when view type changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Create a new tile source based on the current view setting
    const newSource = isStreetView
      ? new XYZ({
          url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
          maxZoom: 19,
        })
      : new XYZ({
          url: "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}",
          maxZoom: 19,
        });

    // If we have a tile layer reference, update its source
    if (tileLayerRef.current) {
      tileLayerRef.current.setSource(newSource);
    }
  }, [isStreetView]);

  // Update layer visibility when showPoints or showPolygons change
  useEffect(() => {
    if (pointLayerRef.current) {
      pointLayerRef.current.setVisible(showPoints);
    }
  }, [showPoints]);

  useEffect(() => {
    if (polygonLayerRef.current) {
      polygonLayerRef.current.setVisible(showPolygons);
    }
  }, [showPolygons]);

  // Helper function to fit the map view to features
  const fitMapToFeatures = (
    pointSource: VectorSource | null,
    polygonSource: VectorSource | null,
  ) => {
    if (!mapRef.current) return;

    // Try to fit to polygon features first
    if (polygonSource && polygonSource.getFeatures().length > 0) {
      const polygonExtent = polygonSource.getExtent();
      if (polygonExtent[0] !== Infinity && polygonExtent[1] !== Infinity) {
        mapRef.current.getView().fit(polygonExtent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14,
        });
        return;
      }
    }

    // If no polygon features, try to fit to point features
    if (pointSource && pointSource.getFeatures().length > 0) {
      const pointExtent = pointSource.getExtent();
      if (pointExtent[0] !== Infinity && pointExtent[1] !== Infinity) {
        mapRef.current.getView().fit(pointExtent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14,
        });
      }
    }
  };

  // Helper function to add features to the map
  const addGrasslandFeatures = (
    pointSource: VectorSource | null,
    polygonSource: VectorSource | null,
    grasslands: GrasslandItem[],
  ) => {
    if (!pointSource || !polygonSource) return;

    grasslands.forEach((grassland) => {
      // Add point feature for location
      if (grassland.locationPoint) {
        try {
          const coordinates = grassland.locationPoint.coordinates;
          const point = new OLPoint(fromLonLat(coordinates));
          const feature = new Feature({
            geometry: point,
            id: grassland.id,
            name: grassland.name,
            type: grassland.type,
            vegetationDensity: grassland.vegetationDensity,
          });
          pointSource.addFeature(feature);
        } catch (error) {
          console.error("Error adding point for", grassland.id, error);
        }
      }

      // Add polygon feature for area boundary
      if (grassland.areaPolygon) {
        try {
          const coordinates = grassland.areaPolygon.coordinates[0].map(
            (coord) => fromLonLat(coord),
          );

          const polygon = new OLPolygon([coordinates]);
          const feature = new Feature({
            geometry: polygon,
            id: grassland.id,
            name: grassland.name,
            type: grassland.type,
            vegetationDensity: grassland.vegetationDensity,
          });
          polygonSource.addFeature(feature);
        } catch (error) {
          console.error("Error adding polygon for", grassland.id, error);
        }
      }
    });
  };

  // Function to view grassland details
  const handleViewGrassland = () => {
    if (selectedGrassland) {
      router.push(
        `/dashboard/digital-profile/institutions/agricultural/grasslands/${selectedGrassland.id}`,
      );
    }
  };

  // Helper function to get grassland type label
  const getGrasslandTypeLabel = (type: string) => {
    const found = grasslandTypes.find((t) => t.value === type);
    return found ? found.label : type;
  };

  // Vegetation density label helper
  const getVegetationDensityLabel = (density?: string) => {
    if (!density) return "";
    const densities: Record<string, string> = {
      VERY_DENSE: "अति घना",
      DENSE: "घना",
      MODERATE: "मध्यम",
      SPARSE: "पातलो",
      VERY_SPARSE: "अति पातलो",
    };
    return densities[density] || density;
  };

  // Render selected grassland info in popup
  useEffect(() => {
    if (!overlayContentRef.current) return;

    if (selectedGrassland) {
      let content = `
        <div class="space-y-2">
          <h3 class="font-medium">${selectedGrassland.name}</h3>
          <p class="text-xs text-muted-foreground">${getGrasslandTypeLabel(selectedGrassland.type)}</p>
          
          <div class="flex flex-wrap gap-1 text-xs">
      `;

      if (selectedGrassland.location) {
        content += `<span class="bg-muted px-2 py-0.5 rounded-sm">${selectedGrassland.location}</span>`;
      }

      if (selectedGrassland.wardNumber) {
        content += `<span class="bg-muted px-2 py-0.5 rounded-sm">वडा नं. ${selectedGrassland.wardNumber}</span>`;
      }

      if (selectedGrassland.areaInHectares) {
        content += `<span class="bg-muted px-2 py-0.5 rounded-sm">${selectedGrassland.areaInHectares} हेक्टर</span>`;
      }

      content += `</div>`;

      // Add vegetation density if available
      if (selectedGrassland.vegetationDensity) {
        content += `
          <div class="text-xs">
            <span class="text-muted-foreground">घनत्व:</span> ${getVegetationDensityLabel(selectedGrassland.vegetationDensity)}
          </div>
        `;
      }

      // Add water source info
      if (selectedGrassland.hasWaterSource) {
        content += `
          <div class="flex items-center gap-1 text-xs text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-droplet"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>
            पानीको स्रोत उपलब्ध
          </div>
        `;
      }

      content += `
          <div class="mt-3">
            <button id="view-grassland-btn" class="bg-primary text-white w-full py-1 px-2 rounded text-sm">
              हेर्नुहोस्
            </button>
          </div>
        </div>
      `;

      overlayContentRef.current.innerHTML = content;

      // Add click event to the button
      const viewButton = overlayContentRef.current.querySelector(
        "#view-grassland-btn",
      );
      if (viewButton) {
        viewButton.addEventListener("click", handleViewGrassland);
      }
    } else {
      overlayContentRef.current.innerHTML = "";
    }
  }, [selectedGrassland]);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative h-[700px]">
          <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

          {/* Map controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-100"
              onClick={() => toggleView()}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              {isStreetView ? "उपग्रह दृश्य" : "सडक दृश्य"}
            </Button>

            <MapLayerControls />
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-90 px-4 py-3 rounded-md shadow-md">
            <h4 className="font-medium text-sm mb-2">चरन क्षेत्रको प्रकार</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {grasslandTypes.slice(0, 6).map((type) => (
                <div key={type.value} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      type.value === "NATURAL_MEADOW"
                        ? "bg-green-500"
                        : type.value === "IMPROVED_PASTURE"
                          ? "bg-emerald-500"
                          : type.value === "RANGELAND"
                            ? "bg-amber-500"
                            : type.value === "SILVOPASTURE"
                              ? "bg-blue-500"
                              : type.value === "WETLAND_GRAZING"
                                ? "bg-cyan-500"
                                : type.value === "ALPINE_GRASSLAND"
                                  ? "bg-purple-500"
                                  : "bg-gray-500"
                    }`}
                  />
                  <span>{type.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              कुनै विशेष चरन क्षेत्रको विवरण हेर्न नक्सामा क्लिक गर्नुहोस्
            </div>
          </div>

          {/* Stats info */}
          <div className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 px-4 py-2 rounded-md shadow-md">
            <div className="text-xs">
              <span className="text-muted-foreground">जम्मा:</span>{" "}
              <strong>{grasslands.length}</strong> चरन क्षेत्र
            </div>
            <div className="text-xs mt-1">
              <span className="text-muted-foreground">कुल क्षेत्रफल:</span>{" "}
              <strong>
                {grasslands
                  .reduce((sum, g) => sum + (g.areaInHectares || 0), 0)
                  .toLocaleString()}
              </strong>{" "}
              हेक्टर
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
