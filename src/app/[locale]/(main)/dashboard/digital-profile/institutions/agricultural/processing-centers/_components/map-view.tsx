"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapIcon,
  Eye,
  Warehouse,
  Factory,
  Flask,
  Activity,
} from "lucide-react";
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

interface ProcessingCenterItem {
  id: string;
  name: string;
  slug: string;
  centerType: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  isOperational?: boolean;
  hasStorageFacility?: boolean;
  storageTotalCapacityMT?: number;
  hasProcessingUnit?: boolean;
  processingCapacityMTPerDay?: number;
  hasQualityControlLab?: boolean;
  primaryCommodities?: string;
  ownershipType?: string;
  locationPoint?: {
    type: string;
    coordinates: [number, number];
  };
  facilityFootprint?: {
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
  centers: ProcessingCenterItem[];
  centerTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({ centers, centerTypes, isLoading }: MapViewProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const overlayContentRef = useRef<HTMLDivElement | null>(null);
  const tileLayerRef = useRef<TileLayer<any> | null>(null);
  const pointLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const polygonLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();
  const { showPoints, showPolygons } = useMapLayersStore();
  const [selectedCenter, setSelectedCenter] =
    useState<ProcessingCenterItem | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create a container for the popup overlay
    const overlayContent = document.createElement("div");
    overlayContent.className = "bg-white p-3 rounded-md shadow-md max-w-xs";
    overlayContentRef.current = overlayContent;

    // Create the popup overlay
    const overlay = new Overlay({
      element: overlayContent,
      positioning: "bottom-center",
      offset: [0, -10],
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
    overlayRef.current = overlay;

    // Create vector sources for points and polygons
    const pointSource = new VectorSource();
    const polygonSource = new VectorSource();

    // Create vector layer for point features
    const pointLayer = new VectorLayer({
      source: pointSource,
      style: (feature) => {
        const centerType = feature.get("centerType");
        const isOperational = feature.get("isOperational");

        let fillColor = "#10b981"; // Default green

        // Color based on center type
        switch (centerType) {
          case "COLLECTION_CENTER":
            fillColor = "#10b981"; // Green
            break;
          case "STORAGE_FACILITY":
            fillColor = "#3b82f6"; // Blue
            break;
          case "PROCESSING_UNIT":
            fillColor = "#8b5cf6"; // Purple
            break;
          case "MULTIPURPOSE_CENTER":
            fillColor = "#6366f1"; // Indigo
            break;
          case "MARKET_CENTER":
            fillColor = "#d97706"; // Amber
            break;
          case "COLD_STORAGE":
            fillColor = "#06b6d4"; // Cyan
            break;
          case "WAREHOUSE":
            fillColor = "#f59e0b"; // Orange
            break;
          case "OTHER":
            fillColor = "#6b7280"; // Gray
            break;
        }

        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({
              color: isOperational ? fillColor : "#ef4444", // Red for non-operational
            }),
            stroke: new Stroke({ color: "#ffffff", width: 2 }),
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
        const centerType = feature.get("centerType");
        let fillColor = "rgba(16, 185, 129, 0.2)"; // Default light green
        let strokeColor = "#10b981"; // Default green

        // Color based on center type
        switch (centerType) {
          case "COLLECTION_CENTER":
            fillColor = "rgba(16, 185, 129, 0.2)"; // Light green
            strokeColor = "#10b981"; // Green
            break;
          case "STORAGE_FACILITY":
            fillColor = "rgba(59, 130, 246, 0.2)"; // Light blue
            strokeColor = "#3b82f6"; // Blue
            break;
          case "PROCESSING_UNIT":
            fillColor = "rgba(139, 92, 246, 0.2)"; // Light purple
            strokeColor = "#8b5cf6"; // Purple
            break;
          case "MULTIPURPOSE_CENTER":
            fillColor = "rgba(99, 102, 241, 0.2)"; // Light indigo
            strokeColor = "#6366f1"; // Indigo
            break;
          case "MARKET_CENTER":
            fillColor = "rgba(217, 119, 6, 0.2)"; // Light amber
            strokeColor = "#d97706"; // Amber
            break;
          case "COLD_STORAGE":
            fillColor = "rgba(6, 182, 212, 0.2)"; // Light cyan
            strokeColor = "#06b6d4"; // Cyan
            break;
          case "WAREHOUSE":
            fillColor = "rgba(245, 158, 11, 0.2)"; // Light orange
            strokeColor = "#f59e0b"; // Orange
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

    // Add processing centers to the map
    addCentersToMap(centers);

    // Add map click handler
    mapRef.current.on("click", handleMapClick);

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, []);

  // Update the tile layer when view type changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    const newSource = isStreetView
      ? new XYZ({
          url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
          maxZoom: 19,
        })
      : new XYZ({
          url: "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}",
          maxZoom: 19,
        });

    tileLayerRef.current.setSource(newSource);
  }, [isStreetView]);

  // Update layer visibility when layer toggle controls change
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

  // Update map when centers data changes
  useEffect(() => {
    addCentersToMap(centers);
  }, [centers]);

  // Add processing centers to the map
  const addCentersToMap = (centers: ProcessingCenterItem[]) => {
    if (!mapRef.current || !pointLayerRef.current || !polygonLayerRef.current)
      return;

    // Clear existing features
    pointLayerRef.current.getSource()?.clear();
    polygonLayerRef.current.getSource()?.clear();

    // Add points and polygons from centers data
    centers.forEach((center) => {
      // Add point if available
      if (center.locationPoint && center.locationPoint.coordinates) {
        const point = new OLPoint(fromLonLat(center.locationPoint.coordinates));
        const feature = new Feature(point);
        feature.setProperties({
          centerId: center.id,
          name: center.name,
          centerType: center.centerType,
          isOperational: center.isOperational,
          featureType: "point",
        });
        pointLayerRef.current?.getSource()?.addFeature(feature);
      }

      // Add polygon if available
      if (center.facilityFootprint && center.facilityFootprint.coordinates) {
        const rings = center.facilityFootprint.coordinates.map((ring) =>
          ring.map((coord) => fromLonLat(coord)),
        );
        const polygon = new OLPolygon(rings);
        const feature = new Feature(polygon);
        feature.setProperties({
          centerId: center.id,
          name: center.name,
          centerType: center.centerType,
          isOperational: center.isOperational,
          featureType: "polygon",
        });
        polygonLayerRef.current?.getSource()?.addFeature(feature);
      }
    });

    // Fit view to features if there are any
    if (
      centers.length > 0 &&
      centers.some((c) => c.locationPoint || c.facilityFootprint)
    ) {
      const extent = [
        ...(polygonLayerRef.current.getSource()?.getExtent() || []),
        ...(pointLayerRef.current.getSource()?.getExtent() || []),
      ];

      // Check if extent is valid
      if (
        extent.some(
          (val) => val !== Infinity && val !== -Infinity && !isNaN(val),
        )
      ) {
        mapRef.current.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          maxZoom: 15,
          duration: 1000,
        });
      }
    }
  };

  // Handle map click
  const handleMapClick = (event: any) => {
    if (!mapRef.current || !overlayRef.current) return;

    // Close current popup
    overlayRef.current.setPosition(undefined);
    setSelectedCenter(null);

    // Check if a feature was clicked
    const feature = mapRef.current.forEachFeatureAtPixel(
      event.pixel,
      (feature) => feature,
    );

    if (feature) {
      const centerId = feature.get("centerId");
      if (centerId) {
        const center = centers.find((c) => c.id === centerId);
        if (center) {
          setSelectedCenter(center);

          // Set popup content
          if (overlayContentRef.current) {
            renderOverlayContent(center, overlayContentRef.current);
          }

          // Set popup position
          if (feature.get("featureType") === "point") {
            overlayRef.current.setPosition(event.coordinate);
          } else {
            // For polygons, use the click position
            overlayRef.current.setPosition(event.coordinate);
          }
        }
      }
    }
  };

  // Render popup content
  const renderOverlayContent = (
    center: ProcessingCenterItem,
    element: HTMLElement,
  ) => {
    const centerType =
      centerTypes.find((t) => t.value === center.centerType)?.label ||
      center.centerType;

    // Format popup content as HTML
    element.innerHTML = `
      <div class="space-y-2">
        <div class="font-medium">${center.name}</div>
        <div class="flex gap-1 items-center text-xs">
          <span class="px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary">${centerType}</span>
          ${
            center.isOperational
              ? '<span class="px-1.5 py-0.5 rounded-sm bg-green-100 text-green-800">संचालित</span>'
              : '<span class="px-1.5 py-0.5 rounded-sm bg-red-100 text-red-800">बन्द</span>'
          }
        </div>
        ${center.location ? `<div class="text-xs text-gray-600">स्थान: ${center.location}</div>` : ""}
        ${center.wardNumber ? `<div class="text-xs text-gray-600">वडा नं.: ${center.wardNumber}</div>` : ""}
      </div>
      <div class="mt-3 pt-2 border-t border-gray-100 flex justify-end">
        <button id="view-center-btn" class="px-2 py-1 text-xs bg-primary text-white rounded-sm">
          विवरण हेर्नुहोस्
        </button>
      </div>
    `;

    // Add event listener to the view button
    setTimeout(() => {
      const viewButton = element.querySelector("#view-center-btn");
      if (viewButton) {
        viewButton.addEventListener("click", () => {
          router.push(
            `/dashboard/digital-profile/institutions/agricultural/processing-centers/${center.id}`,
          );
        });
      }
    }, 0);
  };

  // Get center type label
  const getCenterTypeLabel = (type?: string) => {
    const centerType = centerTypes.find((t) => t.value === type);
    return centerType?.label || type;
  };

  return (
    <Card>
      <div className="p-3 flex flex-wrap gap-2 justify-between items-center border-b">
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" onClick={() => toggleView()}>
            <MapIcon className="h-4 w-4 mr-1" />
            {isStreetView ? "उपग्रह दृश्य" : "सडक दृश्य"}
          </Button>

          <MapLayerControls />
        </div>

        {selectedCenter && (
          <div className="flex items-center gap-2">
            <span className="text-sm">{selectedCenter.name}</span>
            <Button
              size="sm"
              onClick={() =>
                router.push(
                  `/dashboard/digital-profile/institutions/agricultural/processing-centers/${selectedCenter.id}`,
                )
              }
            >
              <Eye className="h-4 w-4 mr-1" />
              विवरण हेर्नुहोस्
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-0">
        <div className="relative h-[700px]">
          <div
            ref={mapContainer}
            className="h-full w-full"
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </CardContent>

      {/* Map Legend */}
      <div className="p-3 border-t">
        <h4 className="mb-2 font-medium text-sm">प्रशोधन केन्द्रको प्रकार</h4>
        <div className="flex flex-wrap gap-2">
          {centerTypes.map((type) => (
            <Badge
              key={type.value}
              variant="outline"
              className="flex items-center gap-1"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    type.value === "COLLECTION_CENTER"
                      ? "#10b981"
                      : type.value === "STORAGE_FACILITY"
                        ? "#3b82f6"
                        : type.value === "PROCESSING_UNIT"
                          ? "#8b5cf6"
                          : type.value === "MULTIPURPOSE_CENTER"
                            ? "#6366f1"
                            : type.value === "MARKET_CENTER"
                              ? "#d97706"
                              : type.value === "COLD_STORAGE"
                                ? "#06b6d4"
                                : type.value === "WAREHOUSE"
                                  ? "#f59e0b"
                                  : "#6b7280",
                }}
              />
              {type.label}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
