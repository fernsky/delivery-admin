"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, Eye, PrayingHands, Calendar, Landmark } from "lucide-react";
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

interface ReligiousPlaceItem {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  wardNumber?: number;
  location?: string;
  address?: string;
  mainDeity?: string;
  religiousSignificance?: string;
  yearEstablished?: number;
  isHeritageSite?: boolean;
  locationPoint?: {
    type: string;
    coordinates: [number, number];
  };
  complexBoundary?: {
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
  religiousPlaces: ReligiousPlaceItem[];
  religiousPlaceTypes: { value: string; label: string }[];
  isLoading?: boolean;
}

export function MapView({
  religiousPlaces,
  religiousPlaceTypes,
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
  const [selectedPlace, setSelectedPlace] = useState<ReligiousPlaceItem | null>(
    null,
  );

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
        const type = feature.get("type");
        let fillColor = "#3b82f6"; // Default blue

        // Color based on religious place type
        switch (type) {
          case "HINDU_TEMPLE":
            fillColor = "#f97316"; // Orange
            break;
          case "BUDDHIST_TEMPLE":
            fillColor = "#eab308"; // Yellow
            break;
          case "MOSQUE":
            fillColor = "#16a34a"; // Green
            break;
          case "CHURCH":
            fillColor = "#3b82f6"; // Blue
            break;
          case "GURUDWARA":
            fillColor = "#eab308"; // Yellow
            break;
          case "SHRINE":
            fillColor = "#ec4899"; // Pink
            break;
          case "MONASTERY":
            fillColor = "#8b5cf6"; // Purple
            break;
          case "SYNAGOGUE":
            fillColor = "#3b82f6"; // Blue
            break;
          case "JAIN_TEMPLE":
            fillColor = "#ef4444"; // Red
            break;
          case "MEDITATION_CENTER":
            fillColor = "#6366f1"; // Indigo
            break;
          case "PAGODA":
            fillColor = "#f59e0b"; // Amber
            break;
          case "SACRED_GROVE":
          case "SACRED_POND":
          case "SACRED_RIVER":
          case "SACRED_HILL":
            fillColor = "#10b981"; // Emerald
            break;
          case "PRAYER_HALL":
            fillColor = "#8b5cf6"; // Violet
            break;
          case "RELIGIOUS_COMPLEX":
            fillColor = "#06b6d4"; // Cyan
            break;
          default:
            fillColor = "#6b7280"; // Gray
        }

        const isHeritageSite = feature.get("isHeritageSite");
        let strokeColor = "#ffffff";
        let strokeWidth = isHeritageSite ? 3 : 2;

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
        const type = feature.get("type");
        let fillColor = "rgba(59, 130, 246, 0.2)"; // Default light blue
        let strokeColor = "#3b82f6"; // Default blue

        // Color based on religious place type (with transparency for fill)
        switch (type) {
          case "HINDU_TEMPLE":
            fillColor = "rgba(249, 115, 22, 0.2)"; // Light orange
            strokeColor = "#f97316"; // Orange
            break;
          case "BUDDHIST_TEMPLE":
            fillColor = "rgba(234, 179, 8, 0.2)"; // Light yellow
            strokeColor = "#eab308"; // Yellow
            break;
          case "MOSQUE":
            fillColor = "rgba(22, 163, 74, 0.2)"; // Light green
            strokeColor = "#16a34a"; // Green
            break;
          case "CHURCH":
            fillColor = "rgba(59, 130, 246, 0.2)"; // Light blue
            strokeColor = "#3b82f6"; // Blue
            break;
          case "SHRINE":
            fillColor = "rgba(236, 72, 153, 0.2)"; // Light pink
            strokeColor = "#ec4899"; // Pink
            break;
          case "MONASTERY":
            fillColor = "rgba(139, 92, 246, 0.2)"; // Light purple
            strokeColor = "#8b5cf6"; // Purple
            break;
          default:
            fillColor = "rgba(107, 114, 128, 0.2)"; // Light gray
            strokeColor = "#6b7280"; // Gray
        }

        const isHeritageSite = feature.get("isHeritageSite");
        let strokeWidth = isHeritageSite ? 3 : 2;

        return new Style({
          fill: new Fill({ color: fillColor }),
          stroke: new Stroke({ color: strokeColor, width: strokeWidth }),
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

    // Add click handler for place selection
    mapRef.current.on("click", function (evt) {
      const feature = mapRef.current!.forEachFeatureAtPixel(
        evt.pixel,
        function (feature) {
          return feature;
        },
      );

      if (feature) {
        const placeId = feature.get("id");
        const place = religiousPlaces.find((p) => p.id === placeId);
        if (place) {
          setSelectedPlace(place);

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
        setSelectedPlace(null);
        if (overlayRef.current) {
          overlayRef.current.setPosition(undefined);
        }
      }
    });

    // Add features for all religious places
    addReligiousPlaceFeatures(pointSource, polygonSource, religiousPlaces);

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

  // Update the map when religious places change
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
    addReligiousPlaceFeatures(pointSource, polygonSource, religiousPlaces);

    // Reset selection when religious places change
    setSelectedPlace(null);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }

    // Auto-fit to all features
    fitMapToFeatures(pointSource, polygonSource);
  }, [religiousPlaces]);

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

  // Helper function to add religious place features to map sources
  const addReligiousPlaceFeatures = (
    pointSource: VectorSource | null,
    polygonSource: VectorSource | null,
    places: ReligiousPlaceItem[],
  ) => {
    if (!pointSource || !polygonSource) return;

    places.forEach((place) => {
      // Add point for location
      if (place.locationPoint) {
        const coords = fromLonLat(place.locationPoint.coordinates);
        const point = new OLPoint(coords);
        const feature = new Feature({
          geometry: point,
          id: place.id,
          name: place.name,
          type: place.type,
          isHeritageSite: place.isHeritageSite,
        });

        pointSource.addFeature(feature);
      }

      // Add polygon for complex boundary
      if (place.complexBoundary) {
        try {
          // Convert GeoJSON coordinates to OpenLayers
          const rings = place.complexBoundary.coordinates.map((ring) =>
            ring.map((coord) => fromLonLat(coord)),
          );

          const polygon = new OLPolygon(rings);
          const feature = new Feature({
            geometry: polygon,
            id: place.id,
            name: place.name,
            type: place.type,
            isHeritageSite: place.isHeritageSite,
          });

          polygonSource.addFeature(feature);
        } catch (error) {
          console.error("Error creating complex boundary polygon:", error);
        }
      }
    });
  };

  // Get religious place type label
  const getReligiousPlaceTypeLabel = (type: string) => {
    const types = {
      HINDU_TEMPLE: "हिन्दु मन्दिर",
      BUDDHIST_TEMPLE: "बौद्ध गुम्बा",
      MOSQUE: "मस्जिद",
      CHURCH: "चर्च",
      GURUDWARA: "गुरुद्वारा",
      SHRINE: "मन्दिर",
      MONASTERY: "मठ",
      SYNAGOGUE: "यहुदी मन्दिर",
      JAIN_TEMPLE: "जैन मन्दिर",
      MEDITATION_CENTER: "ध्यान केन्द्र",
      PAGODA: "पगोडा",
      SACRED_GROVE: "पवित्र वन",
      SACRED_POND: "पवित्र पोखरी",
      SACRED_RIVER: "पवित्र नदी",
      SACRED_HILL: "पवित्र पहाड",
      PRAYER_HALL: "प्रार्थना हल",
      RELIGIOUS_COMPLEX: "धार्मिक परिसर",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Get religious significance label
  const getReligiousSignificanceLabel = (significance?: string) => {
    if (!significance) return "";
    const significances = {
      LOCAL: "स्थानीय",
      REGIONAL: "क्षेत्रीय",
      NATIONAL: "राष्ट्रिय",
      INTERNATIONAL: "अन्तर्राष्ट्रिय",
    };
    return (
      significances[significance as keyof typeof significances] || significance
    );
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
                <h4 className="text-sm font-medium">धार्मिक स्थल प्रकार</h4>
                <div className="space-y-1 max-h-72 overflow-y-auto pr-2">
                  {religiousPlaceTypes.map((type) => (
                    <div key={type.value} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            type.value === "HINDU_TEMPLE"
                              ? "#f97316"
                              : type.value === "BUDDHIST_TEMPLE"
                                ? "#eab308"
                                : type.value === "MOSQUE"
                                  ? "#16a34a"
                                  : type.value === "CHURCH"
                                    ? "#3b82f6"
                                    : type.value === "SHRINE"
                                      ? "#ec4899"
                                      : type.value === "MONASTERY"
                                        ? "#8b5cf6"
                                        : "#6b7280",
                        }}
                      ></div>
                      <span className="text-xs">{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Currently selected place details */}
          {selectedPlace && (
            <Card className="overflow-hidden">
              <div className="aspect-video relative bg-muted">
                {selectedPlace.primaryMedia?.url ? (
                  <img
                    src={selectedPlace.primaryMedia.url}
                    alt={selectedPlace.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Landmark className="h-12 w-12 text-muted-foreground opacity-20" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">
                      {selectedPlace.name}
                    </h3>
                    <Badge className="mt-1">
                      {getReligiousPlaceTypeLabel(selectedPlace.type)}
                    </Badge>
                  </div>

                  {selectedPlace.mainDeity && (
                    <div className="flex gap-2 items-center">
                      <PrayingHands className="h-4 w-4 text-amber-600" />
                      <span className="text-sm">{selectedPlace.mainDeity}</span>
                    </div>
                  )}

                  {selectedPlace.yearEstablished && (
                    <div className="flex gap-2 items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        स्थापना वर्ष: {selectedPlace.yearEstablished}
                      </span>
                    </div>
                  )}

                  {selectedPlace.religiousSignificance && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">धार्मिक महत्व:</span>{" "}
                      {getReligiousSignificanceLabel(
                        selectedPlace.religiousSignificance,
                      )}
                    </div>
                  )}

                  {selectedPlace.isHeritageSite && (
                    <div className="text-sm text-purple-600 font-medium">
                      सम्पदा स्थल
                    </div>
                  )}

                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboard/digital-profile/institutions/cultural/religious-places/${selectedPlace.id}`,
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
              display: selectedPlace ? "block" : "none",
              pointerEvents: "none",
              transform: "translate(-50%, -100%)",
              whiteSpace: "nowrap",
            }}
          >
            {selectedPlace && (
              <div className="text-center">
                <div className="font-medium">{selectedPlace.name}</div>
                <div className="text-xs text-muted-foreground">
                  {getReligiousPlaceTypeLabel(selectedPlace.type)}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
