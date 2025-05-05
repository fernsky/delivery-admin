"use client";

import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point as OLPoint, Polygon as OLPolygon } from "ol/geom";
import { Feature } from "ol";
import { Style, Fill, Stroke, Circle } from "ol/style";
import DrawInteraction from "ol/interaction/Draw";

// Define the types
type Point = {
  type: "Point";
  coordinates: [number, number];
};

type Polygon = {
  type: "Polygon";
  coordinates: [number, number][][];
};

interface OpenLayersMapProps {
  mapMode: "point" | "polygon";
  isDrawing: boolean;
  initialPoint?: Point;
  initialPolygon?: Polygon;
  startDrawing: boolean;
  isStreetView: boolean;
  onUpdate: (point?: Point, polygon?: Polygon) => void;
}

export function OpenLayersMap({
  mapMode,
  isDrawing,
  initialPoint,
  initialPolygon,
  startDrawing,
  isStreetView,
  onUpdate,
}: OpenLayersMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const pointSourceRef = useRef<VectorSource>(new VectorSource());
  const polygonSourceRef = useRef<VectorSource>(new VectorSource());
  const drawInteractionRef = useRef<DrawInteraction | null>(null);
  const [baseTileLayer, setBaseTileLayer] = useState<TileLayer<any> | null>(
    null,
  );

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector layers for point and polygon
    const pointVectorLayer = new VectorLayer({
      source: pointSourceRef.current,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: "#3b82f6" }),
          stroke: new Stroke({ color: "#ffffff", width: 2 }),
        }),
      }),
    });

    const polygonVectorLayer = new VectorLayer({
      source: polygonSourceRef.current,
      style: new Style({
        fill: new Fill({ color: "rgba(59, 130, 246, 0.2)" }),
        stroke: new Stroke({ color: "#3b82f6", width: 2 }),
      }),
    });

    // Create the initial tile layer based on the view preference
    const initialTileLayer = isStreetView
      ? new TileLayer({
          source: new XYZ({
            url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            maxZoom: 19,
          }),
        })
      : new TileLayer({
          source: new XYZ({
            url: "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}",
            maxZoom: 19,
          }),
        });

    setBaseTileLayer(initialTileLayer);

    // Create the map
    mapRef.current = new Map({
      target: mapContainer.current,
      layers: [initialTileLayer, polygonVectorLayer, pointVectorLayer],
      view: new View({
        center: fromLonLat([84.0, 28.3]), // Default center of Nepal
        zoom: 6,
      }),
    });

    // Add click handler for point selection
    mapRef.current.on("click", (event) => {
      if (mapMode === "point" && !isDrawing) {
        const coordinates = toLonLat(event.coordinate);
        addPointFeature(coordinates as [number, number]);
      }
    });

    // Initialize with existing data if provided
    if (initialPoint) {
      addPointFeature(initialPoint.coordinates);
    }

    if (initialPolygon) {
      addPolygonFeature(initialPolygon.coordinates);
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.setTarget(undefined);
        mapRef.current = null;
      }
    };
  }, []);

  // Update the tile layer when view type changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove the existing base tile layer
    if (baseTileLayer) {
      mapRef.current.removeLayer(baseTileLayer);
    }

    // Create and add the new tile layer based on the view preference
    const newTileLayer = isStreetView
      ? new TileLayer({
          source: new XYZ({
            url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
            maxZoom: 19,
          }),
        })
      : new TileLayer({
          source: new XYZ({
            url: "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}",
            maxZoom: 19,
          }),
        });

    mapRef.current.getLayers().insertAt(0, newTileLayer);
    setBaseTileLayer(newTileLayer);
  }, [isStreetView]);

  // Handle map mode changes and drawing state
  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous drawing interactions
    if (drawInteractionRef.current) {
      mapRef.current.removeInteraction(drawInteractionRef.current);
      drawInteractionRef.current = null;
    }

    // Start drawing polygon if needed
    if (mapMode === "polygon" && startDrawing) {
      startDrawingPolygon();
    }
  }, [mapMode, startDrawing]);

  // Add a point feature to the map
  const addPointFeature = (coordinates: [number, number]) => {
    if (!pointSourceRef.current) return;

    // Clear previous points
    pointSourceRef.current.clear();

    // Create a new point feature
    const point = new Feature(new OLPoint(fromLonLat(coordinates)));
    pointSourceRef.current.addFeature(point);

    // Update state
    onUpdate(
      {
        type: "Point",
        coordinates: coordinates,
      },
      undefined,
    );
  };

  // Add a polygon feature to the map
  const addPolygonFeature = (coordinates: [number, number][][]) => {
    if (!polygonSourceRef.current) return;

    // Clear previous polygons
    polygonSourceRef.current.clear();

    // Convert coordinates to OpenLayers format
    const olCoords = coordinates[0].map((coord) => fromLonLat(coord));

    // Create a new polygon feature
    const polygon = new Feature(new OLPolygon([olCoords]));
    polygonSourceRef.current.addFeature(polygon);

    // Update state
    onUpdate(undefined, {
      type: "Polygon",
      coordinates: coordinates,
    });
  };

  const startDrawingPolygon = () => {
    if (!mapRef.current) return;

    // Clear existing polygon
    polygonSourceRef.current.clear();

    // Create draw interaction
    drawInteractionRef.current = new DrawInteraction({
      source: polygonSourceRef.current,
      type: "Polygon",
    });

    // Add drawing complete handler
    drawInteractionRef.current.on("drawend", (event) => {
      // Get the polygon geometry
      const geometry = event.feature.getGeometry() as OLPolygon;

      // Convert to GeoJSON format
      const coordinates = geometry
        .getCoordinates()[0]
        .map((coord) => toLonLat(coord) as [number, number]);

      // Store the polygon
      onUpdate(undefined, {
        type: "Polygon",
        coordinates: [coordinates],
      });

      // Remove the draw interaction when finished
      if (mapRef.current && drawInteractionRef.current) {
        mapRef.current.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }
    });

    // Add the interaction to the map
    mapRef.current.addInteraction(drawInteractionRef.current);
  };

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}
