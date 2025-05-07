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

interface ReligiousPlaceMapProps {
  religiousPlace: any;
}

export function ReligiousPlaceMap({ religiousPlace }: ReligiousPlaceMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasLocationData =
    religiousPlace.locationPoint || religiousPlace.complexBoundary;

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
            यस धार्मिक स्थलको लागि कुनै भौगोलिक स्थान डाटा रेकर्ड गरिएको छैन।
          </p>
        </CardContent>
      </Card>
    );
  }

  // Define a custom icon for the temple/religious place
  const religiousPlaceIcon = new Icon({
    iconUrl: "/images/markers/temple-marker.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  // Get the center point for the map
  const getCenter = () => {
    if (religiousPlace.locationPoint) {
      return [
        religiousPlace.locationPoint.coordinates[1],
        religiousPlace.locationPoint.coordinates[0],
      ];
    }
    if (religiousPlace.complexBoundary) {
      // Calculate centroid from polygon
      const coordinates = religiousPlace.complexBoundary.coordinates[0];
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
          {religiousPlace.wardNumber && (
            <div>
              <span className="text-sm text-muted-foreground">वडा नं.</span>
              <p className="font-medium">{religiousPlace.wardNumber}</p>
            </div>
          )}

          {religiousPlace.location && (
            <div>
              <span className="text-sm text-muted-foreground">स्थान/टोल</span>
              <p className="font-medium">{religiousPlace.location}</p>
            </div>
          )}

          {religiousPlace.address && (
            <div>
              <span className="text-sm text-muted-foreground">ठेगाना</span>
              <p className="font-medium">{religiousPlace.address}</p>
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

            {religiousPlace.locationPoint && (
              <Marker
                position={[
                  religiousPlace.locationPoint.coordinates[1],
                  religiousPlace.locationPoint.coordinates[0],
                ]}
                icon={religiousPlaceIcon}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{religiousPlace.name}</h3>
                    {religiousPlace.description && (
                      <p>{religiousPlace.description.substring(0, 100)}...</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}

            {religiousPlace.complexBoundary && (
              <GeoJSON
                data={religiousPlace.complexBoundary}
                style={() => ({
                  color: "#ff6b6b",
                  weight: 3,
                  opacity: 0.65,
                  fillColor: "#ff9999",
                  fillOpacity: 0.2,
                })}
              />
            )}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
