"use client";

import { LandmarkIcon } from "lucide-react";

interface CulturalSignificanceDetailsProps {
  historicalSite: any;
}

export function CulturalSignificanceDetails({
  historicalSite,
}: CulturalSignificanceDetailsProps) {
  // Check if there is cultural significance to display
  const hasCulturalSignificance = historicalSite.culturalSignificance;

  if (!hasCulturalSignificance) {
    return null;
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2">
        <LandmarkIcon className="h-5 w-5 text-primary" />
        <h3 className="text-base font-medium">सांस्कृतिक महत्व</h3>
      </div>

      <div className="space-y-2">
        <p>{historicalSite.culturalSignificance}</p>
      </div>
    </div>
  );
}
