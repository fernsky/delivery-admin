import { MapPin, Globe } from "lucide-react";
import { Card } from "../../building/card";
import { DetailRow } from "../../shared/detail-row";
import { LocationDetailsSection } from "../location-details-section";
import type { BusinessSchema, LocationDetails } from "../types";

interface LocationSectionProps {
  business: BusinessSchema;
  locationDetails?: LocationDetails;
}

export function LocationSection({
  business,
  locationDetails,
}: LocationSectionProps) {
  return (
    <div className="space-y-6">
      <Card title="Location Information" icon={MapPin}>
        <DetailRow
          icon={MapPin}
          label="Ward Number"
          value={business?.wardNo?.toString()}
        />
       
        <DetailRow icon={Globe} label="Locality" value={business?.businessLocality} />
      </Card>

      {/* Show map if coordinates are available */}
      {business.geom && locationDetails?.coordinates && (
        <LocationDetailsSection
          coordinates={locationDetails.coordinates}
          gpsAccuracy={locationDetails.gpsAccuracy || undefined}
          altitude={locationDetails.altitude || undefined}
        />
      )}
    </div>
  );
}
