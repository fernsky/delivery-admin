import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, AlertCircle } from "lucide-react";
import MapComponent from "@/components/map/map-component";

interface FishFarmMapProps {
  fishFarm: any;
}

export function FishFarmMap({ fishFarm }: FishFarmMapProps) {
  // Check if we have any spatial data
  const hasLocationPoint = fishFarm.locationPoint !== null;
  const hasFarmBoundary = fishFarm.farmBoundary !== null;
  const hasPondPolygons = fishFarm.pondPolygons !== null;
  const hasSpatialData = hasLocationPoint || hasFarmBoundary || hasPondPolygons;

  // Center coordinates based on location data
  let center = { lat: 28.5, lng: 84.25 }; // Default to Nepal center
  let zoomLevel = 7;

  if (hasLocationPoint) {
    center = {
      lat: fishFarm.locationPoint.coordinates[1],
      lng: fishFarm.locationPoint.coordinates[0],
    };
    zoomLevel = 14;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          जियोस्पेसियल जानकारी
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasSpatialData ? (
          <div className="h-[600px]">
            <MapComponent
              height="600px"
              initialCenter={center}
              initialZoom={zoomLevel}
              initialMarker={
                hasLocationPoint
                  ? {
                      lat: fishFarm.locationPoint.coordinates[1],
                      lng: fishFarm.locationPoint.coordinates[0],
                    }
                  : undefined
              }
              initialPolygon={
                hasFarmBoundary
                  ? fishFarm.farmBoundary.coordinates[0].map(
                      (coord: number[]) => ({
                        lat: coord[1],
                        lng: coord[0],
                      }),
                    )
                  : undefined
              }
              initialMultiPolygons={
                hasPondPolygons
                  ? fishFarm.pondPolygons.coordinates.map(
                      (poly: number[][][]) =>
                        poly[0].map((coord: number[]) => ({
                          lat: coord[1],
                          lng: coord[0],
                        })),
                    )
                  : undefined
              }
              readonly={true}
            />
          </div>
        ) : (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              यस माछा फार्मको लागि कुनै जियोस्पेसियल डाटा उपलब्ध छैन
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
