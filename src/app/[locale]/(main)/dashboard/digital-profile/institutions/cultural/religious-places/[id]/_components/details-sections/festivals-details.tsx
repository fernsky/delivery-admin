"use client";

import { CalendarIcon } from "lucide-react";

interface ReligiousPlaceFestivalsDetailsProps {
  religiousPlace: any;
}

export function ReligiousPlaceFestivalsDetails({
  religiousPlace,
}: ReligiousPlaceFestivalsDetailsProps) {
  // Check if there are festivals to display
  const hasFestivals =
    religiousPlace.annualFestivals ||
    religiousPlace.festivalMonths ||
    religiousPlace.festivalDetails;

  if (!hasFestivals) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">चाडपर्वहरू</h3>
      </div>

      {religiousPlace.annualFestivals && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            वार्षिक चाडपर्वहरू
          </h3>
          <p>{religiousPlace.annualFestivals}</p>
        </div>
      )}

      {religiousPlace.festivalMonths && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            चाडपर्वका महिनाहरू
          </h3>
          <p>{religiousPlace.festivalMonths}</p>
        </div>
      )}

      {religiousPlace.festivalDetails && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            चाडपर्वको विवरण
          </h3>
          <p>{religiousPlace.festivalDetails}</p>
        </div>
      )}
    </div>
  );
}
