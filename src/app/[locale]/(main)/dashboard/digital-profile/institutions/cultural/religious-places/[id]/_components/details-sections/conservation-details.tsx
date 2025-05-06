"use client";

import { CheckIcon, XIcon } from "lucide-react";

interface ReligiousPlaceConservationProps {
  religiousPlace: any;
}

export function ReligiousPlaceConservation({
  religiousPlace,
}: ReligiousPlaceConservationProps) {
  // Get preservation status label
  const getPreservationStatusLabel = (status: string | null) => {
    if (!status) return "उल्लेख नभएको";

    const statuses = {
      EXCELLENT: "उत्तम",
      GOOD: "राम्रो",
      FAIR: "ठीकठाक",
      POOR: "कमजोर",
      DAMAGED: "क्षतिग्रस्त",
      UNDER_RENOVATION: "मर्मत हुँदै",
      REBUILT: "पुनर्निर्माण भएको",
    };
    return statuses[status as keyof typeof statuses] || status;
  };

  // Check if there are conservation details to display
  const hasConservationDetails =
    religiousPlace.preservationStatus ||
    religiousPlace.restorationDetails ||
    religiousPlace.hasRegularMaintenance !== undefined ||
    religiousPlace.maintenanceDetails ||
    religiousPlace.lastRestorationYear ||
    religiousPlace.fundingSource;

  if (!hasConservationDetails) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <h3 className="text-base font-medium">संरक्षण र जीर्णोद्धार</h3>

      {religiousPlace.preservationStatus && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            संरक्षण स्थिति
          </h3>
          <p
            className={`${
              religiousPlace.preservationStatus === "EXCELLENT" ||
              religiousPlace.preservationStatus === "GOOD"
                ? "text-green-600"
                : religiousPlace.preservationStatus === "FAIR"
                  ? "text-amber-600"
                  : "text-red-600"
            }`}
          >
            {getPreservationStatusLabel(religiousPlace.preservationStatus)}
          </p>
        </div>
      )}

      {religiousPlace.hasRegularMaintenance !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {religiousPlace.hasRegularMaintenance ? (
              <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
              <XIcon className="h-4 w-4 text-gray-400" />
            )}
            <span>नियमित मर्मत संभार</span>
          </div>
          {religiousPlace.hasRegularMaintenance &&
            religiousPlace.maintenanceDetails && (
              <p className="ml-6">{religiousPlace.maintenanceDetails}</p>
            )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {religiousPlace.lastRestorationYear && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              अन्तिम जीर्णोद्धार वर्ष
            </h3>
            <p>{religiousPlace.lastRestorationYear}</p>
          </div>
        )}

        {religiousPlace.fundingSource && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              कोषको स्रोत
            </h3>
            <p>{religiousPlace.fundingSource}</p>
          </div>
        )}
      </div>

      {religiousPlace.restorationDetails && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            जीर्णोद्धार विवरण
          </h3>
          <p>{religiousPlace.restorationDetails}</p>
        </div>
      )}
    </div>
  );
}
