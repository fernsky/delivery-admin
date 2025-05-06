"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  History,
  Eye,
  Trophy,
  Calendar,
  Building,
  LayoutLandscape,
  Map,
  Layers,
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

interface HistoricalSiteItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  architecturalStyle?: string;
  yearEstablished?: number;
  lastRestorationYear?: number;
  historicalPeriod?: string;
  originalFunction?: string;
  isHeritageSite?: boolean;
  heritageDesignation?: string;
  managedBy?: string;
  preservationStatus?: string;
  isVerified?: boolean;
  locationPoint?: {
    type: string;
    coordinates: [number, number];
  };
  complexBoundary?: {
    type: string;
    coordinates: Array<Array<[number, number]>>;
  };
  structureFootprints?: {
    type: string;
    coordinates: Array<Array<Array<[number, number]>>>;
  };
  primaryMedia?: {
    mediaId: string;
    url: string;
    fileName?: string;
    mimeType?: string;
  };
}

interface MapViewProps {
  historicalSites: HistoricalSiteItem[];
  historicalSiteTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({
  historicalSites,
  historicalSiteTypes,
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
  const structureFootprintsLayerRef = useRef<VectorLayer<VectorSource> | null>(
    null,
  );
  const { isStreetView, toggleView } = useMapViewStore();
  const { showPoints, showPolygons } = useMapLayersStore();
  const [selectedSite, setSelectedSite] = useState<HistoricalSiteItem | null>(
    null,
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector sources for points and polygons
    const pointSource = new VectorSource();
    const polygonSource = new VectorSource();
    const structureFootprintsSource = new VectorSource();

    // Create vector layer for point features
    const pointLayer = new VectorLayer({
      source: pointSource,
      style: (feature) => {
        const siteType = feature.get("siteType");
        const isVerified = feature.get("isVerified");
        const isHeritageSite = feature.get("isHeritageSite");

        let fillColor = "#8b5cf6"; // Default purple for sites

        // Color based on site type
        switch (siteType) {
          case "PALACE":
            fillColor = "#8b5cf6"; // Purple
            break;
          case "FORT":
            fillColor = "#6b7280"; // Gray
            break;
          case "ANCIENT_SETTLEMENT":
            fillColor = "#f59e0b"; // Amber
            break;
          case "ARCHAEOLOGICAL_SITE":
            fillColor = "#f97316"; // Orange
            break;
          case "ANCIENT_MONUMENT":
            fillColor = "#10b981"; // Emerald
            break;
          case "HERITAGE_BUILDING":
            fillColor = "#3b82f6"; // Blue
            break;
          case "MEDIEVAL_TOWN":
            fillColor = "#78716c"; // Stone
            break;
          case "ROYAL_RESIDENCE":
            fillColor = "#e11d48"; // Rose
            break;
          case "HISTORIC_GARDEN":
            fillColor = "#22c55e"; // Green
            break;
          case "HISTORIC_INFRASTRUCTURE":
            fillColor = "#14b8a6"; // Teal
            break;
          case "BATTLEFIELD":
            fillColor = "#ef4444"; // Red
            break;
          case "ANCIENT_RUINS":
            fillColor = "#eab308"; // Yellow
            break;
          case "HISTORIC_LANDMARK":
            fillColor = "#6366f1"; // Indigo
            break;
          default:
            fillColor = "#8b5cf6"; // Purple (default)
            break;
        }

        // Heritage sites get a gold stroke
        let strokeColor = isHeritageSite ? "#facc15" : "#ffffff";
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

    // Create vector layer for complex boundary polygon features
    const polygonLayer = new VectorLayer({
      source: polygonSource,
      style: (feature) => {
        const siteType = feature.get("siteType");
        const isVerified = feature.get("isVerified");
        const isHeritageSite = feature.get("isHeritageSite");

        let fillColor = "rgba(139, 92, 246, 0.2)"; // Default light purple
        let strokeColor = "#8b5cf6"; // Default purple

        // Color based on site type
        switch (siteType) {
          case "PALACE":
            fillColor = "rgba(139, 92, 246, 0.2)"; // Light purple
            strokeColor = "#8b5cf6"; // Purple
            break;
          case "FORT":
            fillColor = "rgba(107, 114, 128, 0.2)"; // Light gray
            strokeColor = "#6b7280"; // Gray
            break;
          case "ANCIENT_SETTLEMENT":
            fillColor = "rgba(245, 158, 11, 0.2)"; // Light amber
            strokeColor = "#f59e0b"; // Amber
            break;
          case "ARCHAEOLOGICAL_SITE":
            fillColor = "rgba(249, 115, 22, 0.2)"; // Light orange
            strokeColor = "#f97316"; // Orange
            break;
          case "ANCIENT_MONUMENT":
            fillColor = "rgba(16, 185, 129, 0.2)"; // Light emerald
            strokeColor = "#10b981"; // Emerald
            break;
          case "HERITAGE_BUILDING":
            fillColor = "rgba(59, 130, 246, 0.2)"; // Light blue
            strokeColor = "#3b82f6"; // Blue
            break;
          case "MEDIEVAL_TOWN":
            fillColor = "rgba(120, 113, 108, 0.2)"; // Light stone
            strokeColor = "#78716c"; // Stone
            break;
          case "ROYAL_RESIDENCE":
            fillColor = "rgba(225, 29, 72, 0.2)"; // Light rose
            strokeColor = "#e11d48"; // Rose
            break;
          case "HISTORIC_GARDEN":
            fillColor = "rgba(34, 197, 94, 0.2)"; // Light green
            strokeColor = "#22c55e"; // Green
            break;
          case "HISTORIC_INFRASTRUCTURE":
            fillColor = "rgba(20, 184, 166, 0.2)"; // Light teal
            strokeColor = "#14b8a6"; // Teal
            break;
          case "BATTLEFIELD":
            fillColor = "rgba(239, 68, 68, 0.2)"; // Light red
            strokeColor = "#ef4444"; // Red
            break;
          case "ANCIENT_RUINS":
            fillColor = "rgba(234, 179, 8, 0.2)"; // Light yellow
            strokeColor = "#eab308"; // Yellow
            break;
          case "HISTORIC_LANDMARK":
            fillColor = "rgba(99, 102, 241, 0.2)"; // Light indigo
            strokeColor = "#6366f1"; // Indigo
            break;
          default:
            fillColor = "rgba(139, 92, 246, 0.2)"; // Light purple (default)
            strokeColor = "#8b5cf6"; // Purple (default)
            break;
        }

        // Heritage sites get a gold stroke
        if (isHeritageSite) {
          strokeColor = "#facc15"; // Yellow-gold for heritage sites
        }

        // Different style for verified sites
        let strokeWidth = isVerified ? 3 : 2;

        return new Style({
          fill: new Fill({ color: fillColor }),
          stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
        });
      },
      visible: showPolygons,
    });

    // Create vector layer for structure footprint features
    const structureFootprintsLayer = new VectorLayer({
      source: structureFootprintsSource,
      style: new Style({
        fill: new Fill({ color: "rgba(139, 69, 19, 0.3)" }), // Brown fill for structures
        stroke: new Stroke({ color: "#8b4513", width: 1 }), // Brown stroke for structures
      }),
      visible: showPolygons,
    });

    // Store references to layers
    pointLayerRef.current = pointLayer;
    polygonLayerRef.current = polygonLayer;
    structureFootprintsLayerRef.current = structureFootprintsLayer;

    // Create the base tile layer based on the view preference
    const tileLayer = new TileLayer({
      source: isStreetView
        ? new XYZ({
            url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            maxZoom: 19,
          })
        : new XYZ({
            url: "https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
            maxZoom: 19,
          }),
    });
    tileLayerRef.current = tileLayer;

    // Create popup overlay for site info
    const overlay = new Overlay({
      element: overlayContentRef.current!,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
      positioning: "bottom-center",
      offset: [0, -15],
      stopEvent: true,
    });
    overlayRef.current = overlay;

    // Create map
    const map = new Map({
      target: mapContainer.current,
      layers: [tileLayer, polygonLayer, structureFootprintsLayer, pointLayer],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([81.6143, 28.3949]), // Default center for Nepal
        zoom: 7,
      }),
    });
    mapRef.current = map;

    // Add click handler to show site info
    map.on("click", (event) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
      );

      if (feature && feature.get("id")) {
        const siteId = feature.get("id");
        const site = historicalSites.find((site) => site.id === siteId);

        if (site) {
          setSelectedSite(site);

          // Position the overlay at the feature coordinates
          if (site.locationPoint) {
            overlay.setPosition(
              fromLonLat([
                site.locationPoint.coordinates[0],
                site.locationPoint.coordinates[1],
              ]),
            );
          }
        }
      } else {
        setSelectedSite(null);
        overlay.setPosition(undefined);
      }
    });

    // Return a cleanup function
    return () => {
      map.setTarget(undefined);
      mapRef.current = null;
    };
  }, [isStreetView, showPoints, showPolygons]);

  // Update the map when sites change
  useEffect(() => {
    if (!mapRef.current) return;

    const pointLayer = pointLayerRef.current;
    const polygonLayer = polygonLayerRef.current;
    const structureFootprintsLayer = structureFootprintsLayerRef.current;

    if (!pointLayer || !polygonLayer || !structureFootprintsLayer) return;

    // Clear previous features
    pointLayer.getSource()?.clear();
    polygonLayer.getSource()?.clear();
    structureFootprintsLayer.getSource()?.clear();

    // Add new features for each site with location data
    historicalSites.forEach((site) => {
      // Add point features
      if (site.locationPoint) {
        const pointFeature = new Feature({
          geometry: new OLPoint(
            fromLonLat([
              site.locationPoint.coordinates[0],
              site.locationPoint.coordinates[1],
            ]),
          ),
        });

        // Set properties needed for styling and interaction
        pointFeature.setProperties({
          id: site.id,
          name: site.name,
          siteType: site.type,
          isVerified: site.isVerified,
          isHeritageSite: site.isHeritageSite,
        });

        pointLayer.getSource()?.addFeature(pointFeature);
      }

      // Add polygon features
      if (site.complexBoundary) {
        try {
          const coords = site.complexBoundary.coordinates[0].map((coord) =>
            fromLonLat(coord),
          );

          const polygonFeature = new Feature({
            geometry: new OLPolygon([coords]),
          });

          // Set properties needed for styling and interaction
          polygonFeature.setProperties({
            id: site.id,
            name: site.name,
            siteType: site.type,
            isVerified: site.isVerified,
            isHeritageSite: site.isHeritageSite,
          });

          polygonLayer.getSource()?.addFeature(polygonFeature);
        } catch (error) {
          console.error("Error adding polygon for site", site.id, error);
        }
      }

      // Add structure footprint features if available
      if (site.structureFootprints) {
        try {
          // Handle MultiPolygon geometry
          site.structureFootprints.coordinates.forEach((polygon) => {
            const coords = polygon[0].map((coord) => fromLonLat(coord));

            const structureFeature = new Feature({
              geometry: new OLPolygon([coords]),
            });

            structureFeature.setProperties({
              id: site.id + "-structure",
              parentId: site.id,
              name: site.name + " संरचना",
            });

            structureFootprintsLayer.getSource()?.addFeature(structureFeature);
          });
        } catch (error) {
          console.error(
            "Error adding structure footprints for site",
            site.id,
            error,
          );
        }
      }
    });

    // Fit to features if available
    if (pointLayer.getSource()?.getFeatures().length) {
      const extent = pointLayer.getSource()?.getExtent();
      if (extent) {
        mapRef.current.getView().fit(extent, {
          padding: [100, 100, 100, 100],
          maxZoom: 16,
        });
      }
    }
  }, [historicalSites]);

  // Update tile layer when view preference changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    const source = isStreetView
      ? new XYZ({
          url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
          maxZoom: 19,
        })
      : new XYZ({
          url: "https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
          maxZoom: 19,
        });

    tileLayerRef.current.setSource(source);
  }, [isStreetView]);

  // Update layer visibility
  useEffect(() => {
    if (!pointLayerRef.current) return;
    pointLayerRef.current.setVisible(showPoints);
  }, [showPoints]);

  useEffect(() => {
    if (!polygonLayerRef.current || !structureFootprintsLayerRef.current)
      return;
    polygonLayerRef.current.setVisible(showPolygons);
    structureFootprintsLayerRef.current.setVisible(showPolygons);
  }, [showPolygons]);

  // Function to get type label for a site
  const getHistoricalSiteTypeLabel = (type: string) => {
    const siteType = historicalSiteTypes.find((t) => t.value === type);
    return siteType ? siteType.label : type;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3">
        <Card className="h-[700px]">
          <CardContent className="p-0">
            <div ref={mapContainer} className="h-[700px] w-full" />

            {/* Site info overlay (hidden initially) */}
            <div
              ref={overlayContentRef}
              className="bg-white rounded-lg shadow-lg p-4 min-w-[250px] max-w-[350px] hidden"
              style={{
                display: selectedSite ? "block" : "none",
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-base">{selectedSite?.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    setSelectedSite(null);
                    if (overlayRef.current) {
                      overlayRef.current.setPosition(undefined);
                    }
                  }}
                >
                  &times;
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <Badge>
                  {selectedSite &&
                    getHistoricalSiteTypeLabel(selectedSite.type)}
                </Badge>

                {selectedSite?.yearEstablished && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>स्थापित: {selectedSite.yearEstablished}</span>
                  </div>
                )}

                {selectedSite?.architecturalStyle && (
                  <div className="flex items-center gap-1">
                    <LayoutLandscape className="h-3 w-3" />
                    <span>
                      वास्तुकला शैली: {selectedSite.architecturalStyle}
                    </span>
                  </div>
                )}

                {selectedSite?.originalFunction && (
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>मूल प्रयोजन: {selectedSite.originalFunction}</span>
                  </div>
                )}

                {selectedSite?.isHeritageSite && (
                  <div className="flex items-center gap-1 text-amber-600">
                    <Trophy className="h-3 w-3" />
                    <span>सम्पदा स्थल</span>
                  </div>
                )}

                {selectedSite?.location && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {selectedSite.location}
                    {selectedSite.wardNumber &&
                      `, वडा नं.: ${selectedSite.wardNumber}`}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      selectedSite &&
                      router.push(
                        `/dashboard/digital-profile/institutions/cultural/historical-sites/${selectedSite.id}`,
                      )
                    }
                  >
                    <Eye className="h-3 w-3 mr-1" /> विस्तृत हेर्नुहोस्
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Map className="h-5 w-5 text-primary" />
              <h3 className="font-medium">नक्सा नियन्त्रणहरू</h3>
            </div>
            <MapLayerControls />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-medium">स्थल प्रकार</h3>
            </div>
            <div className="space-y-2">
              {historicalSiteTypes.map((type) => (
                <div
                  key={type.value}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: getTypeColor(type.value),
                    }}
                  />
                  <span>{type.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">नक्सा लोड हुँदैछ...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get color for site type
function getTypeColor(type: string): string {
  switch (type) {
    case "PALACE":
      return "#8b5cf6"; // Purple
    case "FORT":
      return "#6b7280"; // Gray
    case "ANCIENT_SETTLEMENT":
      return "#f59e0b"; // Amber
    case "ARCHAEOLOGICAL_SITE":
      return "#f97316"; // Orange
    case "ANCIENT_MONUMENT":
      return "#10b981"; // Emerald
    case "HERITAGE_BUILDING":
      return "#3b82f6"; // Blue
    case "HISTORIC_HOUSE":
      return "#06b6d4"; // Cyan
    case "MEDIEVAL_TOWN":
      return "#78716c"; // Stone
    case "ROYAL_RESIDENCE":
      return "#e11d48"; // Rose
    case "HISTORIC_GARDEN":
      return "#22c55e"; // Green
    case "HISTORIC_INFRASTRUCTURE":
      return "#14b8a6"; // Teal
    case "BATTLEFIELD":
      return "#ef4444"; // Red
    case "ANCIENT_RUINS":
      return "#eab308"; // Yellow
    case "HISTORIC_LANDMARK":
      return "#6366f1"; // Indigo
    case "OTHER":
      return "#8b5cf6"; // Purple (default)
    default:
      return "#8b5cf6"; // Purple (default)
  }
}
