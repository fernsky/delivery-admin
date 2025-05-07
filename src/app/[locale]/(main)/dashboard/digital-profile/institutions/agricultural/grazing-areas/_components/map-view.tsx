"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapIcon, Eye, Droplet, Leaf, Tractor } from "lucide-react";
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

interface GrazingAreaItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  areaInHectares?: number;
  elevationInMeters?: number;
  accessibility?: string;
  groundCover?: string;
  terrain?: string;
  livestockCapacity?: number;
  primaryLivestockType?: string;
  grazingSeasons?: string;
  grazingDuration?: string;
  rotationalSystem?: boolean;
  hasWaterSource?: boolean;
  waterSourceTypes?: string;
  hasFencing?: boolean;
  hasShelters?: boolean;
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
  grazingAreas: GrazingAreaItem[];
  grazingAreaTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({
  grazingAreas,
  grazingAreaTypes,
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
  const [selectedGrazingArea, setSelectedGrazingArea] =
    useState<GrazingAreaItem | null>(null);

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
        const grazingAreaType = feature.get("type");
        const terrain = feature.get("terrain");

        let fillColor = "#8b5cf6"; // Default purple color for grazing areas

        // Color based on grazing area type
        switch (grazingAreaType) {
          case "OPEN_RANGE":
            fillColor = "#10b981"; // Green
            break;
          case "ALPINE_MEADOW":
            fillColor = "#8b5cf6"; // Purple
            break;
          case "COMMUNITY_PASTURE":
            fillColor = "#3b82f6"; // Blue
            break;
          case "FOREST_UNDERSTORY":
            fillColor = "#10b981"; // Green
            break;
          case "FLOODPLAIN":
            fillColor = "#06b6d4"; // Cyan
            break;
          case "SEASONAL_PASTURE":
            fillColor = "#f59e0b"; // Amber
            break;
          case "DRY_SEASON_RESERVE":
            fillColor = "#eab308"; // Yellow
            break;
          case "ROTATIONAL_PADDOCK":
            fillColor = "#6366f1"; // Indigo
            break;
          case "MIXED":
            fillColor = "#ec4899"; // Pink
            break;
          default:
            fillColor = "#8b5cf6"; // Purple default
        }

        // Different style based on terrain
        let strokeWidth = 2;
        if (terrain) {
          if (terrain === "MOUNTAINOUS" || terrain === "HILLY") {
            strokeWidth = 3; // Mountainous terrain gets thicker border
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
        const grazingAreaType = feature.get("type");
        let fillColor = "rgba(139, 92, 246, 0.2)"; // Default light purple
        let strokeColor = "#8b5cf6"; // Default purple

        // Color based on grazing area type
        switch (grazingAreaType) {
          case "OPEN_RANGE":
            fillColor = "rgba(16, 185, 129, 0.2)"; // Light green
            strokeColor = "#10b981"; // Green
            break;
          case "ALPINE_MEADOW":
            fillColor = "rgba(139, 92, 246, 0.2)"; // Light purple
            strokeColor = "#8b5cf6"; // Purple
            break;
          case "COMMUNITY_PASTURE":
            fillColor = "rgba(59, 130, 246, 0.2)"; // Light blue
            strokeColor = "#3b82f6"; // Blue
            break;
          case "FOREST_UNDERSTORY":
            fillColor = "rgba(16, 185, 129, 0.2)"; // Light green
            strokeColor = "#10b981"; // Green
            break;
          case "FLOODPLAIN":
            fillColor = "rgba(6, 182, 212, 0.2)"; // Light cyan
            strokeColor = "#06b6d4"; // Cyan
            break;
          case "SEASONAL_PASTURE":
            fillColor = "rgba(245, 158, 11, 0.2)"; // Light amber
            strokeColor = "#f59e0b"; // Amber
            break;
          case "DRY_SEASON_RESERVE":
            fillColor = "rgba(234, 179, 8, 0.2)"; // Light yellow
            strokeColor = "#eab308"; // Yellow
            break;
          case "ROTATIONAL_PADDOCK":
            fillColor = "rgba(99, 102, 241, 0.2)"; // Light indigo
            strokeColor = "#6366f1"; // Indigo
            break;
          case "MIXED":
            fillColor = "rgba(236, 72, 153, 0.2)"; // Light pink
            strokeColor = "#ec4899"; // Pink
            break;
          default:
            fillColor = "rgba(139, 92, 246, 0.2)"; // Light purple
            strokeColor = "#8b5cf6"; // Purple default
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
      layers: [tileLayer, polygonLayer, pointLayer], // Order matters for rendering
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 7,
      }),
      overlays: [overlay],
    });

    // Add click handler for grazing area selection
    mapRef.current.on("click", function (evt) {
      const feature = mapRef.current!.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const grazingAreaId = feature.get("id");
        const grazingArea = grazingAreas.find((g) => g.id === grazingAreaId);
        if (grazingArea) {
          setSelectedGrazingArea(grazingArea);

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
        setSelectedGrazingArea(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all grazing areas
    addGrazingAreaFeatures(pointSource, polygonSource, grazingAreas);

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

  // Update the map when grazing areas change
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
    addGrazingAreaFeatures(pointSource, polygonSource, grazingAreas);

    // Reset selection when grazing areas change
    setSelectedGrazingArea(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all features
    fitMapToFeatures(pointSource, polygonSource);
  }, [grazingAreas]);

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
  const addGrazingAreaFeatures = (
    pointSource: VectorSource | null,
    polygonSource: VectorSource | null,
    grazingAreas: GrazingAreaItem[],
  ) => {
    if (!pointSource || !polygonSource) return;

    grazingAreas.forEach((area) => {
      // Add point feature for location
      if (area.locationPoint) {
        try {
          const coordinates = area.locationPoint.coordinates;
          const point = new OLPoint(fromLonLat(coordinates));
          const feature = new Feature({
            geometry: point,
            id: area.id,
            name: area.name,
            type: area.type,
            terrain: area.terrain,
          });
          pointSource.addFeature(feature);
        } catch (error) {
          console.error("Error adding point for", area.id, error);
        }
      }

      // Add polygon feature for area boundary
      if (area.areaPolygon) {
        try {
          const coordinates = area.areaPolygon.coordinates[0].map((coord) =>
            fromLonLat(coord),
          );

          const polygon = new OLPolygon([coordinates]);
          const feature = new Feature({
            geometry: polygon,
            id: area.id,
            name: area.name,
            type: area.type,
            terrain: area.terrain,
          });
          polygonSource.addFeature(feature);
        } catch (error) {
          console.error("Error adding polygon for", area.id, error);
        }
      }
    });
  };

  // Function to view grazing area details
  const handleViewGrazingArea = () => {
    if (selectedGrazingArea) {
      router.push(
        `/dashboard/digital-profile/institutions/agricultural/grazing-areas/${selectedGrazingArea.id}`,
      );
    }
  };

  // Helper function to get grazing area type label
  const getGrazingAreaTypeLabel = (type: string) => {
    const found = grazingAreaTypes.find((t) => t.value === type);
    return found ? found.label : type;
  };

  // Terrain label helper
  const getTerrainLabel = (terrain?: string) => {
    if (!terrain) return "";
    const types = {
      FLAT: "समतल",
      ROLLING: "घुम्ने/ओर्लोचढाइ",
      HILLY: "पहाडी",
      MOUNTAINOUS: "हिमाली",
      VALLEY: "उपत्यका",
      RIVERINE: "नदी किनार",
      MIXED: "मिश्रित",
    };
    return types[terrain as keyof typeof types] || terrain;
  };

  // Accessibility label helper
  const getAccessibilityLabel = (access?: string) => {
    if (!access) return "";
    const labels: Record<string, string> = {
      EASILY_ACCESSIBLE: "सजिलै पहुँच योग्य",
      MODERATELY_ACCESSIBLE: "मध्यम पहुँच योग्य",
      DIFFICULT_ACCESS: "कठिन पहुँच",
      SEASONAL_ACCESS: "मौसमी पहुँच",
      REMOTE: "दुर्गम",
    };
    return labels[access] || access;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-2">
        <div className="relative">
          <div className="absolute top-2 left-2 z-10 bg-white/90 rounded-md shadow-md p-2">
            <MapLayerControls />
          </div>

          <div className="absolute top-2 right-2 z-10">
            <Button
              size="sm"
              variant="secondary"
              className="shadow-md"
              onClick={() => toggleView()}
            >
              <MapIcon className="mr-2 h-4 w-4" />
              {isStreetView ? "उपग्रह दृश्य" : "सडक दृश्य"}
            </Button>
          </div>

          {/* Map legend */}
          <div className="absolute bottom-12 right-2 z-10 bg-white px-3 py-2 rounded-md shadow-md text-xs max-w-[220px]">
            <div className="font-medium mb-1">नक्सा प्रतीकहरू</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>चरन खर्क स्थान</span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-1.5 bg-purple-500 rounded"></div>
                <span>चरन खर्क क्षेत्र सीमाना</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>खुल्ला चरन क्षेत्र</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>सामुदायिक चरन</span>
              </div>
            </div>
          </div>

          <div className="h-[70vh]">
            {/* Map container */}
            <div
              ref={mapContainer}
              style={{ width: "100%", height: "100%" }}
              className="relative"
            ></div>

            {/* Popup overlay container */}
            <div ref={overlayContentRef} className="invisible">
              <div className="bg-white p-3 rounded-md shadow-lg max-w-[300px] border border-gray-200 mt-2 relative invisible overlayContainer">
                {selectedGrazingArea && (
                  <div className="space-y-2 visible">
                    <h3 className="font-medium text-base">
                      {selectedGrazingArea.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {getGrazingAreaTypeLabel(selectedGrazingArea.type)}
                    </p>

                    <div className="flex flex-wrap gap-1 text-xs">
                      {selectedGrazingArea.location && (
                        <span className="bg-muted px-2 py-0.5 rounded-sm">
                          {selectedGrazingArea.location}
                        </span>
                      )}
                      {selectedGrazingArea.wardNumber && (
                        <span className="bg-muted px-2 py-0.5 rounded-sm">
                          वडा नं. {selectedGrazingArea.wardNumber}
                        </span>
                      )}
                      {selectedGrazingArea.areaInHectares && (
                        <span className="bg-muted px-2 py-0.5 rounded-sm">
                          {selectedGrazingArea.areaInHectares} हेक्टर
                        </span>
                      )}
                      {selectedGrazingArea.elevationInMeters && (
                        <span className="bg-muted px-2 py-0.5 rounded-sm">
                          {selectedGrazingArea.elevationInMeters} मिटर
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedGrazingArea.hasWaterSource && (
                        <Badge variant="outline" className="text-xs">
                          <Droplet className="h-3 w-3 mr-1" />
                          पानी स्रोत
                        </Badge>
                      )}
                      {selectedGrazingArea.primaryLivestockType && (
                        <Badge variant="outline" className="text-xs">
                          पशु: {selectedGrazingArea.primaryLivestockType}
                        </Badge>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={handleViewGrazingArea}
                      className="w-full mt-2"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      विस्तृत हेर्नुहोस्
                    </Button>
                  </div>
                )}
              </div>
              <div className="absolute left-1/2 bottom-0 w-0 h-0 border-8 border-transparent border-t-gray-200 -translate-x-1/2 transform marker"></div>
            </div>
          </div>

          <style jsx>{`
            .overlayContainer {
              visibility: visible;
            }

            .marker {
              visibility: visible;
            }
          `}</style>
        </div>
      </CardContent>
    </Card>
  );
}
