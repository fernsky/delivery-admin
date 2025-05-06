"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapIcon, Locate } from "lucide-react";
import { useMapViewStore } from "@/store/map-view-store";
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

interface ProcessingCenterMapProps {
  locationPoint?: { type: string; coordinates: [number, number] } | null;
  facilityFootprint?: {
    type: string;
    coordinates: Array<Array<[number, number]>>;
  } | null;
  name: string;
  centerType: string;
}

export function ProcessingCenterMap({
  locationPoint,
  facilityFootprint,
  name,
  centerType,
}: ProcessingCenterMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();

  // Center or default to Nepal's center if no location
  const defaultCoordinates: [number, number] = [84.0, 28.3];

  const getCenterTypeLabel = (type: string) => {
    const types = {
      COLLECTION_CENTER: "संकलन केन्द्र",
      STORAGE_FACILITY: "भण्डारण केन्द्र",
      PROCESSING_UNIT: "प्रशोधन इकाई",
      MULTIPURPOSE_CENTER: "बहुउद्देश्यीय केन्द्र",
      MARKET_CENTER: "बजार केन्द्र",
      COLD_STORAGE: "कोल्ड स्टोरेज",
      WAREHOUSE: "गोदाम",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create a vector source for point features
    const pointSource = new VectorSource();

    // Create a vector source for polygon features
    const polygonSource = new VectorSource();

    // Create point style
    const pointStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({ color: "#ef4444" }),
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
      }),
      text: new Text({
        text: name,
        font: "12px Noto Sans, sans-serif",
        offsetY: -15,
        fill: new Fill({ color: "#000" }),
        stroke: new Stroke({ color: "#fff", width: 2 }),
      }),
    });

    // Create polygon style
    const polygonStyle = new Style({
      fill: new Fill({ color: "rgba(239, 68, 68, 0.2)" }),
      stroke: new Stroke({ color: "#ef4444", width: 2 }),
    });

    // Create vector layer for point
    const pointVectorLayer = new VectorLayer({
      source: pointSource,
      style: pointStyle,
    });

    // Create vector layer for polygon
    const polygonVectorLayer = new VectorLayer({
      source: polygonSource,
      style: polygonStyle,
    });

    // Create the initial tile layer based on the view preference
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

    // Create the map view
    const view = new View({
      center: fromLonLat(locationPoint?.coordinates || defaultCoordinates),
      zoom: 15,
      enableRotation: true,
    });

    // Create the map
    mapRef.current = new Map({
      target: mapContainer.current,
      layers: [tileLayer, polygonVectorLayer, pointVectorLayer],
      view: view,
      controls: [],
    });

    // Add location point if provided
    if (locationPoint) {
      const point = new OLPoint(fromLonLat(locationPoint.coordinates));
      const feature = new Feature(point);
      pointSource.addFeature(feature);
    }

    // Add area polygon if provided
    if (facilityFootprint) {
      // Convert GeoJSON coordinates to OpenLayers format (apply fromLonLat to each point)
      const rings = facilityFootprint.coordinates.map((ring) =>
        ring.map((coord) => fromLonLat(coord)),
      );

      const polygon = new OLPolygon(rings);
      const feature = new Feature(polygon);
      polygonSource.addFeature(feature);

      // Fit view to polygon with some padding
      mapRef.current.getView().fit(polygon, {
        padding: [50, 50, 50, 50],
        maxZoom: 18,
      });
    } else if (locationPoint) {
      // If no polygon but point exists, center on point
      view.setCenter(fromLonLat(locationPoint.coordinates));
      view.setZoom(15);
    }

    // Cleanup on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
      }
    };
  }, [isStreetView]);

  // Update the tile layer when view type changes
  useEffect(() => {
    if (!mapRef.current) return;

    const layers = mapRef.current.getLayers().getArray();
    const tileLayer = layers[0];

    if (tileLayer && "setSource" in tileLayer) {
      const newSource = isStreetView
        ? new XYZ({
            url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            maxZoom: 19,
          })
        : new XYZ({
            url: "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}",
            maxZoom: 19,
          });

      (tileLayer as TileLayer<any>).setSource(newSource);
    }
  }, [isStreetView]);

  // Handle center map
  const handleCenterMap = () => {
    if (!mapRef.current) return;

    if (facilityFootprint) {
      const rings = facilityFootprint.coordinates.map((ring) =>
        ring.map((coord) => fromLonLat(coord)),
      );

      const polygon = new OLPolygon(rings);
      mapRef.current.getView().fit(polygon, {
        padding: [50, 50, 50, 50],
        maxZoom: 18,
      });
    } else if (locationPoint) {
      mapRef.current.getView().setCenter(fromLonLat(locationPoint.coordinates));
      mapRef.current.getView().setZoom(15);
    }
  };

  // Show no-data message if neither point nor polygon is available
  if (!locationPoint && !facilityFootprint) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <MapIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">नक्सा डाटा उपलब्ध छैन</h3>
          <p className="text-muted-foreground text-center">
            यस प्रशोधन केन्द्रको लागि कुनै स्थानिक डाटा उपलब्ध छैन।
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-3 border-b bg-background flex flex-wrap gap-2 justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {name} - {getCenterTypeLabel(centerType)}
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toggleView()}>
            <MapIcon className="h-4 w-4 mr-1" />
            {isStreetView ? "उपग्रह दृश्य" : "सडक दृश्य"}
          </Button>

          <Button variant="outline" size="sm" onClick={handleCenterMap}>
            <Locate className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="w-full h-[600px]">
        <div
          ref={mapContainer}
          style={{ width: "100%", height: "100%" }}
          className="relative"
        />
      </div>
    </Card>
  );
}
