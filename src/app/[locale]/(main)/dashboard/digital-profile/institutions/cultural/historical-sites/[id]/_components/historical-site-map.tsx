"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Icon } from "leaflet";

interface HistoricalSiteMapProps {
  historicalSite: any;
}

export function HistoricalSiteMap({ historicalSite }: HistoricalSiteMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasLocationData =
    historicalSite.locationPoint || historicalSite.siteBoundary;

  if (!hasLocationData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>स्थान जानकारी</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <MapPin className="h-12 w-12 mb-4 opacity-20" />
          <h3 className="text-lg font-semibold mb-2">
            कुनै स्थान डाटा उपलब्ध छैन
          </h3>
          <p>
            यस ऐतिहासिक स्थलको लागि कुनै भौगोलिक स्थान डाटा रेकर्ड गरिएको छैन।
          </p>
        </CardContent>
      </Card>
    );
  }

  // Define a custom icon for the historical site
  const historicalSiteIcon = new Icon({
    iconUrl: "/images/markers/monument-marker.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Get the center point for the map
  const getCenter = () => {
    if (historicalSite.locationPoint) {
      return [
        historicalSite.locationPoint.coordinates[1],
        historicalSite.locationPoint.coordinates[0],
      ];
    }
    if (historicalSite.siteBoundary) {
      // Calculate centroid from polygon
      const coordinates = historicalSite.siteBoundary.coordinates[0];
      let lat = 0;
      let lng = 0;
      coordinates.forEach((coord: [number, number]) => {
        lng += coord[0];
        lat += coord[1];
      });
      return [lat / coordinates.length, lng / coordinates.length];
    }
    return [28.3949, 81.6143]; // Default coordinates (can be adjusted)
  };

  const center: [number, number] = getCenter();

  if (!isMounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>स्थान जानकारी</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p>Map loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>स्थान जानकारी</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {historicalSite.wardNumber && (
            <div>
              <span className="text-sm text-muted-foreground">वडा नं.</span>
              <p className="font-medium">{historicalSite.wardNumber}</p>
            </div>
          )}

          {historicalSite.location && (
            <div>
              <span className="text-sm text-muted-foreground">स्थान/टोल</span>
              <p className="font-medium">{historicalSite.location}</p>
            </div>
          )}

          {historicalSite.address && (
            <div>
              <span className="text-sm text-muted-foreground">ठेगाना</span>
              <p className="font-medium">{historicalSite.address}</p>
            </div>
          )}
        </div>

        <div className="h-[500px] w-full border rounded-md overflow-hidden">
          <MapContainer
            center={center}
            zoom={15}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {historicalSite.locationPoint && (
              <Marker
                position={[
                  historicalSite.locationPoint.coordinates[1],
                  historicalSite.locationPoint.coordinates[0],
                ]}
                icon={historicalSiteIcon}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{historicalSite.name}</h3>
                    {historicalSite.description && (
                      <p>{historicalSite.description.substring(0, 100)}...</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}

            {historicalSite.siteBoundary && (
              <GeoJSON
                data={historicalSite.siteBoundary}
                style={() => ({
                  color: "#8b4513", // Brown for historical sites
                  weight: 3,
                  opacity: 0.65,
                  fillColor: "#d2b48c", // Tan
                  fillOpacity: 0.2,
                })}
              />
            )}

            {historicalSite.structureFootprints && (
              <GeoJSON
                data={historicalSite.structureFootprints}
                style={() => ({
                  color: "#800000", // Maroon for structure outlines
                  weight: 2,
                  opacity: 0.8,
                  fillColor: "#cd853f", // Peru brown
                  fillOpacity: 0.3,
                })}
              />
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
