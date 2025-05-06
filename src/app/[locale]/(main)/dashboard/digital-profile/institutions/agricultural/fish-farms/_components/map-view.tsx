"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapIcon, Eye, Fish, Droplet, Scale, Building } from "lucide-react";
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

interface FishFarmItem {
  id: string;
  name: string;
  slug: string;
  farmType: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  totalAreaInHectares?: number;
  waterSurfaceAreaInHectares?: number;
  totalPondCount?: number;
  activePondCount?: number;
  primaryFishSpecies?: string;
  secondaryFishSpecies?: string;
  cultureSystem?: string;
  waterSource?: string;
  annualProductionInKg?: number;
  isVerified?: boolean;
  locationPoint?: {
    type: string;
    coordinates: [number, number];
  };
  farmBoundary?: {
    type: string;
    coordinates: Array<Array<[number, number]>>;
  };
  pondPolygons?: {
    type: string;
    coordinates: Array<Array<Array<[number, number]>>>;
  };
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
  };
}

interface MapViewProps {
  fishFarms: FishFarmItem[];
  fishFarmTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({ fishFarms, fishFarmTypes, isLoading }: MapViewProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<TileLayer<any> | null>(null);
  const pointLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const polygonLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const pondPolygonsLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const { showPoints, showPolygons } = useMapLayersStore();
  const [selectedFarm, setSelectedFarm] = useState<FishFarmItem | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector sources for points and polygons
    const pointSource = new VectorSource();
    const polygonSource = new VectorSource();
    const pondPolygonsSource = new VectorSource();

    // Create vector layer for point features
    const pointLayer = new VectorLayer({
      source: pointSource,
      style: (feature) => {
        const farmType = feature.get("farmType");
        const isVerified = feature.get("isVerified");

        let fillColor = "#3b82f6"; // Default blue for fish farms

        // Color based on farm type
        switch (farmType) {
          case "POND_CULTURE":
            fillColor = "#3b82f6"; // Blue
            break;
          case "CAGE_CULTURE":
            fillColor = "#6366f1"; // Indigo
            break;
          case "TANK_CULTURE":
            fillColor = "#8b5cf6"; // Purple
            break;
          case "RACEWAY_CULTURE":
            fillColor = "#06b6d4"; // Cyan
            break;
          case "RECIRCULATING_AQUACULTURE_SYSTEM":
            fillColor = "#14b8a6"; // Teal
            break;
          case "HATCHERY":
            fillColor = "#10b981"; // Green
            break;
          case "NURSERY":
            fillColor = "#84cc16"; // Lime
            break;
          case "INTEGRATED_FARMING":
            fillColor = "#65a30d"; // Lime dark
            break;
          case "RICE_FISH_CULTURE":
            fillColor = "#eab308"; // Yellow
            break;
          case "ORNAMENTAL_FISH_FARM":
            fillColor = "#ec4899"; // Pink
            break;
          case "RESEARCH_FACILITY":
            fillColor = "#8b5cf6"; // Purple
            break;
          case "MIXED":
            fillColor = "#f59e0b"; // Amber
            break;
          default:
            fillColor = "#6b7280"; // Gray
            break;
        }

        // Different style for verified farms
        let strokeColor = "#ffffff";
        let strokeWidth = isVerified ? 3 : 2;

        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: fillColor }),
            stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
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

    // Create vector layer for farm boundary polygon features
    const polygonLayer = new VectorLayer({
      source: polygonSource,
      style: (feature) => {
        const farmType = feature.get("farmType");
        const isVerified = feature.get("isVerified");

        let fillColor = "rgba(59, 130, 246, 0.2)"; // Default light blue
        let strokeColor = "#3b82f6"; // Default blue

        // Color based on farm type
        switch (farmType) {
          case "POND_CULTURE":
            fillColor = "rgba(59, 130, 246, 0.2)"; // Light blue
            strokeColor = "#3b82f6"; // Blue
            break;
          case "CAGE_CULTURE":
            fillColor = "rgba(99, 102, 241, 0.2)"; // Light indigo
            strokeColor = "#6366f1"; // Indigo
            break;
          case "TANK_CULTURE":
            fillColor = "rgba(139, 92, 246, 0.2)"; // Light purple
            strokeColor = "#8b5cf6"; // Purple
            break;
          case "RACEWAY_CULTURE":
            fillColor = "rgba(6, 182, 212, 0.2)"; // Light cyan
            strokeColor = "#06b6d4"; // Cyan
            break;
          case "RECIRCULATING_AQUACULTURE_SYSTEM":
            fillColor = "rgba(20, 184, 166, 0.2)"; // Light teal
            strokeColor = "#14b8a6"; // Teal
            break;
          case "HATCHERY":
            fillColor = "rgba(16, 185, 129, 0.2)"; // Light emerald
            strokeColor = "#10b981"; // Emerald
            break;
          case "NURSERY":
            fillColor = "rgba(132, 204, 22, 0.2)"; // Light lime
            strokeColor = "#84cc16"; // Lime
            break;
          case "INTEGRATED_FARMING":
            fillColor = "rgba(101, 163, 13, 0.2)"; // Light lime dark
            strokeColor = "#65a30d"; // Lime dark
            break;
          case "RICE_FISH_CULTURE":
            fillColor = "rgba(234, 179, 8, 0.2)"; // Light yellow
            strokeColor = "#eab308"; // Yellow
            break;
          case "ORNAMENTAL_FISH_FARM":
            fillColor = "rgba(236, 72, 153, 0.2)"; // Light pink
            strokeColor = "#ec4899"; // Pink
            break;
          case "RESEARCH_FACILITY":
            fillColor = "rgba(139, 92, 246, 0.2)"; // Light purple
            strokeColor = "#8b5cf6"; // Purple
            break;
          case "MIXED":
            fillColor = "rgba(245, 158, 11, 0.2)"; // Light amber
            strokeColor = "#f59e0b"; // Amber
            break;
          default:
            fillColor = "rgba(107, 114, 128, 0.2)"; // Light gray
            strokeColor = "#6b7280"; // Gray
            break;
        }

        // Different style for verified farms
        let strokeWidth = isVerified ? 3 : 2;

        return new Style({
          fill: new Fill({ color: fillColor }),
          stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
        });
      },
      visible: showPolygons,
    });

    // Create vector layer for pond polygon features
    const pondPolygonsLayer = new VectorLayer({
      source: pondPolygonsSource,
      style: new Style({
        fill: new Fill({ color: "rgba(14, 165, 233, 0.4)" }), // Light sky blue fill for ponds
        stroke: new Stroke({ color: "#0ea5e9", width: 1 }), // Sky blue stroke for ponds
      }),
      visible: showPolygons,
    });

    // Store references to layers
    pointLayerRef.current = pointLayer;
    polygonLayerRef.current = polygonLayer;
    pondPolygonsLayerRef.current = pondPolygonsLayer;

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

    // Create the popup overlay
    const overlay = new Overlay({
      element: overlayContentRef.current!,
      positioning: "bottom-center",
      offset: [0, -10],
      autoPan: true,
    });

    overlayRef.current = overlay;

    // Create the map
    mapRef.current = new Map({
      target: mapContainer.current,
      layers: [tileLayer, polygonLayer, pondPolygonsLayer, pointLayer], // Order matters for rendering
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
      overlays: [overlay],
    });

    // Add click handler for farm selection
    mapRef.current.on("click", function (evt) {
      const feature = mapRef.current!.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const farmId = feature.get("id");
        const farm = fishFarms.find((f) => f.id === farmId);
        if (farm) {
          setSelectedFarm(farm);

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
        setSelectedFarm(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all fish farms
    addFishFarmFeatures(
      pointSource,
      polygonSource,
      pondPolygonsSource,
      fishFarms,
    );

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

  // Update the map when fish farms change
  useEffect(() => {
    if (
      !mapRef.current ||
      !pointLayerRef.current ||
      !polygonLayerRef.current ||
      !pondPolygonsLayerRef.current
    )
      return;

    // Get the vector sources from the layers
    const pointSource = pointLayerRef.current.getSource();
    const polygonSource = polygonLayerRef.current.getSource();
    const pondPolygonsSource = pondPolygonsLayerRef.current.getSource();

    // Clear existing features
    pointSource?.clear();
    polygonSource?.clear();
    pondPolygonsSource?.clear();

    // Add new features
    addFishFarmFeatures(
      pointSource,
      polygonSource,
      pondPolygonsSource,
      fishFarms,
    );

    // Reset selection when fish farms change
    setSelectedFarm(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all features
    fitMapToFeatures(pointSource, polygonSource);
  }, [fishFarms]);

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
    if (polygonLayerRef.current && pondPolygonsLayerRef.current) {
      polygonLayerRef.current.setVisible(showPolygons);
      pondPolygonsLayerRef.current.setVisible(showPolygons);
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

    // If no polygon features, fit to point features
    if (pointSource && pointSource.getFeatures().length > 0) {
      const pointExtent = pointSource.getExtent();
      if (pointExtent[0] !== Infinity && pointExtent[1] !== Infinity) {
        mapRef.current.getView().fit(pointExtent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14,
        });
        return;
      }
    }

    // If no features at all, show Nepal
    mapRef.current.getView().setCenter(fromLonLat([84.0, 28.3]));
    mapRef.current.getView().setZoom(7);
  };

  // Helper function to add fish farm features to map sources
  const addFishFarmFeatures = (
    pointSource: VectorSource | null,
    polygonSource: VectorSource | null,
    pondPolygonsSource: VectorSource | null,
    farms: FishFarmItem[],
  ) => {
    if (!pointSource || !polygonSource || !pondPolygonsSource) return;

    farms.forEach((farm) => {
      // Add point for location
      if (farm.locationPoint) {
        const coords = fromLonLat(farm.locationPoint.coordinates);
        const point = new OLPoint(coords);
        const feature = new Feature({
          geometry: point,
          id: farm.id,
          name: farm.name,
          farmType: farm.farmType,
          isVerified: farm.isVerified,
        });

        pointSource.addFeature(feature);
      }

      // Add polygon for farm boundary
      if (farm.farmBoundary) {
        try {
          // Convert GeoJSON coordinates to OpenLayers
          const rings = farm.farmBoundary.coordinates.map((ring) =>
            ring.map((coord) => fromLonLat(coord)),
          );

          const polygon = new OLPolygon(rings);
          const feature = new Feature({
            geometry: polygon,
            id: farm.id,
            name: farm.name,
            farmType: farm.farmType,
            isVerified: farm.isVerified,
          });

          polygonSource.addFeature(feature);
        } catch (error) {
          console.error("Error creating farm boundary polygon:", error);
        }
      }

      // Add polygons for ponds
      if (farm.pondPolygons) {
        try {
          // Process each polygon in the MultiPolygon
          farm.pondPolygons.coordinates.forEach((polyCoords, idx) => {
            // Convert GeoJSON coordinates to OpenLayers
            const rings = polyCoords.map((ring) =>
              ring.map((coord) => fromLonLat(coord)),
            );

            const polygon = new OLPolygon(rings);
            const feature = new Feature({
              geometry: polygon,
              id: `${farm.id}-pond-${idx}`,
              name: `${farm.name} Pond ${idx + 1}`,
              farmType: "POND", // Special type for styling
              isVerified: farm.isVerified,
            });

            pondPolygonsSource.addFeature(feature);
          });
        } catch (error) {
          console.error("Error creating pond polygons:", error);
        }
      }
    });
  };

  // Get farm type label helper
  const getFarmTypeLabel = (type: string) => {
    const farmType = fishFarmTypes.find((t) => t.value === type);
    return farmType?.label || type;
  };

  // Get water source label helper
  const getWaterSourceLabel = (source?: string) => {
    if (!source) return "";
    const sources: Record<string, string> = {
      RIVER: "नदी",
      STREAM: "खोला",
      SPRING: "झरना",
      WELL: "कुवा",
      GROUNDWATER: "भूमिगत पानी",
      RAINWATER: "वर्षातको पानी",
      CANAL: "कुलो/नहर",
      RESERVOIR: "जलाशय",
      LAKE: "ताल",
      MIXED: "मिश्रित",
    };
    return sources[source] || source;
  };

  // Get culture system label helper
  const getCultureSystemLabel = (system?: string) => {
    if (!system) return "";
    const systems: Record<string, string> = {
      EXTENSIVE: "विस्तृत",
      SEMI_INTENSIVE: "अर्ध-सघन",
      INTENSIVE: "सघन",
      SUPER_INTENSIVE: "अति सघन",
      POLYCULTURE: "मिश्रित मत्स्यपालन",
      MONOCULTURE: "एकल मत्स्यपालन",
    };
    return systems[system] || system;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Map controls */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <MapLayerControls />

              {/* Layer legend */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">माछा फार्म प्रकार</h4>
                <div className="space-y-1 max-h-72 overflow-y-auto pr-2">
                  {fishFarmTypes.map((type) => (
                    <div key={type.value} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            type.value === "POND_CULTURE"
                              ? "#3b82f6"
                              : type.value === "CAGE_CULTURE"
                                ? "#6366f1"
                                : type.value === "TANK_CULTURE"
                                  ? "#8b5cf6"
                                  : type.value === "HATCHERY"
                                    ? "#10b981"
                                    : type.value === "NURSERY"
                                      ? "#84cc16"
                                      : "#f59e0b",
                        }}
                      ></div>
                      <span className="text-xs">{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Currently selected farm details */}
          {selectedFarm && (
            <Card className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                {selectedFarm.primaryMedia?.url ? (
                  <img
                    src={selectedFarm.primaryMedia.url}
                    alt={selectedFarm.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fish className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{selectedFarm.name}</h3>
                    <Badge className="mt-1">
                      {getFarmTypeLabel(selectedFarm.farmType)}
                    </Badge>
                  </div>

                  {selectedFarm.primaryFishSpecies && (
                    <div className="flex gap-2 items-center">
                      <Fish className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        {selectedFarm.primaryFishSpecies}
                      </span>
                    </div>
                  )}

                  {selectedFarm.waterSource && (
                    <div className="flex gap-2 items-center">
                      <Droplet className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">
                        {getWaterSourceLabel(selectedFarm.waterSource)}
                      </span>
                    </div>
                  )}

                  {selectedFarm.cultureSystem && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">पालन प्रणाली:</span>{" "}
                      {getCultureSystemLabel(selectedFarm.cultureSystem)}
                    </div>
                  )}

                  {selectedFarm.totalPondCount !== null &&
                    selectedFarm.totalPondCount !== undefined && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">पोखरी संख्या:</span>{" "}
                        {selectedFarm.totalPondCount} (सक्रिय:{" "}
                        {selectedFarm.activePondCount || 0})
                      </div>
                    )}

                  {selectedFarm.totalAreaInHectares !== null &&
                    selectedFarm.totalAreaInHectares !== undefined && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">जम्मा क्षेत्रफल:</span>{" "}
                        {selectedFarm.totalAreaInHectares} हे.
                      </div>
                    )}

                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboard/digital-profile/institutions/agricultural/fish-farms/${selectedFarm.id}`,
                      )
                    }
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    विस्तृत विवरण हेर्नुहोस्
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map container */}
        <Card className="flex-1 overflow-hidden">
          <div
            ref={mapContainer}
            className="h-[700px] w-full"
            style={{ position: "relative" }}
          ></div>

          {/* Popup Overlay Container */}
          <div
            ref={overlayContentRef}
            className="absolute bg-white p-2 rounded-md shadow-md border text-sm w-48"
            style={{
              display: selectedFarm ? "block" : "none",
              pointerEvents: "none",
              transform: "translate(-50%, -100%)",
              whiteSpace: "nowrap",
            }}
          >
            {selectedFarm && (
              <div className="text-center">
                <div className="font-medium">{selectedFarm.name}</div>
                <div className="text-xs text-muted-foreground">
                  {getFarmTypeLabel(selectedFarm.farmType)}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
